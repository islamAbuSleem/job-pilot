import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createInsforgeServer } from "@/lib/insforge-server";
import { researchCompany } from "@/agent/research";
import { captureServerEvent } from "@/lib/posthog-server";
import type { ProfileForMatching } from "@/agent/types";

export const runtime = "nodejs";

type Params = { id: string };

async function logAgent(
  insforge: Awaited<ReturnType<typeof createInsforgeServer>>,
  row: {
    run_id: string;
    user_id: string;
    message: string;
    level: string;
    job_id?: string | null;
  },
) {
  try {
    await insforge.database.from("agent_logs").insert([{ ...row } as never]);
  } catch {
    /* best-effort */
  }
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<Params> },
) {
  const { id: jobId } = await params;
  let runId: string | null = null;
  let userId: string | null = null;
  try {
    const insforge = await createInsforgeServer();
    const { data: authData } = await insforge.auth.getCurrentUser();
    const user = authData?.user ?? null;
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 },
      );
    }
    userId = user.id;

    const { data: jobRow, error: jobError } = await insforge.database
      .from("jobs")
      .select(
        "id,title,company,about_role,matched_skills,missing_skills,company_research",
      )
      .eq("id", jobId)
      .eq("user_id", user.id)
      .maybeSingle();
    if (jobError || !jobRow) {
      return NextResponse.json(
        { success: false, error: "Job not found" },
        { status: 404 },
      );
    }
    const job = jobRow as {
      id: string;
      title: string | null;
      company: string | null;
      about_role: string | null;
      matched_skills: string[] | null;
      missing_skills: string[] | null;
    };

    const { data: profile } = await insforge.database
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    const p = profile as Record<string, unknown> | null;
    const profileForMatching: ProfileForMatching = {
      current_title: (p?.current_title as string | null) ?? null,
      experience_level: (p?.experience_level as string | null) ?? null,
      years_experience: (p?.years_experience as number | null) ?? null,
      skills: (p?.skills as string[] | null) ?? null,
      industries: (p?.industries as string[] | null) ?? null,
      work_experience: p?.work_experience ?? null,
      education: p?.education ?? null,
      job_titles_seeking: (p?.job_titles_seeking as string[] | null) ?? null,
    };

    const { data: runData, error: runError } = await insforge.database
      .from("agent_runs")
      .insert([
        {
          user_id: user.id,
          status: "running",
          job_title_searched: `research:${job.company ?? jobId}`,
          location_searched: "",
          jobs_found: 0,
          started_at: new Date().toISOString(),
        } as never,
      ])
      .select()
      .single();
    if (runError || !runData) {
      console.error("[agent/research] create run failed:", runError?.message);
      return NextResponse.json(
        { success: false, error: "Failed to start research" },
        { status: 500 },
      );
    }
    runId = (runData as { id: string }).id;

    await logAgent(insforge, {
      run_id: runId,
      user_id: user.id,
      message: `Researching ${job.company ?? "company"}`,
      level: "info",
      job_id: jobId,
    });

    const dossier = await researchCompany(
      {
        title: job.title ?? "",
        company: job.company ?? "",
        description: job.about_role ?? "",
        matchedSkills: Array.isArray(job.matched_skills)
          ? job.matched_skills
          : [],
        missingSkills: Array.isArray(job.missing_skills)
          ? job.missing_skills
          : [],
      },
      profileForMatching,
    );

    const now = new Date().toISOString();
    const { error: updateError } = await insforge.database
      .from("jobs")
      .update({ company_research: dossier } as never)
      .eq("id", jobId)
      .eq("user_id", user.id);
    if (updateError) {
      console.error("[agent/research] dossier save failed:", updateError.message);
      return NextResponse.json(
        { success: false, error: "Failed to save research" },
        { status: 500 },
      );
    }

    await captureServerEvent(user.id, "company_researched", {
      userId: user.id,
      jobId,
      company: job.company ?? "",
    });
    await insforge.database
      .from("agent_runs")
      .update({ status: "completed", completed_at: now } as never)
      .eq("id", runId);
    await logAgent(insforge, {
      run_id: runId,
      user_id: user.id,
      message: `Researched ${job.company ?? "company"}`,
      level: "success",
      job_id: jobId,
    });

    revalidatePath(`/find-jobs/${jobId}`);
    return NextResponse.json({ success: true, data: { dossier } });
  } catch (error) {
    console.error("[agent/research] Unexpected error:", error);
    try {
      if (runId && userId) {
        const insforge = await createInsforgeServer();
        await insforge.database
          .from("agent_runs")
          .update({
            status: "failed",
            completed_at: new Date().toISOString(),
          } as never)
          .eq("id", runId);
        await logAgent(insforge, {
          run_id: runId,
          user_id: userId,
          message: String(error),
          level: "error",
          job_id: jobId,
        });
      }
    } catch {
      /* ignore */
    }
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
