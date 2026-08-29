# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** 2 — Profile Page
**Last completed:** 07 AI Profile Extraction from Resume (text + vision fallback)
**Next:** 08 Resume PDF Generation from Profile

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
- [ ] 08 Resume PDF Generation from Profile

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

### 06 Profile Save Logic
- `actions/profile.ts:saveProfile()` returns `{ resumeUrl, resumePath, resumeUploaded }` on success (signed URL minted server-side). `ProfileForm.handleSave()` calls `onSaved(result)`; `ProfileEditor` updates `savedResumeUrl`/`savedResumePath` state and clears the local `resumeFile` preview. Bug fix: the ResumeCard now shows the saved PDF immediately after Save — previously it kept showing the local file / dropzone until a manual refresh.

### 07 AI Profile Extraction from Resume
- Vision fallback added. `pdf-parse` runs first; if it throws or returns < 50 chars, `lib/pdf-vision.ts` rasterizes the PDF (pdfjs-dist + @napi-rs/canvas) and `lib/openrouter.ts:extractProfileFromResumeVision()` calls `google/gemma-4-31b-it:free` with each page as a separate `image_url` content part. Same JSON schema as the text path, so `ProfileEditor` form-mapping needs no branching.
- `next.config.ts` adds `pdfjs-dist` and `@napi-rs/canvas` to `serverExternalPackages` (Turbopack can't bundle the native binding).
- `pdf-img-convert` was rejected — its `canvas` dep requires a Windows native compile with no prebuilt for current Node ABI. `@napi-rs/canvas` ships prebuilt `.node` binaries.

### 07 follow-up — vision-fallback + model rotation
- **Model rotation**: `qwen/qwen-2.5-72b-instruct:free` was retired by the provider (returns 404 "no longer free"). Swapped to `inclusionai/ling-3.0-flash-fin:free` and added `openrouter/free` as a fallback chain (`callExtractionWithFallback()`). Fallback fires only on transient/model-availability errors (404/429/"no endpoints"). Both text and vision extraction paths use the same fallback.
- **DataCloneError fix**: pdfjs's worker couldn't transfer the user's PDF buffer inside Next.js dev (Turbopack module isolation proxies the ArrayBuffer). Fixed in `lib/pdf-vision.ts` by copying into a fresh `Uint8Array(uint8.byteLength)` before passing to `pdfjs.getDocument({ data })`. Always do this — pdfjs's worker rejects proxied buffers.
- **Better error UX**: 5xx errors now include actionable messages (mention the file may be malformed or the AI service is unavailable) instead of generic "Failed to extract profile from resume." Verified working end-to-end against `Islam-Abusleem-Resume.pdf` (vision path).

### 07 follow-up 2 — lenient JSON + third fallback
- The fallback `openrouter/free` was returning JSON wrapped in markdown fences despite `response_format: json_object`, so `JSON.parse` failed and the user saw "Failed to parse model response as JSON." Added `parseLenientJson()` in `lib/openrouter.ts` — tries direct parse → strips ```json fences → finds the first balanced `{...}` span. Now salvageable on the next try instead of throwing.
- Added `OPENROUTER_SECONDARY_TEXT_MODEL = "nvidia/nemotron-3.5-lightning:free"` as a third hop in the text chain. Distinct provider pool, separate daily quota — works when ling is rate-limited.
- When all models in the chain are 429'd, the route now returns 502 with `"Our AI service has hit its daily free-tier limit. Please try again tomorrow, or fill the profile fields manually below."` instead of leaking the JSON-parse error.
- Re-verified end-to-end with `Islam-Abusleem-Resume.pdf` after ling hit its daily quota — succeeded via nemotron, returned full profile (name, email, phone, location, skills, etc.).
- Logo and Hero/BottomCta backgrounds use inline `style` gradients — they cannot be expressed via `@theme` color tokens. Documented as the only place these decorative gradients appear.
- Hero/BottomCta primary CTAs use `bg-text-primary` (dark) per the design, not `bg-accent`. Documented as the intended visual.

### 02 Auth
- Used `@insforge/sdk/ssr` (not the older separate `@insforge/ssr` package). Updated `context/library-docs.md` to match.
- Next.js 16 renamed `middleware.ts` to `proxy.ts` — used `proxy.ts` with `updateSession()` from `@insforge/sdk/ssr/middleware`.
- InsForge's browser client is read-only for auth; all mutations (OAuth init, code exchange, sign-out) go through `createAuthActions()` in Server Actions / Route Handlers.
- Homepage auth state is read on the server by checking the `insforge_access_token` cookie — no client-side flash. The cookie check happens in `app/page.tsx` (Server Component) and is passed down to `Navbar`/`Hero`/`BottomCta` as an `isAuthed` prop.
- InsForge config: added `http://localhost:3000/api/auth/callback` to `allowed_redirect_urls` via `npx -y @insforge/cli config apply --auto-approve`. Add prod URL the same way before deploy.
- `initiateOAuth` returns `{ success, url }` instead of calling `redirect()`. `OAuthButtons` awaits the result, navigates with `window.location.assign(url)` on success, and shows an error alert on failure. Server-side `redirect()` threw `NEXT_REDIRECT`, which the discarded `void` promise turned into an unhandled rejection and error tracking noise, and which also hid the action's `{ success: false }` failure path from the user.

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
