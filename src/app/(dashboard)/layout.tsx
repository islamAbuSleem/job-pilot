import Link from "next/link";

// TODO(Unit 3): wire to Auth.js — for now render shell without session guard
// import { auth } from "@/auth";
// import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const session = await auth();
  // if (!session?.user) redirect("/signin");
  const session = { user: { email: "dev@example.com" } } as const;

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 border-r border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950 sm:block">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          JobPilot
        </Link>
        <nav className="mt-8 flex flex-col gap-1 text-sm">
          <Link href="/dashboard" className="rounded-lg px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900">
            Dashboard
          </Link>
          <Link href="/jobs" className="rounded-lg px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900">
            Jobs
          </Link>
          <Link href="/jobs/new" className="rounded-lg px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900">
            New Job
          </Link>
          <Link href="/profile" className="rounded-lg px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900">
            Profile
          </Link>
          <Link href="/settings" className="rounded-lg px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900">
            Settings
          </Link>
        </nav>
        <div className="mt-8 border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <p className="truncate text-xs text-zinc-500">{session.user.email}</p>
          <p className="mt-2 text-xs text-zinc-400">Sign out wiring in Unit 3</p>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-zinc-200 bg-white px-6 dark:border-zinc-800 dark:bg-zinc-950 sm:hidden">
          <Link href="/" className="text-sm font-semibold">
            JobPilot
          </Link>
          <span className="text-xs text-zinc-500">{session.user.email}</span>
        </header>
        <main className="flex-1 bg-zinc-50 p-6 dark:bg-black">{children}</main>
      </div>
    </div>
  );
}
