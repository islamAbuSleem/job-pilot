# Memory — Homepage + Tailwind v4 Tokens (Feature 01)

Last updated: 2026-08-28

## What was built

- `app/globals.css` — Tailwind v4 `@theme` block with all design tokens from `context/ui-tokens.md` (colors, `--font-sans: "Inter"`, radii). `html`/`body` set to `var(--color-background)` and `var(--font-sans)`.
- `app/layout.tsx` — replaced default Geist fonts with `Inter` via `next/font/google`, exposed as `--font-sans`, applied via `font-sans` class on `<body>`.
- `app/page.tsx` — composes the full landing page.
- `components/layout/Navbar.tsx` — logo + 3 nav links + "Start for free" CTA.
- `components/layout/Footer.tsx` — logo + Dashboard / Privacy / Terms links.
- `components/homepage/Hero.tsx` — headline, subhead, "Get Started" (dark) + "Find Your First Match" (outlined) CTAs over a radial purple/pink/blue gradient.
- `components/homepage/DashboardPreview.tsx` — `next/image` showing `/images/dashboard-demo.png` in a card.
- `components/homepage/ManageSection.tsx` — "Manage Your Job Search With Ease" two-column section; 3 feature cards on left, `jobs-lists.png` on right.
- `components/homepage/ApplySection.tsx` — "Apply With More Confidence" — image/text order reversed on desktop vs mobile.
- `components/homepage/Testimonial.tsx` — success-stories card with `user-icon.png` avatar.
- `components/homepage/BottomCta.tsx` — bottom CTA mirror of Hero with different gradient.
- `context/ui-registry.md` — added component entries (Navbar, Footer, Hero, DashboardPreview, ManageSection, ApplySection, Testimonial, BottomCta) plus reusable patterns (logo mark, page container, card surface, two-column feature section, section title, feature card).
- `context/progress-tracker.md` — Feature 01 marked `[x]`; Current Status set to "Phase 1, last: 01 Homepage, next: 02 Auth".
- `package.json` / `package-lock.json` — added `lucide-react` (used for `Sparkles` and `ArrowRight` icons).

## Decisions made

- Logo uses an inline `style` gradient (`linear-gradient(45deg, #7C5CFC 0%, #4A2EC5 100%)`) because it cannot be expressed via `@theme` color tokens; only the logo mark uses this gradient.
- Hero and BottomCta section backgrounds use inline `style` radial gradients (multi-color, opacity-driven) for the same reason — these are decorative backdrops, not theme tokens.
- CTAs in Hero/BottomCta use a dark `bg-text-primary` (not the design-system `bg-accent`) because the design shows dark "Get Started" buttons with white text. Documented as-is to match the design.
- Feature 01 is **UI only** — no auth check, no `/login` route exists yet, the `primaryHref="/login"` links will 404 until Feature 02.
- All page sections are server components. No `"use client"` needed yet.

## Problems solved

- `npm` is blocked by PowerShell execution policy in this shell — invoke via `cmd /c "npm run ..."`.
- Multi-line `git commit -m "..."` is parsed by PowerShell as expressions; instead write the message to a file and pass via `git commit -F <file>`.
- `lucide-react` was not pre-installed — added as a dependency (it is in the approved list in `context/code-standards.md`).

## Current state

- Feature 01 complete and committed (`43a7703`, `feat(homepage): build landing page with design tokens (Feature 01)`).
- `npm run build` passes cleanly (4 static routes).
- Pushed to `origin/main` via `git push -u origin main --force` — this **discarded 10 prior remote commits** (auth, jobs pages, redesign work on branches `origin/feat/auth-layout` and `origin/feat/jobs-pages` are still intact on those branches). The user explicitly chose force-push.
- No `app/(auth)/login`, no middleware, no InsForge wiring yet.

## Next session starts with

Begin Feature **02 — Auth** from `context/build-plan.md`:

1. Create `app/(auth)/login/page.tsx` with Google + GitHub OAuth buttons.
2. Create `app/(auth)/callback/page.tsx` for the OAuth callback handler.
3. Add `middleware.ts` to protect `/dashboard`, `/profile`, `/find-jobs`, `/find-jobs/[id]`.
4. Create `lib/insforge-client.ts` and `lib/insforge-server.ts` per `context/architecture.md` (InsForge not yet installed — install `@insforge/ssr` first).
5. Update `app/page.tsx` Hero/BottomCta CTAs to redirect to `/dashboard` when authenticated, `/login` otherwise (currently both go to `/login`).
6. After completion: mark Feature 02 `[x]` in `context/progress-tracker.md`, append any new components to `context/ui-registry.md`, commit, push.

## Open questions

- Should the next session recover any of the discarded remote work (auth pages, jobs pages, redesign) before continuing? User chose force-push, so assumed no — but worth confirming at session start.
- InsForge environment variables (`NEXT_PUBLIC_INSFORGE_URL`, `NEXT_PUBLIC_INSFORGE_ANON_KEY`) are not yet provided — Feature 02 will need them.
