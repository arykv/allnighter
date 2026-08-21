# All Nighter — product direction

Settled 28 July 2026, between Aryan and Claude, working from
`All_Nighter_Strategy_Vision.md`. This supersedes that draft wherever they
disagree — and they disagree in several important places.

`HANDOVER.md` is the technical state of the repo. **This file is why.** When the
two conflict, this one is newer.

---

## 1. Positioning

> **All Nighter isn't where you study all year. It's where you go when you didn't.**

Rejected: *"the operating system for CBSE students."* It's startup language, it
demands infinite breadth, and it fights the one question that governs this
project — *does this save a stressed student time?*

The positioning above is defensible precisely because **no coaching company can
honestly say it.** PW, Vedantu and Unacademy are built on long-term subscription
engagement; "you can survive this in one night" destroys their model. Aryan
scored 95.2% and 92.8% as a last-minute studier, twice. That asymmetry is the
entire moat, and it is not clonable.

### The governing principle

> **Don't become broader. Become deeper.**

Own one emotional moment completely: the student who has just realised the exam
is tomorrow and needs someone trustworthy. Expansion means going deeper into the
CBSE exam machine, not sideways into more boards.

---

## 2. The signature experience — "Pull an all nighter"

The strategy draft listed nine features: *How Cooked Am I · Can I Still Score
90 · Need 33 Marks · Panic Meter · Marks Predictor · Survival Kit Generator · If
You Only Have 2 Hours · Emergency Revision Mode · Last Night Planner.*

**They are all one feature.** Every one takes *(what you've got, how long you've
got)* and returns *(an honest verdict, a plan)*. Nine names would be nine
shallow toys on a Tools page. Build one thing instead.

The brand name becomes the verb. One button:

```
Tomorrow's exam?  Let's survive it.
[ Pull an all nighter → ]
```

Three questions — **three taps, not three text fields.** At 11pm on a phone in
the dark, typing is a tax:

| Question | Interaction |
|---|---|
| Which paper? | Tap a subject chip |
| When is it? | Pre-filled from the CBSE date sheet, one tap to confirm |
| How prepared are you? | Three honest options, not a slider |

Then the site empties out: countdown, hour-by-hour plan to the exam, and *inside
that plan* the chapters, formula sheets, PYQs and videos for those hours.
Nothing else on screen.

### Three rules for the verdict

1. **Never flatter.** If they're cooked, say cooked. The credibility of this
   entire site is that it doesn't lie about marks — that has to hold here too.
2. **Never hopeless.** Brutal about the situation, never about the person. There
   is always a plan, even if the plan is small.
3. **Never promise a night it cannot deliver.** Added 30 Jul 2026, at Aryan's
   insistence, and it is the same rule as (1) applied to the plan rather than to
   the verdict.

### On (3) — what "realistic" cost us, and why it was worth it

The first build of `/tonight` was honest in its *wording* and dishonest in its
*arithmetic*. It divided the hours to the exam by the marks in the paper, which
meant:

- a chapter could take fifteen minutes,
- twelve hours on the clock counted as twelve hours of work,
- and the number at the top — "marks this plan reaches" — was **coverage**, which
  every single reader will read as a score they are going to get.

None of that is a rounding error. A student who follows a plan built on it runs
out of night somewhere in the middle and concludes they are the problem. That is
the opposite of what this page is for.

So the page now says, in plain words on the results screen, all of the following:

> **You are not getting full marks, and nothing on this page is going to.**
> One night does not undo a year, and anyone telling you otherwise is selling a
> course.

…followed by the marks in units the plan never reaches, the fact that internal
marks are untouchable, and the reminder that CBSE wants 33% of the *written*
paper on its own. The headline figure is a **range** sitting next to the pass
mark, because for a lot of people opening this at 1am the pass mark is the actual
question and nobody else will say the number out loud.

**This makes the product look worse and trust it more.** A student who has done
nothing in Chemistry is told, correctly, to expect somewhere in the teens out of
70 — below the pass mark — and the plan's stated objective changes from "a
percentage" to "clear 23". That is a real outcome, it is worth having, and it is
the only version of this feature that survives contact with a real night.

**The best moment on the page is now a refusal.** Past roughly 2:45am there is no
usable night left, and the verdict becomes *"Stop. Go to sleep, and do this in
the morning"* — with the morning becoming the study block. A study site that
tells you to shut the book and set an alarm is the thing a student screenshots.
Do not soften it, and do not let a later "optimisation" hand those hours back.

