# JobPilot

Paste any job → get an AI fit analysis → generate a tailored proposal grounded in your real profile.

JobPilot is a warm, robust job-pilot for developers and job seekers. Paste raw job text or a public URL, pick your resume, and see a structured analysis (fit score, matched skills, gaps, strengths, red flags) plus a streamed proposal that auto-detects freelance bid vs cover letter — no hallucinations.

## Stack

- **Now:** Next.js 16 (App Router, `src/`), React 19, Tailwind CSS 4, pnpm, Vitest
- **Planned:** PostgreSQL + Prisma 7 (`@prisma/adapter-pg`), Auth.js v5 (email + Google + GitHub), OpenRouter via Vercel AI SDK

## Getting Started

```bash
pnpm install
cp .env.example .env   # fill with placeholder values for local UI dev
pnpm dev               # http://localhost:3000
pnpm test              # Vitest — tests in tests/
pnpm lint              # ESLint
```

`src/lib/env.ts` validates `DATABASE_URL` (must start with `postgresql://` or `postgres://`), `AUTH_SECRET`, and `OPENROUTER_API_KEY` at startup.

## Project Structure

- `src/app/page.tsx` — landing (composes `src/app/components/`)
- `src/app/(dashboard)/` — dashboard shell (`src/app/(dashboard)/components/`) and dashboard page (`src/app/(dashboard)/dashboard/components/`)
- `src/app/(auth)/` — signin/signup (`src/app/(auth)/components/` and per-page `components/`)
- `src/components/ui/` — primitives (Button, Card, Input, Textarea, Badge)
- `src/components/common/` — shared (Logo, Header, Footer)
- `tests/` — Vitest suite mirroring `src/`
