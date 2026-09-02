import { NextRequest, NextResponse } from "next/server";
import { createInsforgeServer } from "@/lib/insforge-server";
import { searchJobs, detectCountry, formatSalary } from "@/lib/adzuna";
import { scoreJobAgainstProfile } from "@/agent/matcher";
import { captureServerEvent } from "@/lib/posthog-server";
import { MATCH_THRESHOLD } from "@/lib/utils";

export const runtime = "nodejs";
export const maxDuration = 60;

type Body = { jobTitle?: string; location?: string };

async function logAgent(
  insforge: Awaited<ReturnType<typeof createInsforgeServer>>,
  row: { run_id: string; user_id: string; message: string; level: string; job_id?: string | null },
) {
  try {
    await insforge.database.from("agent_logs").insert([{ ...row } as never]);
  } catch {
    /* best-effort */
  }
}

export async function POST(req: NextRequest) {
  let runId: string | null = null;
  let userId: string | null = null;
  try {
    const insforge = await createInsforgeServer();
    const { data: authData } = await insforge.auth.getCurrentUser();
    const user = authData?.user ?? null;
    if (!user) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }
    userId = user.id;

    const body = (await req.json().catch(() => ({}))) as Body;
    const jobTitle = String(body.jobTitle ?? "").trim();
    const location = String(body.location ?? "").trim();

    if (!jobTitle) {
      return NextResponse.json({ success: false, error: "Job title is required" }, { status: 400 });
    }

    const country = detectCountry(location);

    await captureServerEvent(user.id, "job_search_started", { userId: user.id, jobTitle, location });

    const { data: runData, error: runError } = await insforge.database
      .from("agent_runs")
      .insert([
        {
          user_id: user.id,
          status: "running",
          job_title_searched: jobTitle,
          location_searched: location,
          jobs_found: 0,
          started_at: new Date().toISOString(),
        } as never,
      ])
      .select()
      .single();

    if (runError || !runData) {
      console.error("[agent/find] create run failed:", runError?.message);
      return NextResponse.json({ success: false, error: "Failed to start search" }, { status: 500 });
    }
    runId = (runData as { id: string }).id;

    await logAgent(insforge, { run_id: runId, user_id: user.id, message: `Searching Adzuna for "${jobTitle}" in "${location || "any"}" (${country})`, level: "info" });

    let adzunaJobs;
    try {
      adzunaJobs = await searchJobs(jobTitle, location, country);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error("[agent/find] adzuna failed:", msg);
      await logAgent(insforge, { run_id: runId, user_id: user.id, message: `Adzuna search failed: ${msg}`, level: "error" });
      await insforge.database.from("agent_runs").update({ status: "failed", completed_at: new Date().toISOString() } as never).eq("id", runId);
      return NextResponse.json({ success: false, error: msg.includes("credentials not configured") ? msg : "Job search provider failed. Please try again." }, { status: 502 });
    }

    if (adzunaJobs.length === 0) {
      await insforge.database.from("agent_runs").update({ status: "completed", jobs_found: 0, completed_at: new Date().toISOString() } as never).eq("id", runId);
      await logAgent(insforge, { run_id: runId, user_id: user.id, message: "No jobs found for this query", level: "warning" });
      return NextResponse.json({ success: true, data: { jobsFound: 0, strongMatches: 0, runId } });
    }

    const { data: profile } = await insforge.database.from("profiles").select("*").eq("id", user.id).single();
    const profileForMatching = {
      current_title: (profile as Record<string, unknown> | null)?.current_title as string | null ?? null,
      experience_level: (profile as Record<string, unknown> | null)?.experience_level as string | null ?? null,
      years_experience: (profile as Record<string, unknown> | null)?.years_experience as number | null ?? null,
      skills: (profile as Record<string, unknown> | null)?.skills as string[] | null ?? null,
      industries: (profile as Record<string, unknown> | null)?.industries as string[] | null ?? null,
      work_experience: (profile as Record<string, unknown> | null)?.work_experience ?? null,
      education: (profile as Record<string, unknown> | null)?.education ?? null,
      job_titles_seeking: (profile as Record<string, unknown> | null)?.job_titles_seeking as string[] | null ?? null,
    };

    const CONCURRENCY = 5;
    const scored: Array<{ job: (typeof adzunaJobs)[number]; score: Awaited<ReturnType<typeof scoreJobAgainstProfile>> }> = [];
    for (let i = 0; i < adzunaJobs.length; i += CONCURRENCY) {
      const batch = adzunaJobs.slice(i, i + CONCURRENCY);
      const results = await Promise.allSettled(batch.map((job) => scoreJobAgainstProfile(job, profileForMatching)));
      for (let j = 0; j < batch.length; j++) {
        const r = results[j];
        const job = batch[j]!;
        if (r.status === "fulfilled") scored.push({ job, score: r.value });
        else {
          console.error("[agent/find] scoring rejected for", job.id, r.reason);
          scored.push({ job, score: { matchScore: 50, matchReason: "", matchedSkills: [], missingSkills: [] } });
        }
      }
    }

    const now = new Date().toISOString();
    const rows = scored.map(({ job, score }) => ({
      user_id: user.id,
      run_id: runId,
      source: "search",
      source_url: job.redirect_url,
      external_apply_url: job.redirect_url,
      title: job.title,
      company: job.company.display_name,
      location: job.location.display_name,
      salary: formatSalary(job.salary_min, job.salary_max),
      job_type: job.contract_type || "fulltime",
      about_role: job.description,
      responsibilities: [],
      requirements: [],
      match_score: score.matchScore,
      match_reason: score.matchReason,
      matched_skills: score.matchedSkills,
      missing_skills: score.missingSkills,
      found_at: now,
    }));

    if (rows.length > 0) {
      const { error: insertError } = await insforge.database.from("jobs").insert(rows as never[]);
      if (insertError) {
        console.error("[agent/find] jobs insert failed:", insertError.message);
        await logAgent(insforge, { run_id: runId, user_id: user.id, message: `Failed to save jobs: ${insertError.message}`, level: "error" });
        await insforge.database.from("agent_runs").update({ status: "failed", completed_at: now } as never).eq("id", runId);
        return NextResponse.json({ success: false, error: "Failed to save jobs" }, { status: 500 });
      }
      for (const s of scored) {
        await captureServerEvent(user.id, "job_found", { userId: user.id, source: "search", matchScore: s.score.matchScore });
      }
    }

    const strongMatches = scored.filter((s) => s.score.matchScore >= MATCH_THRESHOLD).length;
    await insforge.database.from("agent_runs").update({ status: "completed", jobs_found: rows.length, completed_at: now } as never).eq("id", runId);
    await logAgent(insforge, { run_id: runId, user_id: user.id, message: `Found ${rows.length} jobs, ${strongMatches} strong matches`, level: "success" });

    return NextResponse.json({ success: true, data: { jobsFound: rows.length, strongMatches, runId } });
  } catch (error) {
    console.error("[agent/find] Unexpected error:", error);
    try {
      if (runId && userId) {
        const insforge = await createInsforgeServer();
        await insforge.database.from("agent_runs").update({ status: "failed", completed_at: new Date().toISOString() } as never).eq("id", runId);
        await logAgent(insforge, { run_id: runId, user_id: userId, message: String(error), level: "error" });
      }
    } catch {
      /* ignore */
    }
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
