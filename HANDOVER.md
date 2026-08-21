# All Nighter — handover

Everything a new session needs to pick this up. Rewritten 30 July 2026, after
the build that took the site from 10 routes to 30.

> **Read `VISION.md` first.** This file is the *state*. That one is the *why* —
> the positioning, the things we deliberately don't build, and the decisions that
> were reversed and why. When they conflict, `VISION.md` is authoritative.

---

## 1. The essentials

| | |
|---|---|
| Live | <https://allnighter.in> |
| Repo | `github.com/arykv/allnighter` (renamed from `dpsg_notes` 28 Jul 2026; old URLs redirect) |
| Local | `~/Documents/dpsg-notes` — note the directory name never changed |
| Hosting | Vercel, project `allnighter` under `arykvs-projects`, auto-deploys from `main` |
| Old domain | `dps-gandhinagar.in` — GitHub Pages, orphan `legacy-domain` branch, one `noindex` page. See §7 |
| Build | `tsc --noEmit && vite build && vite build --ssr … && node scripts/prerender.mjs` |
| Output | 31 prerendered routes, ~11 MB (5.5 MB of that is answer-script images) |

**Deploy = push to `main`.** He checks the live site, so deploy after each
meaningful change.

---

## 2. Who it's for and by

**Aryan Rao Kaveti**, Class of 2026, DPS Gandhinagar (Ambapur).

**Born 03/04/2009 — 17 until April 2027.** This blocks every Indian payment
gateway (18+ with PAN) *and* Amazon Associates. Don't plan revenue features
around him signing up for anything.

### His results — verified against the real marksheets

**Class 12, 2026 — 92.8%**

| Subject | Theory | Prac/IA | Total |
|---|---|---|---|
| Computer Science | 68 | 30 | 98 |
| English Core | 76 | 20 | 96 |
| Mathematics | 71 | 20 | 91 |
| Physics | 60 | 30 | 90 |
| Chemistry | 59 | 30 | 89 |

**Class 10, 2024 — 95.2%** (best of five, Hindi dropped)

| Subject | Theory | Prac/IA | Total |
|---|---|---|---|
| Computer Applications | 48 / 50 | 50 / 50 | 98 |
| Social Science | 76 / 80 | 20 / 20 | 96 |
| Science | 75 / 80 | 20 / 20 | 95 |
| Mathematics | 74 / 80 | 20 / 20 | 94 |
| English | 73 / 80 | 20 / 20 | 93 |
| Hindi | 69 / 80 | 20 / 20 | 89 (not counted) |

Note: Maths and English Class 12 theory are out of **80**; Physics, Chemistry
and CS out of **70**. Practicals differ accordingly.

**The Class 10 table was wrong on the site until 30 Jul 2026** — it stored each
subject *total* in the theory column with internals at zero, which claimed he had
written a 98-mark Computer Applications paper. Two things were wrong:

1. Five of six subjects are **80 theory + 20 internal**, and he got the full 20
   in every one. So part of every number in that column was school-marked, not
   earned in a hall.
2. **Computer Applications is CBSE code 165, a skill subject: 50 theory + 50
   practical**, not 80 + 20. The 98 is **48 + 50**. Confirmed by Aryan against
   the document — do not "correct" it back to 78 + 20.

`results.ts` now carries `theoryMax`/`internalMax` per subject and asserts at
build time that they sum to 100 and that no mark exceeds its maximum.
`theoryPercentage()` publishes the same result on the **written papers only** —
**90.3%** (Class 12) and **93.5%** (Class 10). Both marksheets show it. It costs
about two points in each year and it is the reason the headline number is worth
anything.

### The moderation evidence — the project's whole foundation

His evaluated answer scripts (OSM) versus the marksheet:

| Subject | Script | Marksheet | Change |
|---|---|---|---|
| Chemistry | **52** | 59 | **+7** |
| Physics | **58** | 60 | **+2** |
| Mathematics | 71 | 71 | 0 |
| Computer Science | 68 | 68 | 0 |
| English Core | 76 | 76 | 0 |

