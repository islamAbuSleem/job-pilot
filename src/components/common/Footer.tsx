export function SiteFooter() {
  return (
    <footer className="border-t border-stone-200 bg-white py-6 dark:border-stone-800 dark:bg-stone-900">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 text-xs text-stone-500">
        <span>© 2026 JobPilot • Paste → Analyze → Proposal</span>
        <span className="hidden sm:inline">Warm • Robust • Professional</span>
      </div>
    </footer>
  );
}

export function DarkFooter() {
  return (
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
  );
}
