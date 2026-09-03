"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, ChevronDown } from "lucide-react";
import type { Job } from "./types";
import { MatchScoreBar } from "./MatchScoreBar";
import { CompanyMark } from "./CompanyMark";
import { JobsPagination } from "./JobsPagination";
import {
  MATCH_FILTERS,
  SORT_OPTIONS,
  type MatchFilter,
  type SortKey,
} from "@/lib/jobs-query";

type Props = {
  jobs: Job[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
  start: number;
  end: number;
  filter: MatchFilter;
  sort: SortKey;
  query: string;
};

export function JobsList({
  jobs,
  total,
  page,
  pageSize,
  pageCount,
  start,
  end,
  filter,
  sort,
  query,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchInput, setSearchInput] = useState(query);

  function pushParams(updates: Record<string, string | null>) {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") next.delete(key);
      else next.set(key, value);
    }
    if (!("page" in updates)) next.delete("page");
    const qs = next.toString();
    startTransition(() => {
      router.push(qs ? `${pathname}?${qs}` : pathname);
    });
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    pushParams({ q: searchInput.trim() || null });
  }

  return (
    <>
      <div className="bg-surface border border-border rounded-2xl p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Filter by company or role..."
              className="w-full bg-surface border border-border rounded-md pl-10 pr-3 py-2 text-[14px] leading-5 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
            />
          </form>
          <div className="flex items-center gap-2">
            <DropdownMenu
              value={filter}
              onChange={(v) => pushParams({ filter: v === "all" ? null : v })}
              options={MATCH_FILTERS}
            />
            <DropdownMenu
              value={sort}
              onChange={(v) => pushParams({ sort: v === "matchScore" ? null : v })}
              options={SORT_OPTIONS}
            />
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.8fr)] gap-4 px-6 py-3 border-b border-border bg-surface">
          <span className="text-[12px] font-medium leading-4 tracking-wide uppercase text-text-secondary">Company</span>
          <span className="text-[12px] font-medium leading-4 tracking-wide uppercase text-text-secondary">Role</span>
          <span className="text-[12px] font-medium leading-4 tracking-wide uppercase text-text-secondary">Match Score</span>
          <span className="text-[12px] font-medium leading-4 tracking-wide uppercase text-text-secondary">Salary Est.</span>
          <span className="text-[12px] font-medium leading-4 tracking-wide uppercase text-text-secondary">Date Found</span>
        </div>

        {jobs.length === 0 ? (
          <div className="px-6 py-12 text-center text-[14px] leading-5 text-text-muted">
            {total === 0
              ? "No jobs found yet. Run a search above to find matches."
              : "No jobs match your filters."}
          </div>
        ) : (
          <ul className={isPending ? "opacity-60 transition-opacity" : "transition-opacity"}>
            {jobs.map((job) => (
              <li
                key={job.id}
                className="border-b border-border last:border-b-0 hover:bg-surface-secondary transition-colors"
              >
                <Link
                  href={`/find-jobs/${job.id}`}
                  className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.8fr)] gap-4 items-center px-6 py-4 focus:outline-none focus-visible:bg-surface-secondary"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <CompanyMark name={job.company} />
                    <span className="text-[14px] font-medium leading-5 text-text-primary truncate">
                      {job.company}
                    </span>
                  </div>
                  <span className="text-[14px] font-medium leading-5 text-text-primary truncate">
                    {job.role}
                  </span>
                  <MatchScoreBar score={job.matchScore} />
                  <span className="text-[14px] leading-5 text-text-primary">
                    {job.salary}
                  </span>
                  <span className="text-[14px] leading-5 text-text-secondary">
                    {job.dateFound}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {total > 0 && (
          <div className="px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-t border-border">
            <p className="text-[14px] leading-5 text-text-secondary">
              Showing <span className="text-text-primary font-medium">{start}</span> to{" "}
              <span className="text-text-primary font-medium">{end}</span> of{" "}
              <span className="text-text-primary font-medium">{total}</span> results
              {pageSize > 0 ? ` (${pageSize} per page)` : null}
            </p>
            <JobsPagination
              page={page}
              pageCount={pageCount}
              onChange={(p) => pushParams({ page: p === 1 ? null : String(p) })}
            />
          </div>
        )}
      </div>
    </>
  );
}

type DropdownOption<T extends string> = { value: T; label: string };

function DropdownMenu<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (next: T) => void;
  options: ReadonlyArray<DropdownOption<T>>;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="appearance-none bg-surface border border-border rounded-md pl-3 pr-9 py-2 text-[14px] leading-5 text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
    </div>
  );
}
