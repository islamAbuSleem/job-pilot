import Link from "next/link";

export function BrandingPanel() {
  return (
    <div className="hidden w-[44%] flex-col justify-between border-r border-stone-200 bg-white p-8 dark:border-stone-800 dark:bg-stone-900 lg:flex">
      <Link href="/" className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-900 text-[11px] font-bold tracking-widest text-white dark:bg-white dark:text-stone-900">
          JP
        </div>
        <span className="text-sm font-semibold tracking-tight">JobPilot</span>
      </Link>
      <div>
        <p className="text-sm font-semibold tracking-widest text-amber-600">WARM • ROBUST • PROFESSIONAL</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight leading-tight">
          Where every job
          <br />
          meets its best proposal.
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-6 text-stone-600 dark:text-stone-400">
          Paste any job, get a grounded fit analysis, and stream a proposal that sounds like you — not a bot.
        </p>
        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3 dark:border-stone-800 dark:bg-stone-800/50">
            <p className="text-xs font-bold tracking-widest text-stone-500">POSTGRES</p>
            <p className="text-xs">Prisma 7</p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/20 dark:bg-amber-950/20">
            <p className="text-xs font-bold tracking-widest text-amber-700">NEXT 16</p>
            <p className="text-xs">App Router</p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3 dark:border-stone-800 dark:bg-stone-800/50">
            <p className="text-xs font-bold tracking-widest text-stone-500">OPENROUTER</p>
            <p className="text-xs">6 models</p>
          </div>
        </div>
      </div>
      <p className="text-xs text-stone-400">© 2026 JobPilot</p>
    </div>
  );
}

export function AuthMobileHeader() {
  return (
    <header className="flex h-14 items-center justify-center border-b border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900 lg:hidden">
      <Link href="/" className="flex items-center gap-2 text-sm font-semibold">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-900 text-[10px] font-bold text-white">JP</span>
        JobPilot
      </Link>
    </header>
  );
}
