import { getClient, parseLenientJson, OPENROUTER_MODEL, OPENROUTER_FALLBACK_MODEL, OPENROUTER_SECONDARY_TEXT_MODEL } from "@/lib/openrouter";
import type { ScoredJob, ProfileForMatching } from "./types";
import type { AdzunaJob } from "@/lib/adzuna";

function isRetryableModelError(message: string): boolean {
  const m = message.toLowerCase();
  return m.includes("404") || m.includes("429") || m.includes("rate limit") || m.includes("quota") || m.includes("no endpoints") || m.includes("not available");
}

function clampScore(n: unknown): number {
  const v = typeof n === "number" ? n : parseInt(String(n), 10);
  if (!Number.isFinite(v)) return 50;
  return Math.max(0, Math.min(100, Math.round(v)));
}

function asStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.map((x) => String(x).trim()).filter(Boolean);
}

function buildPrompt(job: AdzunaJob, profile: ProfileForMatching): { system: string; user: string } {
  const system =
    `You are a job matching assistant. Given a job posting and a candidate profile, score how well the candidate matches the job from 0 to 100. ` +
    `Consider title alignment, required skills overlap, experience level, and seniority. ` +
    `Return ONLY valid JSON with this exact shape: {"match_score": number 0-100, "match_reason": "one paragraph explanation", "matched_skills": string[], "missing_skills": string[]}. ` +
    `matched_skills are skills the candidate has that the job needs. missing_skills are skills the job needs that the candidate lacks. Keep arrays to at most 8 items each.`;

  const profileSummary = [
    `Current title: ${profile.current_title ?? "(none)"}`,
    `Experience level: ${profile.experience_level ?? "(none)"}`,
    `Years experience: ${profile.years_experience ?? "(unknown)"}`,
    `Skills: ${Array.isArray(profile.skills) && profile.skills.length ? profile.skills.join(", ") : "(none)"}`,
    `Industries: ${Array.isArray(profile.industries) && profile.industries.length ? profile.industries.join(", ") : "(none)"}`,
    `Seeking: ${Array.isArray(profile.job_titles_seeking) && profile.job_titles_seeking.length ? profile.job_titles_seeking.join(", ") : "(none)"}`,
    `Work experience: ${JSON.stringify(profile.work_experience ?? [])}`,
    `Education: ${JSON.stringify(profile.education ?? {})}`,
  ].join("\n");

  const user =
    `JOB POSTING\nTitle: ${job.title}\nCompany: ${job.company.display_name}\nLocation: ${job.location.display_name}\nDescription: ${job.description}\n` +
    `\nCANDIDATE PROFILE\n${profileSummary}`;

  return { system, user };
}

async function callOneModel(model: string, system: string, user: string): Promise<ScoredJob | null> {
  const client = getClient();
  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
    max_tokens: 300,
  });
  const content = response.choices[0]?.message?.content;
  if (!content) return null;
  const parsed = parseLenientJson(content);
  if (!parsed) return null;
  return {
    matchScore: clampScore((parsed as Record<string, unknown>).match_score ?? (parsed as Record<string, unknown>).matchScore),
    matchReason: String((parsed as Record<string, unknown>).match_reason ?? (parsed as Record<string, unknown>).matchReason ?? ""),
    matchedSkills: asStringArray((parsed as Record<string, unknown>).matched_skills ?? (parsed as Record<string, unknown>).matchedSkills),
    missingSkills: asStringArray((parsed as Record<string, unknown>).missing_skills ?? (parsed as Record<string, unknown>).missingSkills),
  };
}

export async function scoreJobAgainstProfile(
  job: AdzunaJob,
  profile: ProfileForMatching,
): Promise<ScoredJob> {
  const { system, user } = buildPrompt(job, profile);
  const chain = [OPENROUTER_MODEL, OPENROUTER_FALLBACK_MODEL, OPENROUTER_SECONDARY_TEXT_MODEL].filter(
    (m, i, a) => Boolean(m) && a.indexOf(m) === i,
  ) as string[];

  let lastError = "";
  for (const model of chain) {
    try {
      const scored = await callOneModel(model, system, user);
      if (scored) return scored;
      lastError = `Failed to parse ${model} response as JSON`;
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      lastError = msg;
      console.error(`[agent/matcher] ${model} failed:`, msg);
      if (!isRetryableModelError(msg)) break;
    }
  }

  console.error(`[agent/matcher] all models failed for job ${job.id}: ${lastError} — returning neutral score`);
  return { matchScore: 50, matchReason: "", matchedSkills: [], missingSkills: [] };
}
