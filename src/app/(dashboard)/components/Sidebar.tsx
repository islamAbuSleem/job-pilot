import Link from "next/link";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", active: true },
  { href: "/jobs", label: "Jobs", active: false },
  { href: "/profile", label: "Profile", active: false },
  { href: "/settings", label: "Settings", active: false },
] as const;

export function Sidebar({
  email = "dev@example.com",
  items = NAV_ITEMS,
}: {
  email?: string;
  items?: typeof NAV_ITEMS;
}) {
  return (
    <aside className="hidden w-[280px] shrink-0 flex-col border-r border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900 sm:flex">
      <div className="flex h-[64px] items-center gap-3 border-b border-stone-100 px-6 dark:border-stone-800">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-900 text-[11px] font-bold tracking-widest text-white dark:bg-white dark:text-stone-900">
          JP
        </div>
        <span className="text-sm font-semibold tracking-tight">JobPilot</span>
        <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold tracking-widest text-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
          WARM
        </span>
      </div>

      <div className="px-4 py-4">
        <Link
          href="/jobs/new"
          className="flex h-10 w-full items-center justify-center gap-2 rounded-full bg-amber-500 text-sm font-semibold text-stone-900 shadow-sm hover:bg-amber-400"
        >
          <span className="text-lg leading-none">＋</span> New Job
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2 text-sm">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-full px-3.5 py-2.5 ${
              item.active
                ? "bg-stone-900 font-medium text-white dark:bg-white dark:text-stone-900"
                : "text-stone-600 hover:bg-stone-50 dark:text-stone-400 dark:hover:bg-stone-800"
            }`}
          >
            <span className={`rounded-full ${item.active ? "h-2 w-2 bg-amber-400" : "h-1.5 w-1.5 bg-stone-400"}`} /> {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-stone-100 p-4 dark:border-stone-800">
        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3 dark:border-stone-800 dark:bg-stone-800/50">
          <p className="text-xs font-semibold">Dev account</p>
          <p className="truncate text-xs text-stone-500">{email}</p>
          {/* TODO(BE): replace with real auth state */}
          <p className="mt-2 text-xs text-stone-400">Auth wiring in Unit 3</p>
        </div>
      </div>
    </aside>
  );
}

export function MobileTopbar({ email = "dev@example.com" }: { email?: string }) {
  return (
    <header className="flex h-[64px] items-center justify-between border-b border-stone-200 bg-white/80 px-6 backdrop-blur dark:border-stone-800 dark:bg-stone-900/70 sm:px-8 sm:hidden">
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-900 text-[10px] font-bold text-white">JP</div>
        <span className="text-sm font-semibold">JobPilot</span>
      </div>
      <span className="text-xs text-stone-500">{email}</span>
    </header>
  );
}

// TODO(BE): replace hardcoded "3 jobs • 2 analyzed" with live data
export function DashboardTopbar({ name = "Dev" }: { name?: string }) {
  return (
    <header className="hidden h-[64px] items-center justify-between border-b border-stone-200 bg-white/80 px-6 backdrop-blur dark:border-stone-800 dark:bg-stone-900/70 sm:flex sm:px-8">
      <div>
        <p className="text-xs font-semibold tracking-widest text-stone-500">DASHBOARD</p>
        <h1 className="text-sm font-semibold">Welcome back, {name}</h1>
      </div>
      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
        3 jobs • 2 analyzed
      </span>
    </header>
  );
}