### Class 11 was never a decision, it was an accident

`/tonight` only knew Class 12 because the planner read `guides.ts`, and Class 12
is the only year with a written guide behind it. Nobody chose to exclude half the
school; it fell out of where the data happened to live. Fixed 30 Jul 2026 —
paper shape now lives in `papers.ts`, separately from the analysis of it.

The honesty rule is different for Class 11 and must stay different: **it is not a
board exam.** CBSE publishes the syllabus and the weightage, schools set the
paper to it, and therefore nobody can tell a Class 11 student what "always comes
up". Class 11 copy describes what is in a unit and what it is worth. It never
predicts a paper.

### The sleep recommendation is the most important part

A study site telling you to stop studying and go to bed is the moment a student
screenshots it and sends it to a friend. It is also just true. Do not soften it
into a suggestion.

---

## 2b. Answering "why would I use this?" on the front door

Added 30 Jul 2026, because the home page never answered it. A student landing
here already has Google, ChatGPT, a WhatsApp group and four coaching apps — all
free, all with more content than this will ever have. "Notes and resources" is
not a reason to stay; every one of those does that.

So the second thing on the home page is now the question in the student's own
words — *"Why use this when everything is already free somewhere?"* — and five
answers, each one something the alternatives **structurally cannot say**:

1. **It decides.** At 11pm you don't need another PDF, you need someone to say
   what to open first and when to stop.
2. **It tells you what you'll actually score.** Not "you can still get 90".
3. **Every number comes from CBSE**, and the build fails if it stops adding up.
4. **I show you my own papers, including the bad one.** 183 pages.
5. **Nothing is locked, and you never make an account** — no sign-up, no app, no
   "unlock the full plan", including for the parts that could obviously have
   been charged for.

A subscription business cannot say (1) or (5) and survive, and nobody else has
(4) at all. That is the whole argument, and it now takes ten seconds to read
rather than four clicks to discover.

**The header line stopped saying "Delhi Public School · Gandhinagar."** It was
the first line on the page, and to a CBSE student in any other school it read as
*this is not for you* before they had seen a single thing the site does. It now
reads "CBSE · Classes 10 to 12 … Unofficial · one student, no company". The
school is still on `/about`, which is where someone asking who wrote this will
actually look — the honesty is unchanged, the false narrowing is gone.

*(Still open, and his call: `/day` and the bell-timing widget in the hero are
genuinely DPS-Gandhinagar-only, and they hold prime space on a page now aimed at
every CBSE student.)*

## 3. Moderation is the front door, not a feature

The strategy draft listed "moderation evidence" as one bullet among eleven. It is
the only unclonable, search-winnable asset this project owns. Nobody else in
India has both documents and thought to line them up.

`/results` ships the evidence: **+9 marks across five papers, 91.0% → 92.8%,
three subjects matching exactly.**

The pillar it opens — **"what actually happens to your paper after you hand it
in"** — is the highest-priority content on the roadmap. It is unowned, it answers
high-anxiety queries with no authoritative answer anywhere (`is cbse moderation
real`, `does cbse give grace marks`), and it is *reassuring*, which is the
emotional job this site does.

Material already in hand from the Computer Science script: the barcode, the QR
stamp on every page, the examiner's green ticks and red circles, the "Blank Page"
stamps, the rough-work page, the OSM ordering window, and the +7 on Chemistry.

---

## 4. Answer sheets — decided, and it reverses the earlier plan

**There is no paywall. There was never going to be a working one.**

| | |
|---|---|
| **Free, all five subjects** | The analysis — annotations, why each mark was awarded, why marks were lost, how he'd answer it today, what moderation did |
| **Free, published in full** | The scans themselves, redacted |

**Reversed again, 28 Jul 2026, and Aryan was right.** Both of us had argued the
scans should stay private. His counter: *"otherwise how will students trust me"* —
evidence nobody can look at isn't evidence. `/paper` makes a lot of claims about
what CBSE does to a paper, and a skeptical student had only our word for them.

**All five scripts are up in full** at `/paper/script/:slug` — 183 pages.
Only three things are covered, and all three identify the
*script* rather than the candidate: the page-1 barcode, the cover's office-use
block (QR plus IDEN/BAG/CHK), and the scanning centre's per-page stamp.
Handwriting, marks, ticks, crosses and corrections are untouched — covering those
would defeat the purpose.

