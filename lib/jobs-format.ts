const JOB_TYPE_LABELS: Record<string, string> = {
  fulltime: "Full-time",
  full_time: "Full-time",
  "full-time": "Full-time",
  parttime: "Part-time",
  part_time: "Part-time",
  "part-time": "Part-time",
  contract: "Contract",
  internship: "Internship",
  temporary: "Temporary",
};

export function formatJobType(raw: string | null | undefined): string {
  if (!raw) return "—";
  const key = raw.trim().toLowerCase();
  return JOB_TYPE_LABELS[key] ?? "—";
}

export function formatRelative(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const diff = Date.now() - d.getTime();
  if (diff < 0) return "Just now";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours === 1) return "1 hour ago";
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return d.toLocaleDateString();
}
