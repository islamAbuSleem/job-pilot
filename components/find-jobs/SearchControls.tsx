"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

type Props = {
  defaultTitle?: string;
  defaultLocation?: string;
  message?: string | null;
};

export function SearchControls({ defaultTitle = "Frontend Engineer", defaultLocation = "", message = null }: Props) {
  const router = useRouter();
  const [jobTitle, setJobTitle] = useState(defaultTitle ?? "");
  const [location, setLocation] = useState(defaultLocation ?? "");
  const [isSearching, setIsSearching] = useState(false);
  const [banner, setBanner] = useState<{ type: "success" | "error"; text: string } | null>(
    message ? { type: "success", text: message } : null,
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isSearching) return;
    const trimmedTitle = jobTitle.trim();
    if (!trimmedTitle) {
      setBanner({ type: "error", text: "Job title is required." });
      return;
    }
    setIsSearching(true);
    setBanner(null);
    try {
      const res = await fetch("/api/agent/find", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ jobTitle: trimmedTitle, location: location.trim() }),
      });
      const json = (await res.json()) as { success: boolean; data?: { jobsFound: number; strongMatches: number }; error?: string };
      if (!json.success) throw new Error(json.error || "Search failed");
      const found = json.data?.jobsFound ?? 0;
      const strong = json.data?.strongMatches ?? 0;
      if (found === 0) setBanner({ type: "success", text: "No jobs found for this query. Try a different title or location." });
      else if (strong === 0) setBanner({ type: "success", text: `Saved ${found} jobs. None scored 70+ yet — try refining your profile for stronger matches.` });
      else if (strong === found) setBanner({ type: "success", text: `Saved ${found} jobs — all strong matches.` });
      else setBanner({ type: "success", text: `Saved ${found} jobs, ${strong} of them strong matches.` });
      router.refresh();
    } catch (err) {
      setBanner({ type: "error", text: err instanceof Error ? err.message : "Search failed. Please try again." });
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      <form
        className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="job-title" className="text-[12px] font-medium leading-4 tracking-wide uppercase text-text-secondary">
            Job Title
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              id="job-title"
              name="jobTitle"
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Frontend Engineer"
              className="w-full bg-surface border border-border rounded-md pl-10 pr-3 py-2 text-[14px] leading-5 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="location" className="text-[12px] font-medium leading-4 tracking-wide uppercase text-text-secondary">
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Remote, New York..."
            className="w-full bg-surface border border-border rounded-md px-3 py-2 text-[14px] leading-5 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={isSearching}
            className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-[14px] font-medium leading-5 text-accent-foreground hover:bg-accent-dark transition-colors w-full md:w-auto justify-center disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSearching ? (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" aria-hidden>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <Search className="w-4 h-4" />
            )}
            {isSearching ? "Searching..." : "Find Jobs"}
          </button>
        </div>
      </form>

      {banner ? (
        <div
          role="status"
          className={`mt-6 flex items-center gap-2 rounded-md border px-4 py-3 text-[14px] leading-5 ${
            banner.type === "success"
              ? "border-success-light bg-success-lightest text-success-foreground"
              : "border-error-light bg-error-light text-error"
          }`}
        >
          <svg className={`w-4 h-4 shrink-0 ${banner.type === "success" ? "text-success" : "text-error"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
            <path d="M20 3v4" />
            <path d="M22 5h-4" />
            <path d="M4 17v2" />
            <path d="M5 18H3" />
          </svg>
          <span>{banner.text}</span>
        </div>
      ) : null}
    </div>
  );
}