The no-paywall part stands and is not revisitable: it contradicted *"everything
essential stays free"*, and a paywall on a static site is cosmetic anyway —
anything under `public/` is fetchable by URL. Nobody was going to buy 35 pages of
someone else's handwriting. What changed is only whether the scans are published,
not whether they're sold. They are not sold.

This supersedes HANDOVER.md §8's "Computer Science free in full, the other four
paywalled."

**Every page of anything published here must be looked at individually.** That
is not a formality — it caught three separate problems the verifier passed
clean on: the first CS run boxed three chunks of a real answer; the CS-era
filter matched up to twelve of Physics's blue mark chips per page; and English's
skewed scans left the stamp on two pages. Each would have been shipped by
automation alone.

**Privacy checks complete for all five** — 183 pages inspected 28 Jul 2026, plus
the CS cover QR decoded (`817445528`, the same barcode already printed as text on
page 1). No name, no roll number, no parents' names, no DOB anywhere in any of
them. That is what made publishing them possible.

The source PDFs still stay out of git; what ships is the redacted render under
`public/script/`, produced by `scripts/redact.py`. That script re-runs QR
detection over its own output at two scales and exits non-zero if anything still
decodes, so a bad render fails the build rather than reaching the site.

---

## 5. What we don't build

**No AI chatbot. No AI answer evaluator.** Students already have ChatGPT, Gemini,
Claude and Perplexity free in their pocket, and all four are better than anything
we'd ship. It saves zero time versus what they have, it costs money per query on
a project with ₹0 revenue, and one confidently wrong answer burns the only asset
we own. Our advantage is curation, honesty and knowing what a student actually
needs — not intelligence.

> **Narrowed, 30 Jul 2026 — Aryan's call.** The two sentences above still stand:
> there is no chatbot and no evaluator, and there should never be one. What was
> added is much smaller and sits inside a surface we already own.
>
> `/tonight` decides *which* units and *for how long*. It could never say what to
> physically do in a ninety-minute block on Electrochemistry, and that is the
> gap a student actually feels. `api/plan.ts` fills it: given the paper, the
> preparation level and the scheduled units, a model writes the steps.
>
> Three rules make this consistent with the paragraph above rather than a
> reversal of it, and none of them is optional:
>
> 1. **The model writes; it never computes.** Every number a student sees — the
>    hours, the marks, the expected range, the pass mark — is rendered from the
>    deterministic plan. The prompt forbids the model from stating any number at
>    all. A wrong figure on this site must always be findable in a TypeScript
>    file.
> 2. **It is additive, never load-bearing.** Every failure path is silent. The
>    plan is complete and useful with the AI switched off, and a student at 1am
>    is never told that a service they did not ask for is unavailable.
> 3. **It is labelled.** The page says which paragraphs a model wrote, next to
>    the note that the numbers are not its work. On a site whose argument is
>    "these claims are checkable", hiding that would cost more than the feature
>    is worth.
>
> This is also why it is not a chatbot: the endpoint accepts a paper slug, a
> prep level and unit numbers, all validated against `papers.ts`. There is no
> free-text field, so it cannot be used as a general-purpose model relay — which
> is the security property *and* the reason it stays a study tool rather than
> drifting into being a worse ChatGPT.

**No parent section.** A tab written for parents collides with a voice built on
*"I've been through this."* Instead: **one printable page, no tab.** The student
sends it to their mum. That makes it a gift the student gives rather than a room
the site keeps — and unlike a tab, it travels through family WhatsApp.

**No school-ambassador programme yet.** Build the product first and see whether
students want to contribute. Don't engineer a community before product-market
fit.

---

## 6. Notes stay handwritten, wrapped in HTML

A handwritten note's value *is* the handwriting; converting it to a webpage
destroys what made it worth having. But PDF-only is invisible to Google.

So each note gets a page that carries: **a summary, the topics covered, quick
navigation, and a download button** — with the handwritten document as the
primary content. Authenticity intact, discoverability fixed.

(Currently moot: Uday's 8 handwritten PDFs are archived to `archive/notes/` and
off the site. This is the pattern to apply when notes return.)

---

## 7. Email — 5 to 10 a year, every one earning its place

No newsletter. Nobody reads a newsletter. Send only:

- The OSM ordering window opening — **and closing**
- Date sheet released
- A major new moderation article
- A significant new calculator
- A new printable revision kit

