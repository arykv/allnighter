import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, BedDouble, Info, RotateCcw, Sparkles, Sunrise } from 'lucide-react'
import { GRADES, papersFor, type Grade } from '@/data/papers'
import {
  PREP_OPTIONS,
  blocksIn,
  buildPlan,
  fmtMinutes,
  fmtWindow,
  type Plan,
  type Prep,
  type Session,
} from '@/lib/allnighter'
import { stepsFor, useAiPlan, type AiState } from '@/lib/aiPlan'
import { ButtonLink } from '@/components/ui/Button'
import { useLocalStorage } from '@/lib/hooks'
import { rise, stagger } from '@/lib/motion'

/**
 * Pull an all nighter.
 *
 * The whole site in one screen. Four taps — no typing if you don't want to,
 * because at 11pm on a phone in the dark typing is a tax — and then an honest
 * verdict and a plan for the hours you actually have.
 *
 * The rules from VISION.md §2 live in `lib/allnighter.ts`: never flatter, never
 * hopeless. Two things on this page exist purely to keep the first of those
 * honest, and neither should be softened:
 *
 *   - **The range, not a number.** The old version printed "marks this plan
 *     reaches", which every reader took as a score. It was coverage. Now the
 *     page prints what you can honestly expect to *score*, as a band, next to
 *     the pass mark — and says in plain words that you are not getting full
 *     marks, because you aren't and everybody knows it.
 *   - **The sleep block.** A study site telling you to stop studying is the
 *     moment this becomes worth sending to a friend. It is also just true.
 */
