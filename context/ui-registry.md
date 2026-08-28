# UI Registry

Living document. Updated after every component is built. Read this before building any new component — match existing patterns exactly before inventing new ones.

---

## How to Use

Before building any component:

1. Check if a similar component already exists here
2. If yes — match its exact classes
3. If no — build it following ui-rules.md and ui-tokens.md, then add it here

After building any component — update this file with the component name, file path, and exact classes used.

---

## Components

### Layout

#### `Navbar` — `components/layout/Navbar.tsx`
- `header` → `w-full bg-surface border-b border-border`
- inner `nav` → `mx-auto max-w-[1440px] h-16 px-6 flex items-center justify-between`
- logo mark → 36×36, `rounded-[10px]`, gradient `linear-gradient(45deg, #7C5CFC 0%, #4A2EC5 100%)`
- logo text → `text-[19px] font-bold leading-7 text-text-darkest`
- nav links → `text-[14px] font-medium leading-5 text-text-dark hover:text-accent`
- primary CTA → `bg-accent text-accent-foreground px-4 py-2 rounded-md text-[14px] font-medium`
- Accepts `isAuthed: boolean` prop. When true, CTA label changes to "Open dashboard" and href becomes `/dashboard`.

#### `Footer` — `components/layout/Footer.tsx`
- `footer` → `w-full bg-surface border-t border-border`
- inner → `mx-auto max-w-[1440px] px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4`
- links → `text-[14px] font-medium text-text-dark hover:text-accent`

### Homepage

#### `Hero` — `components/homepage/Hero.tsx`
- section → relative, radial gradient backdrop (purple → pink → blue at 0.7 opacity)
- inner → `mx-auto max-w-[1440px] px-8 py-24 md:py-32 text-center`
- h1 → `text-[44px] md:text-[64px] font-bold leading-[1.1] tracking-tight text-text-primary`
- subhead → `mt-6 max-w-2xl mx-auto text-[16px] leading-6 text-text-secondary`
- primary button → `bg-text-primary text-surface` (dark "Get Started" with arrow)
- secondary button → `bg-surface border border-border text-text-primary`
- Accepts `isAuthed: boolean` prop. Primary button href becomes `/dashboard` when authed, otherwise `/login`.

#### `DashboardPreview` — `components/homepage/DashboardPreview.tsx`
- wrapper → `rounded-2xl overflow-hidden bg-surface border border-border`
- shadow → `shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]`
- image → `w-full h-auto` with `next/image`, `priority`

#### `ManageSection` — `components/homepage/ManageSection.tsx`
- section → `mx-auto max-w-[1440px] px-8 py-16`
- grid → `grid grid-cols-1 md:grid-cols-2 gap-12 items-start`
- h2 → `text-[40px] md:text-[48px] font-bold leading-tight tracking-tight text-text-primary`
- feature card → `bg-surface border border-border rounded-2xl p-6`
- feature title → `text-[16px] font-semibold leading-6 text-text-primary`
- feature body → `mt-2 text-[14px] leading-5 text-text-secondary`
- preview image card → `rounded-2xl overflow-hidden bg-surface border border-border`

#### `ApplySection` — `components/homepage/ApplySection.tsx`
- same structure as `ManageSection` with order reversed on mobile (`order-1 md:order-2` on text, `order-2 md:order-1` on image)

#### `Testimonial` — `components/homepage/Testimonial.tsx`
- card → `rounded-2xl border border-border bg-surface p-8 md:p-12 text-center`
- eyebrow → `text-[12px] font-medium tracking-[0.2em] text-accent uppercase`
- quote → `mt-6 max-w-3xl mx-auto text-[22px] md:text-[26px] font-medium leading-snug text-text-primary`
- avatar → `w-10 h-10 rounded-full`
- name → `text-[14px] font-semibold text-text-primary`
- role → `text-[12px] text-text-muted`

#### `BottomCta` — `components/homepage/BottomCta.tsx`
- mirror of `Hero` with a different radial gradient backdrop
- inner → `mx-auto max-w-[1440px] px-8 py-24 text-center`
- Accepts `isAuthed: boolean` prop. Same href logic as Hero.

