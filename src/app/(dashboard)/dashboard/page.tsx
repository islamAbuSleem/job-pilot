import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-col gap-1">
        <h1 className="text-[22px] font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-stone-500">Your pipeline at a glance — warm, robust, ready.</p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-[20px] border border-stone-200 bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] dark:border-stone-800 dark:bg-stone-900">
          <p className="text-xs font-semibold tracking-widest text-stone-500">TOTAL JOBS</p>
          <p className="mt-2 text-[28px] font-semibold tracking-tight leading-none">12</p>
          <p className="mt-1 text-xs text-stone-500">3 this week</p>
        </div>
        <div className="rounded-[20px] border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/30 dark:bg-amber-950/10">
          <p className="text-xs font-semibold tracking-widest text-amber-700 dark:text-amber-300">ANALYZED</p>
          <p className="mt-2 text-[28px] font-semibold tracking-tight leading-none">8</p>
          <p className="mt-1 text-xs text-amber-700/70 dark:text-amber-200/70">Avg fit 74/100</p>
        </div>
        <div className="rounded-[20px] border border-stone-200 bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] dark:border-stone-800 dark:bg-stone-900">
          <p className="text-xs font-semibold tracking-widest text-stone-500">PROPOSALS</p>
          <p className="mt-2 text-[28px] font-semibold tracking-tight leading-none">5</p>
          <p className="mt-1 text-xs text-stone-500">2 ready to send</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_0.9fr]">
        <div className="rounded-[24px] border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Recent jobs</h2>
            <Link href="/jobs" className="text-xs font-medium text-stone-600 hover:underline dark:text-stone-300">
              View all →
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {[
              { title: "Senior Frontend — Acme", fit: 82, status: "Analyzed", tone: "amber" },
              { title: "Backend (Node) — Stark", fit: 64, status: "Needs analysis", tone: "stone" },
              { title: "Full-stack Freelance — Upwork", fit: 91, status: "Proposal ready", tone: "emerald" },
            ].map((j) => (
              <div key={j.title} className="flex items-center justify-between rounded-2xl border border-stone-100 bg-stone-50 px-4 py-3 dark:border-stone-800 dark:bg-stone-800/40">
                <div>
                  <p className="text-sm font-medium">{j.title}</p>
                  <p className="text-xs text-stone-500">{j.status} • Fit {j.fit}/100</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${j.tone === "amber" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200" : j.tone === "emerald" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300" : "bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-200"}`}>
                  {j.fit}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[24px] border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900">
          <h2 className="text-sm font-semibold">Quick start</h2>
          <p className="mt-1 text-sm leading-6 text-stone-600 dark:text-stone-400">Paste a job and get analysis in seconds. Warm, robust, and grounded in your resume.</p>
          <Link href="/jobs/new" className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-full bg-stone-900 px-4 text-sm font-medium text-white hover:bg-stone-800 dark:bg-white dark:text-stone-900">
            New Job
          </Link>
          <div className="mt-4 rounded-2xl bg-stone-50 p-3 dark:bg-stone-800/40">
            <p className="text-xs font-semibold tracking-widest text-stone-500">TIP</p>
            <p className="mt-1 text-xs leading-5 text-stone-600 dark:text-stone-400">Pick the resume closest to the role — you can store multiple and choose per job.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