export default function AllNighter() {
  const [grade, setGrade] = useLocalStorage<Grade>('dpsg.an.grade', 12)
  const [subject, setSubject] = useLocalStorage<string>('dpsg.an.subject', '')
  const [when, setWhen] = useLocalStorage<string>('dpsg.an.when', '')
  const [prep, setPrep] = useLocalStorage<Prep | ''>('dpsg.an.prep', '')

  // Frozen when the plan is generated. Recomputing against a live clock would
  // quietly reshuffle the page under someone who is reading it.
  const [startedAt, setStartedAt] = useState<Date | null>(null)
  const verdictRef = useRef<HTMLHeadingElement>(null)

  const papers = useMemo(() => papersFor(grade), [grade])

  // Switching year shouldn't leave last year's paper selected underneath.
  useEffect(() => {
    if (subject && !papers.some((p) => p.slug === subject)) setSubject('')
  }, [papers, subject, setSubject])

  const plan = useMemo(
    () =>
      subject && when && prep && startedAt
        ? buildPlan(subject, when, prep as Prep, startedAt)
        : null,
    [subject, when, prep, startedAt],
  )

  // Written by a model from the plan above, and never load-bearing — see
  // lib/aiPlan.ts. If it fails the page simply doesn't mention it.
  const ai = useAiPlan(plan)

  // Send the screen reader (and the keyboard) to the answer, not back to the top.
  useEffect(() => {
    if (plan) verdictRef.current?.focus()
  }, [plan])

  const ready = Boolean(subject && when && prep)

  return (
    <div className="register mx-auto max-w-3xl px-4 pt-12 pb-8 pl-5 sm:px-6 sm:pl-16">
      <AnimatePresence mode="wait">
        {!plan ? (
          <motion.div key="ask" exit={{ opacity: 0, y: -8 }}>
            <Ask
              grade={grade}
              setGrade={setGrade}
              papers={papers}
              subject={subject}
              setSubject={setSubject}
              when={when}
              setWhen={setWhen}
              prep={prep}
              setPrep={setPrep}
              ready={ready}
              onSubmit={() => setStartedAt(new Date())}
            />
          </motion.div>
        ) : (
          <motion.div
            key="plan"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Result
              plan={plan}
              ai={ai}
              verdictRef={verdictRef}
              onReset={() => setStartedAt(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* --- Asking --------------------------------------------------------------- */

/** 10:30 am is when nearly every CBSE paper starts. */
const PAPER_HOUR = '10:30'

function isoFor(daysAhead: number) {
  const d = new Date()
  d.setDate(d.getDate() + daysAhead)
  const [h, m] = PAPER_HOUR.split(':')
  d.setHours(Number(h), Number(m), 0, 0)
  // datetime-local wants local time with no zone, which `toISOString` won't give.
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function Ask(p: {
  grade: Grade
  setGrade: (g: Grade) => void
  papers: ReturnType<typeof papersFor>
  subject: string
  setSubject: (s: string) => void
  when: string
  setWhen: (s: string) => void
  prep: Prep | ''
  setPrep: (p: Prep) => void
  ready: boolean
  onSubmit: () => void
}) {
  const quick = [
    { label: 'Tomorrow', iso: isoFor(1) },
    { label: 'Today', iso: isoFor(0) },
    { label: 'Day after', iso: isoFor(2) },
  ]

  return (
    <>
      <p className="eyebrow">Tomorrow's exam?</p>
      <h1 className="mt-2 text-4xl sm:text-5xl">
        Let's <span className="marked">survive it</span>.
      </h1>
      <p className="text-muted mt-4 max-w-xl text-[15px] leading-relaxed">
        Four taps. You'll get an honest read on where you stand — including what you're realistically
        going to score, which is not full marks — and a plan for the hours you actually have rather
        than the hours on the clock.
      </p>

      {/* 1 — year */}
      <fieldset className="mt-10">
        <legend className="eyebrow mb-3">Which year</legend>
        <div className="flex flex-wrap gap-2">
          {GRADES.map((g) => (
            <Chip key={g} selected={p.grade === g} onClick={() => p.setGrade(g)}>
              Class {g}
            </Chip>
          ))}
        </div>
      </fieldset>

      {/* 2 — subject */}
      <fieldset className="mt-8">
        <legend className="eyebrow mb-3">Which paper</legend>
        <div className="flex flex-wrap gap-2">
          {p.papers.map((paper) => (
            <Chip
              key={paper.slug}
              selected={p.subject === paper.slug}
              onClick={() => p.setSubject(paper.slug)}
            >
              {paper.subject}
            </Chip>
          ))}
        </div>
        {p.grade === 11 && (
          <p className="text-faint mt-3 max-w-lg text-xs leading-relaxed">
            Class 11 isn't a board exam, so nobody can tell you what "always comes up" — your school
            sets the paper. The unit weightage below is CBSE's own, from the 2025–26 curriculum, and
            schools set to it.
          </p>
        )}
      </fieldset>

      {/* 3 — when */}
      <fieldset className="mt-8">
        <legend className="eyebrow mb-3">When is it</legend>
        <div className="mb-2.5 flex flex-wrap gap-2">
          {quick.map((q) => (
            <Chip key={q.label} selected={p.when === q.iso} onClick={() => p.setWhen(q.iso)}>
              {q.label}, 10:30 am
            </Chip>
          ))}
        </div>
        <label className="text-faint block text-xs" htmlFor="an-when">
          Or pick the exact time
        </label>
        <input
          id="an-when"
          type="datetime-local"
          value={p.when}
          onChange={(e) => p.setWhen(e.target.value)}
          className="surface border-line hover:border-line-strong focus:border-[var(--mark)] mt-1.5 h-12 w-full max-w-xs rounded-[6px] border px-3 text-[15px] transition-colors focus:outline-none"
        />
      </fieldset>

      {/* 4 — prep */}
      <fieldset className="mt-8">
        <legend className="eyebrow mb-3">How much have you done</legend>
        <p className="text-faint mb-3 max-w-lg text-xs leading-relaxed">
          Answer this one honestly. Everything below it is computed from your answer, so rounding
          yourself up here only produces a plan you can't follow.
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          {PREP_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => p.setPrep(o.value)}
              aria-pressed={p.prep === o.value}
              // Two lines of text make a two-line accessible name read as one
              // run-on phrase. Saying it once, properly, is kinder.
              aria-label={`${o.label} — ${o.sub}`}
              className={`min-h-[3.5rem] rounded-[6px] border p-3.5 text-left transition-colors ${
                p.prep === o.value
                  ? 'border-[var(--mark)] bg-[var(--mark)]/10'
                  : 'surface border-line hover:border-line-strong'
              }`}
            >
              <span className="block text-[14px] font-medium">{o.label}</span>
              <span className="text-muted mt-0.5 block text-[12px] leading-snug">{o.sub}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <button
        type="button"
        disabled={!p.ready}
        onClick={p.onSubmit}
        className="bg-[var(--mark)] mt-10 inline-flex h-12 items-center gap-2 rounded-[6px] px-6 text-[15px] font-medium text-[#241703] transition-[filter,transform] hover:brightness-108 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40"
      >
        Pull an all nighter
        <ArrowRight className="size-4" aria-hidden />
      </button>
      {!p.ready && <p className="text-faint mt-3 text-xs">Pick all four and the plan appears.</p>}

      <p className="text-faint mt-8 max-w-xl text-xs leading-relaxed">
        No account, no sign-in, nothing to install. Your answers are worked out in your browser and
        remembered only on this device, so the page is already filled in next time. The one thing
        that leaves is the subject and the unit list, sent so the plan can be written for you — never
        anything that identifies you.
      </p>
    </>
  )
}

function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`min-h-11 rounded-[6px] border px-3.5 py-2 text-[14px] font-medium transition-colors ${
        selected
          ? 'border-[var(--mark)] bg-[var(--mark)]/10 text-[var(--text)]'
          : 'surface border-line text-muted hover:border-line-strong'
      }`}
    >
      {children}
    </button>
  )
}

/* --- Answering ------------------------------------------------------------ */

function Result({
  plan,
  ai,
  verdictRef,
  onReset,
}: {
  plan: Plan
  ai: AiState
  verdictRef: React.RefObject<HTMLHeadingElement | null>
  onReset: () => void
}) {
  const { paper, verdict } = plan
  const study = plan.sessions.filter((s) => s.kind === 'day' || s.kind === 'tonight')
  const sleep = plan.sessions.find((s) => s.kind === 'sleep')
  const morning = plan.sessions.find((s) => s.kind === 'morning')

  return (
    <section aria-labelledby="an-verdict">
      {/* Same figure as the one in the numbers strip below. Rounding it to
          "32 hours" here while the strip said "31h 33m" read as two different
          measurements of the same thing. */}
      <p className="eyebrow">
        Class {paper.grade} {paper.subject} · {fmtMinutes(plan.clockMinutes)} away
      </p>
      <h1
        id="an-verdict"
        ref={verdictRef}
        tabIndex={-1}
        className={`mt-2 text-3xl sm:text-4xl ${verdict.tone === 'brutal' || verdict.tone === 'none' ? 'text-pen' : ''}`}
      >
        {verdict.headline}
      </h1>
      <p className="text-muted mt-4 text-[15px] leading-relaxed">{verdict.body}</p>

      <p className="border-[var(--mark)]/50 bg-[var(--mark)]/[0.06] mt-5 rounded-[6px] border-l-2 px-4 py-3 text-[14px] leading-relaxed">
        <span className="eyebrow mr-2">The job</span>{' '}
        {verdict.objective}
      </p>

      <AiOpening ai={ai} />

      <Numbers plan={plan} />

      <Expectations plan={plan} />

      {/* The plan itself, session by session — because "six hours" spread over
          three days and "six hours" tonight are not the same instruction. */}
      {study.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl">The plan</h2>
          <p className="text-muted mt-2 text-[15px] leading-relaxed">
            In order. The order is by marks per hour of effort, not by the order of the textbook and
            not by what you feel like starting with — those two are the usual ways a night before
            goes wrong.
          </p>

          <div className="mt-6 space-y-8">
            {study.map((s) => (
              <SessionCard key={s.id} plan={plan} session={s} ai={ai} />
            ))}
          </div>

          <p className="text-faint mt-6 text-[12px] leading-relaxed">
            The shortest block here is {fmtMinutes(shortestBlock(plan))}. That isn't generosity with
            your time — a chapter you have never read does not happen in twenty minutes, and a plan
            that pretends otherwise is a list, not a plan.
          </p>
        </div>
      )}

      {sleep && <SleepCard session={sleep} />}
      {morning && !plan.morningIsStudy && <MorningCard plan={plan} session={morning} />}

      <Dropped plan={plan} />

      <AiBeforeYouGoIn ai={ai} />

      <div className="mt-12 flex flex-wrap gap-2.5">
        {paper.guideSlug && (
          <ButtonLink to={`/guide/${paper.guideSlug}`} size="sm" variant="mark">
            The full {paper.subject} guide
          </ButtonLink>
        )}
        <ButtonLink to={`/chapters/class-${paper.grade}`} size="sm" variant="secondary">
          NCERT chapters
        </ButtonLink>
        <ButtonLink to="/strategy#solve-dont-watch" size="sm" variant="secondary">
          Solve, don't watch
        </ButtonLink>
        <button
          type="button"
          onClick={onReset}
          className="text-muted hover:text-[var(--text)] inline-flex min-h-11 items-center gap-1.5 rounded-[5px] px-3 text-[13px] font-medium transition-colors"
        >
          <RotateCcw className="size-3.5" aria-hidden />
          Change something
        </button>
      </div>
    </section>
  )
}

/**
 * The AI label.
 *
 * Said plainly rather than sold. A student is entitled to know which sentences
 * on this page came out of a model and which came out of a spreadsheet, and on
 * a site whose whole argument is "the numbers here are checkable" that line has
 * to be visible — the numbers are never the model's, and this is what says so.
 */
function AiTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-mark inline-flex items-center gap-1.5 font-mono text-[10px] font-medium tracking-[0.12em] uppercase">
      <Sparkles className="size-3" aria-hidden />
      {children}
    </span>
  )
}

function AiOpening({ ai }: { ai: AiState }) {
  if (ai.status === 'loading') {
    return (
      <p className="text-faint mt-5 flex items-center gap-2 text-[13px]">
        <Sparkles className="size-3.5 animate-pulse" aria-hidden />
        Working out what to actually do in each block…
      </p>
    )
  }
  if (ai.status !== 'ready' || !ai.data.opening) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="surface border-line mt-5 rounded-[6px] border p-4"
    >
      <AiTag>Written for your plan</AiTag>
      <p className="mt-2 text-[15px] leading-relaxed">{ai.data.opening}</p>
      <p className="text-faint mt-2.5 text-[12px] leading-relaxed">
        This part is written by AI from the plan below. Every number on this page — the hours, the
        marks, the pass mark — is worked out by the site, not by the model, which is never asked to
        do arithmetic.
      </p>
    </motion.div>
  )
}