Three exact matches prove the script's "Total Marks" field really *is* the
marksheet's theory column — which is what makes the other two readable.
**+9 marks total: 91.0% → 92.8%.**

**A second finding, from adding the question-wise marks up by hand.** On four of
five scripts the individual marks sum exactly to the printed total. Chemistry
sums to **51.5** and prints **52**. Chemistry is also the only paper with an
*odd* number of half-marks (11, against Physics 10, English 4, Maths 2, CS 0) —
so a fractional total is rounded up *before* moderation. Chemistry's real
journey is **51.5 → 52 → 59**.

Half-mark counts per script are in `src/data/results.ts` (`HALF_MARKS`).

---

## 3. Hard constraints

### Privacy — never publish

- Roll numbers: `11611774` (Class 12), `11112965` (Class 10)
- Parents' names: Indu Rao Kaveti, Kaveti Laxminarayana Rao
- Date of birth: 03/04/2009

Marksheets are **rebuilt as components** from the numbers, never screenshotted —
see `src/components/Marksheet.tsx`, which names the withheld fields on the page
because saying so *is* the trust signal.

The answer scripts are different: they contain none of the above. CBSE's own
instructions forbid writing your name, roll number or school in an answer, which
is why publishing them was possible at all. See §6.

### Design — he rejected the first attempt as "looks AI generated"

That version was near-black canvas, one mint accent, a radial glow blob and a
faint grid. **Do not drift back toward it.** The approved direction is an Indian
school register:

- Bottle-green *ground* (not black); warm paper in light mode
- Faint horizontal ruling on a 30px rhythm across the whole page
- One red margin line down the left of the content column (`.register`)
- Marigold is the marking colour — used only for what is live *now*
- Type: Bricolage Grotesque (display) / Archivo (UI) / Azeret Mono (data)
- Light = notebook page. Dark = register cover.

Tokens live in `src/index.css`. Motion vocabulary in `src/lib/motion.ts` — two
springs (`snap`, `settle`) and one ease. Use them; don't hand-roll.

### Contrast — the tokens are the lightest values that pass, so re-check any edit

Every foreground token clears **WCAG AA (4.5:1)** against all three backgrounds
it can land on: `--canvas`, `--surface`, `--surface-2`. This was not true until
30 Jul 2026 — light mode ran `--text-faint` at **3.4:1**, and `--text-faint`
carries `.eyebrow`, which is 10px mono caps. Small text in a pale colour is
precisely what a tired student at 1am cannot read.

`--mark` and `--mark-text` are **two different marigolds on purpose**:

- `--mark` (light `#bd7a1f`) is the **fill** — buttons, rules, the highlighter
  swipe. The contrast that matters is the dark text sitting *on* it.
- `--mark-text` (light `#96590c`) is the same hue taken darker so it can be a
  link on paper. `.text-mark` uses this one; never the fill.

On the dark board the fill is already light enough, so both point at `mark-400`.
One value for both is what forced the original into a shade too pale to read and
too dark to feel like a highlighter.

### Accessibility

`SectionHead` takes `level={1}` when it *is* the page title. Until this existed
**24 of the then-30 routes shipped with no `<h1>` anywhere in them**, because on
almost every page the first `SectionHead` is the page title — and it looks
identical either way, which is why nobody noticed. All 31 routes now have exactly
one `h1`, no skipped heading levels, no unlabelled controls, no duplicate ids.

`MotionConfig reducedMotion="user"` sits at the root of `App.tsx`. The
`prefers-reduced-motion` block in `index.css` only reaches *CSS* animation, and
every entrance here is a JS-driven spring — without the MotionConfig the setting
did nothing on the pages that move most.

There is no axe in the toolchain. The check that found all of the above is a
throwaway Python pass over `dist/**/index.html` looking for: missing `h1`,
multiple `h1`, skipped heading levels, `<button>`/`<a>` with no accessible name,
`<img>` without `alt`, inputs with no label, and duplicate ids. Worth re-running
after any structural change — it takes seconds and it caught 25 real issues.

