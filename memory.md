# Memory — Feature 07 (AI Profile Extraction from Resume) + Resume Delete

Last updated: 2026-08-29

## What was built

**Feature 07 — AI Profile Extraction from Resume** (mostly committed across multiple commits before this session). All on `main`.

- `lib/openrouter.ts` — OpenAI SDK client pointed at OpenRouter (`https://openrouter.ai/api/v1`) with `qwen/qwen-2.5-72b-instruct:free` model. Exports `extractProfileFromResume(text)` and `extractProfileFromResumeWithRetry(text, maxRetries=2)` with exponential backoff. Caches a single OpenAI client.
- `app/api/resume/extract/route.ts` — `POST` multipart. Uses new `pdf-parse` ESM class API: `new PDFParse({ data: uint8 }).getText()`. Then calls OpenRouter with a 23-field structured prompt. Returns `{ success: true, data }` or `{ success: false, error, detail }`.
- `app/api/resume/delete/route.ts` — `POST`. Removes resume from storage + clears `resume_pdf_url` in profiles. Re-validates `/profile`.
- `lib/resume-path.ts` — `extractResumePath(stored, userId)` helper. Parses both legacy `/resumes/...` and current `/api/storage/.../objects/{userId}/resume.pdf` URL shapes. Used by `app/profile/page.tsx` (to generate signed URLs) and the delete route.
- `components/profile/ResumeCard.tsx` — `Trash2` button on "Current resume" row, `window.confirm` gate, `isDeleting` spinner, calls `onDelete`. Also has `Sparkles` "Extract from Resume" button calling `/api/resume/extract` with `credentials: "include"`.
- `components/profile/ProfileEditor.tsx` — Listens for `resume-extracted` `window` custom event, maps JSON → form state, handles delete with `useTransition` + `router.refresh()`. New `resumePath` prop forwarded from page.

**Errors hit and fixed during this session (Feature 07 follow-up commits, all on `main`):**
- `5a07df0` save flow shows resume card immediately (URL prop passed after save); vision fallback for PDF extraction
- `fd23865` vision fallback + model rotation for resume extraction
- `f236bf6` lenient JSON parsing + third text fallback for resume extraction
- `b3b31b9` sync `ProfileForm` internal state when parent `initialData` changes
- `e553fa3` loosen `work_experience` + `job_titles_seeking` validation (allow empty work_experience when not extracting, allow `job_titles_seeking` strings with commas)
- `f61d56c` progress tracker cleanup

## Decisions made

- **Model: `qwen/qwen-2.5-72b-instruct:free`** — 72B, free tier, 128k context, strong JSON mode. Chosen over the user's initial pick `liquid/lfm-2.5-2.6b:free` (2.6B) because the model will also be reused for Features 10/13/8 (job matching, company research synthesis, resume generation) which need multi-step reasoning and structured JSON output.
- **`pdf-parse` v2+ ESM class API** (`new PDFParse({ data }).getText()`) — NOT the old `import pdf from "pdf-parse"; pdf(buffer)` default-export pattern. The old API throws "Export default doesn't exist" build errors with the new version.
- **Two separate API routes** (`/api/resume/extract` and `/api/resume/delete`) — server-side because storage and InsForge client require server context with auth cookies.
- **Window custom event `resume-extracted`** for the extract → form handoff (ResumeCard doesn't know ProfileForm's setter). Decoupled alternative to threading `onExtracted` props through ProfileEditor.
- **Direct push to `main`** — no feature branch. The repo has been using direct-to-main for these follow-up commits. If a proper PR is wanted, `git revert` + re-do on `feat/07-...` branch.
- **Confirmation via `window.confirm`** for resume delete (simple, no extra dialog component).

## Problems solved

