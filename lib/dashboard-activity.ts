import { createInsforgeServer } from "./insforge-server";
import { formatRelative } from "./jobs-format";
import type { ActivityEntry } from "@/components/dashboard/RecentActivity";

type ActivityClient = Awaited<ReturnType<typeof createInsforgeServer>>;

const MAX_ENTRIES = 5;
const RESEARCH_PREFIX = "research:";

type RunRow = {
  status: string | null;
  job_title_searched: string | null;
  jobs_found: number | null;
  started_at: string | null;
  completed_at: string | null;
};

function pluralizeJobs(n: number): string {
  return n === 1 ? "1 job" : `${n} jobs`;
}

export async function getRecentActivity(
  userId: string,
): Promise<ActivityEntry[]> {
  try {
    const insforge: ActivityClient = await createInsforgeServer();
    const { data, error } = await insforge.database
      .from("agent_runs")
      .select("status,job_title_searched,jobs_found,started_at,completed_at")
      .eq("user_id", userId)
      .eq("status", "completed")
      .order("completed_at", { ascending: false })
      .limit(10);
    if (error) throw new Error(error.message);
    const runs = ((data ?? []) as RunRow[]).filter(
      (r) => (r.completed_at ?? r.started_at) !== null,
    );

    const entries: Array<ActivityEntry & { at: string }> = [];
    for (const run of runs) {
      const at = (run.completed_at ?? run.started_at) as string;
      const searched = (run.job_title_searched ?? "").trim();
      if (searched.startsWith(RESEARCH_PREFIX)) {
        const company = searched.slice(RESEARCH_PREFIX.length).trim();
        if (!company) continue;
        entries.push({
          text: `Researched ${company}`,
          time: formatRelative(at),
          tone: "info",
          at,
        });
      } else {
        if (!searched) continue;
        entries.push({
          text: `Found ${pluralizeJobs(run.jobs_found ?? 0)} for ${searched}`,
          time: formatRelative(at),
          tone: "success",
          at,
        });
      }
    }

    entries.sort((a, b) => (a.at < b.at ? 1 : a.at > b.at ? -1 : 0));
    return entries
      .slice(0, MAX_ENTRIES)
      .map(({ text, time, tone }) => ({ text, time, tone }));
  } catch (error) {
    console.error(
      "[dashboard-activity] failed:",
      error instanceof Error ? error.message : String(error),
    );
    return [];
  }
}
