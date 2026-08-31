# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** 2 — Profile Page
**Last completed:** 08 Resume PDF Generation from Profile (minimax-m3 model)
**Next:** Fix TODOs below, then 09 Find Jobs Page — Full UI

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

- [ ] 09 Find Jobs Page — Full UI
- [ ] 10 Adzuna Job Discovery
- [ ] 11 Filter + Sort + Pagination

### Phase 4 — Job Details Page

- [ ] 12 Job Details Page — Full UI
- [ ] 13 Company Research Agent

### Phase 5 — Dashboard

- [ ] 14 Dashboard Page — Full UI
- [ ] 15 Stats Bar — Real Data
- [ ] 16 Recent Activity — Real Data
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