### Standing product rules

- **No uploads, no database.** He killed a scoped Supabase flow. Contributions
  come by email to `dpsgnotes@gmail.com`. *(This is what blocks deadline-alert
  emails — see §8.)*
- **No AI chatbot, no AI evaluator.** Still true. What exists is a *writer*
  inside `/tonight` that never computes and is never load-bearing — the rules it
  has to keep are in `VISION.md` §5, and they are not style preferences.
- **Links, not re-hosting**, for NCERT and outside material.
- **Nothing gets paywalled.** Ads pay for the site; a reader never does. This is
  the line that must not move.
- **No affiliate links, no sponsorship, no paid mentions, ever.** `/books` says
  so on the page. An ad slot is a rented rectangle everyone recognises; a bought
  recommendation is a lie about a book. Only the first is allowed.

---

## 4. What's built — all 30 routes

**The flagship**
- `/tonight` — *Pull an all nighter.* Four taps (**year**, subject chip, datetime,
  preparation), then an honest verdict and an hour-by-hour plan. Logic in
  `src/lib/allnighter.ts`; ranks units by **marks per minute**, names what it's
  dropping, and tells you to sleep with a number.

  **Rewritten 30 Jul 2026 to be realistic.** The first version divided the hours
  to the exam by the marks in the paper. That produced fifteen-minute chapters,
  treated twelve hours of clock as twelve hours of work, and printed a coverage
  figure that every reader took for a score. What it models now:

  | | |
  |---|---|
  | Clock ≠ study | `studyMinutesBetween` walks the real hours: ten minutes' break per hour, and a quality curve by hour of night (3–5am is worth 0.45, the morning after sleep 1.05). Twelve hours on the clock becomes about four of work, and the page shows both numbers next to each other |
  | A unit has a floor | `MIN_BLOCK` — 45 min from scratch, 30 half-known, 20 revising. A unit that doesn't fit is **dropped by name**, never given a token quarter hour |
  | Coverage ≠ marks | `BASELINE`/`CONVERSION` per prep level. The headline is a **range**, next to CBSE's pass mark (`floor(0.33 × theory)` — 23/70, 26/80, the board's own figures) |
  | The night has a shape | Sessions: day(s) → tonight → **sleep** → morning. Morning is revision-only. Past ~2:45am there is no usable night and the verdict becomes *"Stop. Go to sleep, and do this in the morning"* — then the morning becomes the study time |
  | Multi-day | More than one night out, whole days are capped at **six effective hours** and labelled. Over a week out the verdict says this isn't an all nighter yet |
  | Unpreppable marks | `Unit.unpreppable` — unseen passages. Listed, never scheduled, and counted in the range at 60% |

  **The `depth` label must stay prep-aware.** It was density-only at first and
  told a student who had ticked "basically nothing" *"You know this one. Don't
  re-read it"* about a 45-mark Python unit. Time-per-mark says how deep a block
  can go; only `prep` says what depth *means* to the person reading it.

**Class 11 — `src/data/papers.ts`**

