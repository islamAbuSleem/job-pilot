---
date: 2026-08-20
topic: job-pilot-mvp
---

# JobPilot MVP - Paste -> Analyze -> Proposal

## Problem Frame

Developers and job seekers (freelance, full-time, early-career, generalist) waste hours per application reading ambiguous job descriptions, self-assessing fit, spotting gaps, and writing bespoke proposals/cover letters. Existing options are fragmented: generic trackers with no AI, or one-off ChatGPT prompts with no memory of the user's profile/resume and no structured extraction. JobPilot's wedge is a single tight loop that compounds value: **paste a job (text or URL) -> see a structured fit analysis grounded in your real profile/resume -> get a tailored proposal you can edit and send**, all in under 2 minutes. This refines the prior MVP plan (`docs/plans/2026-08-20-001-feat-job-pilot-mvp-plan.md`) by pinning concrete product behavior, scope, and success signals so planning does not have to invent them.

## Requirements

**Job Ingestion**

- R1. User can create a job by pasting raw job text (textarea, required) OR a public job URL; at least one must be provided.
- R2. When a URL is pasted, system fetches the page (10s timeout, max 3 redirects), validates HTML content-type, strips nav/scripts, and extracts cleaned description; if fetch fails or page is JS-heavy with no useful text, system falls back to a screenshot/OCR path or surfaces a clear error with guidance to paste text instead.
- R3. System normalizes and persists: title, company, cleaned description, requirements list (if detectable), location/salary if present, source URL and raw text, owned by the authenticated user.
- R4. Private/internal URLs are rejected (localhost, 127.0.0.1, 10.*, 192.168.*, 172.16-31.*, 0.0.0.0, file://) with a user-facing "URL not allowed" message.

**Profile & Resume**

- R5. User has a persistent profile: short bio, skills (multi-select/free text), years of experience, and links (portfolio, LinkedIn, GitHub). Editable at any time.
- R6. User can upload multiple resumes (PDF or plain text, up to 10MB each), each stored with filename and extracted text; text is the ground truth for AI, raw file retention is best-effort for v1. User can list, preview (first ~500 chars), and delete resumes.
- R7. For each job, user picks which resume to use for analysis/proposal (dropdown, defaults to most recent). If no resume exists, analysis and proposal still run using profile only.
- R8. Resume upload handles: empty file -> 400, oversized -> 413, scanned PDF with no extractable text -> 400 with guidance to paste text.

**AI Analysis (Fit Scoring)**

- R9. From a "Analyze" action on a job, system runs AI over (job + selected resume + profile) and returns a persisted structured analysis: `fitScore 0-100`, `matchedSkills[]`, `gaps[]` (missing/weak skills), `strengths[]` (what to emphasize), `redFlags[]` (risks, e.g., underpaid, vague scope, mismatch), and `summary` (2-3 lines).
- R10. Analysis is streamed to the UI token-by-token (no full page reload), respects client abort (cancel stops upstream), and is viewable again on job detail after completion.
- R11. User can pick the model per analysis (curated list of ~6 OpenRouter models, e.g., openai/gpt-4o, anthropic/claude-3.5-sonnet, google/gemini-2.0-flash); default is a balanced fast/cheap model.

**Proposal Generation**

- R12. From a job (and optionally its latest analysis), user can "Generate proposal" which streams a tailored proposal/cover letter grounded strictly in the selected resume/profile and job requirements (must not hallucinate skills not present). Supports `tone` (concise vs detailed at minimum).
- R13. Proposal type is auto-detected from job text (freelance bid vs corporate cover letter) but user can override via a type/tone picker; detection looks for cues like "Upwork", "hourly", "milestone" vs "cover letter", "full-time", "benefits".
- R14. Proposal is persisted per job with model/tone metadata, keeps history (multiple per job, latest marked current), and is editable inline with save, copy to clipboard, and download as markdown. Regeneration with a different model is allowed.
- R15. Streaming shares the same abortable, non-persist-partial-on-abort behavior as analysis.

**Auth & Ownership**

- R16. Only authenticated users can create/view their own profiles, resumes, jobs, analyses, and proposals. Unauthenticated access to dashboard and all creation/analysis APIs redirects or returns 401/302.
- R17. Sign-up/sign-in via email+password (hashed) and via Google OAuth and GitHub OAuth; duplicate email on sign-up returns a friendly 409.

**History & Navigation**

- R18. User can list their jobs ordered newest first, with pagination (10/page), status badges (no analysis / analyzed / has proposal), and search/filter by title/company/status.
- R19. Job detail shows: job metadata, analysis tab (latest + history), and proposal tab (editor + history).
- R20. Dashboard shows counts (total jobs, analyzed, proposals) and recent jobs with a "New Job" CTA; empty states guide to the first action.

## Success Criteria

- Primary (user-selected): Human spot-check finds >=90% of analyses "reasonable" — fitScore and gaps align with a quick manual reading of the same job + resume pair (sample 20 diverse jobs).
- Time-to-value: Median paste -> first proposal < 2 minutes for a 500-1500 word job on a typical broadband connection (measured via analytics on the happy path).
- Functional: Authenticated user can complete sign-up -> create profile -> upload resume -> paste job (text and URL) -> analyze (streamed) -> generate proposal (streamed, editable, copyable) without page reload, and data persists after reload.
- Quality gate: Proposal in 95% of spot-checks does not claim skills absent from the selected resume/profile.

## Scope Boundaries

- No job board aggregation, search, or saved-search alerts in v1 (single-URL fetch only).
- No LinkedIn/GitHub profile import; profile is manual + resume upload.
- No ATS integration, email sending, calendar/interview tracking, or Kanban tracker (deferred to `feat: application tracker`).
- No payments/billing, teams/orgs, or RBAC beyond per-user ownership.
- No browser extension.
- Screenshot/OCR fallback for JS-heavy URLs is a stretch goal — if not ready, the fallback is a clear error + "paste text" guidance, not a blocker for v1.

## Key Decisions

- **Serve all job-seeker segments with one profile model:** Freelance, FTE, generalist, and students share the same profile+resume structure; differentiation happens in proposal type auto-detection rather than separate data models. Rationale: broadens early validation without multiplying schema; low carrying cost (one enum/prompt branch).
- **Auto-detect proposal type from job text:** Reduces user friction vs forcing a manual toggle, while keeping an override. Rationale: achieves personalization for both Upwork bids and cover letters without doubling UI; detection is heuristic and easy to correct.
- **Structured 5-part analysis (score + matched/gaps/strengths/red flags + summary):** Chosen as "enough" vs score-only (too thin) or full salary/level estimates (speculative in v1). Rationale: balances insight and overwhelm; matches the prior plan's analysis schema and the user's Q3 choice.
- **Multiple resumes, pick per job:** Supports the real workflow where one person tailors "frontend" vs "backend" vs "freelance" resumes. Rationale: explicit user control beats auto-pick magic in v1; low cost (resumeId FK).
- **Generic HTML fetch with screenshot/OCR fallback:** Covers the long tail of job sites without per-site parsers. Rationale: generic readability extraction handles ~80% of cases; screenshot fallback is noted as stretch to avoid blocking v1.
- **Analysis accuracy as primary validation:** Chose over time-to-proposal or retention because trust in fit scoring is the moat; if analysis feels wrong, proposals won't be trusted either.

## Dependencies / Assumptions

- User will have at least one resume or a filled profile before running analysis; system degrades gracefully to profile-only if not.
- OpenRouter multi-model access is available; curated allowlist of ~6 models covers cost/latency/quality tradeoffs.
- OAuth apps for Google and GitHub can be created; if not configured, OAuth buttons hide but email/password flow still works.
- Node >=20.19 and Postgres available locally (Docker) or hosted.

## Outstanding Questions

### Resolve Before Planning

- None — product decisions needed for planning are now pinned. The prior plan's bootstrap Q1-4 and this refinement's Q1-6 cover the blocking choices.

### Deferred to Planning

- [Affects R2][Technical] PDF parsing library choice (pdf-parse vs unpdf vs pdfjs) and exact 10MB/empty-file handling — evaluate when implementing `src/app/api/upload/resume/route.ts`.
- [Affects R11,R14][Needs research] OpenRouter `strict` vs `compatible` JSON mode for structured analysis — default `compatible` unless strict proves needed with real models.
- [Affects R4][Technical] Exact private-IP denylist and redirect cap implementation for SSRF guard.
- [Affects R18][Technical] Pagination/filter query params and index choices for `Job` listing.
- [Affects R10,R15][Needs research] Best Vercel AI SDK streaming primitive for this stack (`streamText` vs `streamObject`) and `maxDuration`/`maxTokens` caps — confirm with docs during implementation.
- [Affects R13][Technical] Exact heuristics/prompt for freelance-vs-FTE auto-detection and user override UX.

## Next Steps

-> /ce-plan for structured implementation planning (update `docs/plans/2026-08-20-001-feat-job-pilot-mvp-plan.md` to reflect auto-detect proposal type, multi-resume-per-job, screenshot fallback stretch, and analysis-accuracy success metric)