This is the one email a CBSE student genuinely wants, it's time-critical, nothing
else on the internet does it well, and **it returns every year on its own.** Frame
every capture on the site as deadline alerts, never as "subscribe".

---

## 8. Voice

Useful is the floor. Memorable is the goal. The small moments are what students
remember:

> *"You're medium rare."*
> *"Go sleep. Seriously."*
> *"You've done enough for tonight."*
> *"Drink some water."*

Honest, warm, never a motivational poster. Never *"wake up at 5 AM."* Always
*"I've already been through this, here's exactly what you need."*

Imperfection builds trust: his worst paper, the methods that failed, the marks
that were bad. Keep publishing those.

---

## 9. Growth

**The link preview is the product.** For most WhatsApp impressions the OG card is
the entire experience. One generic sitewide image is leaving the single cheapest
win on the table — per-page cards carrying a *number* (*"+9 marks. CBSE
moderation is real."*) will outperform any feature here for an afternoon's work.

Distribution: Google, WhatsApp, Reddit, friends. Never advertising. The target
sentence is *"bro, just use All Nighter"* — which is why the flagship feature is
named so that the sentence says itself.

---

## 10. Sequence

Traffic before features. **The site currently has no Search Console submission at
all** — building experiences for zero visitors is malpractice.

> **Sequencing decision, 28 Jul 2026:** SEO and Search Console wait until the
> site is content-complete. Aryan's call — submitting an unfinished site is
> worth less than submitting a finished one, and it is his fifteen minutes to
> spend when he chooses. Recorded here so it stops being raised.

### Wave 0 — unglamorous, highest ROI, days not weeks
- ~~Kill the duplicate `dps-gandhinagar.in` copy~~ — **done.** See HANDOVER §8.
- ~~Per-page OG images~~ — **done.** Every route renders its own card at build
  time, leading with a number where there's an honest one.
- Search Console + sitemap — **blocked on Aryan's Google login.** Everything on
  our side is ready; the exact steps are in HANDOVER §8.
- Rename the repo to `allnighter` — last, so a rename can't disturb Vercel's Git
  connection while there's still work shipping.

### Wave 1 — the moat
- ~~`/results`~~ — **shipped.** Both marksheets plus the moderation receipt.
- ~~"What happens to your paper after you hand it in"~~ — **shipped** at
  `/paper`. The journey, the anatomy of the booklet, the full transcribed
  question-wise marks summary, and six lessons. Its best moment is arithmetic:
  the unasterisked rows total 68, exactly the printed total, which turns the
  footnote from a claim into a proof.
- ~~The scripts themselves~~ — **Computer Science, Physics and Chemistry are
  published in full** at `/paper/script/:slug`, 105 pages between them, every
  page inspected individually first.
- Still to do: Mathematics (43 pages) and English scripts. Each needs its pages
  inspected one by one before anything is generated — that step is not optional
  and it is what caught the one real mistake.
- Still to do: the per-question walkthrough — what was asked, what he wrote,
  what the examiner did to it, how he'd answer it today. That one needs Aryan,
  not just the document.

### Wave 1b — subject guides *(the positioning Aryan articulated)*

> *"Free content is available, but it's scattered. I've put it all together with
> in-depth analysis."*

Curation as the product, not content as the product. **Physics and Chemistry are
live** at `/guide/:slug`. Rules that make them worth trusting are in
`src/data/guides.ts`: weightage must come from CBSE and is asserted at build
time to sum to 70, no channel goes in unverified, and where a source doesn't
settle something the page says so rather than filling the gap.

The unclonable half of each guide comes from his own script, not the web — the
half-mark findings, the question that scored zero. The web only supplies
weightage and paper structure, which every coaching site already has. **So do
the script before the guide for each remaining subject.**

All five shipped. Each was much better for having read its script first —
that ordering is the rule, not a preference.

### Wave 2 — the signature
~~Pull an all nighter~~ — **shipped** at `/tonight`, and it leads the home page.

Three taps, no typing. Ranks units by **marks per minute**, not raw marks —
which needed an `effort` field on Unit, because ranking by marks alone dropped
Biomolecules first, the exact opposite of what the Chemistry guide advises.
Names what it drops out loud. Tells you to sleep, with a number.

The two rules in `lib/allnighter.ts` are not stylistic and must survive any
edit: **never flatter, never hopeless.**

> ⚠️ **Content dependency, not yet costed.** The experience promises important
> chapters, formula sheets, PYQs and last-minute videos *per subject*. Today the
> site has NCERT chapter links and channel recommendations — no formula sheets,
> no PYQs, no ranking of which chapters actually matter. The shell is a few days'
> work and would be empty.
>
> **So: do one subject completely before widening.** Pick the highest-anxiety,
> highest-volume paper, build it end to end, prove the experience is worth
> having, then repeat. Five shallow subjects is the failure mode.

### Wave 3 — the loop
- ~~Wall charts~~ — **shipped** at `/print`. Three A3 charts (Physics formulae,
  Maths formulae, organic conversions), print-styled rather than PDFs so they
  stay editable and weigh nothing.
- ~~The parent one-pager~~ — **shipped** at `/print/for-parents`. Deliberately
  not a tab; a single sheet the student hands on.
- **Deadline alerts — a decision, not a task.** It needs an email backend, and
  "no uploads, no database" is a standing rule. Decide the rule before building
  the feature.

### Wave 4 — only if 1–3 land
Pre-orders · contributors · other boards

---

## 13. Where it actually got to, 28 Jul 2026

Everything in waves 0–3 that survives this document's own philosophy is built
and live. 30 prerendered routes.

| | |
|---|---|
| The flagship | `/tonight` — three taps, honest verdict, plan ranked by marks per minute |
| The moat | `/results`, `/paper`, and all five scripts at `/paper/script/:slug` — 183 pages |
| Curation | Five guides at `/guide/:slug`, weightage asserted at build time |
| Off-screen | Three wall charts and the parent page at `/print` |
| Utility | 395 NCERT chapters, 7 calculators, strategy, resources, school day |

**Open, and each for a stated reason:** SEO/Search Console (deferred by Aryan
until the site was done — it now is); deadline-alert emails (needs a backend
decision first); printed-kit pre-orders (needs April 2027).

---

## 11. The tension to decide consciously, not drift into

The moat is **one person's honest voice with receipts.** Phase 3 of the strategy
draft was *more schools, more boards, ambassadors.*

These are in direct opposition. Fifty contributors and one honest voice cannot
coexist — scale the contributors and *"here's my worst paper"* becomes *"here's
our content,"* which is the moment the trust evaporates.

Current call: **a small permanent authority over a big generic platform.** Expand
by depth, not breadth.

Open and worth answering early: Aryan is class of 2026. Who runs this in 2028,
and does the voice survive the handover?

---

## 12. Revenue

**Changed 30 Jul 2026 — Aryan's call, and it reverses the "₹0 for now" stance.**
The site is to carry **ads**, and the "free forever / no ads / no business
model" language is to come out of the copy. That language was doing real work in
the pitch, so removing it is not cosmetic and is recorded here rather than
quietly done.

What was true before and is still true:

- **Nothing is paywalled.** Not the planner, not the guides, not the 183 pages of
  answer scripts. Ads pay for the site; a reader never does. This is the line
  that must not move — the moment a student hits "unlock", the positioning in §1
  is dead.
- **No affiliate links, no sponsorship, no paid mentions.** `/books` still says
  so on the page. An ad slot is a rented rectangle that everybody recognises as
  an advert; a recommendation that has been bought is a lie about a book. Those
  are not the same thing and the second one is still banned.
- **Physical objects remain the better long-term line**: printed revision kits,
  flashcards, wall charts, planners. Ads are what the site can earn *now*.

What this cost, and it is worth being honest about it: *"no ads"* was reason 5
of the five on the front door, and one of only two that a coaching company
structurally cannot copy. Reason 5 is now "nothing is locked", which is weaker
but still true and still unusual.

### The blocker, which is the same one as always

**Google AdSense requires the account holder to be 18.** Aryan is 17 until
April 2027 — the identical constraint that blocks every Indian payment gateway.
An account in his own name will be rejected, and an account that misstates age
risks the payouts being withheld later, which is a worse outcome than waiting.

The legitimate route is a **parent or guardian's AdSense account**, with their
PAN and bank details, and the site declared under it. That is a conversation with
his parents, not a task in this repo.

What is done on the site's side, and was needed regardless: the "no ads" claims
are gone, and `/privacy` exists and discloses third-party advertising cookies —
Google will not approve a site without that page.

## 12b. What the model is allowed to touch

See §5. The short version: it writes prose inside `/tonight` and it is never
asked to compute, never load-bearing, and always labelled.