`/tonight` used to know only Class 12, because it read `guides.ts` and that is
the only year with a written guide. Class 11 papers now live in `papers.ts`;
Class 12 papers are **derived** from `GUIDES` so weightage still has exactly one
home. Every Class 11 number was read out of CBSE's own 2025–26 curriculum PDFs
under `cbseacademic.nic.in/web_material/CurriculumMain26/SrSec/` — Physics 70
(23/17/20/10, CBSE's own four marked blocks, *not* split further because CBSE
doesn't publish per-unit figures inside them), Chemistry 70 (nine units),
Maths 80 (23/25/12/8/12), English Core 80 (26/23/31), CS 70 (10/45/15).

Class 11 unit copy says what is *in* a unit and what it is *worth*, and never
claims to know what gets asked — it is not a board exam and the school sets the
paper. Keep that distinction.

**The moat — unclonable, and the reason to trust everything else**
- `/results` — both marksheets as components, plus the moderation receipt
- `/paper` — what happens to your paper after you hand it in
- `/paper/script/:slug` — **all five scripts, 183 pages**: `computer-science`,
  `physics`, `chemistry`, `mathematics`, `english`

**Curation**
- `/guide` + `/guide/class-12-{physics,chemistry,maths,english,computer-science}`
- `/books` — three books worth buying, and Maths where you should buy nothing

**The AI layer — `api/plan.ts` + `src/lib/aiPlan.ts`**

The only place this site talks to a model. `/tonight` schedules *which* units and
*for how long*; this writes what to physically do inside each block, plus an
opening paragraph and a last-stretch list.

| | |
|---|---|
| Key | `GEMINI_API_KEY`, set on the `allnighter` Vercel project in all three environments. Server-side only — never `VITE_`-prefixed, or it ships to the browser |
| Models | **`gemini-flash-lite-latest` first**, `gemini-flash-latest` second. Aliases, never pinned versions — Google retires those. Lite answers in ~1.1s measured; flash returned 503 "high demand" on every attempt across two sessions, and asking it first is what made the first production call die with `FUNCTION_INVOCATION_TIMEOUT`. Do not add `thinkingConfig.thinkingBudget: 0` — lite rejects it with a 400 |
| Budget | 8s per attempt, two attempts, `maxDuration: 30` in `vercel.json`. Vercel's default is 10s, which is less than one slow Gemini call |
| Contract | The model **writes; it never computes.** The prompt forbids it from stating any number at all, and every figure on the page is rendered from the deterministic plan |
| Abuse | The endpoint takes a paper slug, a prep level, and unit numbers — all validated against `papers.ts`. **There is no free-text field**, so it cannot be used as a general-purpose Gemini relay. That is the defence; there is no auth to add on a site with no accounts |
| Failure | Every path is silent. `useAiPlan` resolves to `off`, and the plan renders exactly as it would with the AI disabled. It must stay that way |
| Caching | **It is a `GET`, and that is load-bearing.** It started as a `POST` carrying `s-maxage=86400`, which did nothing whatsoever — CDNs do not cache POST, so every plan ever generated was a paid call. As a cacheable GET the same request costs one call a day globally |
| Cardinality | Block length goes in the query as one letter (`s`/`m`/`l`), never as minutes. The prompt only ever needed "short/moderate/long", and minutes would have made nearly every URL unique, defeating the cache. `src/lib/aiPlan.ts` does the bucketing |
| Rate limit | Per-IP, 15 a minute, in module scope — checked *after* validation, so malformed floods cost nothing. Not a global quota (that needs the database this project doesn't have); it exists to stop one caller in a loop turning a warm instance into a billing incident |

`vercel.json`'s SPA catch-all is scoped `/((?!api/).*)` so it cannot swallow the
function.

**The handler must be a named method export (`export async function GET`),
never a default export.** Vercel's Node runtime reads `export default` as the old
`(req, res) => void` signature and *ignores the value it returns*. A
web-standard `(Request) => Response` handler exported as default does not throw
— it runs, builds a correct Response, returns it into the void, and the request
hangs until it is killed at `maxDuration`. It surfaces as
`FUNCTION_INVOCATION_TIMEOUT`, which sends you hunting for a slow upstream that
is not slow. The only place this is visible is the runtime log line
*"WARN: default export returned a `Response`"* — `vercel inspect` will not show
it.

**The function cannot import from `src/`.** Vercel transpiles `api/plan.ts` to
`api/plan.js` and emits *nothing it imports from outside `api/`* — so
`import ... from '../src/data/papers'` typechecks, builds locally, passes every
local probe, and then dies at cold start in production with
`ERR_MODULE_NOT_FOUND /var/task/src/data/papers`. Local success proves nothing
here. `scripts/build-api-papers.mjs` generates `api/_papers.js` from
`papers.ts` instead, so the weightage still has exactly one home; the output is
plain `.js` and is committed as well as regenerated by `npm run build`.

**`vercel.json` is schema-validated and rejects unknown keys.** A `"_comment"`
added inside a rewrite object failed the whole deployment before the build
command ever ran — the give-away is `Builds . [0ms]` in `vercel inspect`, and
neither `vercel logs` nor `--logs` will tell you why. JSON has no comments;
explanations for that file belong here instead.

**Analytics and ads**

- `@vercel/analytics/react` — note `/react`, **not** `/next`. Vercel's setup page
  hands you the Next.js import by default and this is a Vite SPA, where that
  entry point does not exist.
- `/privacy` documents everything that leaves the device. It is also a hard
  AdSense prerequisite — Google rejects sites with no such page.
- **AdSense is blocked on age**, not on code: the account holder must be 18 and
  Aryan is 17 until April 2027. See VISION §12.

**Off-screen**
- `/print` + `/print/{physics-formulae,maths-formulae,organic-conversions,for-parents}`

**Utility (pre-existing)**
- `/` `/library` `/library/:id` `/chapters/class-{10,11,12}` `/tools` (7
  calculators) `/strategy` `/resources` `/day` `/about`

---

## 5. Architecture

```
src/
  data/     results · guides · papers · script · paper · print · books
            resources · subjects · ncert(.json) · links · channels
            schedule · strategy · tools · legacy-routes · types
  lib/      allnighter (the plan) · aiPlan (the writer) · search (Fuse) · marks · seo
            hooks · motion · theme · schedule-store · format · cn
  components/  Marksheet · PeriodBar · ResourceCard · CommandPalette
               RouteErrorBoundary · layout/ · ui/
  routes/   Home · AllNighter · Guide · Script · Paper · Results · Print
            Books · Library · Viewer · Chapters · Resources · Tools
            SchoolDay · Strategy · About · NotFound
  entry-server.tsx
api/
  plan.ts           the only call to Gemini — see §4
scripts/
  prerender.mjs     renders routes → HTML, sitemap, JSON-LD, OG cards
  og.mjs            per-page Open Graph card generation
  og-assets/        pinned static fonts + glyph metrics + OFL licences
  redact.py         answer-script redaction, self-verifying
  build-ncert.py    regenerates ncert.json from ncert.nic.in
```

**Five build-time assertions guard the data.** They fail the build rather than
publish something wrong, and that's deliberate:

1. `guides.ts` — unit weightage must sum to the paper total (70/70/80/80/70).
   Coaching sites copy each other's typos and students plan their week on it.
2. `papers.ts` — same check across **both** years, plus no zero-mark units and no
   duplicate slugs. Class 11 has no guide page, so this is the only thing
   standing between a mistyped weightage and a student's plan.
3. `results.ts` — `theoryMax + internalMax` must be 100 and no mark may exceed
   its maximum. A typo here is the site claiming a mark that was never awarded.
4. `script.ts` — page numbers must be contiguous `1..n`, so captions can't drift
   out of step with the images and mislabel someone's evidence.
5. `og.mjs` — `measure()` throws on any character outside the font subset. An
   overflowing headline is invisible until someone shares it.

---

## 6. The answer scripts — how they're made

`scripts/redact.py <pdf> <outdir> <slug>` renders a script to web images and then
tries to break its own output.

**Three things are covered, nothing else:** the page-1 barcode (located by text
search, so the box is exact), the cover's office-use block (QR + IDEN/BAG/CHK),
and the scanning centre's small blue stamp on every page. All three identify the
*script*, not the candidate. Handwriting, marks, ticks, crosses and corrections
are untouched — covering those would defeat the purpose.

**The stamp filter is built from measured geometry**, not guesses: 31 correctly
detected CS stamps gave width 33–38px at 1700px, aspect 1.06–1.29, fill
0.80–0.93. The tolerances are those ranges with room either side.

**Expect exactly one box per page, except:**
- pages 3 and 4 — printed preliminaries, no stamp
- Maths pages 22–25 — bound-in graph sheets carry no stamp

Anything else means the filter needs re-checking for that subject.

### Source PDFs — in `~/Downloads`, deliberately not in git

| Subject | File | Pages |
|---|---|---|
| Computer Science | `5CB3A505-527F-49BA-B866-87C1B07A0241-2.pdf` | 35 |
| Physics | `1E6C7DA5-BF1C-49F3-99B0-637F5231BEAF.pdf` | 35 |
| Chemistry | `0DF9A2C7-1765-4F8A-BC96-70A5D5C59566.pdf` | 35 |
| Mathematics | `1D11A343-8B06-45AB-94B1-FF70D3FC6C0E.pdf` | 43 |
| English Core | `A8C772D1-B5C5-41D9-8237-9F21ACA3BAAB-2.pdf` | 35 |

Page 1 of each is real text — `page.get_text()` reads the marks summary straight
out.

### The rule that matters most

**Every page of every script was looked at individually before publishing, and
any new script must be too.** This is not a formality. It caught three separate
problems that the automated verifier passed clean:

1. The first CS run boxed **three chunks of a real answer** (blue ballpoint read
   as a stamp). Fixed by confining detection to the header band.
2. The CS-era filter matched **up to twelve of Physics's blue mark chips per
   page** — it would have blacked out the very marks the script exists to show.
   Fixed by the measured geometry above.
3. English's scans are skewed enough to put the stamp at y≈0.21, outside the
   0.20 band, so two pages shipped with it intact. Band widened to 0.27.

The verifier passed all three times. Looking at the pages is what caught them.

---

## 7. Technical gotchas — all learned the hard way

1. **Truncated PDF downloads still start with `%PDF`.** The NCERT builder must
   check for a trailing `%%EOF` and retry, or text extraction silently produces
   garbage titles.
2. **`AnimatePresence mode="wait"` with `Suspense` nested inside causes blank
   pages.** `Suspense` must wrap `AnimatePresence`, not the reverse. There's also
   a `RouteErrorBoundary`.
3. **Vite copies `public/` into every build target.** The SSR build sets
   `copyPublicDir: false` or it duplicates the whole assets folder.
4. **`renderToString` cannot await Suspense.** `entry-server.tsx` renders up to 4
   passes, checking for the skeleton, so lazy routes resolve.
5. **Radix Accordion content needs `forceMount`** or collapsed chapters are
   invisible to crawlers.
6. **Prerendered routes must exist as `dist/<route>/index.html`.** Vercel checks
   the filesystem before rewrites, so the SPA fallback only catches unprerendered
   paths.
7. **`build-ncert.py` shells out to `curl`** — this machine sits behind a
   TLS-intercepting proxy Python's cert store doesn't trust.
8. **The GitHub Pages API does not rebuild when you change the source branch.**
   `gh api -X POST repos/<owner>/<repo>/pages/builds` after any change, or the
   old deployment keeps serving. This cost real time.
9. **Polling a URL for `200` proves nothing on this site.** The SPA fallback
   returns 200 for everything. Check `content_type` or grep for expected text.
10. **OG fonts are pinned static instances**, renamed to unique families
    (`OGDisplay`, `OGSans`…) so resvg can't pick the wrong weight, and subset to
    Latin. Regenerate with `fonttools` if the type ever changes.

`dps-gandhinagar.in` was **not** merely stale — GitHub Pages was serving a stuck
deployment of the *whole site*, 404ing on every route added after it and
competing with allnighter.in for identical content. It now publishes the orphan
`legacy-domain` branch: one `noindex, follow` page, `404.html` so old deep links
land somewhere human. Edit by pushing to that branch. **Don't merge `main` into
it and don't delete its `CNAME`.**

---

## 8. What's left — three things, none of them code

1. **Google Search Console.** Never done, for either domain. Deferred by Aryan
   until the site was content-complete — it now is. Needs his Google login and a
   TXT record at the registrar. Steps: add a **Domain** property for
   `allnighter.in` (not URL-prefix), verify by TXT, submit `sitemap.xml`, then
   request indexing for `/`, `/tonight`, `/results` and `/paper` by hand.
   **Do not add `dps-gandhinagar.in` as a property** — it's deliberately
   `noindex`; adding it to get it indexed would undo the fix.

2. **Deadline-alert emails — a decision, not a task.** "Tell me when the OSM
   window opens / the date sheet drops" is the one email a CBSE student genuinely
   wants, it's time-critical, and it recurs annually. But it needs an email
   backend, and *no uploads, no database* is a standing rule. **Decide the rule
   before building the feature.**

3. **Printed kits / pre-orders.** Blocked until April 2027 (age). The wall charts
   at `/print` double as the demand test in the meantime.

**Distribution, which is his to do:** a post on r/CBSE — *"I bought my evaluated
answer sheets back and compared them to my marksheet."* Genuine contribution,
nobody else has both documents, and it has to come from him to be honest.

---

## 9. Verified YouTube channels — check before changing

**An HTTP 200 plus a plausible `og:title` is not verification.** Several dead
accounts carry exactly the expected name. Check the page for
`"doesn't have any content"`, and prefer asking Aryan.

### Class 11–12
| Subject | Channel |
|---|---|
| Physics, Chemistry | `@AshuGhai11th12th` (Ashu Ghai sir) |
| Mathematics | `@AshuGhai11th12th` (Ushank Ghai sir — same channel) |
| Chemistry (2nd) | `@NCERTWallahClass12PW` |
| English — writing | `@GrandAcad` |
| English — literature | `@EnglishClassesbyTaniyaSharma` |
| Python | `@programmingwithmosh` |
| Physics practicals | `@experientialphysics` (his own school teacher) |

### Class 10
| Subject | Channel |
|---|---|
| Science | `@AshuGhai9th10th` |
| Science (2nd) | `@Exphub` (Prashant Kirad) |
| Mathematics | `@AshuGhai9th10th` |
| Mathematics (2nd) | `@RitikMishraClass9-10`, `@PW-Foundation` |
| Social Science | `@DigrajSinghRajputOfficial` |
| Social Science (2nd) | `@SunlikeStudy` |
| English | `@StudentsHeaven` |

Umbrella: `@ScienceAndFunEducation`

### Known-wrong — do not use
`@PrashantKirad` (empty) · `@DigrajSingh` (empty) · `@UshankGhai` (empty) ·
`@ScienceandFun` (different channel) · `@NCERTWallah` (different channel) ·
`@thegrandacademy`, `@TaniyaSharma` (wrong people)

---

## 10. Working style

He moves fast, sends corrections mid-turn, and expects things built rather than
discussed. He catches wrong details and calls them out — verify before shipping,
especially anything with a name or a URL attached.

**Once he defers something, it's decided.** Record it once in the docs and stop
mentioning it. Closing four consecutive reports with "still on you: Search
Console" got exactly the response it deserved.

**He is usually right when he pushes back.** Two of the best decisions on this
project were his reversals of positions I'd argued for:

- Publishing the answer scripts. Both of us had said keep them private; his
  counter — *"otherwise how will students trust me"* — is correct, because
  evidence nobody can look at isn't evidence.
- Not selling them either. The analysis was always the product.

**Don't report after every small step when he's asked you to just finish.**

---

## 11. Archived / dormant

- **Uday's 8 handwritten PDFs** are in `archive/notes/`, off the site. Restoring
  one = move the PDF to `public/notes/` and paste its entry into `resources.ts`.
  When notes return they should get the HTML wrapper pattern in `VISION.md` §6 —
  summary, topics, quick nav, download — with the handwriting as primary content.
- **The old hand-written HTML site** is in `legacy/`, kept for history only and
  excluded from deployment via `.vercelignore`.