- **PDF text extraction failing on certain files** — improved error messages in `extract/route.ts` to distinguish password-protected, corrupted, and scanned/image-based PDFs (returns `error` and `detail` for debugging).
- **`fetch` calls not sending cookies** — `extract` and `delete` fetch calls were missing `credentials: "include"`, causing 401 "Not authenticated" from the server. Fixed.
- **Resume card not showing after save** — fixed by adding signed URL on the page server component and `router.refresh()` in the delete handler.
- **ProfileForm stale after parent `initialData` change** — fixed in `b3b31b9` (use `initialData` prop as the source of truth, sync internal state on prop change).
- **Path parsing inconsistency** between page and delete route — unified via `extractResumePath()` helper in `lib/resume-path.ts`.
- **JSON parsing brittleness** for OpenRouter output — lenient parser strips ```json fences, finds first `{...}` block, falls back to text-only prompts.

## Current state

- `main` is at `b48c914 feat(profile): add resume delete with confirm + shared path helper` (pushed to origin).
- All Feature 07 + delete work is on `main`. No feature branch in flight.
- `npm run build` clean. Routes registered: `/api/resume/extract`, `/api/resume/delete`, `/profile`, etc.
- `OPENROUTER_API_KEY` is in `.env.local` (gitignored, NOT in memory). Model constant: `qwen/qwen-2.5-72b-instruct:free`.
- `pdf-parse` + `openai` npm packages installed.
- `lib/resume-path.ts` is the canonical helper — both `app/profile/page.tsx` and `app/api/resume/delete/route.ts` use it. New resume URL writes from `actions/profile.ts` store the public URL like `https://p8i46jbn.eu-central.insforge.app/api/storage/buckets/resumes/objects/{userId}%2Fresume.pdf` (URL-encoded `{userId}/resume.pdf`).
- PostHog env vars in `.env.local`: `NEXT_PUBLIC_POSTHOG_HOST=/ingest`, `POSTHOG_HOST=https://eu.i.posthog.com`. `next.config.ts` rewrites `/ingest/*` → `POSTHOG_HOST` so browser avoids CORS.

## User workflow rules

- One **branch per feature** off `main` is the rule, but the previous session + this one have been pushing follow-ups directly to `main`. User accepts this and merges via the GitHub web UI. The PR-creation flow (`gh` or `GITHUB_TOKEN`) is not set up in this shell — if you want to create a PR from a branch, do it on GitHub web UI.
- Never commit secrets. `.env.local` is gitignored. The OpenRouter key and InsForge anon key live there.
- Build clean before every commit. `npm run build` checks 11 routes.

## Next session starts with

Next feature: **Feature 08 — Resume PDF Generation from Profile** (`context/build-plan.md:138-153`).
- `POST /api/resume/generate` reads profile data from DB.
- OpenRouter (or another LLM) generates professional resume copy (summary, polished bullets, clean language).
- `@react-pdf/renderer` renders to a single-page PDF buffer using `renderToBuffer()`.
- Buffer uploaded to InsForge Storage at `resumes/{userId}/resume.pdf` with `upsert: true`.
- `resume_pdf_url` updated in `profiles` table.
- Currently `handleGenerate` in `ResumeCard.tsx:86` is a `console.log` stub — needs to be wired.
- The shared `lib/openrouter.ts` is already in place for the LLM step.
- `lib/openrouter.ts:3` holds the model constant — change once, used by both extract (Feature 07) and generate (Feature 08).

## Open questions

- The user said "it was working before the latest feature" about PDF extraction, but Feature 07 (extract) is new. Likely confusion — the resume upload/view was working (Feature 06) but extract (Feature 07) hit the empty-text error path (PDF likely scanned/image-based). No code regression; user needs a text-based PDF to test.
- Whether to use the same `qwen-2.5-72b-instruct:free` model for resume generation (Feature 08) or switch to something more creative — TBD when Feature 08 is built.
- PostHog `profile_completed` event (code-standards.md:228) is fired on the `false→true` `is_complete` transition in `actions/profile.ts:165`. Not yet verified end-to-end.

