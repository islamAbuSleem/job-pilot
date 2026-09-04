# Memory — Features 14/15/16 (Dashboard) + Feature 17 architected

Last updated: 2026-09-04

## What was built

**Feature 14 — Dashboard Page Full UI** (committed `eadaf1d`): `app/dashboard/page.tsx` + 7 components under `components/dashboard/` (`StatsCard`, `StatsBar`, `RecentActivity`, `ResearchActivityChart`, `JobsOverTimeChart`, `MatchScoreChart`, `IncompleteProfileBanner`). Layout matches `context/designs/dashboard.png` exactly (4 stat cards → activity + research chart → over-time + distribution). Mock data; all sections take typed data props. Installed `recharts@^3.10.1` (registered in code-standards approved deps per build-plan.md:442). SVG colors use CSS vars, never hex.

**Feature 15 — Stats Bar Real Data** (committed `5a380f8`): new `lib/dashboard-stats.ts` (`getDashboardStats(userId)`) — total, avg match rate, researched count (`.not("company_research","is",null)`), this-week count, plus week-over-week trends (badge hidden when no prior-week baseline). Try/catch → zeros fallback. No component changes.

**Feature 16 — Recent Activity Real Data** (committed `1f6cfdb`): new `lib/dashboard-activity.ts` (`getRecentActivity(userId)`, max 5) — completed `agent_runs` by `completed_at` desc; `research:*` rows → "Researched {company}" (info blue), others → "Found {N job(s)} for {title}" with pluralization (success green); times via shared `formatRelative()`.

**Feature 17 — architected only, NOT built.** Blueprint agreed, awaiting build confirmation.

## Decisions made

- **Charts: derive from InsForge DB, not PostHog Query API.** No Personal API key or project ID in env, library-docs has no Query API patterns, and the configured PostHog MCP (`https://mcp.posthog.com/mcp`) is not callable from this session. Numbers are identical by construction (one `job_found` per job insert carrying that job's `matchScore`; one `company_researched` per dossier save). Documented deviation from build-plan.md:433-443 letter, preserves intent.
- **Window: last 7 days by weekday for both time charts** (not 30 days) — matches design labels and existing `{day, value}` prop shapes.
- **Research activity source: research `agent_runs` rows, not `jobs` table** (same deviation as Feature 16) — `jobs` has no researched-at timestamp.
- **Company Research card button is `disabled`** — wait, no: Research Company button is live since Feature 13.
- recharts SVG colors reference `var(--color-*)` — satisfies the no-hex invariant.
- `zod@4.4.3` exact pin still in force (must match stagehand's nested copy).

## Problems solved

- `npm install recharts` timed out at 180s but had actually completed (`recharts@^3.10.1` in package.json) — verified via `Test-Path` instead of re-running.
- PowerShell 5.1 has no `&&`, no `head`, and `Find-ChildItem` (typo of `Get-ChildItem`) — use `;`, `Select-Object -First`, `Get-ChildItem`.
- Edit tool `oldString` must contain literal U+2026 (`…`) where the file has it — three ASCII dots won't match (learned earlier, still applies).

## Current state

- `main` includes `eadaf1d` (F14), `5a380f8` (F15), `1f6cfdb` (F16). Working tree: check with `git status -s` (docs updates for 14/15/16 may be uncommitted — progress-tracker and ui-registry were edited this session).
- `/dashboard` serves with real stats + real activity; all three charts still on mock constants (`MOCK_RESEARCH`, `MOCK_OVER_TIME`, `MOCK_DISTRIBUTION` in `app/dashboard/page.tsx`).
- `npm run build` clean, eslint clean on all touched files (last verified after F16 commit).
- Feature 13 still NOT live-tested end-to-end (no real Browserbase session has run; costs credits).

## Next session starts with

1. Get explicit confirmation to build Feature 17, then implement per the agreed blueprint: new `lib/dashboard-charts.ts` (`getDashboardCharts(userId)` → `{ research, overTime, distribution }`, one jobs select bucketed two ways + research runs by weekday, try/catch → zeroed datasets), wire into `app/dashboard/page.tsx`, delete the three MOCK constants, build + lint, update tracker/registry, commit.
2. Then: first live Research Company run (Browserbase credits), then remaining polish.

## Open questions

- `library-docs.md` Stagehand + Browserbase sections still describe v0.x (installed v4 API differs) — left as-is, out of scope.
- `code-standards.md:308` still says `@insforge/ssr` while the project uses `@insforge/sdk` (pre-existing drift).
- Whether to backfill/delete the stale "Working Tree State (carryover from prior sessions)" section in progress-tracker.md — untouched this session.
