# Memory — Feature 13 (Company Research Agent)

Last updated: 2026-09-03

## What was built

**Feature 13 — Company Research Agent.** Committed and pushed (`3cd3d89`, `ec364d6`, `9d544eb`; `main` in sync with `origin/main`, tree clean).

- `lib/browserbase.ts` — `launchResearchBrowser()` via the stagehand package's `browserbase.launch({ apiKey, projectId })`.
- `lib/stagehand.ts` — `createStagehand(browser)` with `groq/llama-3.3-70b-versatile` + `GROQ_API_KEY`.
- `lib/company-url.ts` — `deriveCompanyHomepageUrl()`: strips Inc/LLC/Ltd/Corp/Co suffixes, lowercases, strips non-alphanumerics → `https://{clean}.com`; Google-search fallback when empty.
- `agent/research.ts` — `researchCompany(job, profile)`: homepage `extract()` (oneLiner/productSummary/signals/pageLinks) → skip-to-synthesis when both oneLiner and productSummary are empty → up to 3 sub-page extracts preferring about/blog/engineering/product → `stagehand.close()` in `finally` → OpenRouter synthesis (temperature 0.4, max_tokens 800, same 3-model chain + `parseLenientJson` as the matcher). Always returns a complete dossier.
- `app/api/jobs/[id]/research/route.ts` — `POST`, `runtime nodejs`, no `maxDuration`. Auth → user-scoped job + profile load → `agent_runs` row (`job_title_searched: "research:{company}"`) → research → dossier saved to `jobs.company_research` → `company_researched` PostHog event → `revalidatePath`. Returns `{ success, data: { dossier } }`.
- `components/job-details/ResearchCompanyButton.tsx` — client button: idle / researching (spinner + disabled) / error (`role="alert"`); success calls `router.refresh()`. Wired into `CompanyResearchCard` header (new `jobId` prop, passed from the page). Button is no longer dimmed.
- Deps: `@browserbasehq/sdk@^2.19.1`, `@browserbasehq/stagehand@^4.0.2`, `zod@4.4.3` (exact pin). `next.config.ts` — both browserbase packages in `serverExternalPackages`.
- `.env.local` (gitignored) — added `GROQ_API_KEY` ([REDACTED]); renamed `BROWSERBASE_API_key` → `BROWSERBASE_API_KEY` (nothing referenced the old casing).
- Docs: `progress-tracker.md` (Phase 5, 13 checked + decisions), `ui-registry.md` (ResearchCompanyButton entry, card entry updated).

`npm run build` clean (`/api/jobs/[id]/research` registered as `ƒ (Dynamic)`); eslint clean.

## Decisions made

- **Homepage URL: derive from `job.company`, don't follow the Adzuna redirect.** CloudFront blocks the redirect fetch (proven in Feature 12 follow-up 5).
- **Two LLM providers, split by step.** Stagehand 4 hardcodes `modelName` to openai/anthropic/google/groq/cerebras literals — OpenRouter is rejected by Zod validation. `extract()` uses Groq; final synthesis uses the OpenRouter chain via `lib/openrouter.ts`.
- **Synchronous route, no `maxDuration`.** Blocks until research completes; client shows spinner + `router.refresh()` on success. Browserbase runs on its own infra.
- **Always return a dossier.** Browser failure → synthesize from job + profile alone; synthesis failure → empty dossier shape. Route only 500s on auth/job-not-found/DB-write failure.
- **Single Browserbase session**, 120s timeout, sequential visits, max 3 sub-pages (free-plan limit).
- **Secrets stay in `.env.local` only.** Never in `memory.md`, never committed.

## Problems solved

- **Turbopack can't bundle `@browserbasehq/stagehand`** (`new URL("../", import.meta.url)` for extension assets). Fixed with `serverExternalPackages` — same treatment as `@napi-rs/canvas` / `pdfjs-dist`.
- **Zod version mismatch breaks `extract(instruction, schema)` typing.** Top-level zod was 4.5.4, stagehand's nested copy is 4.4.3; the `_zod.version.minor` literal mismatch makes TS silently fall back to the freeform overload. Pinned top-level `zod@4.4.3`. Do NOT bump without checking stagehand's nested version.
- **Adzuna redirect now followed by the real browser, not Node fetch.** The original `resolveEmployerUrl` used `fetch(sourceUrl, { redirect: "follow" })` which CloudFront 403s. Rewrote it to navigate `page.goto(sourceUrl)` in the real Browserbase browser, read `page.url()` after the redirect settles, and derive the homepage from the real landing hostname. Falls back to name-based guess only if the navigation throws or lands on adzuna.com.

## Current state

- `main` at `9d544eb` + a follow-up fix (committed and pushed): agent now uses the real browser to follow the Adzuna redirect and waits for pages to settle before extracting.
- Research Company button is live (no longer dimmed).
- **Still awaiting first live end-to-end test** — no real Browserbase session has run yet (costs credits).
- `zod` already in approved-deps list; no standards update needed.

## Next session starts with

1. First live research run against a real job (click Research Company, watch for the dossier; keep an eye on Browserbase credit usage and Groq rate limits — up to 4 sequential Groq calls per click).
2. Then Feature 14 — Dashboard Page Full UI (`context/build-plan.md:388+`).

## Open questions

- `library-docs.md` Stagehand + Browserbase sections still describe v0.x — update to v4 API or leave with a pointer to installed package docs? Left as-is (out of scope).
- `code-standards.md:308` still says `@insforge/ssr` while the project uses `@insforge/sdk` (pre-existing drift). Out of scope.
- Groq free-tier 30 RPM vs research burst (up to 4 sequential calls per click) — button disables while researching, which mitigates double-click 429s. Unverified under real load.
