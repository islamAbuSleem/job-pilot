# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** 2 — Profile Page
**Last completed:** 05 Profile Page — Full UI
**Next:** 06 Profile Save Logic

---

## Progress

### Phase 1 — Foundation

- [x] 01 Homepage
- [x] 02 Auth
- [x] 03 PostHog Initialization
- [x] 04 Database Schema

### Phase 2 — Profile Page

- [x] 05 Profile Page — Full UI
- [ ] 06 Profile Save Logic
- [ ] 07 AI Profile Extraction from Resume
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
