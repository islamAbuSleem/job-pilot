import Link from "next/link";

export type JobItem = { title: string; fit: number; status: string; tone: "amber" | "stone" | "emerald" };

const DEFAULT_JOBS: JobItem[] = [
  { title: "Senior Frontend — Acme", fit: 82, status: "Analyzed", tone: "amber" },
  { title: "Backend (Node) — Stark", fit: 64, status: "Needs analysis", tone: "stone" },
  { title: "Full-stack Freelance — Upwork", fit: 91, status: "Proposal ready", tone: "emerald" },
];

export function RecentJobs({ jobs = DEFAULT_JOBS }: { jobs?: JobItem[] }) {
  return (
    <div className="rounded-[24px] border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Recent jobs</h2>
        <Link href="/jobs" className="text-xs font-medium text-stone-600 hover:underline dark:text-stone-300">
          View all →
        </Link>
      </div>
      <div className="mt-4 space-y-3">
        {jobs.map((j) => (
          <div
            key={j.title}
            className="flex items-center justify-between rounded-2xl border border-stone-100 bg-stone-50 px-4 py-3 dark:border-stone-800 dark:bg-stone-800/40"
          >
            <div>
              <p className="text-sm font-medium">{j.title}</p>
              <p className="text-xs text-stone-500">
                {j.status} • Fit {j.fit}/100
              </p>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                j.tone === "amber"
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200"
                  : j.tone === "emerald"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
                    : "bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-200"
              }`}
            >
              {j.fit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
