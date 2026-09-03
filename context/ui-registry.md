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
- nav links → `text-[14px] font-medium leading-5 transition-colors text-text-dark hover:text-accent`
- active link → `text-accent border-b-2 border-accent pb-1` (Feature 09 deviation from `ui-rules.md` — design shows underline; active color still #7C5CFC)
- primary CTA → `inline-flex items-center justify-center rounded-md px-4 py-2 bg-accent text-accent-foreground text-[14px] font-medium hover:bg-accent-dark transition-colors`
- Accepts `isAuthed: boolean` prop. When true, CTA label changes to "Open dashboard" and href becomes `/dashboard`.
- Accepts `activePath?: string` prop (Feature 09). When provided and matching `/dashboard`, `/find-jobs`, or `/profile`, that link gets the active style. Pass it from each page that uses the Navbar; falls back to all-inactive when omitted.

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

### Profile

#### `AttentionBanner` — `components/profile/AttentionBanner.tsx`
File: `components/profile/AttentionBanner.tsx`
Last updated: 2026-08-29

| Property | Class |
| --- | --- |
| Background | `bg-surface` |
| Border | `border border-border` |
| Border radius | `rounded-2xl` (card), `rounded-sm` (missing-field pills) |
| Text — primary | `text-error` (heading `text-[16px] font-semibold leading-6`), `text-text-primary` (body `text-[14px] leading-5`, ring `%` `text-[24px] font-semibold leading-7`) |
| Text — secondary | `text-text-primary` (body), `text-error` (pills `text-[12px] font-medium leading-4`) |
| Text — muted | `text-text-primary` used for body |
| Spacing | `p-6` (card), `gap-6` (card flex), `gap-2` (heading + pills), `mt-2`/`mt-4` (body/pills) |
| Hover state | none (static server component) |
| Shadow | none |
| Accent usage | `text-error` / `bg-error-light` (pills), `var(--color-error)` stroke on CompletionRing |

**Pattern notes:** Red-themed attention state — heading + AlertCircle icon in `text-error`, pills in `bg-error-light`/`text-error`. CompletionRing is inline SVG 120×120, stroke 8, `var(--color-surface-secondary)` track + `var(--color-error)` progress with `strokeLinecap round`, `-rotate-90`. Constants `COMPLETION_PERCENTAGE`/`MISSING_FIELDS` hardcoded.

#### `ResumeCard` — `components/profile/ResumeCard.tsx`
File: `components/profile/ResumeCard.tsx`
Last updated: 2026-09-03

| Property | Class |
| --- | --- |
| Background | `bg-surface` (card, Select button), `bg-surface-secondary` (dropzone idle, file row), `bg-accent-muted` (dropzone active), `bg-accent-light` (icon circle), `bg-accent` (Generate button) |
| Border | `border border-border` (card, file row, Select button), `border border-dashed` (dropzone), `border-t border-border` (Generate separator) |
| Border radius | `rounded-2xl` (card), `rounded-lg` (dropzone/file row), `rounded-full` (icon circle), `rounded-md` (buttons) |
| Text — primary | `text-text-primary` (`text-[16px] font-semibold leading-6` title, `text-[14px] font-medium leading-5` upload line/file name) |
| Text — secondary | `text-text-secondary` (subtext `text-[14px] leading-5`, Generate helper `text-[14px] leading-5`) |
| Text — muted | `text-text-muted` (dropzone sub-line `text-[12px] leading-4`, file size `text-[12px] leading-4`, View PDF link `text-accent hover:underline`), `text-error` (error `text-[13px] leading-5`) |
| Spacing | `p-6` (card), `px-6 py-10` (dropzone), `px-4 py-3` (file row), `pt-6 mt-6` (Generate row), `gap-4` (Generate flex), `gap-1` (download+delete icon-button row), `mt-2`/`mt-3` (upload texts) |
| Hover state | `hover:bg-surface-secondary` (Select), `hover:bg-accent-dark` (Generate), `hover:text-text-primary hover:bg-surface` (clear X), `hover:text-accent hover:bg-accent-light` (download), `hover:text-error hover:bg-error-light` (delete) |
| Shadow | none |
| Accent usage | `bg-accent-light text-accent` (icon circle), `border-accent bg-accent-muted` (drag active), `bg-accent text-accent-foreground` (Generate), `text-accent` (View PDF link) |

**Pattern notes:** Dropzone via `react-dropzone@20.1.1` (`accept pdf`, `maxSize 5MB`, `multiple false`, `noClick/noKeyboard` — Select button is click target). Conditional `border-accent`/`bg-accent-muted` when `isDragActive`. File row collapses dropzone; right side is `gap-1` icon-button row with Download (`Download` icon, blob-download via `fetch(existingUrl, {credentials:"include"})` → object URL → `a[download="resume.pdf"]`, falls back to `window.open` on failure) then Trash2 delete (gated by `window.confirm` in parent, `isDeleting` shows spinner + "Removing..."). Generate button (`bg-accent text-accent-foreground`) now wired to `POST /api/resume/generate` with `isGenerating` spinner and `router.refresh()` on success (Feature 08 completed; no hard reload). Error line `text-[13px] leading-5 text-error` `role="alert"` at bottom of card.

#### `TagInput` — `components/profile/TagInput.tsx`
File: `components/profile/TagInput.tsx`
Last updated: 2026-08-29

| Property | Class |
| --- | --- |
| Background | `bg-surface` (input, Add button), `bg-surface-secondary` (pills) |
| Border | `border border-border` (input, Add button) |
| Border radius | `rounded-md` (input, Add button, pills) |
| Text — primary | `text-text-primary` (input `text-[14px] leading-5`, pills `text-[12px] font-medium leading-4`) |
| Text — secondary | `text-text-muted` (placeholder), `text-text-primary` (Add button `text-[14px] font-medium leading-5`) |
| Text — muted | `text-text-muted` (X icon) |
| Spacing | `px-3 py-2` (input), `px-4 py-2` (Add), `px-2 py-1` (pills), `gap-2` (row + pills flex), `gap-1` (pill inner), `gap-3` (outer flex-col) |
| Hover state | `hover:bg-surface-secondary` (Add), `hover:text-text-primary` (X), `focus:ring-1 focus:ring-accent focus:border-accent` (input) |
| Shadow | none |
| Accent usage | `focus:ring-accent` / `focus:border-accent` |

**Pattern notes:** Reusable for Skills/Industries/Job Titles/Preferred Locations. `flex-1` input + Add button row, `flex-wrap gap-2` pills. Enter commits, Backspace on empty removes last, duplicate/atMax rejected, `disabled:opacity-60`.

#### `ProfileForm` — `components/profile/ProfileForm.tsx`
File: `components/profile/ProfileForm.tsx`
Last updated: 2026-08-29

| Property | Class |
| --- | --- |
| Background | `bg-surface` (card), `bg-accent` (Save button) |
| Border | `border border-border` (card), `border-t border-border` (section dividers) |
| Border radius | `rounded-2xl` (card), `rounded-md` (Save button) |
| Text — primary | `text-text-primary` (title `text-[16px] font-semibold leading-6`) |
| Text — secondary | `text-text-secondary` (subtext `text-[14px] leading-5`) |
| Text — muted | — |
| Spacing | `p-6` (card), `mt-1` (subtext), `mt-6` + `flex flex-col gap-8` (sections), `mt-8 border-t pt-6` (Save row), `px-4 py-3` (Save) |
| Hover state | `hover:bg-accent-dark` (Save) |
| Shadow | none |
| Accent usage | `bg-accent text-accent-foreground` (Save) |

**Pattern notes:** Owns `useState<FormData>` initialized from `initialData` prop (server-fetched). Renders 5 section sub-components in order. Save is inside card after `border-t` divider, full-width `bg-accent`, wired to `saveProfile` Server Action via `useTransition`; shows `success`/`error` alert and `fieldErrors` map, disables during pending.

#### `PersonalInfo` — `components/profile/sections/PersonalInfo.tsx`
File: `components/profile/sections/PersonalInfo.tsx`
Last updated: 2026-08-29

| Property | Class |
| --- | --- |
| Background | `bg-surface` (inputs/select), `bg-surface-secondary` (email readOnly) |
| Border | `border border-border` |
| Border radius | `rounded-md` |
| Text — primary | `text-text-primary` (inputs `text-[14px] leading-5`) |
| Text — secondary | `text-text-secondary` (labels `text-[12px] font-medium leading-4 tracking-wide uppercase`) |
| Text — muted | `text-text-muted` (placeholder), `text-text-secondary` (email `cursor-default`) |
| Spacing | `gap-4` (2-col grid), `mt-1.5` (inputs), `px-3 py-2` (inputs) |
| Hover state | `focus:ring-1 focus:ring-accent focus:border-accent` |
| Shadow | none |
| Accent usage | focus ring only |

**Pattern notes:** `grid-cols-1 md:grid-cols-2 gap-4`, Work Authorization spans `md:col-span-2`. Email `readOnly` with `bg-surface-secondary`. Select chevron via `ChevronDown` icon `absolute right-3 text-text-muted` in `relative` wrapper.

#### `ProfessionalInfo` — `components/profile/sections/ProfessionalInfo.tsx`
File: `components/profile/sections/ProfessionalInfo.tsx`
Last updated: 2026-08-29

| Property | Class |
| --- | --- |
| Background | `bg-surface` |
| Border | `border border-border` |
| Border radius | `rounded-md` |
| Text — primary | `text-text-primary` (inputs `text-[14px] leading-5`, heading `text-[16px] font-semibold leading-6`) |
| Text — secondary | `text-text-secondary` (labels `text-[12px]`) |
| Text — muted | `text-text-muted` (placeholder) |
| Spacing | `gap-4` (grid), `mt-1.5`/`mt-4` |
| Hover state | focus ring |
| Shadow | none |
| Accent usage | focus ring |

**Pattern notes:** Current Title full-width, Experience+Years 2-col, Skills/Industries each `TagInput` full-width. Options: junior/mid/senior/lead.

#### `WorkExperience` — `components/profile/sections/WorkExperience.tsx`
File: `components/profile/sections/WorkExperience.tsx`
Last updated: 2026-08-29

| Property | Class |
| --- | --- |
| Background | `bg-surface` (inputs), `bg-surface-secondary` (disabled End Date) |
| Border | `border border-border` (inputs, role card `rounded-lg p-4`) |
| Border radius | `rounded-md` (inputs), `rounded-lg` (role card), `rounded` (checkbox) |
| Text — primary | `text-text-primary` (inputs `text-[14px] leading-5`, heading `text-[16px] font-semibold`) |
| Text — secondary | `text-text-secondary` (labels `text-[12px]`), `text-text-primary` (checkbox label `text-[14px]`) |
| Text — muted | `text-text-muted` (placeholder, disabled End Date), `text-text-muted hover:text-error` (Remove link `text-[13px]`) |
| Spacing | `gap-4` (grid), `mt-1.5` (inputs), `mt-2` (checkbox), `p-4` (role card), `gap-4` (outer), `mt-3` (Remove row) |
| Hover state | `hover:text-error` (Remove), `hover:text-accent` → `hover:text-accent-dark` via `text-accent` (Add role) |
| Shadow | none |
| Accent usage | `text-accent` (Add role `+ Add role`), `text-accent focus:ring-accent` (checkbox) |

**Pattern notes:** Dynamic rows, "+ Add role" hidden at 3 (arch `work_experience` max 3). Each role `rounded-lg border p-4`. End Date label row is `flex justify-between` with checkbox `inline-flex gap-1.5 text-[12px]` on right; input `mt-1.5` below with `disabled:bg-surface-secondary` when `current`. Remove link `justify-end`.

#### `Education` — `components/profile/sections/Education.tsx`
File: `components/profile/sections/Education.tsx`
Last updated: 2026-08-29

| Property | Class |
| --- | --- |
| Background | `bg-surface` |
| Border | `border border-border` |
| Border radius | `rounded-md` |
| Text — primary | `text-text-primary` |
| Text — secondary | `text-text-secondary` (labels) |
| Text — muted | `text-text-muted` (placeholder) |
| Spacing | `gap-4` (2-col), `mt-1.5` |
| Hover state | focus ring |
| Shadow | none |
| Accent usage | focus ring |

**Pattern notes:** 2-col grid, options high_school/associate/bachelor/master/doctorate.

#### `JobPreferences` — `components/profile/sections/JobPreferences.tsx`
File: `components/profile/sections/JobPreferences.tsx`
Last updated: 2026-08-29

| Property | Class |
| --- | --- |
| Background | `bg-surface` |
| Border | `border border-border` |
| Border radius | `rounded-md` |
| Text — primary | `text-text-primary` |
| Text — secondary | `text-text-secondary` |
| Text — muted | `text-text-muted` |
| Spacing | `gap-4` (sections + 2-col), `mt-1.5`/`mt-4` |
| Hover state | focus ring |
| Shadow | none |
| Accent usage | focus ring |

**Pattern notes:** Job Titles `TagInput`, Remote+Salary 2-col, Preferred Locations `TagInput`, Cover Letter Tone select. Options remote/onsite/hybrid/any + formal/casual/enthusiastic.

#### `ProfileEditor` — `components/profile/ProfileEditor.tsx`
File: `components/profile/ProfileEditor.tsx`
Last updated: 2026-08-29

| Property | Class |
| --- | --- |
| Background | `bg-background` (page via parent) |
| Border | `border-border` (via children) |
| Spacing | `mx-auto w-full max-w-[1080px] flex-col gap-6` |

**Pattern notes:** Client wrapper that lifts `resumeFile` state, `completion` ({percentage, missingFields}), and `savedResumeUrl`/`savedResumePath`. Renders `AttentionBanner` + `ResumeCard` + `ProfileForm`. Passed `initialData`/`resumeUrl`/`initialCompletion` from Server Component. Keeps form and banner in sync via `onCompletionChange`. Receives `onSaved(result)` from `ProfileForm` after a successful save — when `result.resumeUploaded === true`, the editor clears `resumeFile` and updates `savedResumeUrl`/`savedResumePath` so the ResumeCard flips from "ready to upload" preview to the just-saved URL immediately (no `router.refresh()` needed).

#### `ProfileCompletion` — `lib/profile-completion.ts`
- `computeCompletion(profile): { percentage, missingFields, isComplete }` — 10 required checks, used in both Server Action and `AttentionBanner` for single source of truth.

#### `ProfileValidation` — `lib/profile-validation.ts`
- Zod `profileSchema` for all 23 profile fields, `workExperienceRoleSchema` max 3, used in `actions/profile.ts` for server-side validation. Returns `fieldErrors` map on failure.

### Find Jobs

#### `SearchControls` — `components/find-jobs/SearchControls.tsx`
File: `components/find-jobs/SearchControls.tsx`
Last updated: 2026-09-01

| Property | Class |
| --- | --- |
| Background | `bg-surface` (card, inputs, button) |
| Border | `border border-border` (card, inputs) |
| Border radius | `rounded-2xl` (card), `rounded-md` (inputs, button) |
| Text — primary | `text-text-primary` (input values) |
| Text — secondary | `text-text-secondary` (labels `text-[12px] font-medium leading-4 tracking-wide uppercase`) |
| Text — muted | `text-text-muted` (placeholder, search icon) |
| Spacing | `p-6` (card), `gap-4` (grid), `gap-2` (label + input), `mt-6` (success banner), `px-4 py-3` (banner) |
| Hover state | `hover:bg-accent-dark` (Find Jobs) |
| Accent usage | `bg-accent text-accent-foreground` (Find Jobs button), `focus:ring-accent` / `focus:border-accent` (inputs) |

**Pattern notes:** Form is `grid grid-cols-1 md:grid-cols-[1fr_1fr_auto]` — title + location + button. Job Title input has `Search` icon `absolute left-3` inside a `relative` wrapper. Inputs are controlled (`value`/`onChange`) and submit to `POST /api/agent/find` with `credentials:"include"` and `{jobTitle, location}` JSON. Loading shows spinner + "Searching..." and disables the button (`disabled:opacity-60`). Banner uses `bg-success-lightest border-success-light text-success-foreground` for success and `border-error-light bg-error-light text-error` for errors. On success one of three messages is shown, all reading "Saved N jobs" so the job count is unambiguous: `Saved ${found} jobs — all strong matches.` when `strong === found`, `Saved ${found} jobs, ${strong} of them strong matches.` when `0 < strong < found`, `Saved ${found} jobs. None scored 70+ yet — try refining your profile for stronger matches.` when `strong === 0`, plus the no-jobs `No jobs found for this query. Try a different title or location.` for `found === 0`. Then `router.refresh()` pulls the just-inserted DB rows via the server component. Empty title shows inline error banner. (Wired in Feature 10; was `e.preventDefault()` stub in Feature 09.) **Defaults:** `defaultTitle="Frontend Engineer"` is also the initial `jobTitle` state (always pre-filled). `defaultLocation=""` is empty so the first submit omits `where` and Adzuna returns country-wide results; the visible "Remote, New York..." is only a `placeholder`. (Fix 2026-09-02 — submitting the literal placeholder `Remote, New York...` (with `...`) made Adzuna return 0 results.)

#### `JobsList` — `components/find-jobs/JobsList.tsx`
File: `components/find-jobs/JobsList.tsx`
Last updated: 2026-09-03

| Property | Class |
| --- | --- |
| Background | `bg-surface` (filter card, table, inputs, dropdowns, pagination buttons) |
| Border | `border border-border` (filter card, table, inputs, dropdowns), `border-b border-border last:border-b-0` (row separators) |
| Border radius | `rounded-2xl` (filter card, table) |
| Text — primary | `text-text-primary` (input, company, role, salary, page numbers active) |
| Text — secondary | `text-text-secondary` (column headers `text-[12px] font-medium leading-4 tracking-wide uppercase`, date found, "Showing X to Y of Z results") |
| Text — muted | `text-text-muted` (placeholder, dropdown chevron, ellipsis) |
| Spacing | `p-4` (filter card), `px-6 py-3` (column header), `px-6 py-4` (rows), `px-6 py-4` (pagination row), `gap-3` (filter flex), `gap-2` (dropdowns) |
| Hover state | `hover:bg-surface-secondary` (rows, inactive page buttons, Previous/Next), `focus-visible:bg-surface-secondary` (row link) |
| Accent usage | `focus:ring-accent` / `focus:border-accent` (inputs), `bg-accent-light text-accent` (active page), `border-b-2 border-accent` (active nav) |

**Pattern notes:** Client Component. **State lives in the URL** (`?page=&filter=&sort=&q=`); `JobsList` pushes changes via `router.push` inside `startTransition` and the Server Component (`app/find-jobs/page.tsx`) re-runs the query. Server passes the already-filtered `jobs` slice, `page`, `pageSize`, `pageCount`, `start`, `end`, `filter`, `sort`, `query` as props. Local state: only the text input (so typing doesn't fire a server roundtrip per keystroke); pressing Enter or clicking the input's submit pushes to the URL. The list dims (`opacity-60`) during `useTransition` pending. Table uses CSS grid `grid-cols-[minmax(0,1.4fr)_minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.8fr)]` so column widths match the design. **Each row is now a `<Link href="/find-jobs/{id}">`** (Feature 12) — the `<li>` carries the row's hover bg and `border-b`, the `<Link>` carries the grid + cell padding + `focus-visible:bg-surface-secondary`. Row hover `bg-surface-secondary`, separator `border-b border-border`. Empty state: when `total === 0` shows "No jobs found yet. Run a search above to find matches." (`text-text-muted`, `py-12`); when `total > 0` but the page slice is empty, shows "No jobs match your filters." — same muted style. Pagination row hidden when `total === 0`. Filter/sort options are imported from `lib/jobs-query.ts` (single source of truth shared with the Server Component).

#### `MatchScoreBar` — `components/find-jobs/MatchScoreBar.tsx`
File: `components/find-jobs/MatchScoreBar.tsx`
Last updated: 2026-09-01

| Property | Class |
| --- | --- |
| Background | `bg-border-light` (track), `bg-success` (80-100%), `bg-info` (60-79%), `bg-warning` (<60%) |
| Border radius | `rounded-full` (track + fill) |
| Text — primary | `text-text-primary` (none — uses semantic color tokens) |
| Text — secondary | — |
| Accent usage | `text-success` (90-100%, 70-89%), `text-info` (60-69%), `text-warning` (50-59%), `text-text-muted` (<50%) |

**Pattern notes:** `h-1` bar (4px) inside a `max-w-[120px]` track, with the percentage on the right (`text-[14px] font-medium tabular-nums`). Fill width is `Math.max(0, Math.min(100, score))%` to clamp. Score-color split mirrors `ui-rules.md` Match Score Bar with the additional `text-warning` 50-59 range.

#### `CompanyMark` — `components/find-jobs/CompanyMark.tsx`
File: `components/find-jobs/CompanyMark.tsx`
Last updated: 2026-09-01

| Property | Class |
| --- | --- |
| Background | `bg-surface-secondary` |
| Border | `border border-border` |
| Border radius | `rounded-lg` |
| Text — secondary | `text-text-secondary` (icon) |
| Spacing | `w-10 h-10` |
| Accent usage | none |

**Pattern notes:** Square 40×40 with a `Building2` icon. Initials are computed in `sr-only` so the company name is screen-reader-available even when only the icon shows.

#### `JobsPagination` — `components/find-jobs/JobsPagination.tsx`
File: `components/find-jobs/JobsPagination.tsx`
Last updated: 2026-09-02

| Property | Class |
| --- | --- |
| Background | `bg-surface` (all buttons) |
| Border | none — uses `gap-2` for separation |
| Border radius | `rounded-md` (buttons) |
| Text — primary | `text-text-primary` (page numbers) |
| Text — secondary | `text-text-muted` (ellipsis), `text-text-secondary` (Previous/Next) |
| Spacing | `gap-2` (button row), `px-3 min-w-9 h-9` (buttons) |
| Hover state | `hover:bg-surface-secondary` (Previous/Next, inactive pages) |
| Accent usage | `bg-accent-light text-accent` (active page) |

**Pattern notes:** Pure component, no client state. `buildPageList(current, total)` always includes page 1, page `total`, and the current page ± 1; ellipsis is inserted between any gap > 1. Returns `1..N` for `total <= 5`, `[]` for `total <= 1`. `Previous` and `Next` are disabled (`opacity-50 cursor-not-allowed`) at the ends. Active page gets `aria-current="page"`. The list is the source of truth for which numeric buttons render — the parent re-renders this component with the new `page` after a URL push.

#### `FindJobsPage` — `app/find-jobs/page.tsx`
File: `app/find-jobs/page.tsx`
Last updated: 2026-09-03

| Property | Class |
| --- | --- |
| Background | `bg-background` (page) |
| Spacing | `py-12` (container), `px-8` (container), `gap-6` (form stack) |
| Shadow | none |

**Pattern notes:** Server Component. Reads `isAuthed` from the `insforge_access_token` cookie. Accepts `searchParams: Promise<{ page?, filter?, sort?, q? }>` and parses each via helpers in `lib/jobs-query.ts` (`parsePage`, `parseFilter`, `parseSort`) so unknown values fall back to defaults (`page=1`, `filter=all`, `sort=matchScore`, `q=""`). Builds an InsForge query chain on `insforge.database.from("jobs").select("*", { count: "exact" }).eq("user_id", user.id)`, then conditionally appends `.gte("match_score", 70)` / `.lt("match_score", 70)` for the match filter, `.or('company.ilike."%…%",title.ilike."%…%"')` for text search (values double-quoted so commas survive the gateway's or=() parsing; `escapeIlike` only escapes a double quote in the term), then `.order("match_score", { ascending: false }).order("found_at", { ascending: false })` / `.order("found_at", { ascending: false | true })` per the sort key, and finally `.range(from, to)` with `pageSize = 20` (DEFAULT_PAGE_SIZE). `start` / `end` / `pageCount` are derived from the server's `count`; `notFound()` triggers if `page > pageCount` and there are results. DB fetch is wrapped in try/catch — any error leaves the list empty. Mounts `Navbar` with `activePath="/find-jobs"`, `<PageviewTracker path="/find-jobs" />`, then `SearchControls` (wired in Feature 10) + `JobsList` (URL-driven, Feature 11).

#### `Job Types` — `components/find-jobs/types.ts`
File: `components/find-jobs/types.ts`
Last updated: 2026-09-01

| Property | Notes |
| --- | --- |
| Exports | `Job {id, company, role, matchScore, salary, dateFound}` |

**Pattern notes:** UI-only shape shared by `app/find-jobs/page.tsx` (server-mapped DB row) and `components/find-jobs/JobsList.tsx`. Lifted from the deleted `mock-jobs.ts` when the mock fallback was removed.

#### `JobsQuery` — `lib/jobs-query.ts`
File: `lib/jobs-query.ts`
Last updated: 2026-09-03

| Property | Notes |
| --- | --- |
| Exports | `DEFAULT_PAGE_SIZE = 20`, `MATCH_THRESHOLD = 70`, `MATCH_FILTERS`, `SORT_OPTIONS`, `MatchFilter`, `SortKey`, `JobRow`, `ListJobsResult`, `parsePage`, `parseFilter`, `parseSort`, `escapeIlike` |
| Used by | `app/find-jobs/page.tsx` (Server Component), `components/find-jobs/JobsList.tsx` (Client Component) |

**Pattern notes:** Single source of truth for filter / sort options, threshold, page size, and the small parsers that turn raw `searchParams` into typed values with safe defaults. `MATCH_THRESHOLD` was previously only in `lib/utils.ts`; moved here so the server query and the client share the same numeric value. `escapeIlike` trims the search term and escapes only `"` → `\"` (a literal quote in the term can't break out of the quoted value) — the or=() value is double-quoted in `page.tsx` because the InsForge gateway 400s on unquoted commas in or=() values (see `progress-tracker.md` "11 follow-up"); backslash-escaping `%`/`_` is inert on this gateway and was removed. The actual query chain lives inline in `app/find-jobs/page.tsx` so TypeScript can infer the postgrest-js fluent types end-to-end.

#### `Adzuna Client` — `lib/adzuna.ts`
File: `lib/adzuna.ts`
Last updated: 2026-09-01

| Property | Notes |
| --- | --- |
| Exports | `searchJobs(jobTitle, location, country)`, `detectCountry(location)`, `formatSalary(min,max)`, `AdzunaJob` type |
| Env | `ADZUNA_APP_ID`, `ADZUNA_APP_KEY` |
| Endpoint | `https://api.adzuna.com/v1/api/jobs/{country}/search/1?app_id&app_key&what&where?&category=it-jobs&results_per_page=10&content-type=application/json` |
| Rules | Always `category=it-jobs`; omit `where` if location empty; default country `us` |

**Pattern notes:** Follows `library-docs.md:184-274` exactly. `detectCountry()` is a string heuristic (`uk→gb, australia→au, canada→ca`, else `us`). Throws if Adzuna credentials missing or on non-ok response (caller maps to 502).

#### `Job Matcher` — `agent/matcher.ts`
File: `agent/matcher.ts`
Last updated: 2026-09-01

| Property | Notes |
| --- | --- |
| Exports | `scoreJobAgainstProfile(job, profile): Promise<ScoredJob>` |
| Model | `OPENROUTER_MODEL` with fallback chain `OPENROUTER_FALLBACK_MODEL → OPENROUTER_SECONDARY_TEXT_MODEL` via `getClient()` |
| Prompt | System: role+shape instruction; User: job title/company/location/description + profile summary (title/level/years/skills/industries/seeking/work_experience/education) |
| Options | `response_format: json_object, temperature:0.3, max_tokens:300` |
| Parse | `parseLenientJson()`; clamp 0-100; `matched_skills/missing_skills` → `string[]` max 8 |

**Pattern notes:** Lives in `agent/` per `architecture.md:113` (agent owns matching). Reuses `lib/openrouter.ts` client + lenient parser. On any model failure after fallback chain, returns neutral `{matchScore:50, matchReason:"", matchedSkills:[], missingSkills:[]}` so one bad score never drops a job.

#### `Agent Types` — `agent/types.ts`
File: `agent/types.ts`
Last updated: 2026-09-01

| Property | Notes |
| --- | --- |
| Exports | `ScoredJob {matchScore, matchReason, matchedSkills, missingSkills}`, `ProfileForMatching` |

#### `Find Jobs Route` — `app/api/agent/find/route.ts`
File: `app/api/agent/find/route.ts`
Last updated: 2026-09-01

| Property | Notes |
| --- | --- |
| Method | `POST` `{jobTitle, location}` |
| Auth | `createInsforgeServer().auth.getCurrentUser()` → 401 if missing |
| Validation | `jobTitle` required (400), `location` optional |
| Steps | `captureServerEvent job_search_started` → insert `agent_runs running` → `detectCountry` → `searchJobs` → 0-result early-`completed` → load `profiles` → parallel `scoreJobAgainstProfile` (concurrency 5, `Promise.allSettled`) → bulk `insert` `jobs` → `captureServerEvent job_found` per job → update `agent_runs completed` + `agent_logs success` |
| Errors | Adzuna fail → `failed` + 502; insert fail → `failed` + 500; scoring reject → neutral 50; outer catch marks `failed` |

**Pattern notes:** `runtime nodejs, maxDuration 60`. Uses `logAgent()` helper for `agent_logs` (best-effort). `formatSalary` from `lib/adzuna`. `MATCH_THRESHOLD` is re-exported via `lib/jobs-query.ts` (server query chain reads it directly there; this route does not need it because the response only returns `jobsFound` and `strongMatches >= 70` is a count, not a filter).

#### `Utils` — `lib/utils.ts`
File: `lib/utils.ts`
Last updated: 2026-09-02

| Property | Notes |
| --- | --- |
| Exports | `MATCH_THRESHOLD` (re-exported from `@/lib/jobs-query`), `cn(...classes)` |
| Usage | `cn` for combining classnames; `MATCH_THRESHOLD` is canonically defined in `lib/jobs-query.ts` (so the server query and the client share the same constant) and re-exported here for backwards compatibility with `JobsList.tsx`. New code should import directly from `lib/jobs-query`. |

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
File: `app/profile/page.tsx`
Last updated: 2026-08-29

| Property | Class |
| --- | --- |
| Background | `bg-background` (page) |
| Border | `border-border` (via child cards) |
| Border radius | `rounded-2xl` (child cards) |
| Text — primary | `text-text-primary` (if heading present) |
| Text — secondary | `text-text-secondary` |
| Spacing | `py-12` (container), `px-8` (container), `gap-6` (form stack) |
| Shadow | none |

**Pattern notes:** Server Component. `main` is `flex-1 w-full` (full width); inner container `mx-auto max-w-[1440px] px-8 py-12` is centered. Form column is `mx-auto flex w-full max-w-[1080px] flex-col gap-6` — 1080px matches design's card width, centered with `mx-auto`, falls back to `w-full` on narrow viewports. No page heading — design starts directly with banner.

#### `app/api/auth/logout/route.ts`
- GET handler. Constructs a `NextResponse.redirect("/")` first so the redirect `Set-Cookie` headers ride on the same response, then calls `createAuthActions({ requestCookies, responseCookies }).signOut()` to clear `insforge_access_token` + `insforge_refresh_token`.
- Sign-out cannot be a Server Component page because in Next.js 16, cookies are read-only in Server Components — the `signOut` action throws "Cookies can only be modified in a Server Action or Route Handler." A Route Handler with the request/response cookie split is the writable context.
- `instrumentation-client.ts` picks up the cleared session on the next page load and calls `posthog.reset()` because the previously-identified user id is gone.
- Linked from any "Sign out" button via `href="/api/auth/logout"`.

---

## Profile Error Boundary

**File:** `app/profile/error.tsx`

Route-level error boundary for `/profile`. Renders a centered card (`AlertCircle` + heading + body + "Try again" button) when the route render fails, and reports the exception through `posthog.captureException` (same env guard as `app/global-error.tsx`). Keeps a server error scoped to the route instead of the whole app.

---

### Job Details

#### `BackLink` — `components/job-details/BackLink.tsx`
File: `components/job-details/BackLink.tsx`
Last updated: 2026-09-03

| Property | Class |
| --- | --- |
| Background | none |
| Border | none |
| Text — secondary | `text-text-secondary` (`text-[14px] font-medium leading-5`) |
| Spacing | `gap-1` (icon + label) |
| Hover state | `hover:text-text-primary` |
| Accent usage | none |

**Pattern notes:** Inline link with `ArrowLeft` icon. Default label "Back to Jobs", default href `/find-jobs`. Used once at the top of `/find-jobs/[id]`.

#### `JobHeaderCard` — `components/job-details/JobHeaderCard.tsx`
File: `components/job-details/JobHeaderCard.tsx`
Last updated: 2026-09-03

| Property | Class |
| --- | --- |
| Background | `bg-surface` (card), `bg-surface-secondary` (icon block) |
| Border | `border border-border` (card, icon block) |
| Border radius | `rounded-2xl` (card), `rounded-lg` (icon block) |
| Text — primary | `text-text-primary` (title `text-[24px] md:text-[28px] font-bold leading-tight tracking-tight`, company `text-[14px] leading-5 font-medium`) |
| Text — secondary | `text-text-secondary` (row containing company + score) |
| Spacing | `p-6` (card), `gap-6` (flex row), `gap-4` (icon + meta), `gap-2` (company + score), `mt-2` (meta below title) |
| Hover state | `hover:bg-surface-secondary` (View Job Post button) |
| Accent usage | none (score badge is `bg-success-lightest` / `text-success-foreground` — uses success tokens) |

**Pattern notes:** Server component. `w-12 h-12` icon block with `Building2` (`text-text-secondary`). Score pill is `rounded-full bg-success-lightest px-2 py-0.5 text-[12px] font-medium leading-4 text-success-foreground`. View Job Post is a secondary button — external `<a target="_blank" rel="noopener noreferrer">`; rendered `aria-disabled` when `externalApplyUrl` is empty.

#### `InfoCardsRow` — `components/job-details/InfoCardsRow.tsx`
File: `components/job-details/InfoCardsRow.tsx`
Last updated: 2026-09-03

| Property | Class |
| --- | --- |
| Background | `bg-surface` (cards), `bg-success-light` (Salary icon), `bg-info-light` (Location icon), `bg-accent-light` (Job Type icon), `bg-surface-tertiary` (Date Found icon) |
| Border | `border border-border` (cards) |
| Border radius | `rounded-2xl` (cards), `rounded-lg` (icon blocks) |
| Text — primary | `text-text-primary` (value `text-[16px] font-semibold leading-6 truncate`) |
| Text — muted | `text-text-muted` (label `text-[12px] font-medium leading-4 tracking-wide uppercase`) |
| Spacing | `p-6` (cards), `gap-4` (icon + text), `gap-6` (grid), `mt-1` (label below value) |
| Accent usage | Icon-block colors are semantic — Salary = success, Location = info, Job Type = accent, Date Found = neutral (matches score-bar convention) |

**Pattern notes:** 4-card grid `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6`. Each card is `flex items-center gap-4` with a 40×40 `rounded-lg` icon block on the left and a `min-w-0` text block on the right. Value is the primary heading; label is uppercase muted below. Missing values render as `—` (em dash).

#### `MatchReasonCard` — `components/job-details/MatchReasonCard.tsx`
File: `components/job-details/MatchReasonCard.tsx`
Last updated: 2026-09-03

| Property | Class |
| --- | --- |
| Background | `bg-surface` |
| Border | `border border-border` |
| Border radius | `rounded-2xl` |
| Text — primary | `text-text-primary` (body `text-[14px] leading-6`) |
| Text — secondary | `text-text-secondary` (label `text-[12px] font-medium leading-4 tracking-wide uppercase`) |
| Spacing | `p-6`, `gap-2` (icon + label), `mt-3` (body) |
| Accent usage | `text-accent` (Sparkles icon) |

**Pattern notes:** Server component. Single section with `Sparkles` icon + uppercase "AI Match Reasoning" label, then the GPT-4o reasoning paragraph. Empty-state fallback `"No reasoning available yet."` when `matchReason` is empty.

#### `SkillsCard` — `components/job-details/SkillsCard.tsx`
File: `components/job-details/SkillsCard.tsx`
Last updated: 2026-09-03

| Property | Class |
| --- | --- |
| Background | `bg-surface` (card), `bg-success-lightest` (matched pill), `bg-accent-muted` (gap pill) |
| Border | `border border-border` (card) |
| Border radius | `rounded-2xl` (card), `rounded-full` (pills) |
| Text — primary | `text-text-primary` (subhead `text-[14px] font-medium leading-5`) |
| Text — secondary | `text-text-secondary` (section label `text-[12px] font-medium leading-4 tracking-wide uppercase`) |
| Accent usage | `text-success-foreground` (matched pill), `text-accent` (gap pill) |

**Pattern notes:** Server component. Two stacked groups — "You have" (matched, `bg-success-lightest`/`text-success-foreground` with `Check`) and "Gap skills" (missing, `bg-accent-muted`/`text-accent` with `X`). `flex flex-wrap gap-2` for pills. Each group only renders if its array is non-empty; if both are empty, renders the muted fallback "No skill breakdown available yet."

#### `JobDescriptionCard` — `components/job-details/JobDescriptionCard.tsx`
File: `components/job-details/JobDescriptionCard.tsx`
Last updated: 2026-09-03

| Property | Class |
| --- | --- |
| Background | `bg-surface` (card, iframe), `bg-surface-secondary` (iframe wrapper) |
| Border | `border border-border` (card, iframe wrapper) |
| Border radius | `rounded-2xl` (card), `rounded-lg` (iframe wrapper) |
| Text — primary | `text-text-primary` (body `text-[14px] leading-6`, heading `text-[16px] font-semibold leading-6`) |
| Text — secondary | `text-text-secondary` (icon, fallback hint) |
| Text — muted | `text-text-muted` (empty state `text-[14px] leading-5`) |
| Spacing | `p-6`, `gap-2` (icon + heading), `mt-3` (body, toggle), `mt-4` (iframe wrapper) |
| Hover state | `hover:text-accent-dark` (toggle) |
| Accent usage | `text-accent` (Show full description / Hide full description toggle, fallback link) |

**Pattern notes:** Client component. Renders the Adzuna `about_role` snippet first (clamped via `useLayoutEffect` if it actually overflows 6 lines on the current card width — measurement against `bodyRef.current.scrollHeight` vs `lineHeight * 6`). Below the body is a `Show full description` / `Hide full description` toggle (with a rotating `ChevronDown` icon) that expands an inline `<iframe src={externalApplyUrl}>` inside a `rounded-lg border border-border overflow-hidden` wrapper. The iframe is `min-h-[600px]`, has `referrerPolicy="no-referrer"`, and is sandboxed (`allow-same-origin allow-scripts allow-forms` — no `allow-top-navigation` to prevent clickjacking). Iframe-load detection: on `onLoad` the component tries to read `contentDocument.body.innerText`; if it's empty or throws (cross-origin) the fallback panel renders instead. Fallback: muted copy "This site doesn't allow embedding." with an `Open full description in new tab` `text-accent` link to the same `externalApplyUrl`. **The iframe is the supported path for the full description — Adzuna's `redirect_url` 302-redirects to the actual ATS page; the browser follows the redirect naturally, but `X-Frame-Options`/`Content-Security-Policy: frame-ancestors` may block embedding on some sites (the fallback handles this).** Empty description renders a muted "No description available for this role." line.

#### `CompanyResearchCard` — `components/job-details/CompanyResearchCard.tsx`
File: `components/job-details/CompanyResearchCard.tsx`
Last updated: 2026-09-03

| Property | Class |
| --- | --- |
| Background | `bg-surface` (card, button), `bg-surface-secondary` (icon block), `bg-accent-light` (Tech Stack pills, "Your Edge" highlight block) |
| Border | `border border-border` (card, icon block), `border-t border-border` (separator above empty/dossier), `border border-accent-light` (Your Edge highlight) |
| Border radius | `rounded-2xl` (card), `rounded-lg` (icon block, highlight block), `rounded-full` (pills) |
| Text — primary | `text-text-primary` (heading `text-[16px] font-semibold leading-6`, dossier paragraphs `text-[14px] leading-6`, "No research yet" `text-[16px] font-semibold leading-6`) |
| Text — secondary | `text-text-secondary` (subhead, button label, dossier sub-labels) |
| Text — muted | `text-text-muted` (sources `text-[12px] leading-4 break-all`) |
| Spacing | `p-6`, `gap-2` (heading row), `gap-4` (heading + button), `gap-6` (dossier blocks), `mt-3` (empty state heading), `mt-1` (helper), `py-8` (empty state) |
| Hover state | `hover:bg-accent-dark` would apply when the button is enabled (Feature 13) |
| Accent usage | `text-accent` (Briefcase icon, dossier sub-labels), `bg-accent text-accent-foreground` (Research Company button — disabled in this feature) |

**Pattern notes:** Server component. Header row has the section heading on the left and the "Research Company" primary button on the right; `border-t border-border` separates the header from the content below. Content is either the empty state (default — `Building2` icon, "No research yet" heading, helper text) or the dossier renderer (9 fields: companyOverview, techStack, culture, whyThisRole, yourEdge, gapsToAddress, smartQuestions, interviewPrep, sources — see `build-plan.md:354-366` for the data shape). Each dossier sub-block is a `DossierBlock` helper with uppercase label + content. The "Your Edge" block has an `accent-light/accent-muted` highlight per the build plan. The Research Company button is intentionally `disabled` in Feature 12 — Feature 13 wires the agent and removes the disabled state.

#### `ApplyButton` — `components/job-details/ApplyButton.tsx`
File: `components/job-details/ApplyButton.tsx`
Last updated: 2026-09-03

| Property | Class |
| --- | --- |
| Background | `bg-accent` (button), `bg-surface` (empty fallback card) |
| Border | `border border-border` (empty fallback card) |
| Border radius | `rounded-2xl` (button, empty fallback card) |
| Text — primary | `text-accent-foreground` (button `text-[14px] font-medium leading-5`) |
| Text — muted | `text-text-muted` (empty fallback `text-[14px] leading-5`) |
| Spacing | `px-6 py-4` (button), `p-6` (empty fallback), `gap-2` (icon + label) |
| Hover state | `hover:bg-accent-dark` (button) |
| Accent usage | `bg-accent text-accent-foreground` (button) |

**Pattern notes:** Server component. Full-width primary button (`w-full`) with `ExternalLink` icon + label `"Apply Now at {company}"`. Opens `externalApplyUrl` in a new tab (`target="_blank" rel="noopener noreferrer"`). When `externalApplyUrl` is empty, renders a muted card "No apply link available for this role." instead.

#### `JobDetailsPage` — `app/find-jobs/[id]/page.tsx`
File: `app/find-jobs/[id]/page.tsx`
Last updated: 2026-09-03

| Property | Class |
| --- | --- |
| Background | `bg-background` (page) |
| Border | `border-border` (via child cards) |
| Border radius | `rounded-2xl` (child cards) |
| Text — primary | `text-text-primary` (back link hover) |
| Spacing | `py-12` (page container), `px-8` (page container), `gap-6` (form stack) |

**Pattern notes:** Server Component. Reads `params: Promise<{ id: string }>` (Next 16 async params), fetches one row from `jobs` via `createInsforgeServer().database.from("jobs").select("*").eq("id", id).maybeSingle()`, then maps through `mapJobRow()` (handles nullable DB columns). On any error or missing row → `notFound()`. Layout mirrors `app/find-jobs/page.tsx`: `mx-auto max-w-[1440px] px-8 py-12` outer, `mx-auto w-full max-w-[1080px] flex flex-col gap-6` content column (matches the profile column width). Auth gate is handled by `proxy.ts` (`/find-jobs/*` already covered). Mounts `Navbar isAuthed activePath="/find-jobs"` + `Footer` + `<PageviewTracker path="/find-jobs/{id}" />`. Renders the sections in this order: `BackLink` → `JobHeaderCard` → `InfoCardsRow` → `MatchReasonCard` → `SkillsCard` → `JobDescriptionCard` → `CompanyResearchCard` → `ApplyButton`. `infoCardsRow` values use `formatJobType()` (`lib/jobs-format.ts` — `fulltime` → `Full-time`, empty → `—`) and `formatRelative()` (from the same module — same logic as `app/find-jobs/page.tsx:20-31` was extracted into the lib for reuse).

#### `JobDetailsError` — `app/find-jobs/[id]/error.tsx`
File: `app/find-jobs/[id]/error.tsx`
Last updated: 2026-09-03

**Pattern notes:** Mirrors `app/profile/error.tsx` exactly — centered card with `AlertCircle` + heading + body + "Try again" button. Reports exception to PostHog via the same env guard (`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` + `NEXT_PUBLIC_POSTHOG_HOST`). Use for the `/find-jobs/[id]` route.

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
