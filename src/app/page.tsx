import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <span className="text-lg font-semibold tracking-tight">JobPilot</span>
          <nav className="flex items-center gap-3">
            <Link
              href="/signin"
              className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
            >
              Sign in
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900"
            >
              Go to Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-16">
        <section className="mx-auto max-w-3xl py-12 text-center">
          <p className="mb-3 text-sm font-medium tracking-wide text-zinc-500">
            For developers &amp; job seekers
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
            Paste any job.
            <br />
            Get fit analysis
            <br />
            <span className="text-zinc-500">and a tailored proposal.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-7 text-zinc-600 dark:text-zinc-400">
            Paste job text or a URL, pick your resume, and let JobPilot score
            your fit, highlight gaps, and stream a proposal grounded in your
            real profile.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="flex h-11 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/signin"
              className="flex h-11 items-center justify-center rounded-full border border-zinc-200 px-6 text-sm font-medium hover:bg-white dark:border-zinc-800 dark:hover:bg-zinc-900"
            >
              Sign in to start
            </Link>
          </div>
          <p className="mt-4 text-xs text-zinc-500">
            Email + Google + GitHub auth • Postgres + Prisma • OpenRouter multi-model
          </p>
        </section>

        <section className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 py-8 sm:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <h3 className="text-sm font-semibold">1. Paste job</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Raw text or any public URL. We clean and normalize title, company,
              and requirements.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <h3 className="text-sm font-semibold">2. Analyze fit</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Streaming fit score, matched skills, gaps, strengths, and red flags
              vs your selected resume.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <h3 className="text-sm font-semibold">3. Generate proposal</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Auto-detects freelance vs cover letter, streams an editable draft
              you can copy or download.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 py-6 text-center text-xs text-zinc-500 dark:border-zinc-800">
        JobPilot MVP • Paste → Analyze → Proposal
      </footer>
    </div>
  );
}