function AiSteps({ steps }: { steps: string[] | null }) {
  if (!steps?.length) return null

  return (
    <div className="border-[var(--mark)]/40 mt-2.5 border-l-2 pl-3">
      <AiTag>In this block</AiTag>
      <ol className="mt-1.5 space-y-1">
        {steps.map((t, i) => (
          <li key={t.slice(0, 24)} className="text-muted flex gap-2 text-[13px] leading-relaxed">
            <span className="text-faint shrink-0 font-mono text-[11px] tabular">{i + 1}.</span>
            {t}
          </li>
        ))}
      </ol>
    </div>
  )
}

function AiBeforeYouGoIn({ ai }: { ai: AiState }) {
  if (ai.status !== 'ready' || !ai.data.beforeYouGoIn.length) return null

  return (
    <section className="mt-12" aria-labelledby="an-lastly">
      <h2 id="an-lastly" className="text-lg">
        The last stretch, before you walk in
      </h2>
      <ul className="mt-3 space-y-2">
        {ai.data.beforeYouGoIn.map((t) => (
          <li key={t.slice(0, 24)} className="text-muted flex gap-2.5 text-[14px] leading-relaxed">
            <span className="text-mark mt-2 size-1 shrink-0 rounded-full bg-current" aria-hidden />
            {t}
          </li>
        ))}
      </ul>
    </section>
  )
}

