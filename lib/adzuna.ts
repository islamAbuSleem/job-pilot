export type AdzunaJob = {
  id: string;
  title: string;
  company: { display_name: string };
  location: { display_name: string };
  description: string;
  redirect_url: string;
  salary_min?: number;
  salary_max?: number;
  salary_is_predicted: "0" | "1";
  contract_type?: string;
  created: string;
  category: { tag: string; label: string };
};

export function detectCountry(location: string): string {
  const loc = location.toLowerCase();
  if (/\b(uk|england|scotland|wales|london|manchester|birmingham|gb|britain)\b/.test(loc)) return "gb";
  if (/\b(australia|sydney|melbourne|brisbane|perth|au)\b/.test(loc)) return "au";
  if (/\b(canada|toronto|vancouver|montreal|calgary|ca)\b/.test(loc)) {
    if (loc.includes("california")) return "us";
    return "ca";
  }
  return "us";
}

export async function searchJobs(
  jobTitle: string,
  location: string,
  country: string = "us",
): Promise<AdzunaJob[]> {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;
  if (!appId || !appKey) {
    throw new Error("Adzuna credentials not configured (ADZUNA_APP_ID / ADZUNA_APP_KEY)");
  }

  const params = new URLSearchParams({
    app_id: appId,
    app_key: appKey,
    what: jobTitle,
    category: "it-jobs",
    results_per_page: "10",
    "content-type": "application/json",
  });

  if (location.trim()) {
    params.set("where", location.trim());
  }

  const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/1?${params.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Adzuna API error: ${response.status} ${body.slice(0, 300)}`);
  }

  const data = (await response.json()) as { results?: AdzunaJob[] };
  return data.results ?? [];
}

export function formatSalary(min?: number, max?: number): string | null {
  if (min == null) return null;
  if (max == null || max === min) return `$${Math.round(min / 1000)}k`;
  return `$${Math.round(min / 1000)}k - $${Math.round(max / 1000)}k`;
}