### Auth

#### `OAuthButtons` — `components/auth/OAuthButtons.tsx`
- Client Component (`"use client"`) — invokes the `initiateOAuth` Server Action.
- Each button → `w-full inline-flex items-center justify-center gap-3 rounded-md border border-border bg-surface px-4 py-2.5 text-[14px] font-medium text-text-primary hover:bg-surface-secondary disabled:opacity-60 disabled:cursor-not-allowed transition-colors`
- Renders provider icon on the left + label on the right. Pending state shows "Redirecting..." and disables both buttons.
- Accepts `nextPath?: string` and forwards it to `initiateOAuth(provider, nextPath)`. The Server Action persists it (after sanitization) in the `insforge_post_auth_redirect` cookie so the callback can return the user to the page they originally tried to visit.

#### `LoginPage` — `app/(auth)/login/page.tsx`
- Server Component reading `searchParams: { error?, next? }`.
- Layout: minimal header (logo only) + centered card.
- Card → `w-full max-w-md bg-surface border border-border rounded-2xl p-8 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]`
- Heading → `text-[24px] font-semibold leading-8 text-text-primary`
- Subhead → `mt-2 text-[14px] leading-5 text-text-secondary`
- Error banner (only when `error` is present) → `mt-6 rounded-md border border-border bg-surface-secondary px-3 py-2 text-[13px] text-error`
- Error messages map (oauth_failed / missing_verifier / exchange_failed) is defined in the page; add to it if a new error is introduced.
- Footer legal text → `mt-8 text-center text-[12px] leading-4 text-text-muted` with accent-colored inline links.

### Server infrastructure

#### `proxy.ts` — project root
- Next.js 16 Proxy (replaces `middleware.ts`). Uses `updateSession()` from `@insforge/sdk/ssr/middleware`.
- Matcher excludes `/_next/static`, `/_next/image`, `favicon.ico`, `images`, and `api/auth`.
- Auth gate: any path under `/dashboard`, `/profile`, `/find-jobs` without an `insforge_access_token` cookie is redirected to `/login?next=<path>`.

#### `app/api/auth/refresh/route.ts`
- One-liner: `export const { POST } = createRefreshAuthRouter();`

#### `app/api/auth/callback/route.ts`
- GET handler reads `insforge_code` + `error` from query.
- Reads `insforge_code_verifier` cookie. If missing → redirect `/login?error=missing_verifier`.
- Reads `insforge_post_auth_redirect` cookie, sanitizes via `sanitizeNextPath()`, falls back to `/dashboard` if missing/invalid.
- Calls `createAuthActions({ requestCookies, responseCookies })` then `exchangeOAuthCode(code, codeVerifier)`.
- On success: redirect to the sanitized next path, delete both `insforge_code_verifier` and `insforge_post_auth_redirect` cookies.
- On failure: redirect to `/login?error=exchange_failed`.

#### `actions/auth.ts`
- `initiateOAuth(provider, nextPath?)` — Server Action. Calls `auth.signInWithOAuth(provider, { redirectTo: '<NEXT_PUBLIC_APP_URL>/api/auth/callback', skipBrowserRedirect: true })`. Stores `codeVerifier` in `insforge_code_verifier` cookie, sanitizes `nextPath` and (if safe) stores it in `insforge_post_auth_redirect`, then `redirect(data.url)`. Logs and returns `{ success: false, error }` on init failure.
- `signOut()` — Server Action. Wraps `auth.signOut()`.
- Constraints: only "google" and "github" are accepted (the enabled providers in this project).

