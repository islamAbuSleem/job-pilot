import { StatsGrid } from "./components/StatsGrid";
import { RecentJobs } from "./components/RecentJobs";
import { QuickStart } from "./components/QuickStart";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-col gap-1">
        <h1 className="text-[22px] font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-stone-500">Your pipeline at a glance — warm, robust, ready.</p>
      </div>
      <StatsGrid />
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_0.9fr]">
        <RecentJobs />
        <QuickStart />
      </div>
    </div>
  );
}
