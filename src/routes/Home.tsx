import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight, BookOpen, Calculator, Clock, Play, Search } from 'lucide-react'
import { PeriodBar } from '@/components/PeriodBar'
import { ResourceCard } from '@/components/ResourceCard'
import { ButtonLink } from '@/components/ui/Button'
import { Kbd, SectionHead } from '@/components/ui/primitives'
import { RECENT_RESOURCES, countBySubject, getResource } from '@/data/resources'
import { SUBJECTS } from '@/data/subjects'
import { TOOLS } from '@/data/tools'
import { NCERT_BOOKS, NCERT_CHAPTER_COUNT, booksFor } from '@/data/ncert'
import { GUIDES } from '@/data/guides'
import { useRecents } from '@/lib/hooks'
import { inView, rise, stagger } from '@/lib/motion'
import { cn } from '@/lib/cn'

export default function Home({ onOpenSearch }: { onOpenSearch: () => void }) {
  const { ids } = useRecents()
  // Returning students see what they were reading; first-timers see what's newest.
  const opened = useMemo(
    () => ids.map(getResource).filter((r): r is NonNullable<typeof r> => Boolean(r)).slice(0, 3),
    [ids],
  )
  const shelf = opened.length ? opened : RECENT_RESOURCES.slice(0, 3)
  const shelfTitle = opened.length ? 'Jump back in' : 'Added most recently'
  const shelfEyebrow = opened.length ? 'Where you left off' : 'Fresh in'

  const stocked = useMemo(
    () => SUBJECTS.filter((s) => countBySubject(s.id) > 0),
    [],
  )
  const empty = useMemo(() => SUBJECTS.filter((s) => countBySubject(s.id) === 0), [])

  return (
    <>
      <Hero onOpenSearch={onOpenSearch} />

      <WhyBother />

      <ProofStrip />

      <div className="register mx-auto max-w-6xl px-4 pl-5 sm:px-6 sm:pl-16">
        {/* Someone who has been here before gets their own shelf first. */}
        {shelf.length > 0 && (
          <motion.section
            initial="hidden"
            animate="show"
            variants={stagger(0.05)}
            className="mt-16"
          >
            <SectionHead eyebrow={shelfEyebrow} title={shelfTitle} />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {shelf.map((r, i) => (
                <ResourceCard key={r.id} resource={r} index={i} />
              ))}
            </div>
          </motion.section>
        )}

        <TakeAway />

        <QuickActions />

        {stocked.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={inView}
          variants={stagger(0.04)}
          className="mt-20"
        >
          <SectionHead
            eyebrow="The shelf"
            title="Start with a subject"
            description="Everything is filed by class and stream. Open a subject to see what’s actually there."
            action={
              <ButtonLink to="/library" variant="secondary" size="sm">
                Browse all
                <ArrowRight className="size-3.5" />
              </ButtonLink>
            }
          />

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stocked.map((s) => (
              <motion.div key={s.id} variants={rise}>
                <Link
                  to={`/library?subject=${s.id}`}
                  className={cn(
                    'group surface border-line block h-full rounded-[8px] border p-5 shadow-card',
                    'transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-line-strong',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="surface-2 text-accent grid size-10 place-items-center rounded-[6px] font-mono text-[13px] font-medium">
                      {s.code}
                    </span>
                    <span className="text-faint font-mono text-xs tabular">
                      {countBySubject(s.id)}
                    </span>
                  </div>
                  <h3 className="mt-4 text-[17px]">{s.name}</h3>
                  <p className="text-muted mt-1.5 text-[13px] leading-relaxed">{s.blurb}</p>
                  <span className="text-accent mt-4 flex items-center gap-1 text-[13px] font-medium">
                    Open
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>

          {empty.length > 0 && (
            <div className="border-line mt-4 rounded-[8px] border border-dashed p-5">
              <p className="text-sm font-medium">Still empty</p>
              <p className="text-muted mt-1.5 text-[13px] leading-relaxed">
                {empty.map((s) => s.name).join(' · ')}
              </p>
              <p className="text-faint mt-3 text-[13px]">
                If you have notes for any of these,{' '}
                <Link to="/about#contribute" className="text-mark underline underline-offset-2">
                  send them over
                </Link>{' '}
                — that&rsquo;s the whole way this fills up.
              </p>
            </div>
          )}
        </motion.section>
        )}

        {stocked.length === 0 && <NotesWanted />}

        <ChaptersCallout />

        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={inView}
          variants={stagger(0.04)}
          className="mt-20"
        >
          <SectionHead
            eyebrow="Beyond notes"
            title="Maths you shouldn’t have to do by hand"
            description={`${TOOLS.length} calculators that follow CBSE’s own rules, so the number matches the certificate.`}
            action={
              <ButtonLink to="/tools" variant="secondary" size="sm">
                Open tools
                <ArrowRight className="size-3.5" />
              </ButtonLink>
            }
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((t) => (
              <motion.div key={t.id} variants={rise}>
                <Link
                  to={`/tools#${t.id}`}
                  className="group surface border-line hover:border-line-strong block h-full rounded-[8px] border p-5 shadow-card transition-colors"
                >
                  <h3 className="text-[15px]">{t.name}</h3>
                  <p className="text-muted mt-1.5 text-[13px] leading-relaxed">{t.blurb}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <Dedication />
      </div>
    </>
  )
}

/* -------------------------------------------------------------------------- */

/**
 * The page opens the way a register does: a ruled header block with the session
 * printed on it, then the one field that matters. No slogan, no glow — the
 * search box is the product and it gets the space.
 */
/**
 * The three things nobody else has, surfaced on the front door.
 *
 * Before this the home page predated all of it — a visitor could leave without
 * ever learning that five real evaluated scripts and a documented moderation
 * receipt were sitting two clicks away. Those are the reason to trust anything
 * else here, so they go above the fold-ish, not in the footer.
 */
/**
 * The things meant to leave the screen, on the front door.
 *
 * Wall charts and the parent page are the only free-and-physical things here,
 * and they were reachable only from the footer — which is where links go to
 * die. Both are the kind of thing a student sends to someone else, which is
 * the whole distribution strategy in one row.
 */
function TakeAway() {
  const items = [
    { to: '/print', eyebrow: 'Print', title: 'Wall charts', body: 'Physics and Maths formulae and the organic conversions, on A3. The cheapest revision there is — you look at one for months without meaning to.' },
    { to: '/print/for-parents', eyebrow: 'One page', title: 'For a parent', body: 'What actually helps the night before, and what does not however kindly meant. Send it on rather than trying to explain it.' },
    { to: '/books', eyebrow: 'The shelf', title: 'What to buy', body: 'Three books worth the money, and the one subject you should buy nothing at all for. No affiliate links, ever.' },
  ]

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={inView}
      variants={stagger(0.05)}
      className="mt-20"
    >
      <SectionHead
        eyebrow="Take it with you"
        title="Things that work off the screen"
        description="All free, none of it behind an account, and all of it made to be handed to somebody else."
      />
      <div className="grid gap-3 sm:grid-cols-3">
        {items.map((i) => (
          <motion.div key={i.to} variants={rise}>
            <Link
              to={i.to}
              className="surface border-line hover:border-line-strong block h-full rounded-[8px] border p-5 shadow-card transition-[border-color,transform] duration-200 hover:-translate-y-0.5"
            >
              <p className="eyebrow">{i.eyebrow}</p>
              <h3 className="mt-2 text-[16px]">{i.title}</h3>
              <p className="text-muted mt-1.5 text-[14px] leading-relaxed">{i.body}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

/**
 * The question the site has to answer in the first ten seconds.
 *
 * A student who lands here already has Google, ChatGPT, a WhatsApp group and
 * four coaching apps, all free, all with more content than this will ever have.
 * "Notes and resources" is not a reason to stay — every one of those does that.
 * So this section says the actual reasons in the plainest words available, and
 * every one of them is something the alternatives structurally can't say: a
 * subscription business cannot tell you that you can survive this in one night,
 * and nobody else has bought their own answer scripts back and published them.
 */
function WhyBother() {
  const reasons = [
    {
      to: '/tonight',
      title: 'It decides, instead of giving you more to read',
      body: 'At 11pm you don’t need another PDF. You need someone to say what to open first, what to skip, and when to stop. Four taps gets you exactly that, in order, with the time each block gets — and AI fills in what to physically do inside each one, down to the equation to write from memory.',
      link: 'Try it',
    },
    {
      to: '/tonight',
      title: 'It tells you what you’ll actually score',
      body: 'Not "you can still get 90". A realistic range next to the pass mark, the units it can’t reach named out loud, and — when that’s the truth — the sentence that one night doesn’t undo a year.',
      link: 'See how it works that out',
    },
    {
      to: '/guide',
      title: 'Every number here comes from CBSE, not from another website',
      body: 'Unit weightage is read out of the published curriculum, and the site refuses to build if it stops adding up to the paper total. Where a source doesn’t settle something, the page says so rather than filling the gap.',
      link: 'The subject guides',
    },
    {
      to: '/paper',
      title: 'I show you my own papers, including the bad one',
      body: '183 pages of my evaluated answer scripts, exactly as CBSE returned them — the ticks, the crosses, the rough work, and the five-mark question that scored zero. Nobody advising you online does this.',
      link: 'Read the scripts',
    },
    {
      to: '/about',
      title: 'Nothing here is locked, and you never make an account',
      body: 'No sign-up, no app, no “unlock the full plan”. Every chapter, every guide, all 183 pages of my answer scripts and the whole planner are open to anyone who lands on the page — including the parts I could obviously have charged for.',
      link: 'How this is built',
    },
  ]

  return (
    <section className="border-line border-b" aria-labelledby="why-bother">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={inView}
        variants={stagger(0.05)}
        className="register mx-auto max-w-6xl px-4 py-14 pl-5 sm:px-6 sm:pl-16"
      >
        <motion.p variants={rise} className="eyebrow">
          Fair question
        </motion.p>
        <motion.h2 variants={rise} id="why-bother" className="mt-2 max-w-2xl text-3xl sm:text-4xl">
          Why use this when everything is already <span className="marked">free somewhere</span>?
        </motion.h2>
        <motion.p variants={rise} className="text-muted mt-4 max-w-xl text-[15px] leading-relaxed">
          Because it being free somewhere is the problem. It’s scattered across a syllabus PDF
          nobody opens, ten sites that copy each other, and a hundred channels — and assembling it
          is a day of work that every student repeats alone. Five reasons this is worth the tab:
        </motion.p>

        <ol className="divide-line border-line mt-8 divide-y border-t">
          {reasons.map((r, i) => (
            <motion.li key={r.title} variants={rise} className="py-5">
              <div className="flex gap-4 sm:gap-5">
                <span className="text-faint mt-1 shrink-0 font-mono text-[11px] tabular">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <h3 className="text-[17px]">{r.title}</h3>
                  <p className="text-muted mt-1.5 max-w-2xl text-[14px] leading-relaxed">{r.body}</p>
                  <Link
                    to={r.to}
                    className="text-mark mt-2.5 inline-flex items-center gap-1 text-[13px] font-medium underline-offset-4 hover:underline"
                  >
                    {r.link}
                    <ArrowRight className="size-3.5" aria-hidden />
                  </Link>
                </div>
              </div>
            </motion.li>
          ))}
        </ol>
      </motion.div>
    </section>
  )
}

function ProofStrip() {
  const items = [
    {
      to: '/results',
      stat: '+9',
      label: 'marks, across five papers',
      title: 'CBSE moderation is real',
      body: 'My evaluated scripts next to the marksheet they became. Three subjects match exactly, two gained marks — which is what makes the other two readable.',
    },
    {
      to: '/paper',
      stat: '183',
      label: 'pages, nothing left out',
      title: 'All five answer scripts, published',
      body: 'Every paper I sat, exactly as CBSE returned it. The ticks, the crosses, the blank pages, the rough work, and the five-marker that scored zero.',
    },
    {
      to: '/guide',
      stat: '5',
      label: 'subjects mapped',
      title: 'Where the marks actually are',
      body: 'Official unit weightage for every subject, what each unit really asks, and what to do first when you are short on time.',
    },
  ]

  return (
    <section className="border-line border-b">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={inView}
        variants={stagger(0.06)}
        className="register mx-auto grid max-w-6xl gap-3 px-4 py-12 pl-5 sm:px-6 sm:pl-16 lg:grid-cols-3"
      >
        {items.map((i) => (
          <motion.div key={i.to} variants={rise}>
            <Link
              to={i.to}
              className="surface border-line hover:border-line-strong block h-full rounded-[8px] border p-5 shadow-card transition-[border-color,transform] duration-200 hover:-translate-y-0.5"
            >
              <div className="flex items-baseline gap-2.5">
                <span className="font-display text-mark text-3xl font-bold tabular">{i.stat}</span>
                <span className="eyebrow">{i.label}</span>
              </div>
              <h3 className="mt-3 text-[16px]">{i.title}</h3>
              <p className="text-muted mt-1.5 text-[14px] leading-relaxed">{i.body}</p>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

function Hero({ onOpenSearch }: { onOpenSearch: () => void }) {
  const subjectCount = new Set(NCERT_BOOKS.map((b) => b.subject)).size

  return (
    <section className="border-line border-b">
      <div className="register mx-auto max-w-6xl px-4 pt-10 pb-12 sm:px-6 sm:pt-14">
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger(0.06, 0.04)}
          className="pl-5 sm:pl-16"
        >
          {/* Register header line — the kind printed at the top of a school form.
              It used to read "Delhi Public School · Gandhinagar", which is where
              this started and is still where the marksheets come from. But it is
              also the first line on the page, and to a CBSE student in any other
              school it read as "this is not for you" before they had seen a
              single thing the site does. The school is on /about, where someone
              asking who wrote this will actually look for it. */}
          <motion.div
            variants={rise}
            className="border-line text-faint flex flex-wrap items-center gap-x-4 gap-y-1 border-b pb-3 font-mono text-[10px] tracking-[0.16em] uppercase"
          >
            <span>CBSE · Classes 10 to 12</span>
            <span className="hidden sm:inline">Session 2025–26</span>
            <span className="ml-auto">Unofficial · one student, no company</span>
          </motion.div>

          <motion.h1
            variants={rise}
            className="mt-8 max-w-4xl text-[2.4rem] leading-[1.02] sm:text-[3.4rem] lg:text-[4rem]"
          >
            Tomorrow's exam? <span className="marked">Let's survive it</span>.
          </motion.h1>

          <motion.p
            variants={rise}
            className="text-muted mt-6 max-w-xl text-[15px] leading-relaxed"
          >
            This isn't where you study all year. It's where you go when you didn't. Four taps and
            you get an honest read on where you stand — including what you're realistically going to
            score, which is not full marks — a plan for the hours you actually have rather than the
            hours on the clock, and AI that writes out what to actually do in each block.
          </motion.p>

          {/* The one button the whole site is named after. */}
          <motion.div variants={rise} className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              to="/tonight"
              className="bg-[var(--mark)] inline-flex h-13 items-center gap-2 rounded-[6px] px-6 py-3.5 text-[15px] font-medium text-[#241703] transition-[filter,transform] hover:brightness-108 active:scale-[0.98]"
            >
              Pull an all nighter
              <ArrowRight className="size-4" />
            </Link>
            <span className="text-faint text-[13px]">
              Or browse — {NCERT_CHAPTER_COUNT} NCERT chapters, {GUIDES.length} subject guides,{' '}
              {TOOLS.length} calculators.
            </span>
          </motion.div>

          <div className="mt-9 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-10">
            <div>
              {/* Styled as a form field, label and all — because that's what it is. */}
              <motion.div variants={rise}>
                <p className="eyebrow mb-2">Or search everything</p>
                <button
                  onClick={onOpenSearch}
                  aria-label="Open search"
                  aria-keyshortcuts="Meta+K"
                  className={cn(
                    'surface border-line-strong group flex h-14 w-full items-center gap-3 rounded-[6px] border px-4',
                    'transition-colors duration-150 hover:border-[var(--mark)]',
                  )}
                >
                  <Search className="text-faint size-[18px] shrink-0" />
                  <span className="text-faint min-w-0 truncate text-left text-[15px]">
                    <span className="sm:hidden">Search notes, chapters, tools…</span>
                    <span className="hidden sm:inline">
                      Try “chem”, “class 11 physics”, or paste your marks
                    </span>
                  </span>
                  <span className="ml-auto hidden shrink-0 gap-1 sm:flex">
                    <Kbd>⌘</Kbd>
                    <Kbd>K</Kbd>
                  </span>
                </button>
              </motion.div>

              <motion.dl
                variants={rise}
                className="border-line mt-6 grid grid-cols-3 divide-x divide-[var(--line)] border-y"
              >
                <Stat value={String(NCERT_CHAPTER_COUNT)} label="chapters" />
                <Stat value={String(subjectCount)} label="subjects" />
                <Stat value="183" label="script pages" />
              </motion.dl>
            </div>

            <motion.div variants={rise}>
              <PeriodBar />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/**
 * The NCERT books are free and the papers are set from them, but reaching one
 * chapter normally means a government site or an ad farm. This says the number
 * out loud because the number is the argument.
 */
function ChaptersCallout() {
  if (!NCERT_CHAPTER_COUNT) return null

  const rows = ([11, 12] as const).map((grade) => {
    const books = booksFor(grade)
    return {
      grade,
      books: books.length,
      chapters: books.reduce((n, b) => n + b.chapters.length, 0),
    }
  })

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={inView}
      variants={stagger(0.05)}
      className="mt-20"
    >
      <SectionHead
        eyebrow="NCERT"
        title="Every chapter of every book, one click"
        description="Straight from ncert.nic.in — no ad walls, no sign-up, no “download” that opens three tabs. Chapter names come out of the PDFs themselves, so the list matches the rationalised syllabus."
        action={
          <ButtonLink to="/chapters/class-11" variant="secondary" size="sm">
            Open chapters
            <ArrowRight className="size-3.5" />
          </ButtonLink>
        }
      />

      <motion.div variants={rise} className="border-line divide-line divide-y border-y">
        {rows.map((r) => (
          <Link
            key={r.grade}
            to={`/chapters/class-${r.grade}`}
            className="group flex items-baseline gap-4 py-4 transition-colors hover:bg-[var(--surface-hover)]"
          >
            <span className="font-display w-24 shrink-0 text-xl font-bold">Class {r.grade}</span>
            <span className="text-muted min-w-0 flex-1 truncate text-[13px]">
              {NCERT_BOOKS.filter((b) => b.grade === r.grade)
                .map((b) => b.subject)
                .filter((v, i, a) => a.indexOf(v) === i).length}{' '}
              subjects · {r.books} books
            </span>
            <span className="text-mark shrink-0 font-mono text-sm tabular">
              {r.chapters} chapters
            </span>
            <ArrowRight className="text-faint size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </motion.div>
    </motion.section>
  )
}

/**
 * Shown while the student-notes library is empty. An honest ask reads far
 * better than fifteen subjects each labelled "still empty" — and it's the only
 * thing that actually fills the shelf.
 */
function NotesWanted() {
  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={inView}
      variants={stagger(0.04)}
      className="mt-20"
    >
      <SectionHead
        eyebrow="The shelf"
        title="This part is waiting on you"
        description="Every NCERT chapter is already here. What isn’t, yet, is the good stuff — the handwritten notes seniors actually revised from."
      />
      <motion.div variants={rise} className="border-line rounded-[8px] border border-dashed p-6">
        <p className="text-[15px] leading-relaxed">
          If you have notes worth passing down, send them in. They go up credited to you by
          name, free for everyone, and they stay here long after you&rsquo;ve left.
        </p>
        <ButtonLink to="/about#contribute" variant="primary" size="md" className="mt-5">
          Send your notes
        </ButtonLink>
      </motion.div>
    </motion.section>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="min-w-0 px-3 py-3.5 first:pl-0 sm:px-4">
      <dd className="font-display text-2xl font-bold tabular">{value}</dd>
      <dt className="text-faint mt-0.5 truncate font-mono text-[10px] tracking-[0.12em] uppercase">
        {label}
      </dt>
    </div>
  )
}

function QuickActions() {
  const actions = [
    { to: '/chapters/class-11', icon: BookOpen, label: 'NCERT chapters', hint: 'Class 11 & 12, one click each' },
    { to: '/resources', icon: Play, label: 'Who to learn from', hint: 'Free channels that cover CBSE' },
    { to: '/tools#percentage', icon: Calculator, label: 'Work out my percentage', hint: 'Best of five' },
    { to: '/day', icon: Clock, label: 'Bell timings', hint: 'And what period it is' },
  ]

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={inView}
      variants={stagger(0.04)}
      className="mt-16"
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((a) => (
          <motion.div key={a.to} variants={rise}>
            <Link
              to={a.to}
              className="group surface border-line hover:border-line-strong flex h-full items-center gap-3 rounded-[8px] border p-4 shadow-card transition-colors"
            >
              <span className="surface-2 text-accent grid size-9 shrink-0 place-items-center rounded-[6px]">
                <a.icon className="size-4" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">{a.label}</span>
                <span className="text-faint block truncate text-xs">{a.hint}</span>
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

/**
 * The one personal moment on the site. It gets the serif — used nowhere else —
 * and sits after the useful parts rather than in front of them.
 */
function Dedication() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={inView}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="border-line mt-24 border-t px-0 py-14 sm:px-8"
    >
      <p className="eyebrow">Why this exists</p>
      <p className="dedication mt-5 max-w-2xl text-[1.6rem] leading-snug sm:text-[2rem]">
        “I spent two years hunting for notes in WhatsApp groups. You shouldn&rsquo;t have to.
        Everything I could find is here — take it, use it, and add yours when you&rsquo;re done
        with them.”
      </p>
      <div className="mt-7 flex flex-col gap-1">
        <p className="text-sm font-semibold">Aryan Rao</p>
        <p className="text-faint font-mono text-[11px] tracking-[0.14em] uppercase">
          Class of 2026
        </p>
      </div>
      <p className="text-muted mt-6 text-sm">
        Best of luck, juniors. <span aria-hidden>❤️</span>
      </p>
      <div className="mt-8 flex flex-wrap gap-2">
        <ButtonLink to="/about#contribute" variant="primary" size="sm">
          Add your notes
        </ButtonLink>
        <ButtonLink to="/about" variant="secondary" size="sm">
          How this was built
        </ButtonLink>
      </div>
    </motion.section>
  )
}