const shortestBlock = (plan: Plan) =>
  plan.blocks.reduce((n, b) => Math.min(n, b.minutes), Number.POSITIVE_INFINITY)

/**
 * The three numbers, and the gap between the first two is the point.
 *
 * Clock hours are what a student counts when they decide they have time. Study
 * hours are what those hours are worth once breaks and the hour of the night
 * are taken off. Seeing 12h become 4h is usually the moment the plan starts
 * being believed.
 */
function Numbers({ plan }: { plan: Plan }) {
  const total = plan.studyMinutes + (plan.morningIsStudy ? 0 : plan.morningMinutes)

  return (
    <div className="border-line-strong mt-8 grid gap-x-8 gap-y-4 border-y py-5 sm:grid-cols-2">
      <div>
        <p className="flex items-baseline gap-2.5">
          <span className="font-display text-mark text-3xl font-bold tabular">
            {fmtMinutes(total)}
          </span>
          <span className="eyebrow">of real work</span>
        </p>
        <p className="text-muted mt-1.5 text-[13px] leading-relaxed">
          Out of {fmtMinutes(plan.clockMinutes)} on the clock. The difference is breaks, meals,
          getting to the hall, and the fact that an hour at 3am is not an hour at 9pm.
        </p>
      </div>
      <div>
        <p className="flex items-baseline gap-2.5">
          <span className="font-display text-3xl font-bold tabular">
            {plan.expected.low}–{plan.expected.high}
          </span>
          <span className="eyebrow">out of {plan.paper.theoryMarks}, realistically</span>
        </p>
        <p className="text-muted mt-1.5 text-[13px] leading-relaxed">
          A range, not a promise — the paper you get matters too. Pass mark is {plan.passMark}.
          {plan.atRisk ? ' The bottom of that range is below it.' : ' You are clear of it.'}
        </p>
      </div>
    </div>
  )
}

