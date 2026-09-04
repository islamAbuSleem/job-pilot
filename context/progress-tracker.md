# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** 5 — Dashboard
**Last completed:** 16 Recent Activity — Real Data
**Next:** 17 Analytics Charts — PostHog Data

---

## TODOs

- [ ] **Fix `/api/auth/refresh` 401 `AUTH_UNAUTHORIZED — No refresh token provided`**: the InsForge-hosted refresh endpoint (`https://p8i46jbn.eu-central.insforge.app/api/auth/refresh`) returns 401 when called directly. The `insforge_refresh_token` cookie is set on the app domain (`localhost:3000`), not the InsForge host, so direct browser hits carry no cookie. Investigate whether the browser client's automatic refresh (when the access token nears expiry) is hitting the right base URL and sending `credentials: "include"`; verify cookie domain/path settings; confirm the user is not silently logged out when the access token expires. Files: `app/api/auth/refresh/route.ts`, `lib/insforge-client.ts`, `proxy.ts` (`updateSession`).

---

## Progress

### Phase 1 — Foundation

- [x] 01 Homepage
- [x] 02 Auth
- [x] 03 PostHog Initialization
- [x] 04 Database Schema

### Phase 2 — Profile Page

- [x] 05 Profile Page — Full UI
- [x] 06 Profile Save Logic
- [x] 07 AI Profile Extraction from Resume
- [x] 08 Resume PDF Generation from Profile

### Phase 3 — Find Jobs Page

- [x] 09 Find Jobs Page — Full UI
- [x] 10 Adzuna Job Discovery
- [x] 11 Filter + Sort + Pagination

### Phase 4 — Job Details Page

- [x] 12 Job Details Page
- [x] 13 Company Research Agent

### Phase 5 — Dashboard

- [x] 14 Dashboard Page — Full UI
- [x] 15 Stats Bar — Real Data
- [x] 16 Recent Activity — Real Data
- [ ] 17 Analytics Charts — PostHog Data

---

## Decisions Made During Build

### 01 Homepage
- Logo and Hero/BottomCta backgrounds use inline `style` gradients — they cannot be expressed via `@theme` color tokens. Documented as the only place these decorative gradients appear.
- Hero/BottomCta primary CTAs use `bg-text-primary` (dark) per the design, not `bg-accent`. Documented as the intended visual.

### 02 Auth
- Used `@insforge/sdk/ssr` (not the older separate `@insforge/ssr` package). Updated `context/library-docs.md` to match.
- Next.js 16 renamed `middleware.ts` to `proxy.ts` — used `proxy.ts` with `updateSession()` from `@insforge/sdk/ssr/middleware`.
- InsForge's browser client is read-only for auth; all mutations (OAuth init, code exchange, sign-out) go through `createAuthActions()` in Server Actions / Route Handlers.
- Homepage auth state is read on the server by checking the `insforge_access_token` cookie — no client-side flash. The cookie check happens in `app/page.tsx` (Server Component) and is passed down to `Navbar`/`Hero`/`BottomCta` as an `isAuthed` prop.
- InsForge config: added `http://localhost:3000/api/auth/callback` to `allowed_redirect_urls` via `npx -y @insforge/cli config apply --auto-approve`. Add prod URL the same way before deploy.
- `initiateOAuth` returns `{ success, url }` instead of calling `redirect()`. `OAuthButtons` awaits the result, navigates with `window.location.assign(url)` on success, and shows an error alert on failure. Server-side `redirect()` threw `NEXT_REDIRECT`, which the discarded `void` promise turned into an unhandled rejection and error tracking noise, and which also hid the action's `{ success: false }` failure path from the user.

### 06 Profile Save Logic
- `actions/profile.ts:saveProfile()` returns `{ resumeUrl, resumePath, resumeUploaded }` on success (signed URL minted server-side). `ProfileForm.handleSave()` calls `onSaved(result)`; `ProfileEditor` updates `savedResumeUrl`/`savedResumePath` state and clears the local `resumeFile` preview. Bug fix: the ResumeCard now shows the saved PDF immediately after Save — previously it kept showing the local file / dropzone until a manual refresh.
- `revalidatePath` alone is insufficient for the save flow. Mounted Client Components keep their `useState` snapshot until a parent re-renders them with new props or the user reloads. Lifting state into the editor and passing results back via callback avoids `router.refresh()` flicker.

### 06 → 07 — ProfileForm state sync
- `ProfileEditor` listens for the `resume-extracted` window event and calls `setFormData(mapped)` on its own state, passing the result down as `initialData={formData}` to `ProfileForm`. But `ProfileForm` initialized its internal `data` state once at mount via `useState<FormData>(initialData ?? DEFAULT_DATA)` and never re-synced when the parent's `initialData` prop changed — so the visible form fields kept showing pre-extraction values despite extraction succeeding server-side.
- Fix: added `useEffect(() => { setData(initialData ?? DEFAULT_DATA); }, [initialData])` in `ProfileForm` so it stays in sync with whatever the parent hands down.

