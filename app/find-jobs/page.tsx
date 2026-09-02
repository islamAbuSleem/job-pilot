import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchControls } from "@/components/find-jobs/SearchControls";
import { JobsList } from "@/components/find-jobs/JobsList";
import { PageviewTracker } from "@/components/PageviewTracker";
import { createInsforgeServer } from "@/lib/insforge-server";
import {
  DEFAULT_PAGE_SIZE,
  MATCH_THRESHOLD,
  escapeIlike,
  parseFilter,
  parsePage,
  parseSort,
  type JobRow,
  type ListJobsResult,
} from "@/lib/jobs-query";

function formatRelative(iso: string): string {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours === 1) return "1 hour ago";
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return d.toLocaleDateString();
}

type SearchParams = {
  page?: string | string[];
  filter?: string | string[];
  sort?: string | string[];
  q?: string | string[];
};

export default async function FindJobsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const isAuthed = Boolean(cookieStore.get("insforge_access_token")?.value);

  const page = parsePage(params.page);
  const pageSize = DEFAULT_PAGE_SIZE;
  const filter = parseFilter(params.filter);
  const sort = parseSort(params.sort);
  const query = typeof params.q === "string" ? params.q.trim() : "";

  let result: ListJobsResult = { rows: [], total: 0 };

  try {
    const insforge = await createInsforgeServer();
    const { data: authData } = await insforge.auth.getCurrentUser();
    const user = authData?.user ?? null;
    if (user) {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      const base = insforge.database
        .from("jobs")
        .select("*", { count: "exact" })
        .eq("user_id", user.id);

      const filtered =
        filter === "high"
          ? base.gte("match_score", MATCH_THRESHOLD)
          : filter === "low"
            ? base.lt("match_score", MATCH_THRESHOLD)
            : base;

      const searched = query
        ? filtered.or(
            `company.ilike.%${escapeIlike(query)}%,title.ilike.%${escapeIlike(query)}%`,
          )
        : filtered;

      const ordered =
        sort === "newest"
          ? searched.order("found_at", { ascending: false })
          : sort === "oldest"
            ? searched.order("found_at", { ascending: true })
            : searched
                .order("match_score", { ascending: false })
                .order("found_at", { ascending: false });

      const { data, count, error } = await ordered.range(from, to);
      if (error) throw new Error(error.message);
      result = { rows: (data as JobRow[]) ?? [], total: count ?? 0 };
    }
  } catch {
    /* leave result empty */
  }

  const pageCount = Math.max(1, Math.ceil(result.total / pageSize));
  if (page > pageCount && result.total > 0) notFound();

  const start = result.total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(result.total, page * pageSize);

  const jobs = result.rows.map((r) => ({
    id: String(r.id),
    company: String(r.company ?? ""),
    role: String(r.title ?? ""),
    matchScore: typeof r.match_score === "number" ? r.match_score : 50,
    salary: typeof r.salary === "string" ? r.salary : "",
    dateFound: typeof r.found_at === "string" ? formatRelative(r.found_at) : "",
  }));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PageviewTracker path="/find-jobs" />
      <Navbar isAuthed={isAuthed} activePath="/find-jobs" />
      <main className="flex-1 w-full">
        <div className="mx-auto max-w-[1440px] px-8 py-12">
          <div className="flex flex-col gap-6">
            <SearchControls />
            <JobsList
              jobs={jobs}
              total={result.total}
              page={page}
              pageSize={pageSize}
              pageCount={pageCount}
              start={start}
              end={end}
              filter={filter}
              sort={sort}
              query={query}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
