import Link from "next/link";
import { Button } from "@/components/ui/button";
import { JobCard, type JobCardData } from "./components/JobCard";

// TODO(BE): replace mock data with BE fetch
const MOCK_JOBS: JobCardData[] = [
  { id: "1", title: "Senior Frontend — Acme", company: "Acme Inc.", status: "analyzed", fitScore: 82 },
  { id: "2", title: "Backend (Node) — Stark", company: "Stark Corp", status: "new", fitScore: undefined },
  { id: "3", title: "Full-stack Freelance — Upwork", company: "Upwork", status: "proposed", fitScore: 91 },
];

export default function JobsPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight">Jobs</h1>
          <p className="mt-1 text-sm text-stone-500">All your pasted jobs and proposals.</p>
        </div>
        <Link href="/jobs/new">
          <Button variant="primary">＋ New Job</Button>
        </Link>
      </div>
      {MOCK_JOBS.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {MOCK_JOBS.map((j) => (
            <JobCard key={j.id} {...j} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-12 rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center dark:border-stone-700 dark:bg-stone-900">
      <p className="text-sm font-medium">No jobs yet</p>
      <p className="mt-1 text-sm text-stone-500">Paste a job to see it here.</p>
      <Link href="/jobs/new" className="mt-4 inline-flex h-9 rounded-full bg-stone-900 px-4 text-sm font-medium text-white hover:bg-stone-800 dark:bg-white dark:text-stone-900">
        New Job
      </Link>
    </div>
  );
}
