# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** 1 — Foundation
**Last completed:** 02 Auth
**Next:** 03 PostHog Initialization

---

## Progress

### Phase 1 — Foundation

- [x] 01 Homepage
- [x] 02 Auth
- [ ] 03 PostHog Initialization
- [ ] 04 Database Schema

### Phase 2 — Profile Page

- [ ] 05 Profile Page — Full UI
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

## Notes

### 02 Auth
- `insforge.toml` is the declarative source of truth for InsForge project config — re-export with `npx -y @insforge/cli config export` to refresh it after dashboard changes.
- `npx -y @insforge/cli config apply` requires a TTY. Use `--auto-approve` to apply from non-interactive shells.