/**
 * Expectations, in plain words.
 *
 * This block is the whole reason the file was rewritten. Everything else on the
 * page is advice; this is the part that stops a student reading the advice as a
 * guarantee, and it is worth more than any of the scheduling.
 */
function Expectations({ plan }: { plan: Plan }) {
  const pct = Math.round((plan.expected.high / plan.paper.theoryMarks) * 100)
  const points: string[] = []

  points.push(
    `You are not getting full marks, and nothing on this page is going to. The best case here is about ${pct}% of the written paper — one night does not undo a year, and anyone telling you otherwise is selling a course.`,
  )

  if (plan.droppedMarks > 0) {
    points.push(
      `${plan.droppedMarks} of the ${plan.paper.theoryMarks} marks are in units this plan never reaches. They are listed by name further down, on purpose. You will still pick up a few of them from objective questions and general reading, and that is already counted in the range above.`,
    )
  }

  if (plan.paper.internalMarks > 0) {
    points.push(
      `The ${plan.paper.internalMarks} ${plan.paper.grade === 12 ? 'practical or internal' : 'internal'} marks are separate and nothing tonight changes them. CBSE also wants 33% of the written paper on its own — a full practical does not rescue a failed theory paper.`,
    )
  }

  points.push(
    'Following a plan is not the same as the plan working. If a block overruns, take the time out of the next block rather than out of sleep — the order matters more than the timings.',
  )

  return (
    <section className="mt-10" aria-labelledby="an-expect">
      <h2 id="an-expect" className="flex items-center gap-2 text-lg">
        <Info className="text-mark size-4 shrink-0" aria-hidden />
        Before you start — what this will and won't do
      </h2>
      <ul className="mt-3 space-y-2.5">
        {points.map((t) => (
          <li key={t.slice(0, 28)} className="text-muted flex gap-2.5 text-[14px] leading-relaxed">
            <span className="text-mark mt-2 size-1 shrink-0 rounded-full bg-current" aria-hidden />
            {t}
          </li>
        ))}
      </ul>
    </section>
  )
}

