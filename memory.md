# Memory — Feature 13 (Company Research Agent)

Last updated: 2026-09-03

## What was built

**Feature 13 — Company Research Agent** (working tree, not yet committed).

- `lib/browserbase.ts` — `launchResearchBrowser()` via the stagehand package's `browserbase.launch({ apiKey, projectId })`. Reads `BROWSERBASE_API_KEY` + `BROWSERBASE_PROJECT_ID`.
- `lib/stagehand.ts` — `createStagehand(browser)` with `groq/llama-3.3-70b-versatile` + `GROQ_API_KEY`. Stagehand 4 API: `Stagehand.create({ browser, model })`, NOT `new Stagehand({ browserbaseSessionID })`.
- `lib/company-url.ts` — `deriveCompanyHomepageUrl()`: strips Inc/LLC/Ltd/Corp/Co suffixes, lowercases, strips non-alphanumerics → `https://{clean}.com`; Google-search fallback when empty. (Deliberately does NOT follow the Adzuna redirect — CloudFront 403s server-side fetches, proven in Feature 12 follow-up 5.)
- `agent/research.ts` — `researchCompany(job, profile)`: homepage `extract()` (oneLiner/productSummary/signals/pageLinks) → skip-to-synthesis when both oneLiner and productSummary are empty → up to 3 sub-page extracts preferring about/blog/engineering/product → `stagehand.close()` in `finally` → OpenRouter synthesis (temperature 0.4, max_tokens 800, same 3-model chain + `parseLenientJson` as the matcher). Always returns a complete dossier.
- `app/api/jobs/[id]/research/route.ts` — `POST`, `runtime nodejs`, no `maxDuration`. Auth → load job (user-scoped) → load profile → create `agent_runs` row (`job_title_searched: "research:{company}"`) → research → save dossier to `jobs.company_research` → `company_researched` PostHog event → `revalidatePath`. Returns `{ success, data: { dossier } }`.
- `components/job-details/ResearchCompanyButton.tsx` — client button: idle / researching (spinner + disabled) / error (`role="alert"`); success calls `router.refresh()`. Wired into `CompanyResearchCard` header (new `jobId` prop, passed from the page).
- Deps installed: `@browserbasehq/sdk@^2.19.1`, `@browserbasehq/stagehand@^4.0.2`, `zod@4.4.3` (exact pin — see Problems solved).
- `next.config.ts` — added both browserbase packages to `serverExternalPackages`.
- `.env.local` — added `GROQ_API_KEY` ([REDACTED]); renamed `BROWSERBASE_API_key` → `BROWSERBASE_API_KEY` (nothing referenced the old casing).

`npm run build` clean (`/api/jobs/[id]/research` registered as `ƒ (Dynamic)`); eslint clean.

## Decisions made

- **Homepage URL: derive from `job.company`, don't follow the Adzuna redirect.** CloudFront blocks the redirect fetch (Feature 12 follow-up 5). User confirmed.
- **Two LLM providers, split by step.** Stagehand 4 hardcodes `modelName` to openai/anthropic/google/groq/cerebras literals (Zod template-literal validation) — OpenRouter is rejected. So: `extract()` calls use Groq (`llama-3.3-70b-versatile`); final synthesis uses the OpenRouter chain via `lib/openrouter.ts`. User confirmed both.
- **Route shape: synchronous, no `maxDuration`.** The route blocks until research completes and returns the dossier; client shows spinner + `router.refresh()` on success. Browserbase runs on its own infra per `library-docs.md:296-298`.
- **Always return a dossier.** Browser failure → synthesize from job + profile alone; synthesis failure → empty dossier shape. Route never 500s on research failure (only on auth/job-not-found/DB-write failure).
- **Single Browserbase session**, 120s timeout, sequential visits, max 3 sub-pages — free-plan limit per `library-docs.md:300-303`.
- **No `/remember`-style secrets in this file.** Groq key lives only in `.env.local` (gitignored).

## Problems solved

