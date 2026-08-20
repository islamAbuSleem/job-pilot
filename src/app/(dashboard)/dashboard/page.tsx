export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Your jobs, analyses, and proposals will appear here.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs font-medium text-zinc-500">Total jobs</p>
          <p className="mt-2 text-2xl font-semibold">0</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs font-medium text-zinc-500">Analyzed</p>
          <p className="mt-2 text-2xl font-semibold">0</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs font-medium text-zinc-500">Proposals</p>
          <p className="mt-2 text-2xl font-semibold">0</p>
        </div>
      </div>
      <div className="mt-8 rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-zinc-700 dark:bg-zinc-950">
        <p className="text-sm font-medium">No jobs yet</p>
        <p className="mt-1 text-sm text-zinc-500">Create your first job to see it here.</p>
        <a
          href="/jobs/new"
          className="mt-4 inline-flex h-9 items-center justify-center rounded-full bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900"
        >
          New Job
        </a>
      </div>
    </div>
  );
}
