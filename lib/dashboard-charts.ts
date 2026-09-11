import { createInsforgeServer } from "./insforge-server";
import type { ResearchActivityPoint } from "@/components/dashboard/ResearchActivityChart";
import type { JobsOverTimePoint } from "@/components/dashboard/JobsOverTimeChart";
import type { MatchScoreBucket } from "@/components/dashboard/MatchScoreChart";

const DAY_MS = 1000 * 60 * 60 * 24;
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

const EMPTY_RESEARCH: ResearchActivityPoint[] = WEEKDAYS.map((day) => ({
  day,
  value: 0,
}));
const EMPTY_OVER_TIME: JobsOverTimePoint[] = WEEKDAYS.map((day) => ({
  day,
  value: 0,
}));

const DISTRIBUTION_RANGES = [
  { range: "50-60%", min: 50, max: 60 },
  { range: "60-70%", min: 60, max: 70 },
  { range: "70-80%", min: 70, max: 80 },
  { range: "80-90%", min: 80, max: 90 },
  { range: "90-100%", min: 90, max: 101 },
] as const;

const EMPTY_DISTRIBUTION: MatchScoreBucket[] = DISTRIBUTION_RANGES.map(
  ({ range }) => ({ range, value: 0 }),
);

// Why the `as` casts below: the InsForge database client returns
// loosely-typed rows for `.select()` column lists, so narrow each result
// to the selected columns with these named row types.
type FoundAtRow = { found_at: string | null };
type CompletedAtRow = { completed_at: string | null };
type MatchScoreRow = { match_score: number | null };

function weekdayIndex(iso: string): number {
  const day = new Date(iso).getUTCDay();
  return (day + 6) % 7;
}

function bucketByWeekday<T>(
  rows: T[],
  getDate: (row: T) => string | null | undefined,
): number[] {
  const buckets = [0, 0, 0, 0, 0, 0, 0];
  for (const row of rows) {
    const iso = getDate(row);
    if (!iso) continue;
    buckets[weekdayIndex(iso)]++;
  }
  return buckets;
}

export type DashboardCharts = {
  research: ResearchActivityPoint[];
  overTime: JobsOverTimePoint[];
  distribution: MatchScoreBucket[];
};

export async function getDashboardCharts(
  userId: string,
): Promise<DashboardCharts> {
  const empty: DashboardCharts = {
    research: EMPTY_RESEARCH,
    overTime: EMPTY_OVER_TIME,
    distribution: EMPTY_DISTRIBUTION,
  };
  try {
    const insforge = await createInsforgeServer();
    const weekAgo = new Date(Date.now() - 7 * DAY_MS).toISOString();
    const monthAgo = new Date(Date.now() - 30 * DAY_MS).toISOString();

    const { data: jobs, error: jobsError } = await insforge.database
      .from("jobs")
      .select("found_at")
      .eq("user_id", userId)
      .gte("found_at", monthAgo);
    if (jobsError) throw new Error(jobsError.message);
    const overTimeCounts = bucketByWeekday(
      (jobs ?? []) as FoundAtRow[],
      (row) => row.found_at,
    );
    const overTime = EMPTY_OVER_TIME.map((d, i) => ({
      ...d,
      value: overTimeCounts[i],
    }));

    const { data: runs, error: runsError } = await insforge.database
      .from("agent_runs")
      .select("completed_at")
      .eq("user_id", userId)
      .eq("status", "completed")
      .ilike("job_title_searched", "research:%")
      .gte("completed_at", weekAgo);
    if (runsError) throw new Error(runsError.message);
    const researchCounts = bucketByWeekday(
      (runs ?? []) as CompletedAtRow[],
      (row) => row.completed_at,
    );
    const research = EMPTY_RESEARCH.map((d, i) => ({
      ...d,
      value: researchCounts[i],
    }));

    const { data: allJobs, error: allJobsError } = await insforge.database
      .from("jobs")
      .select("match_score")
      .eq("user_id", userId);
    if (allJobsError) throw new Error(allJobsError.message);
    const distribution = EMPTY_DISTRIBUTION.map((d) => ({ ...d }));
    for (const row of (allJobs ?? []) as MatchScoreRow[]) {
      const score = typeof row.match_score === "number" ? row.match_score : 0;
      const idx = DISTRIBUTION_RANGES.findIndex(
        (r) => score >= r.min && score < r.max,
      );
      if (idx !== -1) distribution[idx].value++;
    }

    return { research, overTime, distribution };
  } catch (error) {
    console.error(
      "[dashboard-charts] failed:",
      error instanceof Error ? error.message : String(error),
    );
    return empty;
  }
}