- **Turbopack can't bundle `@browserbasehq/stagehand`.** It resolves extension assets via `new URL("../", import.meta.url)`, which Turbopack can't statically resolve (`Module not found: Can't resolve '../'`). Fixed with `serverExternalPackages` — same treatment as `@napi-rs/canvas` / `pdfjs-dist` from Feature 07.
- **Zod version mismatch breaks `extract(instruction, schema)` typing.** Top-level `zod` resolved to 4.5.4 while stagehand's nested copy is 4.4.3; the `_zod.version.minor` literal (`4` vs `5`) fails the overload, and TS silently falls back to the freeform overload (returning `{ extraction: string }` instead of the schema shape). Fixed by pinning top-level `zod@4.4.3`. Do NOT bump top-level zod without checking stagehand's nested version.
- **`library-docs.md` Stagehand examples target v0.x** (`new Stagehand({ browserbaseSessionID })`, `stagehand.page`, `disablePino`). Stagehand 4 uses `browserbase.launch()` → `Stagehand.create({ browser, model })`, `browser.context.pages()`, `extract(instruction, schema, options?)`. All Feature 13 code was verified against `node_modules/@browserbasehq/stagehand/dist/index.d.mts` + README, not the docs file.

## Current state

- `main` is at `5c48c60` (docs commit for Feature 12) plus the uncommitted working tree:
  - `M package.json`, `M package-lock.json` (browserbase/stagehand/zod)
  - `M next.config.ts` (serverExternalPackages)
  - `M lib/browserbase.ts` (rewritten for Stagehand 4 launch pattern)
  - `M components/job-details/CompanyResearchCard.tsx` (live button, jobId prop)
  - `M app/find-jobs/[id]/page.tsx` (passes jobId)
  - `M context/progress-tracker.md` (Phase 5, 13 checked + decisions)
  - `M context/ui-registry.md` (ResearchCompanyButton entry, card entry updated)
  - `?? lib/stagehand.ts`, `?? lib/company-url.ts`, `?? agent/research.ts`
  - `?? app/api/jobs/[id]/research/`
  - `?? components/job-details/ResearchCompanyButton.tsx`
  - (`.env.local` modified but gitignored — GROQ_API_KEY + BROWSERBASE_API_KEY casing fix)
- `npm run build` clean. Routes now include `/api/jobs/[id]/research`. `zod` already in the approved-deps list (`code-standards.md:319`), no standards update needed.
- **NOT yet live-tested end-to-end** — no real Browserbase session has been run (costs credits). The button, route, and dossier renderer are wired; first real research run will exercise the whole chain.

## User workflow rules

- Direct pushes to `main` accepted; merges via GitHub web UI. No `gh` CLI configured.
- Never commit secrets. `.env.local` is gitignored.
- Build clean before every commit. `npm run build` checks 14 routes now.
- Before any third-party library, load its installed skill first, then read `context/library-docs.md`. (Note: `library-docs.md` Stagehand section is stale v0.x — the installed `index.d.mts` + README are authoritative for v4.)

## Next session starts with

1. Commit + push the Feature 13 working tree (3 commits suggested: `feat(research): browser session + agent pipeline`, `feat(job-details): wire Research Company button`, `docs(context): register Feature 13`).
2. First live research run against a real job to verify the whole chain (Browserbase session → extracts → synthesis → dossier renders). Watch Browserbase credit usage.
3. Then Feature 14 — Dashboard Page Full UI (`context/build-plan.md:388+`).

## Open questions

- Groq free-tier rate limits (30 RPM) vs research burst: homepage + up to 3 sub-page extracts = up to 4 Groq calls per research click, sequential. Fine for single-user, but rapid double-clicks could 429 — the button disables while researching, which mitigates it.
- `library-docs.md` Stagehand + Browserbase sections still describe v0.x. Should they be updated to the v4 API, or left as-is with a pointer to the installed package docs? Left as-is for now (out of scope).
- `code-standards.md:308` still says `@insforge/ssr` while the project uses `@insforge/sdk` (pre-existing drift, noted in progress tracker "02 Auth"). Out of scope.
