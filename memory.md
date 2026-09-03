# Memory — Feature 12 (Job Details Page) + 11 Follow-up (text-search comma fix)

Last updated: 2026-09-03

## What was built

**11 follow-up — comma in text search broke the list (fixed).** `lib/jobs-query.ts:escapeIlike()` now escapes only `"` → `\"`; `app/find-jobs/page.tsx:78` wraps the ilike values in double quotes inside `or=()`. Live-verified on the InsForge gateway (`/api/database/records/...`) with a throwaway test table (since dropped). Search terms with commas, spaces, and literal quotes now return correct rows; an unquoted comma 400'd and the list silently went empty.

**Feature 12 — Job Details Page.** All on `main` (not yet committed; working tree).

- `app/find-jobs/[id]/page.tsx` — Server Component. Reads `params: Promise<{ id: string }>` (Next 16 async), fetches the row via `createInsforgeServer().database.from("jobs").select("*").eq("id", id).maybeSingle()`, maps through `mapJobRow()`, and renders the eight sections. On any error or missing row → `notFound()`. Auth gate already covers it via `proxy.ts:16` (`/find-jobs/*` is a protected path).
- `app/find-jobs/[id]/error.tsx` — PostHog-reporting error boundary, mirrors `app/profile/error.tsx`.
- `components/job-details/BackLink.tsx` — `< ArrowLeft` link, default `/find-jobs`.
- `components/job-details/JobHeaderCard.tsx` — Building2 48×48 + title (`text-[24px] md:text-[28px] font-bold leading-tight tracking-tight`) + `View Job Post` external link. Score pill (`bg-success-lightest text-success-foreground rounded-full`) sits next to the company name.
- `components/job-details/InfoCardsRow.tsx` — 4-card grid `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6`. Each card: 40×40 colored icon block + value + uppercase label. Salary icon `bg-success-light text-success`; Location `bg-info-light text-info-dark`; Job Type `bg-accent-light text-accent`; Date Found `bg-surface-tertiary text-text-secondary`. Missing values render as `—`.
- `components/job-details/MatchReasonCard.tsx` — Sparkles icon + uppercase "AI Match Reasoning" + the GPT-4o paragraph.
- `components/job-details/SkillsCard.tsx` — Two groups: "You have" (matched, `bg-success-lightest` / `Check`) and "Gap skills" (missing, `bg-accent-muted` / `X`). Each only renders if its array is non-empty.
- `components/job-details/JobDescriptionCard.tsx` — FileText icon + "Job Description" heading + prose `about_role` (`whitespace-pre-line`).
- `components/job-details/CompanyResearchCard.tsx` — Two halves separated by `border-t border-border`: header (heading + disabled "Research Company" button) and content (empty state OR 9-field dossier renderer). Dossier renders all fields from `lib/job-details.ts:JobResearchDossier` per `build-plan.md:354-366`; "Your Edge" is highlighted with `border-accent-light bg-accent-muted/50`. Empty state: Building2 + "No research yet" + helper text mentioning the company name.
- `components/job-details/ApplyButton.tsx` — Full-width `bg-accent` button. External `<a target="_blank">`. Empty-URL fallback is a muted card.
- `lib/job-details.ts` — `JobResearchDossier` type, `JobDetails` type, `mapJobRow()` mapper. Every nullable DB column is normalized (e.g., `title ?? "Untitled role"`, `match_score ?? 50`).
- `lib/jobs-format.ts` — `formatJobType()` (`fulltime` → "Full-time", empty → `—") and `formatRelative()` (extracted from `app/find-jobs/page.tsx:20-31` so both pages share the same logic).
- `components/find-jobs/JobsList.tsx` — Rows are now `<Link href="/find-jobs/{id}">` (Next 16 prefetches these in the viewport). `<li>` carries the row's `border-b`/hover; `<Link>` carries the grid + cell padding + `focus-visible:bg-surface-secondary`.

`npm run build` clean; new route `/find-jobs/[id]` registered as `ƒ (Dynamic)`. eslint clean.

## Decisions made

- **Job Description shape** — design shows a single prose block, not the 5-section `About / Responsibilities / Requirements / Nice to have / Benefits` layout from `build-plan.md:227`. Followed the design. The 5 sections need a job-description-extraction step (Adzuna only writes `about_role`); that belongs to the Adzuna-replacement feature, not the UI build.
- **Company Research card** — built the dossier renderer now per the build-plan spec (renders all 9 fields) but the card defaults to the empty state. `Research Company` button is `disabled` with an `aria-label`; Feature 13 wires the agent. The card reads `jobs.company_research` jsonb on every render — null → empty state, set → renderer.
- **Page column width** — `mx-auto w-full max-w-[1080px]` matches the profile form column. The design's cards sit between the profile column and the 1440px page container; 1080px keeps them readable on small viewports without stretching.
- **proxy.ts** — no change needed. `pathname.startsWith("/find-jobs/")` already covers `/find-jobs/[id]`.
- **Map a single row, not a list** — `app/find-jobs/page.tsx` uses `select("*")` and maps through `mapJobRow()`; for the list view, it does the same. Two maps because the two pages have different `Job` vs `JobDetails` shapes (the list strips to six fields, the details page keeps all 23).
- **Skills pill colors** — Matched = `bg-success-lightest text-success-foreground` with `Check` icon; Missing = `bg-accent-muted text-accent` with `X` icon. Both follow `ui-tokens.md:172-173` exactly. The design's purple "Java (Spring Boot)" gap pill is intentional — not red.
- **`searchParams` for the page** — none. The page is keyed by `id` only; previous `?page=&filter=&sort=&q=` lives on the list page, not the detail.
- **No new dependencies** — used only `lucide-react` icons already in the project; no new packages installed. `context/code-standards.md:308-322` lists the approved dependency set and nothing in Feature 12 required an addition.

## Problems solved

- **`pdf-parse` ESM class API** (carryover) — `new PDFParse({ data: uint8 }).getText()`. The old `import pdf from "pdf-parse"; pdf(buffer)` default-export pattern throws "Export default doesn't exist" with the new version. Used in `app/api/resume/extract/route.ts`.
- **Text search with a comma 400'd** — found in the Feature 11 audit. The InsForge gateway 400s on unquoted commas inside `or=()` values; the try/catch in `app/find-jobs/page.tsx` swallowed the 400, so the list silently went empty. Verified live: the gateway's or=() parser splits on unescaped commas (`a,b%` becomes invalid), backslash-escape of `,` is not honored, but **double-quoting** the value (`"a,b%"`) is stripped by the gateway and parses fine. Fix: wrap ilike values in double quotes; `escapeIlike()` now only escapes `"`. Side effect: backslash-escape of `%`/`_` is also dead (the gateway drops the backslash, leaving the wildcard) — the old `escapeIlike` was inert, simplified.
- **Backslash in JSON tool parameters** (workflow issue, not a code issue) — PowerShell 5.1's `Get-Content` decodes UTF-8 as CP1252, so non-ASCII characters (e.g. U+2026 `…`) in `ui-registry.md` show as `…` mojibake in console output. The actual file is fine UTF-8. The Edit tool reads/writes UTF-8 correctly, but `oldString` must contain the literal U+2026 byte sequence — three ASCII dots won't match.

## Current state

- `main` is at `b48c914` (from 2026-09-02) plus the uncommitted working tree:
  - `M app/find-jobs/page.tsx` (comma fix)
  - `M components/find-jobs/JobsList.tsx` (row link)
  - `M lib/jobs-query.ts` (escapeIlike)
  - `M context/progress-tracker.md` (12 + 11-follow-up entries)
  - `M context/ui-registry.md` (JobsList + Job Details section)
  - `?? app/find-jobs/[id]/`
  - `?? components/job-details/`
  - `?? lib/job-details.ts`
  - `?? lib/jobs-format.ts`
- `npm run build` clean. Routes: `/`, `/login`, `/dashboard`, `/profile`, `/find-jobs`, `/find-jobs/[id]`, `/api/agent/find`, `/api/resume/*`. Proxy (Next 16 middleware) is registered.
- `OPENROUTER_*` keys in `.env.local` (gitignored, not in this file). InsForge anon key in `.env.local` and service key in `.insforge/project.json`. ADZUNA_APP_ID/KEY in `.env.local`. PostHog keys in `.env.local`.
- `pdf-parse` + `openai` + `@react-pdf/renderer` + `pdfjs-dist` + `@napi-rs/canvas` are installed. `react-dropzone` for resume upload.
- `lib/job-details.ts` is the canonical mapper for the `jobs` table on the detail page. `components/find-jobs/JobsList.tsx` uses its own inline mapper (smaller shape: 6 fields).
- `proxy.ts` protects `/dashboard`, `/profile`, `/find-jobs/*` (covers `/find-jobs/[id]`). Public: `/`, `/login`, `/api/auth/*`.

## User workflow rules

- One branch per feature off `main`, but follow-ups have been pushed directly to `main` since 2026-08-29; user accepts this and merges via GitHub web UI. No `gh` CLI configured.
- Never commit secrets. `.env.local` is gitignored.
- Build clean before every commit. `npm run build` checks 13 routes.
- Before any third-party library, load its installed skill first, then read `context/library-docs.md`.

## Next session starts with

Next feature: **Feature 13 — Company Research Agent** (`context/build-plan.md:242-386`).

- `POST /api/agent/research` receives `jobId`. Loads the job row from DB, loads the user's profile from DB, derives the company homepage URL by following the Adzuna `redirect_url` with a server-side `fetch(redirect_url, { redirect: "follow" })`, strips subdomains (e.g. `jobs.stripe.com` → `stripe.com`), constructs `https://{rootDomain}`. Falls back to `https://www.{company}.com` if the Adzuna redirect lands on adzuna.com or throws.
- Opens a single Browserbase session with Stagehand. Homepage `extract()` (Zod schema with `oneLiner`, `productSummary`, `signals`, `pageLinks`) — if both `oneLiner` and `productSummary` are empty, skip sub-pages and go straight to synthesis.
- Up to 3 sub-pages (`about` / `blog` / `engineering` / `product` preferred over `careers`/`team`). Each `extract()` is wrapped in try/catch.
- GPT-4o synthesis (after browser closes) — 9-field dossier (see `lib/job-details.ts:JobResearchDossier` and `build-plan.md:354-366`). `temperature: 0.4`, `response_format: json_object`. Always returns a complete dossier — never empty even if browser research failed.
- Saves to `jobs.company_research` jsonb. Fires `company_researched` PostHog event.
- Wires `Research Company` button on `components/job-details/CompanyResearchCard.tsx` to call the route; the button is currently `disabled` with an `aria-label` explaining the future-state.
- Browserbase runs on its own infra (not inside Next.js), so don't add `maxDuration` to the route. Use `nodejs` runtime.

## Open questions

- Free-tier model rotation status for the synthesis prompt — the build plan still says `gpt-4o` is the model. The project has been using OpenRouter free models for Feature 07 (extraction) — does the same fallback chain apply to synthesis? If yes, update `build-plan.md:321-324` to use the OpenRouter chain. If no, `gpt-4o` stays.
- `POST /api/agent/research` revalidation: after the agent saves the dossier, the page should re-render with the dossier. Use `revalidatePath(`/find-jobs/${jobId}`)` from the route handler. Verify Next 16 supports this from a route handler.
- `jsonschema -> Zod` for the synthesis response: the synthesis step must return valid JSON matching the dossier shape. Use the same lenient JSON parser (`parseLenientJson()` in `lib/openrouter.ts`) — synthesis models occasionally wrap JSON in ```json fences.
