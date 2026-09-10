import { cookies } from "next/headers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageviewTracker } from "@/components/PageviewTracker";
import { StatsBar, type StatItem } from "@/components/dashboard/StatsBar";
import {
  RecentActivity,
  type ActivityEntry,
} from "@/components/dashboard/RecentActivity";
import { ResearchActivityChart } from "@/components/dashboard/ResearchActivityChart";
import { JobsOverTimeChart } from "@/components/dashboard/JobsOverTimeChart";
import { MatchScoreChart } from "@/components/dashboard/MatchScoreChart";
import { IncompleteProfileBanner } from "@/components/dashboard/IncompleteProfileBanner";
import { createInsforgeServer } from "@/lib/insforge-server";
import { computeCompletion } from "@/lib/profile-completion";
import { getDashboardStats } from "@/lib/dashboard-stats";
import { getRecentActivity } from "@/lib/dashboard-activity";
import { getDashboardCharts, type DashboardCharts, type ResearchActivityPoint, type JobsOverTimePoint, type MatchScoreBucket } from "@/lib/dashboard-charts";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const isAuthed = Boolean(cookieStore.get("insforge_access_token")?.value);

  let showBanner = false;
  let stats: StatItem[] = [
    { label: "Total Jobs Found", value: "0" },
    { label: "Avg. Match Rate", value: "0%" },
    { label: "Companies Researched", value: "0", subtext: "Total researched" },
    { label: "Jobs This Week", value: "0", subtext: "New this week" },
  ];
  let activity: ActivityEntry[] = [];
  let charts: DashboardCharts = {
    research: [],
    overTime: [],
    distribution: [],
  };
  try {
    const insforge = await createInsforgeServer();
    const { data: authData } = await insforge.auth.getCurrentUser();
    const user = authData?.user ?? null;
    if (user) {
      const { data: profile } = await insforge.database
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      showBanner = !computeCompletion(
        profile as Parameters<typeof computeCompletion>[0],
      ).isComplete;

      const real = await getDashboardStats(user.id);
      stats = [
        {
          label: "Total Jobs Found",
          value: String(real.total),
          ...(real.totalTrend ? { trend: real.totalTrend } : {}),
        },
        {
          label: "Avg. Match Rate",
          value: `${real.avgMatchRate}%`,
          ...(real.avgTrend ? { trend: real.avgTrend } : {}),
        },
        {
          label: "Companies Researched",
          value: String(real.researched),
          subtext: "Total researched",
        },
        {
          label: "Jobs This Week",
          value: String(real.thisWeek),
          subtext: "New this week",
        },
      ];

      activity = await getRecentActivity(user.id);
      charts = await getDashboardCharts(user.id);
    }
  } catch {
    showBanner = false;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PageviewTracker path="/dashboard" />
      <Navbar isAuthed={isAuthed} activePath="/dashboard" />
      <main className="flex-1 w-full">
        <div className="mx-auto max-w-[1440px] px-8 py-12">
          <div className="flex flex-col gap-6">
            {showBanner ? <IncompleteProfileBanner /> : null}
            <StatsBar stats={stats} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentActivity entries={activity} />
              <ResearchActivityChart data={charts.research} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3">
                <JobsOverTimeChart data={charts.overTime} />
              </div>
              <div className="lg:col-span-2">
                <MatchScoreChart data={charts.distribution} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
