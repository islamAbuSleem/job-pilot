import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fafaf9] dark:bg-stone-950">
      {/* Top nav */}
      <header className="sticky top-0 z-30 border-b border-stone-200/70 bg-white/80 backdrop-blur-md dark:border-stone-800/50 dark:bg-stone-900/70">
        <div className="mx-auto flex h-[64px] max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-900 text-[11px] font-bold tracking-widest text-white dark:bg-white dark:text-stone-900">
              JP
            </div>
            <span className="text-[15px] font-semibold tracking-tight">JobPilot</span>
            <span className="hidden rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-semibold tracking-widest text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 sm:inline">
              MVP
            </span>
          </div>
          <nav className="flex items-center gap-2">
            <Link
              href="/signin"
              className="hidden rounded-full px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800 sm:inline"
            >
              Sign in
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-stone-800 hover:shadow dark:bg-white dark:text-stone-900 dark:hover:bg-stone-100"
            >
              Go to Dashboard →
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6">
        <section className="relative overflow-hidden py-12 sm:py-16">
          {/* Warm grid backdrop */}
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(245,158,11,0.08),_transparent_60%),linear-gradient(to_bottom,_white,_#fafaf9)] dark:bg-[radial-gradient(ellipse_at_top,_rgba(245,158,11,0.12),_transparent_60%),linear-gradient(to_bottom,_#0c0a09,_#0c0a09)]" />
          <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.06]" style={{ backgroundImage: `linear-gradient(to right, #444 1px, transparent 1px), linear-gradient(to bottom, #444 1px, transparent 1px)`, backgroundSize: `32px 32px` }} />

          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800 dark:border-amber-900/30 dark:bg-amber-950/30 dark:text-amber-200">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                Paste → Analyze → Proposal in under 2 min
              </div>
              <h1 className="mt-5 text-[36px] font-semibold leading-[0.95] tracking-[-0.03em] text-stone-900 dark:text-white sm:text-[52px]">
                Turn any job
                <br />
                into a <span className="relative inline-block">tailored proposal <span className="absolute inset-x-0 bottom-1 -z-10 h-3 bg-amber-200/60 dark:bg-amber-400/20" /></span>
              </h1>
              <p className="mt-5 max-w-xl text-[17px] leading-7 text-stone-600 dark:text-stone-400">
                Paste job text or a URL, pick your resume, and get a structured fit analysis plus a streamed proposal grounded in your real profile — not hallucinations.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/dashboard"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-stone-900 px-7 text-sm font-medium text-white shadow-[0_4px_14px_rgba(0,0,0,0.12)] hover:bg-stone-800 hover:shadow-[0_6px_20px_rgba(0,0,0,0.14)] dark:bg-white dark:text-stone-900"
                >
                  Start with a job — it’s free
                </Link>
                <Link
                  href="/signin"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-stone-200 bg-white px-7 text-sm font-medium hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-900 dark:hover:bg-stone-800"
                >
                  See demo analysis
                </Link>
              </div>
              <div className="mt-6 flex items-center gap-4 text-xs text-stone-500 dark:text-stone-400">
                <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />No credit card</span>
                <span>•</span>
                <span>Email + Google + GitHub</span>
                <span>•</span>
                <span>OpenRouter multi-model</span>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="h-7 w-7 rounded-full border-2 border-white bg-stone-200 dark:border-stone-900 dark:bg-stone-800" />
                  <div className="h-7 w-7 rounded-full border-2 border-white bg-stone-300 dark:border-stone-900 dark:bg-stone-700" />
                  <div className="h-7 w-7 rounded-full border-2 border-white bg-amber-200 dark:border-stone-900 dark:bg-amber-900/40" />
                </div>
                <p className="text-xs leading-4 text-stone-600 dark:text-stone-400">
                  Trusted by devs shipping <span className="font-semibold text-stone-900 dark:text-white">3+ proposals/week</span>
                </p>
              </div>
            </div>

            {/* Robust preview card */}
            <div className="relative">
              <div className="absolute -inset-3 -z-10 rounded-[28px] bg-gradient-to-br from-amber-100 to-stone-100 blur-2xl dark:from-amber-950/20 dark:to-stone-900/40" />
              <div className="overflow-hidden rounded-[24px] border border-stone-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] dark:border-stone-800 dark:bg-stone-900">
                <div className="flex items-center justify-between border-b border-stone-100 px-5 py-3 dark:border-stone-800">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-semibold tracking-widest text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                    ANALYSIS • ANTHROPIC/CLAUDE-3.5
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold tracking-widest text-stone-500">SENIOR FRONTEND • ACME</p>
                      <h3 className="mt-1 text-sm font-semibold leading-5">Fit Analysis — 82/100</h3>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">Strong fit</span>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-2xl bg-stone-50 p-3 dark:bg-stone-800/50">
                      <p className="text-[11px] font-semibold tracking-widest text-stone-500">MATCHED</p>
                      <p className="mt-1 text-sm font-semibold">React, TS, Tailwind</p>
                    </div>
                    <div className="rounded-2xl bg-amber-50 p-3 dark:bg-amber-950/20">
                      <p className="text-[11px] font-semibold tracking-widest text-amber-700 dark:text-amber-300">GAPS</p>
                      <p className="mt-1 text-sm font-semibold">Next.js 15, tRPC</p>
                    </div>
                    <div className="rounded-2xl bg-stone-50 p-3 dark:bg-stone-800/50">
                      <p className="text-[11px] font-semibold tracking-widest text-stone-500">RISKS</p>
                      <p className="mt-1 text-sm font-semibold">Vague scope</p>
                    </div>
                  </div>
                  <div className="mt-4 rounded-2xl border border-stone-100 bg-stone-50 p-4 dark:border-stone-800 dark:bg-stone-800/30">
                    <p className="text-xs font-semibold tracking-widest text-stone-500">PROPOSAL DRAFT — STREAMING</p>
                    <p className="mt-2 text-sm leading-6 text-stone-700 dark:text-stone-300">
                      Hi Acme team — I’m a frontend engineer with 4 years of React + TypeScript, recently shipping a Tailwind-heavy SaaS. Your Next.js + tRPC stack matches my recent work…
                      <span className="inline-block h-3 w-0.5 translate-y-0.5 animate-pulse bg-stone-900 dark:bg-white" />
                    </p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <span className="h-2 w-16 rounded-full bg-stone-900 dark:bg-white" />
                    <span className="h-2 w-10 rounded-full bg-stone-200 dark:bg-stone-700" />
                    <span className="h-2 w-8 rounded-full bg-amber-200 dark:bg-amber-800" />
                  </div>
                </div>
              </div>
              <p className="mt-3 text-center text-xs text-stone-500">Pasted URL → cleaned in 0.9s • Streamed in 1.4s</p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-10">
          <div className="mx-auto max-w-6xl rounded-[28px] border border-stone-200 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:border-stone-800 dark:bg-stone-900 sm:p-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="text-lg font-semibold tracking-tight">How it works</h2>
              <p className="text-sm text-stone-500">Paste once. Reuse your profile everywhere.</p>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="group rounded-2xl border border-stone-100 bg-stone-50 p-5 transition hover:bg-white hover:shadow-sm dark:border-stone-800 dark:bg-stone-800/30 dark:hover:bg-stone-800">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm dark:bg-stone-900">1</div>
                <h3 className="mt-4 text-sm font-semibold">Paste job</h3>
                <p className="mt-1.5 text-sm leading-6 text-stone-600 dark:text-stone-400">Raw text or any public URL. We strip nav, normalize title/company, and keep source.</p>
              </div>
              <div className="group rounded-2xl border border-amber-100 bg-amber-50/60 p-5 dark:border-amber-900/20 dark:bg-amber-950/10">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500 text-white shadow-sm">2</div>
                <h3 className="mt-4 text-sm font-semibold">Analyze fit</h3>
                <p className="mt-1.5 text-sm leading-6 text-stone-600 dark:text-stone-400">Streaming score 0-100, matched skills, gaps to address, strengths, and red flags vs your selected resume.</p>
              </div>
              <div className="group rounded-2xl border border-stone-100 bg-stone-50 p-5 transition hover:bg-white hover:shadow-sm dark:border-stone-800 dark:bg-stone-800/30 dark:hover:bg-stone-800">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm dark:bg-stone-900">3</div>
                <h3 className="mt-4 text-sm font-semibold">Generate proposal</h3>
                <p className="mt-1.5 text-sm leading-6 text-stone-600 dark:text-stone-400">Auto-detects freelance bid vs cover letter, streams an editable draft you can copy or download.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Social proof */}
        <section className="pb-12">
          <div className="rounded-[20px] bg-stone-900 px-6 py-5 text-stone-100 dark:bg-white dark:text-stone-900 sm:px-8">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-sm font-medium">Built for devs who ship — not just apply.</p>
              <div className="flex items-center gap-6 text-xs opacity-80">
                <span>Postgres + Prisma</span>
                <span>•</span>
                <span>Next.js 16</span>
                <span>•</span>
                <span>Tailwind 4</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-200 bg-white py-6 dark:border-stone-800 dark:bg-stone-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 text-xs text-stone-500">
          <span>© 2026 JobPilot • Paste → Analyze → Proposal</span>
          <span className="hidden sm:inline">Warm • Robust • Professional</span>
        </div>
      </footer>
    </div>
  );
}
