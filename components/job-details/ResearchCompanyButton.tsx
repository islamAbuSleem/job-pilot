"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

type Props = {
  jobId: string;
  company: string;
};

export function ResearchCompanyButton({ jobId, company }: Props) {
  const router = useRouter();
  const [isResearching, setIsResearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (isResearching) return;
    setIsResearching(true);
    setError(null);
    try {
      const res = await fetch(`/api/jobs/${jobId}/research`, {
        method: "POST",
        credentials: "include",
      });
      const json = (await res.json()) as
        | { success: true; data: { dossier: unknown } }
        | { success: false; error?: string };
      if (!res.ok || !json.success) {
        throw new Error(
          (!json.success && json.error) || "Research failed. Please try again.",
        );
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Research failed. Please try again.");
    } finally {
      setIsResearching(false);
    }
  }

  return (
    <div className="flex flex-col items-stretch sm:items-end gap-2 w-full sm:w-auto">
      <button
        type="button"
        onClick={handleClick}
        disabled={isResearching}
        aria-label={
          isResearching ? `Researching ${company}` : `Research ${company}`
        }
        className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2 text-[14px] font-medium leading-5 text-accent-foreground hover:bg-accent-dark transition-colors w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isResearching ? (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" aria-hidden>
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : (
          <Search className="w-4 h-4" aria-hidden />
        )}
        {isResearching ? "Researching…" : "Research Company"}
      </button>
      {error ? (
        <p role="alert" className="text-[13px] leading-5 text-error sm:text-right">
          {error}
        </p>
      ) : null}
    </div>
  );
}
