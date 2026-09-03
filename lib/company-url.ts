const SUFFIX_PATTERN =
  /\s*\b(inc\.?|llc|ltd\.?|corp\.?|co\.?|corporation|company|group|holdings|limited|plc|gmbh|sas|bv)\.*$/i;

export function deriveCompanyHomepageUrl(company: string | null | undefined): string {
  const raw = typeof company === "string" ? company.trim() : "";
  if (!raw) {
    return "https://www.google.com/search?q=";
  }
  const cleaned = raw
    .replace(SUFFIX_PATTERN, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  if (!cleaned) {
    return `https://www.google.com/search?q=${encodeURIComponent(raw)}`;
  }
  return `https://${cleaned}.com`;
}