function SessionCard({ plan, session, ai }: { plan: Plan; session: Session; ai: AiState }) {
  const blocks = blocksIn(plan, session.id)

  return (
    <div>
      <div className="border-line flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b pb-2">
        <h3 className="text-[17px]">{session.label}</h3>
        <p className="text-faint font-mono text-[11px] tabular">
          {fmtWindow(session)} · {fmtMinutes(session.studyMinutes)} of work
        </p>
      </div>

      {session.capped && (
        <p className="text-faint mt-2 text-[12px] leading-relaxed">
          Capped at six hours. There are more hours in the day than that, but there aren't more good
          ones — planning eleven and doing five is how a week of revision quietly becomes a week of
          feeling behind.
        </p>
      )}

      {blocks.length === 0 ? (
        <p className="text-muted mt-3 text-[14px] leading-relaxed">
          Nothing new here. By this point the plan has covered what it can reach, so this is for
          going back over the blocks above — and for stopping earlier than you think you should.
        </p>
      ) : (
        <motion.ol
          initial="hidden"
          animate="show"
          variants={stagger(0.05)}
          className="mt-3 space-y-2.5"
        >
          {blocks.map((b, i) => (
            <motion.li
              key={`${b.unit.n}-${i}`}
              variants={rise}
              className="surface border-line flex gap-4 rounded-[6px] border p-4"
            >
              <span className="surface-2 border-line-strong text-mark grid size-7 shrink-0 place-items-center rounded-full border font-mono text-[11px] font-medium">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                  <h4 className="text-[15px]">
                    {b.unit.name}
                    {b.continued && <span className="text-faint text-[13px]"> — carry on</span>}
                  </h4>
                  <span className="text-mark font-mono text-[12px] tabular">
                    {fmtMinutes(b.minutes)} · {b.unit.marks} marks
                  </span>
                </div>

                <p className="mt-2 text-[13px] leading-relaxed">
                  <span className="surface-2 border-line text-muted mr-2 inline-block rounded-[4px] border px-1.5 py-0.5 font-mono text-[10px] tracking-wide uppercase">
                    {b.depth.label}
                  </span>{' '}
                  <span className="text-muted">{b.depth.detail}</span>
                </p>

                {/* A unit split across two sittings shows its steps once. */}
                {!b.continued && <AiSteps steps={stepsFor(ai, b.unit.n)} />}

                {b.partial && (
                  <p className="text-pen mt-2 text-[13px] leading-relaxed">
                    You will not finish this one. It's here because getting part of a big unit beats
                    getting all of nothing — start at the beginning and stop when the time is up.
                  </p>
                )}

                <p className="text-faint mt-2 text-[13px] leading-relaxed">{b.unit.asked}</p>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      )}
    </div>
  )
}

/** The most important block on the page. Do not soften it into a suggestion. */
function SleepCard({ session }: { session: Session }) {
  const isNap = session.clockMinutes < 90

  return (
    <div className="border-[var(--mark)]/50 bg-[var(--mark)]/[0.06] mt-8 flex gap-3 rounded-[6px] border-l-2 px-4 py-4">
      <BedDouble className="text-mark mt-0.5 size-4 shrink-0" aria-hidden />
      <div>
        <p className="text-[15px] font-medium">
          {fmtWindow(session)} — {isNap ? 'nap' : 'sleep'} for {fmtMinutes(session.clockMinutes)}.
          Seriously.
        </p>
        <p className="text-muted mt-1.5 text-[14px] leading-relaxed">
          {isNap
            ? 'Twenty-odd minutes, alarm set, lying down rather than at the desk. It is not enough to feel rested and it is still worth more than the same twenty minutes of reading — you have to be able to hold a question in your head for three hours tomorrow.'
            : session.clockMinutes <= 100
              ? 'One full sleep cycle. Waking at the end of a cycle rather than out of the middle of one is most of the difference between short sleep that helps and short sleep that hurts, which is why this is ninety minutes and not sixty.'
              : 'This is not padding. Past about this point another hour of revision is worth less than being able to think in the hall, and you cannot write a five-marker on four hours of sleep. Set an alarm and stop.'}
        </p>
      </div>
    </div>
  )
}

/**
 * The morning is the best study time in the whole window and the easiest to
 * lose. It is deliberately not scheduled with new material — a chapter met at
 * 7am on exam day does not survive to 10:30, it just displaces something that
 * would have.
 */
function MorningCard({ plan, session }: { plan: Plan; session: Session }) {
  const first = plan.blocks.slice(0, 3).map((b) => b.unit.name)

  return (
    <div className="surface border-line mt-4 flex gap-3 rounded-[6px] border p-4">
      <Sunrise className="text-mark mt-0.5 size-4 shrink-0" aria-hidden />
      <div>
        <p className="text-[15px] font-medium">
          {fmtWindow(session)} — {fmtMinutes(session.studyMinutes)} in the morning, revision only.
        </p>
        <p className="text-muted mt-1.5 text-[14px] leading-relaxed">
          Nothing new goes here. These are the best hours you have and they are for making last
          night stick: {first.length ? first.join(', ') : 'whatever you did last night'} — then the
          formula sheet, then the first section of any past paper you can find. If you find yourself
          opening a chapter you have not seen before, close it.
        </p>
      </div>
    </div>
  )
}

function Dropped({ plan }: { plan: Plan }) {
  if (!plan.dropped.length && !plan.unpreppable.length) return null

  return (
    <div className="mt-12 space-y-8">
      {plan.dropped.length > 0 && (
        <section aria-labelledby="an-dropped">
          <h2 id="an-dropped" className="text-lg">
            Not doing this time — on purpose
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {plan.dropped.map((u) => (
              <span
                key={u.n}
                className="surface-2 border-line text-faint rounded-[5px] border px-2.5 py-1 text-[13px] line-through"
              >
                {u.name} · {u.marks}
              </span>
            ))}
          </div>
          <p className="text-muted mt-3 text-[13px] leading-relaxed">
            Deciding this now is the whole point. A night before fails by running out of time halfway
            through something that mattered, because nobody ever chose what to skip — a chosen loss
            costs you those marks, an unchosen one costs you those marks plus the twenty minutes you
            spent panicking about them.
          </p>
        </section>
      )}

      {plan.unpreppable.length > 0 && (
        <section aria-labelledby="an-unprep">
          <h2 id="an-unprep" className="text-lg">
            Not on the plan because there is nothing to revise
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {plan.unpreppable.map((u) => (
              <span
                key={u.n}
                className="surface-2 border-line text-muted rounded-[5px] border px-2.5 py-1 text-[13px]"
              >
                {u.name} · {u.marks}
              </span>
            ))}
          </div>
          <p className="text-muted mt-3 text-[13px] leading-relaxed">
            Unseen passages. There is no content to learn — only a technique to use on the day:
            answer in the words of the passage wherever the question allows it, and keep one-mark
            answers to one line. Those marks are already counted in the range at the top, because
            pretending you'll score nothing on them would be as dishonest as pretending you'll get
            them all.
          </p>
        </section>
      )}
    </div>
  )
}
