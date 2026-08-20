import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export type JobStatus = "new" | "analyzed" | "proposed";

export interface JobCardData {
  id: string;
  title: string;
  company: string;
  status: JobStatus;
  fitScore?: number;
}

const statusBadge: Record<JobStatus, { cls: string; label: string }> = {
  new: { cls: "bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-200", label: "New" },
  analyzed: { cls: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200", label: "Analyzed" },
  proposed: { cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300", label: "Proposal ready" },
};

export function JobCard({ id, title, company, status, fitScore }: JobCardData) {
  const badge = statusBadge[status];
  return (
    <Link href={`/jobs/${id}`} className="group flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-4 transition hover:border-stone-300 hover:shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <div>
        <p className="text-sm font-medium text-stone-900 group-hover:underline dark:text-white">{title}</p>
        <p className="mt-0.5 text-xs text-stone-500">{company}</p>
      </div>
      <div className="flex items-center gap-2">
        {fitScore != null && (
          <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-700 dark:bg-stone-800 dark:text-stone-300">
            {fitScore}/100
          </span>
        )}
        <Badge variant="stone" size="sm" className={badge.cls}>{badge.label}</Badge>
      </div>
    </Link>
  );
}
