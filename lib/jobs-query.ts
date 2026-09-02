export const DEFAULT_PAGE_SIZE = 20;
export const MATCH_THRESHOLD = 70;

export const MATCH_FILTERS = [
  { value: "all", label: "All Matches" },
  { value: "high", label: "High Match" },
  { value: "low", label: "Low Match" },
] as const;

export const SORT_OPTIONS = [
  { value: "matchScore", label: "Match Score" },
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
] as const;

export type MatchFilter = (typeof MATCH_FILTERS)[number]["value"];
export type SortKey = (typeof SORT_OPTIONS)[number]["value"];

export type JobRow = {
  id: string;
  company: string | null;
  title: string | null;
  match_score: number | null;
  salary: string | null;
  found_at: string;
};

export type ListJobsResult = {
  rows: JobRow[];
  total: number;
};

export function parsePage(raw: string | string[] | undefined): number {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const n = Number.parseInt(value ?? "1", 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

export function parseFilter(raw: string | string[] | undefined): MatchFilter {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (value === "high" || value === "low") return value;
  return "all";
}

export function parseSort(raw: string | string[] | undefined): SortKey {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (value === "newest" || value === "oldest") return value;
  return "matchScore";
}

export function escapeIlike(input: string): string {
  return input.trim().replace(/[\\%_]/g, (m) => `\\${m}`);
}
