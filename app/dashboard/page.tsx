import { cookies } from "next/headers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageviewTracker } from "@/components/PageviewTracker";
import { StatsBar, type StatItem } from "@/components/dashboard/StatsBar";
import {
  RecentActivity,
  type ActivityEntry,
} from "@/components/dashboard/RecentActivity";
import {
  ResearchActivityChart,
  type ResearchActivityPoint,
} from "@/components/dashboard/ResearchActivityChart";
import {
  JobsOverTimeChart,
  type JobsOverTimePoint,
} from "@/components/dashboard/JobsOverTimeChart";
import {
  MatchScoreChart,
  type MatchScoreBucket,
} from "@/components/dashboard/MatchScoreChart";
import { IncompleteProfileBanner } from "@/components/dashboard/IncompleteProfileBanner";
import { createInsforgeServer } from "@/lib/insforge-server";
import { computeCompletion } from "@/lib/profile-completion";

const MOCK_STATS: StatItem[] = [
  { label: "Total Jobs Found", value: "284", trend: "+12%" },
  { label: "Avg. Match Rate", value: "82%", trend: "+3%" },
  { label: "Companies Researched", value: "35", subtext: "Total researched" },
  { label: "Jobs This Week", value: "28", subtext: "New this week" },
];

const MOCK_ACTIVITY: ActivityEntry[] = [
  { text: "Found 8 jobs for Frontend Engineer", time: "10 mins ago", tone: "accent" },
  { text: "Researched Stripe", time: "1 hour ago", tone: "info" },
  { text: "Found 12 jobs for React Developer", time: "2 hours ago", tone: "success" },
  { text: "Researched Vercel", time: "Yesterday", tone: "accent" },
  { text: "Found 10 jobs for Full Stack Engineer", time: "Yesterday", tone: "success" },
];

const MOCK_RESEARCH: ResearchActivityPoint[] = [
  { day: "Mon", value: 2 },
  { day: "Tue", value: 5 },
  { day: "Wed", value: 3 },
  { day: "Thu", value: 8 },
  { day: "Fri", value: 12 },
  { day: "Sat", value: 4 },
  { day: "Sun", value: 1 },
];

const MOCK_OVER_TIME: JobsOverTimePoint[] = [
  { day: "Mon", value: 12 },
  { day: "Tue", value: 45 },
  { day: "Wed", value: 32 },
  { day: "Thu", value: 60 },
  { day: "Fri", value: 85 },
  { day: "Sat", value: 40 },
  { day: "Sun", value: 12 },
];

const MOCK_DISTRIBUTION: MatchScoreBucket[] = [
  { range: "50-60%", value: 5 },
  { range: "60-70%", value: 15 },
  { range: "70-80%", value: 45 },
  { range: "80-90%", value: 85 },
  { range: "90-100%", value: 35 },
];

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const isAuthed = Boolean(cookieStore.get("insforge_access_token")?.value);

  let showBanner = false;
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
            <StatsBar stats={MOCK_STATS} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentActivity entries={MOCK_ACTIVITY} />
              <ResearchActivityChart data={MOCK_RESEARCH} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3">
                <JobsOverTimeChart data={MOCK_OVER_TIME} />
              </div>
              <div className="lg:col-span-2">
                <MatchScoreChart data={MOCK_DISTRIBUTION} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
