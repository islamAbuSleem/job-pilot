import Link from "next/link";

export function QuickStart() {
  return (
    <div className="rounded-[24px] border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900">
      <h2 className="text-sm font-semibold">Quick start</h2>
      <p className="mt-1 text-sm leading-6 text-stone-600 dark:text-stone-400">
        Paste a job and get analysis in seconds. Warm, robust, and grounded in your resume.
      </p>
      <Link
        href="/jobs/new"
        className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-full bg-stone-900 px-4 text-sm font-medium text-white hover:bg-stone-800 dark:bg-white dark:text-stone-900"
      >
        New Job
      </Link>
      <div className="mt-4 rounded-2xl bg-stone-50 p-3 dark:bg-stone-800/40">
        <p className="text-xs font-semibold tracking-widest text-stone-500">TIP</p>
        <p className="mt-1 text-xs leading-5 text-stone-600 dark:text-stone-400">
          Pick the resume closest to the role — you can store multiple and choose per job.
        </p>
      </div>
    </div>
  );
}