#### `lib/auth-redirect.ts`
- Holds `POST_AUTH_COOKIE` constant and `sanitizeNextPath(value)` helper. Sanitization rules: must start with `/`, must not start with `//` or `/\`, must not contain CR/LF. Imported by `actions/auth.ts` and `app/api/auth/callback/route.ts` so the allowlist lives in one place.
- Lives outside `actions/` because Server Action files require every export to be an async function — synchronous helpers cannot be exported from `"use server"` modules.

#### `PageviewTracker` — `components/PageviewTracker.tsx`
- Client Component. Calls `capturePageview(path)` on mount. Renders `null`. Use as `<PageviewTracker path="/..." />` inside a Server Component page.

#### `instrumentation-client.ts` — project root
- Next.js 16's standard client-side SDK bootstrap (auto-loaded by the framework).
- Initializes PostHog if both `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` are set; otherwise logs a single dev-mode error and continues (no throw).
- Calls `insforge.auth.getCurrentUser()` on every page load and runs `posthog.identify(user.id, { email, name })` or `posthog.reset()` based on session state, using `localStorage("posthog_identified_user_id")` to detect user changes.
- Auto-captures JS exceptions via `capture_exceptions: true`.

#### `app/global-error.tsx`
- Client Component root error boundary (Next.js 16).
- Calls `posthog.captureException(error)` in a `useEffect` when both env vars are set.

#### `lib/posthog-client.ts`
- Thin browser-side wrapper around `posthog-js`. `posthog.capture()` no-ops until `instrumentation-client.ts` initializes PostHog, so calls from this file are always safe.
- `captureEvent(event, properties?)` — wrapper around `posthog.capture()`.
- `capturePageview(path?)` — wrapper around `posthog.capture("$pageview", { $current_url: path })`. Manual pageview capture because `instrumentation-client.ts` does not set `capture_pageview: true` (so pages opt in explicitly).

#### `lib/posthog-server.ts`
- `createPostHogServer()` — returns a `posthog-node` `PostHog` instance with `flushAt: 1` and `flushInterval: 0`. Returns `null` if env vars are missing.
- `captureServerEvent(distinctId, event, properties?)` — convenience wrapper that creates the client, captures the event, and calls `shutdown()`. Catches and logs errors so a PostHog outage never breaks the calling route.

#### `ProfilePage` — `app/profile/page.tsx`
- Server Component. Reads current user via `createInsforgeServer().auth.getCurrentUser()` and computes `isAuthed` from the `insforge_access_token` cookie.
- Renders `<Navbar isAuthed>` and a "Coming soon" card pointing back to `/dashboard` or `/logout`. Feature 05 replaces this with the real profile editor.
- Wrapper: `min-h-screen flex flex-col bg-background`, main `mx-auto max-w-[1440px] w-full px-8 py-12`, card matches the standard `bg-surface border border-border rounded-2xl p-8` pattern.

#### `app/api/auth/logout/route.ts`
- GET handler. Constructs a `NextResponse.redirect("/")` first so the redirect `Set-Cookie` headers ride on the same response, then calls `createAuthActions({ requestCookies, responseCookies }).signOut()` to clear `insforge_access_token` + `insforge_refresh_token`.
- Sign-out cannot be a Server Component page because in Next.js 16, cookies are read-only in Server Components — the `signOut` action throws "Cookies can only be modified in a Server Action or Route Handler." A Route Handler with the request/response cookie split is the writable context.
- `instrumentation-client.ts` picks up the cleared session on the next page load and calls `posthog.reset()` because the previously-identified user id is gone.
- Linked from any "Sign out" button via `href="/api/auth/logout"`.

---

## Patterns

### Logo Mark (used in Navbar + Footer)
```tsx
<span
  className="w-9 h-9 rounded-[10px] flex items-center justify-center"
  style={{ background: "linear-gradient(45deg, #7C5CFC 0%, #4A2EC5 100%)" }}
>
  <Sparkles className="w-5 h-5 text-accent-foreground" />
</span>
```

### Page Container
Always `mx-auto max-w-[1440px] px-8` with vertical spacing `py-16` (section) or `py-24/py-32` (hero).

### Card Surface
`rounded-2xl bg-surface border border-border p-6` (small) or `p-8 md:p-12` (large).

### Two-Column Feature Section
`grid grid-cols-1 md:grid-cols-2 gap-12 items-center` (or `items-start` when text column has stacked cards).

### Section Title
`text-[40px] md:text-[48px] font-bold leading-tight tracking-tight text-text-primary`.

### Feature Card (inside two-column section)
`bg-surface border border-border rounded-2xl p-6` with `text-[16px] font-semibold` title and `text-[14px] leading-5 text-text-secondary` body.