### 07 AI Profile Extraction from Resume
- Vision fallback added. `pdf-parse` runs first; if it throws or returns < 50 chars, `lib/pdf-vision.ts` rasterizes the PDF (pdfjs-dist + @napi-rs/canvas) and `lib/openrouter.ts:extractProfileFromResumeVision()` calls `google/gemma-4-31b-it:free` with each page as a separate `image_url` content part. Same JSON schema as the text path, so `ProfileEditor` form-mapping needs no branching.
- `next.config.ts` adds `pdfjs-dist` and `@napi-rs/canvas` to `serverExternalPackages` (Turbopack can't bundle the native binding).
- `pdf-img-convert` was rejected — its `canvas` dep requires a Windows native compile with no prebuilt for current Node ABI. `@napi-rs/canvas` ships prebuilt `.node` binaries.
- **Always copy the input Uint8Array** into a fresh `Uint8Array(uint8.byteLength)` + `data.set(uint8)` before passing it to `pdfjs.getDocument({ data })`. Inside Next.js dev (Turbopack module isolation), the original buffer carries a proxy that pdfjs's worker can't structured-clone — `DataCloneError: Cannot transfer object of unsupported type`. Do not "optimize" this away.

### 07 follow-up — model rotation
- `qwen/qwen-2.5-72b-instruct:free` was retired by the provider (returns 404 "no longer free"). Swapped to `inclusionai/ling-3.0-flash-fin:free` and added `openrouter/free` as a fallback chain (`callExtractionWithFallback()`). Fallback fires only on transient/model-availability errors (404/429/"no endpoints"). Both text and vision extraction paths use the same fallback.
- Free-tier models are subject to daily quotas (50/day for the lowest tier). When the primary model 429s, the user still gets a successful extraction via a fallback.

### 07 follow-up 2 — lenient JSON + third fallback
- The fallback `openrouter/free` was returning JSON wrapped in markdown fences despite `response_format: json_object`, so `JSON.parse` failed and the user saw "Failed to parse model response as JSON." Added `parseLenientJson()` in `lib/openrouter.ts` — tries direct parse → strips ```json fences → finds the first balanced `{...}` span. Now salvageable on the next try instead of throwing.
- Added `OPENROUTER_SECONDARY_TEXT_MODEL = "nvidia/nemotron-3.5-lightning:free"` as a third hop in the text chain. Distinct provider pool, separate daily quota — works when ling is rate-limited.
- When all models in the chain are 429'd, the route now returns 502 with `"Our AI service has hit its daily free-tier limit. Please try again tomorrow, or fill the profile fields manually below."` instead of leaking the JSON-parse error.

### 08 Resume PDF Generation from Profile
- Created `lib/resume-generation.ts` (prompt + JSON parser reuse via exported `getClient`/`parseLenientJson` from `openrouter.ts`).
- Created `app/api/resume/generate/resume-pdf.tsx` (single-page A4 JSX component) and `route.tsx` (server-only `POST`, reads DB profile, calls LLM, renders buffer, uploads to storage, updates `profiles`).
- Wired `components/profile/ResumeCard.tsx` `handleGenerate` stub to `POST /api/resume/generate` with `credentials: "include"`, `isGenerating` loading state, and `window.location.reload()` on success.
- Installed `@react-pdf/renderer` (approved dependency).
- Build clean. Route registered in build output (`/api/resume/generate`).

### 07 follow-up 3 — validation loosening
- `profileSchema.work_experience.max(3)` → `.max(10)` to match the `WorkExperience` UI section (also bumped MAX_ROLES 3 → 10) and accept real resumes with 5–15 roles.
- `profileSchema.job_titles_seeking.min(1)` → `.default([])` because a resume that only lists past experience has no "seeking" titles, and that gap shouldn't block saving. The completion check still nudges users to fill seeking titles — it just no longer prevents the save.

### 09 Find Jobs Page — Full UI
- Built `app/find-jobs/page.tsx` (Server Component) and the `components/find-jobs/*` tree: `SearchControls`, `JobsList` (owns filter + sort + page state), `MatchScoreBar`, `CompanyMark`, `JobsPagination`, plus `mock-jobs.ts` with 6 sample rows.
- Mock data only — no Adzuna / DB calls. Filter and sort logic is in-memory and works against the 6-row mock, so the page is testable end-to-end. Feature 10 will replace the mock with `/api/agent/find` results; Feature 11 will swap the in-memory logic for `lib/adzuna` + DB queries.
- **No SOURCE column** — the design (`context/designs/find-jobs.png`) does not show one, even though `context/build-plan.md:172` lists it. Design wins for this feature; revisit if Feature 12 (Job Details) implies a `source` filter.
- **Navbar active state now uses an underline** (`border-b-2 border-accent`) in addition to the purple color. `ui-rules.md:34-36` says "No underline — active state is color change only" but the design shows the underline. Followed the design; documented the deviation in `ui-registry.md`. To reconcile, either update `ui-rules.md` to allow the underline, or drop it from the next design.
- `Navbar` gained an optional `activePath?: string` prop. Currently only `/find-jobs/page.tsx` passes it (`activePath="/find-jobs"`). Homepage and Profile page still render with no active state — acceptable because the design only shows it for Find Jobs, but consider backfilling Dashboard/Profile pages when those land.
- `MATCH_THRESHOLD = 70` was inlined in `JobsList.tsx` because `lib/utils.ts` did not exist yet — moved to `lib/utils.ts` in Feature 10 per `code-standards.md:266`.
- Build clean, `/find-jobs` registered as a dynamic route (auth-checked by `proxy.ts:4`).

### 10 Adzuna Job Discovery
- Created `lib/adzuna.ts` following `library-docs.md:184-274` exactly: `searchJobs()` with `ADZUNA_APP_ID/KEY`, `category=it-jobs`, `results_per_page=10`, `detectCountry()` heuristic (`us` default, `gb/au/ca` keywords), `formatSalary()`.
- Created `lib/utils.ts` with `MATCH_THRESHOLD = 70` (moved from `JobsList.tsx` inline) per `code-standards.md:266`.
- Created `agent/types.ts` (`ScoredJob`, `ProfileForMatching`) and `agent/matcher.ts` (`scoreJobAgainstProfile`) reusing `lib/openrouter.ts` `getClient()` + `parseLenientJson()` with `OPENROUTER_MODEL` fallback chain, `temperature 0.3 / max_tokens 300`. Neutral `50` on failure so one bad LLM call never drops a job.
- Created `app/api/agent/find/route.ts` (`POST {jobTitle, location}`) — auth → `job_search_started` → insert `agent_runs running` → `detectCountry` → `searchJobs` → 0 early-complete → load `profiles` → parallel scoring (concurrency 5, `allSettled`) → bulk insert `jobs` (mapping per `library-docs:244`) → `job_found` per job → update `agent_runs completed` + success log. Adzuna fail → `failed`+502, insert fail → `failed`+500.
- Wired `components/find-jobs/SearchControls.tsx` to `POST /api/agent/find` with `credentials: "include"`, controlled inputs, `isSearching` spinner + disabled, inline `success/error` banner (reworded 2026-09-02 to start with "Saved N jobs" so the job count is unambiguous: all-strong / partial / none-strong variants; no-jobs case stays the same), `router.refresh()` on success. Removed the `e.preventDefault()` stub.
- Updated `app/find-jobs/page.tsx` to query `jobs` for the current user (`select * where user_id order by found_at desc`) and map DB rows to `{id, company, role:title, matchScore:match_score, salary, dateFound:formatRelative(found_at)}`. Falls back to `MOCK_JOBS/MOCK_TOTAL` when no DB rows or on error so the page stays verifiable without Adzuna keys.
- Build clean, `/api/agent/find` registered as `ƒ (Dynamic)` route (`runtime nodejs, maxDuration 60`).

### 10 follow-up — removed mock fallback
- The /find-jobs page now ships without mock data. `MOCK_JOBS` / `MOCK_TOTAL` are gone; `app/find-jobs/page.tsx` initializes `jobs = []` and `total = 0` and only ever replaces them with DB rows. `components/find-jobs/mock-jobs.ts` deleted. The `Job` type was moved to `components/find-jobs/types.ts` and is imported by `page.tsx` and `JobsList.tsx`.

### 10 follow-up 2 — default location bug
- Symptom: every search run returned 0 jobs in 1–2 s with status `completed` and `jobs_found: 0`. Database showed 10 completed `agent_runs` and 0 `jobs` rows. Adzuna was reachable and returned 2692 results for `Frontend Engineer` (US, no `where`).
- Cause: `SearchControls` defaulted `location` state to the placeholder string `"Remote, New York..."` (the `...` is a UI ellipsis indicator). On submit, that literal string was passed to Adzuna as `where=Remote%2C+New+York...` which matched nothing.
- Fix: `defaultLocation = ""` so the first submit omits `where` and Adzuna returns country-wide results; the `...` lives only in the input's `placeholder` attribute (unchanged). Confirmed: 0 jobs after fix when location is blank (US-wide `Frontend Engineer` returns results, but the `page.tsx` query still needs the auth/DB path to be exercised by the user; build clean, `ƒ /api/agent/find` registered).
- `JobsList` distinguishes the two empty states: no rows at all → "No jobs found yet. Run a search above to find matches."; rows exist but filters exclude all → "No jobs match your filters." The pagination row is hidden when `total === 0` so we don't show "Showing 1 to 0 of 0 results".
- Tradeoff: the Feature 09 verifiability guarantee (page renders something visible without backend) no longer applies. A user with no searches will see an empty state instead of mock rows — this is what the user asked for and aligns with the "core principle" that the page should show real data, not seeded data. `ui-registry.md` FindJobsPage / JobsList / Job Types entries updated; `npm run build` clean.

### 11 Filter + Sort + Pagination
- Promoted `lib/jobs-query.ts` to a single source of truth for `DEFAULT_PAGE_SIZE = 20`, `MATCH_THRESHOLD = 70`, `MATCH_FILTERS` / `SORT_OPTIONS` (option lists), `parsePage` / `parseFilter` / `parseSort` (URL → typed), `escapeIlike` (neutralises `%`, `_`, `\` in user search text), and the `MatchFilter` / `SortKey` / `JobRow` / `ListJobsResult` types. `MATCH_THRESHOLD` re-exported from `lib/utils.ts` for backwards compatibility — new code imports directly from `lib/jobs-query`.
- `app/find-jobs/page.tsx` now reads `searchParams: Promise<{ page?, filter?, sort?, q? }>` and runs an InsForge PostgREST chain: `.from("jobs").select("*", { count: "exact" }).eq("user_id", user.id)` → optional `.gte("match_score", 70)` / `.lt("match_score", 70)` for the match filter → optional `.or("company.ilike.%…%,title.ilike.%…%")` for text search → `.order("match_score", { ascending: false }).order("found_at", { ascending: false })` (default) / `.order("found_at", { ascending: false | true })` (newest / oldest) → `.range((page-1)*20, page*20-1)`. `count: "exact"` populates `total` from the `content-range` response header. Calls `notFound()` if `page > pageCount` and there are results. Wrapped in try/catch — any error leaves the list empty. `start` / `end` / `pageCount` are derived on the server.
- `components/find-jobs/JobsList.tsx` is now URL-driven. It receives the server-resolved `jobs`, `total`, `page`, `pageSize`, `pageCount`, `start`, `end`, `filter`, `sort`, `query` as props and pushes changes via `router.push` inside `startTransition`. Filter / sort / page resets `page` to 1 implicitly (the `pushParams` helper always deletes `page` unless the caller explicitly sets it). The list dims (`opacity-60`) while the transition is pending. Local state: only the text input — typing doesn't fire a server roundtrip per keystroke; pressing Enter or clicking the input pushes the trimmed value to `?q=`. The input is intentionally not synced back to `?q=` on every keystroke (Linear / GitHub pattern — only the URL value seeds it on mount).
- `components/find-jobs/JobsPagination.tsx` `buildPageList(current, total)` rewritten: always includes page 1, page `total`, and `current ± 1`, with ellipsis inserted between any gap > 1. Returns `1..N` for `total <= 5`, `[]` for `total <= 1`. Old version always emitted `[1, 2, 3, "ellipsis", total]` for `total > 5` and never reflected the current page, so navigating past page 3 left the "active" highlight on page 3.
- `ui-registry.md` updated: JobsList, JobsPagination, FindJobsPage, new JobsQuery entry, Utils notes. `npm run build` clean, `npm run lint` (eslint on the four files) clean.

### 11 follow-up — audit: comma in text search silently broke the list (fixed 2026-09-03)
- Audited Feature 11 against `build-plan.md:206-219`. All eight spec points were implemented (all/high/low filters at threshold 70, sort matchScore-desc / newest / oldest, case-insensitive search on company + title, 20/page with exact count, URL-driven state). One real bug found: **text search with a comma in the term 400'd on the InsForge gateway** — unquoted `or=(company.ilike.%a,b%,title.ilike.%a,b%)` splits on the comma, leaving an invalid filter fragment. The `try/catch` in `page.tsx` swallowed the 400, so the list silently went empty instead of showing matches.
- Root cause verified live against `/api/database/records/` (throwaway test table, dropped afterwards): unquoted `or=()` values cannot contain commas (400); **double-quoted values can** — the gateway strips the quotes, and `\"` inside yields a literal quote. Backslash-escaping of `%`/`_` does NOT work on this gateway (the backslash is silently dropped, `%` stays a wildcard), so the old `escapeIlike` backslash-escaping was inert and has been removed.
- Fix: `escapeIlike()` in `lib/jobs-query.ts` now trims and escapes only `"` → `\"`; `app/find-jobs/page.tsx` wraps the ilike values: `.or('company.ilike."%…%",title.ilike."%…%"')`. Live-verified correct rows for: comma term, space term, title-only match, literal-quote term.
- Consequence: a literal `%`/`_` typed in the search box now acts as a LIKE wildcard (slightly broader matches) rather than a literal — acceptable for this feature; job titles and company names essentially never contain them.
- `npm run build` clean; eslint on both touched files clean.

### 12 Job Details Page
- Built `app/find-jobs/[id]/page.tsx` (Server Component) + `app/find-jobs/[id]/error.tsx` (PostHog-reporting error boundary, mirrors `app/profile/error.tsx`).
- New `components/job-details/*`: `BackLink`, `JobHeaderCard` (Building2 + title + `View Job Post` external link + 85% Match Score pill), `InfoCardsRow` (4-card grid: salary / location / job type / date found — each with a colored 40×40 icon block), `MatchReasonCard`, `SkillsCard` (matched = `bg-success-lightest` / `Check`; gap = `bg-accent-muted` / `X` per `ui-tokens.md:172-173`), `JobDescriptionCard` (prose `about_role`, `whitespace-pre-line`), `CompanyResearchCard` (empty state by default + a 9-field dossier renderer that activates once Feature 13 writes `jobs.company_research`), `ApplyButton` (full-width `bg-accent`, opens `external_apply_url` in a new tab).
- New `lib/job-details.ts` — `JobDetails` type + `mapJobRow()` that handles every nullable column in the `jobs` table (the agent writes `about_role` as a snippet and may leave `location` / `salary` / `job_type` empty — each is normalized to a safe default). `lib/jobs-format.ts` — `formatJobType()` (raw `fulltime` → "Full-time", empty → "—") and `formatRelative()` (extracted from the old inline copy in `app/find-jobs/page.tsx:20-31` so both pages share the same logic).
- Wired `JobsList` rows to be clickable — `<li>` now carries the row's `border-b`/hover, and the cell grid is wrapped in `<Link href="/find-jobs/{id}">` with `focus-visible:bg-surface-secondary`. Next.js prefetches these in the viewport, so navigation feels instant.
- **Job Description shape** — design shows a single prose block, not the 5-section `About / Responsibilities / Requirements / Nice to have / Benefits` layout from `build-plan.md:227`. Followed the design (single `about_role` text). The 5 sections are a data-extraction task (Adzuna only fills `about_role`) and belong with the Adzuna-replacement feature, not the UI build.
- **Company Research card** — built the dossier renderer now per the build-plan spec (renders all 9 fields) but the card defaults to the empty state. `Research Company` button is `disabled` with a tooltip-equivalent `aria-label`; Feature 13 wires the agent and removes the disabled state. The card reads `jobs.company_research` jsonb on every render — when the field is null, empty state; when set, the renderer.
- **Dossier sub-blocks** match the spec at `build-plan.md:354-366` — Company Overview, Tech Stack, Culture, Why This Role, **Your Edge** (highlighted with `border-accent-light bg-accent-muted/50`), Gaps to Address, Smart Questions, Interview Prep, Sources. All optional; if any array is empty, that sub-block is hidden.
- **proxy.ts** — no change needed. `pathname.startsWith("/find-jobs/")` already covers `/find-jobs/[id]`. Verified at `proxy.ts:16`.
- **Page column width** — `mx-auto w-full max-w-[1080px]` matches the profile form column (the design's card widths fall between the profile column and the 1440px page container; 1080px keeps the cards readable on small viewports without stretching past the design's intent).
- `npm run build` clean; new route `/find-jobs/[id]` registered as `ƒ (Dynamic)`. eslint clean across all new files + the modified `JobsList.tsx`.

### 12 follow-up — show more / show less on long descriptions
- `JobDescriptionCard` is now a client component with a `useState` collapse toggle. When `about_role` is longer than 600 chars, the body renders with `line-clamp-6` and a `text-accent` "Show more" button; clicking reveals the full text + a "Show less" toggle. Short descriptions render in full with no toggle. `npm run build` clean, eslint clean.

### 12 follow-up 2 — full job description via Adzuna redirect (long descriptions)
- Adzuna's `description` is a snippet (~150-300 chars). The full text lives at `redirect_url`, which redirects to the actual ATS page (Lever, Greenhouse, Ashby, etc.). Fixed by enriching at discovery time.
- `lib/adzuna-redirect.ts` — `fetchJobPage(redirectUrl)`: server-side `fetch(redirectUrl, { redirect: "follow" })` with 8s timeout, 60KB body cap, custom User-Agent, and an HTML content-type guard. Returns `{ finalUrl, html }` or `null`. Also exports `stripHtmlToText(html)` for fallback.
- `agent/matcher.ts:buildPrompt()` now accepts an optional `htmlBody`. When present, the system prompt asks the LLM to **also** extract the long description from the HTML in the same call (`long_description` field, JSON schema extended). `max_tokens` bumped 300 → 1200 to fit the longer output. The HTML is truncated to 12KB before injection to stay under small-context free models. When `htmlBody` is absent (fetch failed), `long_description` falls back to a cleaned-up version of the Adzuna snippet.
- Defensive parsing in the matcher: if the LLM returns an empty/very-short `long_description` after a successful HTML fetch, fall back to `stripHtmlToText(html)`. If all else fails, fall back to `job.description`. Final pass collapses any `...` runs to a single `…`.
- `app/api/agent/find/route.ts` — for each Adzuna result, `fetchJobPage(job.redirect_url)` runs in parallel with the scoring batch (concurrency 5, same as before). The fetched HTML is passed into `scoreJobAgainstProfile()`, which now also returns `longDescription` in the same LLM call — no extra LLM cost. The `about_role` column gets `score.longDescription` when it's > 200 chars; otherwise the Adzuna snippet is kept (defensive against LLM output that's shorter than the original snippet).
- `ScoredJob` type extended with `longDescription: string`. The neutral-score fallback returns the cleaned Adzuna description.
- **Backfill not in scope** — existing jobs in the DB still have the Adzuna snippet. A one-time backfill (re-run `fetchJobPage` + `extractLongDescription` for every row) is a separate task; the show-more toggle remains a no-op for those jobs until a new search runs.
- **Cost / latency** — same LLM call count per job (1) but a larger prompt (HTML body added). The fetch is `redirect: "follow"` so the Adzuna redirect resolves in one HTTP request; the response is the ATS page. No browser / no Stagehand.
- `npm run build` clean, eslint clean on `lib/adzuna-redirect.ts`, `agent/matcher.ts`, `agent/types.ts`, `app/api/agent/find/route.ts`, `components/job-details/JobDescriptionCard.tsx`.

### 12 follow-up 3 — on-demand full description fetch for existing jobs
- The discovery-time enrichment only helps new jobs. Existing rows still have the Adzuna snippet — "Show more" had no effect because the data was the truncated source. Fixed with an on-demand fetch.
- `app/api/jobs/[id]/description/route.ts` — `POST` (Next.js 16, `runtime nodejs`, `maxDuration 30`). Auth-required, scoped to the current user. Reads the job's `source_url` + `about_role`, calls `fetchJobPage(source_url)` (the existing 8s-timeout HTML fetcher), strips HTML with `stripHtmlToText`, validates the result is at least 80 chars and longer than the current `about_role`, then `update`s `about_role` with the long text. Returns `{ description, replaced: true }` on success, `{ description: current, replaced: false }` when the page text isn't actually longer (avoids no-op writes).
- Error mapping: 401 unauth, 404 not found, 422 source URL missing or text not extractable, 502 fetch unreachable, 500 DB write failed.
- `JobDescriptionCard` now takes `jobId: string` and holds `text` / `loading` / `error` in local state. Branch on `text.length`: > 600 → existing clamp toggle ("Show more" / "Show less"); ≤ 600 → "Load full description" button (secondary button style, spinner while `loading`, `text-error` alert on failure). After the route returns, `text` is replaced and the card re-renders in the long branch — the next visit sees the persisted `about_role` from the DB.
- `proxy.ts` already excludes `api/auth` from the matcher but **includes** all other paths. `/api/jobs/*` is unauthenticated at the proxy level — the route handler enforces `getCurrentUser()` itself (same pattern as `/api/agent/find`).
- `npm run build` clean; new route `/api/jobs/[id]/description` registered as `ƒ (Dynamic)`. eslint clean.

### 12 follow-up 4 — measure-driven overflow detection for the description toggle
- The toggle was previously shown whenever `text.length > 600`, but a long string that wraps to < 6 lines wouldn't actually be clipped by `line-clamp-6` — the user would click "Show more" and see no change. "Click show more do nothing."
- Fix: `JobDescriptionCard` now uses a `useLayoutEffect` + `bodyRef` to measure `el.scrollHeight` against `lineHeight * 6` and only renders the "Show more / Show less" toggle when the rendered text actually overflows. On first render, the text is un-clamped, the effect measures, and the state flips to `clampActive = true` only when overflow is real. After the user clicks "Show more", `expanded = true`, the clamp is removed, and the effect resets `overflows = false`. The "Load full description" button (for the snippet case) only shows when `overflows === false` AND `text.length <= 600`, so it doesn't appear next to a real clamp toggle.
- `npm run build` clean, eslint clean (one `react-hooks/set-state-in-effect` disable for the early-return branch — the rule is designed to discourage effect-driven state churn, but this is a legitimate measure-driven sync that can't be expressed as a derivation).

### 12 follow-up 5 — full job description is unreachable server-side (reverted enrichment, surfaced as external link)
- **Root cause:** Adzuna's `redirect_url` is `https://www.adzuna.com/land/ad/{id}?utm_*` which then 302-redirects to the actual ATS page. The Adzuna edge (CloudFront) blocks all server-side requests with `403 Forbidden — Request blocked. Generated by cloudfront (CloudFront)`, regardless of User-Agent — the WAF rejects at the edge before UA inspection. `fetchJobPage(redirectUrl)` always returns `null` from a Node.js runtime. The on-demand route handler (`POST /api/jobs/[id]/description`) was therefore always returning 502 "Could not reach the original job posting". The discovery-time enrichment (passing the HTML to the matcher) had the same problem — `fetchJobPage` failed for every job, so the matcher always ran the snippet branch. The free Adzuna API tier also has no per-job endpoint (`GET /v1/api/jobs/us/jobs/{id}` returns `{"exception":"UNKNOWN_METHOD"}`).
- **Conclusion:** the full description is unreachable from our server. The only way to read it is in a real browser via the original posting.
- **Reverted** the broken code:
  - Deleted `lib/adzuna-redirect.ts` and `app/api/jobs/[id]/description/route.ts`.
  - `agent/matcher.ts` and `agent/types.ts` reverted to the original (no `htmlBody` param, no `longDescription` field, `max_tokens: 300`).
  - `app/api/agent/find/route.ts` reverted to plain `scoreJobAgainstProfile(job, profile)` (no per-job `fetchJobPage`). New jobs now also get the Adzuna snippet in `about_role` — same as before the enrichment attempt.
- **Replaced the on-demand "Load full description" button with a "Read full description" link** in `JobDescriptionCard`. The link is a `text-accent` `<a target="_blank" rel="noopener noreferrer">` that opens `externalApplyUrl` in a new tab — that's the same URL the `View Job Post` button at the top of the page already opens, but it's now discoverable right under the truncated snippet. The `useLayoutEffect` overflow measurement is kept (the clamp toggle now only appears when the rendered text actually exceeds 6 lines).
- `JobDescriptionCard` props simplified: now `{ description: string, externalApplyUrl: string }` — no more `jobId`, no fetch state, no error state.
- `npm run build` clean, eslint clean. Route count back to 12 (the dead `api/jobs/[id]/description` route is gone).

### 12 follow-up 6 — inline iframe for the full description
- The user wants the full description visible in the app, not in a new tab. Since the full description is unreachable from our server (CloudFront blocks `fetch` of Adzuna's redirect URL — see `12 follow-up 5`) and Adzuna's API has no per-job endpoint, the only practical way is to render the actual ATS page inside the app.
- `JobDescriptionCard` now renders an inline `<iframe src={externalApplyUrl}>` when the user clicks "Show full description". The browser follows Adzuna's `redirect_url` 302-redirect naturally and renders the destination ATS page (Greenhouse, Lever, Ashby, etc.) right inside the card. The toggle rotates a `ChevronDown` icon and switches label to "Hide full description".
- Iframe is `min-h-[600px]`, `sandbox="allow-same-origin allow-scripts allow-forms"` (no `allow-top-navigation` — clickjacking guard), `referrerPolicy="no-referrer"`. Wrapped in `rounded-lg border border-border overflow-hidden bg-surface-secondary` so it sits cleanly inside the card.
- **Embedding-block detection**: on `onLoad` the component reads `contentDocument.body.innerText`; if it's empty or throws (cross-origin errors are caught), it flips a state and renders a fallback panel: muted copy "This site doesn't allow embedding." with a `text-accent` link to open the URL in a new tab. Handles the `X-Frame-Options: DENY` / `Content-Security-Policy: frame-ancestors` case automatically.
- `npm run build` clean, eslint clean. No new dependencies.

### 12 follow-up 7 — drop the iframe, use a link (per user feedback)
- The user saw the inline iframe in the previous iteration and said it didn't look good. Reverted to a clean link approach.
- `JobDescriptionCard` now shows the Adzuna snippet (clamped via `useLayoutEffect` if it actually overflows 6 lines) and a single `View full description on the main site` `text-accent` link below. No toggle, no iframe, no client fetch state.
- The link opens `externalApplyUrl` in a new tab (same destination as the top-of-page "View Job Post" button — surfaced here for discoverability right under the truncated snippet).
- `npm run build` clean, eslint clean. No new dependencies.

### 13 Company Research Agent
- Installed `@browserbasehq/sdk@^2.19.1` + `@browserbasehq/stagehand@^4.0.2` (both already in the approved-deps list) and `zod@4.4.3` as a direct dep. `GROQ_API_KEY` added to `.env.local`; `BROWSERBASE_API_key` renamed to `BROWSERBASE_API_KEY` (nothing referenced the old casing).
- New `lib/browserbase.ts` (`launchResearchBrowser()` via the stagehand package's `browserbase.launch({ apiKey, projectId })`), `lib/stagehand.ts` (`createStagehand(browser)` with `groq/llama-3.3-70b-versatile`), `lib/company-url.ts` (`deriveCompanyHomepageUrl()` — strips Inc/LLC/Ltd/Corp/Co suffixes, lowercases, strips non-alphanumerics → `https://{clean}.com`; Google-search fallback when empty).
- New `agent/research.ts` (`researchCompany(job, profile)`): homepage `extract()` with the 4-field schema (oneLiner/productSummary/signals/pageLinks) → skip-to-synthesis when both oneLiner and productSummary are empty → up to 3 sub-page extracts preferring about/blog/engineering/product over careers/team → `stagehand.close()` in `finally` → OpenRouter synthesis (temperature 0.4, max_tokens 800, same 3-model fallback chain as the matcher, `parseLenientJson`). Always returns a complete dossier; per-step try/catch with `[agent/research]` log prefix.
- New `app/api/jobs/[id]/research/route.ts` (`POST`, `runtime nodejs`, no `maxDuration`): auth → load job (scoped to user) → load profile → create `agent_runs` row (`job_title_searched: "research:{company}"`) → `researchCompany()` → save dossier to `jobs.company_research` → `company_researched` PostHog event → `revalidatePath('/find-jobs/[id]')`. Returns `{ success, data: { dossier } }`.
- New `components/job-details/ResearchCompanyButton.tsx` (client): idle / researching (spinner + disabled) / error (`role="alert"` under the button); success calls `router.refresh()` so the server card re-renders with the dossier. Wired into `CompanyResearchCard` header (new `jobId` prop, passed from the page).
- **Stagehand 4 vs the old docs**: `library-docs.md` examples target Stagehand 0.x (`new Stagehand({ browserbaseSessionID })`, `stagehand.page`, `disablePino`). Stagehand 4 uses `browserbase.launch()` → `Stagehand.create({ browser, model })`, `browser.context.pages()`, `extract(instruction, schema)`. All Feature 13 code follows the v4 API verified against `node_modules/@browserbasehq/stagehand/dist/index.d.mts` + README.
- **Stagehand model allowlist**: v4 hardcodes `modelName` to openai/anthropic/google/groq/cerebras literals — OpenRouter is NOT accepted (Zod template-literal validation). `extract()` calls use `groq/llama-3.3-70b-versatile` + `GROQ_API_KEY`; the final synthesis step uses the OpenRouter chain via `lib/openrouter.ts` (unchanged).
- **Turbopack**: `@browserbasehq/stagehand` resolves extension assets via `new URL("../", import.meta.url)`, which Turbopack cannot bundle — added both browserbase packages to `serverExternalPackages` in `next.config.ts` (same treatment as `@napi-rs/canvas` / `pdfjs-dist`).
- **Zod version pin**: top-level `zod` must be exactly `4.4.3` to match stagehand's nested copy — otherwise the `extract(instruction, schema)` overload fails type-check (`_zod.version.minor` literal mismatch) and TS silently falls back to the freeform overload. Do not bump top-level zod without checking stagehand's nested version.
- `npm run build` clean (`/api/jobs/[id]/research` registered as `ƒ (Dynamic)`); eslint clean on all touched files.

### 13 follow-up — agent uses real browser to follow Adzuna redirect (fix for shallow results 2026-09-03)
- **Symptom:** clicking Research Company returned a shallow dossier — the agent was guessing the company homepage from the job's company name (e.g. `SimVentions, Inc` → `https://simventions.com` ✗), not visiting the real employer site.
- **Root cause:** the original `resolveEmployerUrl` used Node `fetch(sourceUrl, { redirect: "follow" })` to follow the Adzuna redirect, but CloudFront 403s server-side fetches (proven in Feature 12 follow-up 5). It always fell back to the unreliable name-based guess.
- **Fix:** rewrote the agent to navigate the Adzuna `source_url` in the real Browserbase browser (`page.goto(sourceUrl)`). The browser follows the 302 redirect naturally and lands on the actual employer job page. The homepage URL is derived from the real landing page hostname (stripping subdomains). Also added `waitForLoadState("domcontentloaded")` after each navigation so pages have content before Groq extracts them.
- The route now selects `source_url` from the job row and passes it to the research agent.
- **Build:** `npm run build` clean, eslint clean. Committed and pushed.
- **NOT yet live-tested end-to-end** — no real Browserbase session has run yet (costs credits). First click on Research Company exercises the whole chain.

### 14 Dashboard Page — Full UI
- New `app/dashboard/page.tsx` (Server Component): `Navbar activePath="/dashboard"` + `Footer` + `PageviewTracker path="/dashboard"`; `mx-auto max-w-[1440px] px-8 py-12` container with `flex flex-col gap-6` stack. `/dashboard` already in `proxy.ts` PROTECTED_PATHS — no proxy change.
- New `components/dashboard/StatsCard.tsx` (label 14px medium secondary, value 30px bold primary, trend pill `rounded-sm bg-success-lightest text-success-darker` + muted "vs last week", or muted subtext line). `StatsBar.tsx` wraps 4 cards in `grid sm:grid-cols-2 lg:grid-cols-4 gap-6`.
- New `components/dashboard/RecentActivity.tsx` (server): title + stack of entries, each with 16px outer / 8px inner dot (`accent` → accent-light/accent, `info` → info-light/info, `success` → success-light/success-alt per ui-tokens Activity Dots), 14px medium text + 12px muted time; muted empty state when no entries.
- New client chart components (recharts v3, `"use client"`): `ResearchActivityChart.tsx` (blue bars, y ticks 0/3/6/9/12), `JobsOverTimeChart.tsx` (accent monotone area, 3px stroke, gradient fill via `stopColor="var(--color-accent)"` opacity 0.25→0), `MatchScoreChart.tsx` (success bars, y ticks 0/25/50/75/100). Shared chart chrome: card wrapper with 16px semibold title, `h-[280px]` body, dashed `var(--color-border)` grid (`vertical={false}`), no tick/axis lines, 12px muted ticks. SVG colors reference CSS vars (`fill="var(--color-info)"` etc.) — never hex, per ui-tokens invariants. Each chart takes typed `data` props and renders a muted empty state when all values are 0.
- New `components/dashboard/IncompleteProfileBanner.tsx` (server): error-icon card + "Complete your profile to unlock better matches" + secondary "Complete profile" link to `/profile`. Rendered conditionally — page does a best-effort `profiles` fetch + `computeCompletion()` in try/catch, banner only when `!isComplete`, silent on error.
- Mock data matches `context/designs/dashboard.png` exactly (284/+12%, 82%/+3%, 35, 28; 5 activity entries; research 2/5/3/8/12/4/1; over-time 12/45/32/60/85/40/12; distribution 5/15/45/85/35). Components take typed data props so Features 15–17 plug real data in without structural changes.
- Middle row `grid lg:grid-cols-2`, bottom row `grid lg:grid-cols-5` (over-time `col-span-3`, distribution `col-span-2`) — matches design proportions.
- Installed `recharts@^3.10.1`; registered in code-standards approved deps (mandated by build-plan.md:442).
- `npm run build` clean (`/dashboard` registered as `ƒ (Dynamic)`); eslint clean on all new files.

### 15 Stats Bar — Real Data
- New `lib/dashboard-stats.ts` (`getDashboardStats(userId)`): one `select("match_score,found_at")` scoped to user → total, avg (rounded), this-week / prior-week splits computed in JS; researched count via `select("id", { count: "exact", head: true }).not("company_research", "is", null)`. Whole helper wrapped in try/catch returning zeros on failure so the page still renders.
- Trends computed week-over-week to match the design badges: total trend = % change of this-week vs prior-week count; avg trend = point change of weekly avgs. Badge hidden when prior week has no jobs (no baseline) — honest empty state instead of a fake "+0%".
- Page builds `StatItem[]` from real values; zero-stats fallback when logged out or on error. No structural changes to `StatsBar`/`StatsCard`.
- `npm run build` clean; eslint clean.

### 16 Recent Activity — Real Data
- New `lib/dashboard-activity.ts` (`getRecentActivity(userId)`, max 5 entries): completed `agent_runs` ordered by `completed_at` desc (limit 10) → `research:*` rows become "Researched {company}" (info blue dot), others become "Found {N job(s)} for {title}" with proper pluralization (success green dot); times via shared `formatRelative()`; merged + re-sorted desc in JS. Try/catch returns `[]` on failure — the card's existing muted empty state covers it.
- Deviation from spec (documented): spec says research entries come from the `jobs` table, but `jobs` has no researched-at timestamp so ordering would be wrong. Used the research `agent_runs` rows instead (written by our own research route with `completed_at`) — same "Researched {company}" format, correct recency. Only `completed` runs included (running/failed skipped).
- Page drops `MOCK_ACTIVITY`, passes real entries. No changes to `RecentActivity` component.
- `npm run build` clean; eslint clean.

## Notes

### 02 Auth
- `insforge.toml` is the declarative source of truth for InsForge project config — re-export with `npx -y @insforge/cli config export` to refresh it after dashboard changes.
- `npx -y @insforge/cli config apply` requires a TTY. Use `--auto-approve` to apply from non-interactive shells.
- InsForge has `requireEmailVerification: true` but it only gates password sign-up — OAuth users arrive pre-verified through their identity provider. No code change needed for the OAuth flow, but if a password sign-up flow is added later, branch on the response per `.agents/skills/insforge/auth/sdk-integration.md:26-89`.
- `nextPath` post-auth redirect: stored in `insforge_post_auth_redirect` cookie (10 min TTL, httpOnly). `sanitizeNextPath` in `lib/auth-redirect.ts` is the single source of truth for the allowlist (must start with `/`, not `//`, no CR/LF). Lives outside `actions/` because `"use server"` files require every export to be an async function.

### 03 PostHog Initialization (partial)
- Env var name in this project: `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` + `NEXT_PUBLIC_POSTHOG_HOST`. PostHog's own docs typically use `NEXT_PUBLIC_POSTHOG_KEY` — don't be confused if a skill says "set POSTHOG_KEY". The code reads `_PROJECT_TOKEN` everywhere.
- Browser init is a no-op when the env var is missing — safe to develop without keys.
- Currently wired events: `$pageview` on `/`, `oauth_sign_in_started` on button click, `oauth_initiated` server-side when `initiateOAuth` runs, `oauth_succeeded` and `oauth_failed` in the callback. The four business events (`job_search_started`, `job_found`, `profile_completed`, `company_researched`) from `code-standards.md` are still pending Features 06/10/13.
- No `posthog.identify(userId)` / `posthog.reset()` yet — those belong to the full Feature 03 scope.

### 02 Auth follow-up (rolled into 03 branch)
- Added `app/profile/page.tsx` — placeholder that reads the current user via `createInsforgeServer().auth.getCurrentUser()` and renders a "Coming soon" card with a Sign-out link to `/api/auth/logout`. Feature 05 will replace this with the real form.
- Sign-out lives at `app/api/auth/logout/route.ts` (GET handler), not a `/logout` page. The Server Component version (`app/(auth)/logout/page.tsx`) was deleted because in Next.js 16 cookies are read-only in Server Components — `createAuthActions` threw "Cookies can only be modified in a Server Action or Route Handler." The Route Handler uses the request/response cookie split, clears both auth cookies, and redirects to `/`.

### 05 Profile crash fix
- `app/profile/page.tsx` called `insforge.auth.getCurrentUser()` and destructured `data.user` two levels deep with no guard. When `data` was `undefined` the server render threw `TypeError: Cannot read properties of undefined`, which took down the whole route. Removed the call — `user` was never used and `isAuthed` comes from the `insforge_access_token` cookie. This also dropped the now-unused `createInsforgeServer` import.
- Added `app/profile/error.tsx` — a route-level error boundary. A server error now degrades only `/profile` instead of the whole app, and reports the exception through `posthog.captureException`.

### 08 Resume PDF Generation from Profile — starting notes
- `@react-pdf/renderer` is in the approved deps list (`context/code-standards.md`). Use it server-side via `renderToStream` / `renderToBuffer`; `react-pdf` does not render in the browser by default.
- The ResumeCard already has a "Generate Resume from Profile" button stubbed at `ResumeCard.tsx:handleGenerate` — currently logs a message and no-ops. Replace with a real call.
- Generate via an API route handler at `app/api/resume/generate/route.ts` rather than a server action — PDF rendering is CPU-heavy and Next.js has tighter time budgets on server actions.
- Storage: the uploaded resume lives at `<userId>/resume.pdf`. Consider keeping generated PDFs at a separate path (e.g. `<userId>/generated.pdf`) so the user's source resume is preserved. Surface both in `ResumeCard` with a "current resume" / "generated resume" distinction, or pick one and replace the other — decide before coding.
- Auth + RLS: the generator route must run on the server (`export const runtime = "nodejs"`), read the profile from the DB via `createInsforgeServer()`, and only write to the user's own storage key.

---

## Working Tree State (carryover from prior sessions — NOT touched in 07 follow-ups)

These four items exist in the working tree but were not part of the Feature07 commit chain. They appear to be partial work from earlier sessions that landed before the `memory.md` snapshot this session started from.

- **M** `app/profile/page.tsx` — extracted resume-path helper import + a smaller rewrite of the signed-URL block (now uses `extractResumePath(profile.resume_pdf_url, user.id)` instead of inline URL parsing).
- **M** `components/profile/ResumeCard.tsx` — UI tweaks (specifics not verified this session).
- **??** `app/api/resume/delete/` — route handler for deleting a saved resume. Likely an `app/api/resume/delete/route.ts` POST handler.
- **??** `lib/resume-path.ts` — helper that wraps the signed-URL parsing logic. Probably `extractResumePath(stored, userId)` returning the storage object key.

Decision before Feature 08 starts: commit these as part of Feature08 with a single `chore(profile): carryover cleanup` commit, or stash them and pick up later. They look like Feature06 cleanup that was left uncommitted — safest to commit them now so they aren't lost.
