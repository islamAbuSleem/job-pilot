import { createInsforgeServer } from "./insforge-server";

export type DashboardStats = {
  total: number;
  avgMatchRate: number;
  researched: number;
  thisWeek: number;
  totalTrend?: string;
  avgTrend?: string;
};

type StatsClient = Awaited<ReturnType<typeof createInsforgeServer>>;

const DAY_MS = 1000 * 60 * 60 * 24;

function formatTrend(current: number, previous: number): string | undefined {
  if (previous <= 0) return undefined;
  const pct = Math.round(((current - previous) / previous) * 100);
  return `${pct >= 0 ? "+" : ""}${pct}%`;
}

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const empty: DashboardStats = {
    total: 0,
    avgMatchRate: 0,
    researched: 0,
    thisWeek: 0,
  };
  try {
    const insforge: StatsClient = await createInsforgeServer();
    const now = Date.now();
    const weekAgo = new Date(now - 7 * DAY_MS).toISOString();
    const twoWeeksAgo = new Date(now - 14 * DAY_MS).toISOString();

    const { data: rows, error: rowsError } = await insforge.database
      .from("jobs")
      .select("match_score,found_at")
      .eq("user_id", userId);
    if (rowsError) throw new Error(rowsError.message);
    const jobs = (rows ?? []) as Array<{
      match_score: number | null;
      found_at: string | null;
    }>;

    const scores = jobs.map((j) =>
      typeof j.match_score === "number" ? j.match_score : 0,
    );
    const total = jobs.length;
    const avgMatchRate =
      total === 0
        ? 0
        : Math.round(scores.reduce((a, b) => a + b, 0) / total);

    const inWeek = (iso: string | null, from: string, to?: string): boolean => {
      if (!iso) return false;
      return to ? iso >= from && iso < to : iso >= from;
    };
    const thisWeekJobs = jobs.filter((j) => inWeek(j.found_at, weekAgo));
    const priorWeekJobs = jobs.filter((j) =>
      inWeek(j.found_at, twoWeeksAgo, weekAgo),
    );
    const avg = (list: typeof jobs): number => {
      if (list.length === 0) return 0;
      const s = list.reduce(
        (a, j) => a + (typeof j.match_score === "number" ? j.match_score : 0),
        0,
      );
      return s / list.length;
    };

    const { count: researched } = await insforge.database
      .from("jobs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .not("company_research", "is", null);

    return {
      total,
      avgMatchRate,
      researched: researched ?? 0,
      thisWeek: thisWeekJobs.length,
      totalTrend: formatTrend(thisWeekJobs.length, priorWeekJobs.length),
      avgTrend:
        priorWeekJobs.length === 0
          ? undefined
          : (() => {
              const diff = Math.round(avg(thisWeekJobs) - avg(priorWeekJobs));
              return `${diff >= 0 ? "+" : ""}${diff}%`;
            })(),
    };
  } catch (error) {
    console.error(
      "[dashboard-stats] failed:",
      error instanceof Error ? error.message : String(error),
    );
    return empty;
  }
}
