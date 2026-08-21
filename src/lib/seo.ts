import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export const SITE = {
  name: 'All Nighter',
  origin: 'https://allnighter.in',
  /** Used when a page has nothing more specific to say. */
  image: 'https://allnighter.in/school-campus.jpg',
}

/**
 * The link preview.
 *
 * Most shares of this site are one student sending it to another the night
 * before a paper, and in that message the card *is* the product — it gets seen
 * far more often than the page does. So every route gets its own, and leads
 * with a number wherever there's an honest one to lead with.
 *
 * `scripts/og.mjs` renders these to PNG at build time.
 */
export interface OgCard {
  /** Mono caps line above everything. Two or three words. */
  kicker: string
  /** The claim. Wrapped and auto-shrunk to fit, but shorter always reads better. */
  headline: string
  /** The one big marigold figure. Omit when the page has no honest number. */
  stat?: string
  /** What the figure means, in mono caps beside it. */
  statLabel?: string
}

export interface PageMeta {
  path: string
  title: string
  description: string
  /** Extra terms this page should be findable by. Not a keywords meta tag —
   *  these are worked into the visible copy, which is what actually counts. */
  intent: string[]
  og: OgCard
}

/** Where a page's card lives once built. `/chapters/class-10` → `/og/chapters-class-10.png`. */
export function ogImageFor(path: string): string {
  const slug = path === '/' ? 'home' : path.replace(/^\/|\/$/g, '').replace(/\//g, '-')
  return `${SITE.origin}/og/${slug}.png`
}

/**
 * Titles and descriptions per route.
 *
 * The prerender step reads this to write real `<title>` and `<meta>` tags into
 * each page's HTML, and `useSeo` applies the same values on client-side
 * navigation. One source, so the two can't drift.
 *
 * Descriptions are written for a student reading a search result, not for a
 * crawler: say what's on the page and why it's worth the click.
 */
export const PAGES: PageMeta[] = [
  {
    path: '/',
    title: 'All Nighter — where you go when you didn’t study all year',
    description:
      'Tomorrow’s exam? Four taps and you get an honest plan for the hours you have left — Class 11 or 12, with the marks you can realistically expect rather than the ones you’d like. Plus all 395 NCERT chapters, five subject guides with official CBSE weightage, seven calculators, and five real evaluated answer scripts published in full. No login, nothing locked.',
    intent: [
      'cbse study material class 10 11 12',
      'ncert chapters pdf free',
      'last minute cbse revision',
      'dps gandhinagar notes',
    ],
    og: {
      kicker: 'Tomorrow’s exam?',
      headline: 'Not where you study all year. Where you go when you didn’t.',
      stat: '395',
      statLabel: 'NCERT chapters, free',
    },
  },
  {
    path: '/chapters/class-10',
    title: 'NCERT Class 10 chapters — every PDF, chapter by chapter',
    description:
      'Every NCERT Class 10 chapter as a direct PDF: Science, Maths, Social Science (History, Geography, Civics, Economics), English First Flight and Footprints, and Hindi. No sign-up and no download manager — straight from ncert.nic.in.',
    intent: [
      'ncert class 10 pdf download chapter wise',
      'class 10 science ncert pdf',
      'class 10 sst ncert chapter pdf',
    ],
    og: {
      kicker: 'NCERT Class 10',
      headline: 'Every chapter, as a direct PDF',
      stat: '84',
      statLabel: 'chapters',
    },
  },
  {
    path: '/chapters/class-11',
    title: 'NCERT Class 11 chapters — every PDF, chapter by chapter',
    description:
      'Every NCERT Class 11 chapter as a direct PDF: Physics, Chemistry, Maths, Biology, Computer Science, Accountancy, Business Studies, Economics, History, Political Science, Psychology and English. No sign-up and no download manager — straight from ncert.nic.in.',
    intent: [
      'ncert class 11 pdf download chapter wise',
      'class 11 physics ncert pdf',
      'class 11 chemistry ncert chapter pdf',
    ],
    og: {
      kicker: 'NCERT Class 11',
      headline: 'Every chapter, as a direct PDF',
      stat: '161',
      statLabel: 'chapters',
    },
  },
  {
    path: '/chapters/class-12',
    title: 'NCERT Class 12 chapters — every PDF, chapter by chapter',
    description:
      'Every NCERT Class 12 chapter as a direct PDF: Physics, Chemistry, Maths, Biology, Computer Science, Accountancy, Business Studies, Economics, History, Political Science, Psychology and English. No sign-up and no download manager — straight from ncert.nic.in.',
    intent: [
      'ncert class 12 pdf download chapter wise',
      'class 12 physics ncert pdf',
      'class 12 chemistry ncert chapter pdf',
    ],
    og: {
      kicker: 'NCERT Class 12',
      headline: 'Every chapter, as a direct PDF',
      stat: '150',
      statLabel: 'chapters',
    },
  },
  {
    path: '/library',
    title: 'Handwritten notes library — Class 11 & 12',
    description:
      'Handwritten notes scanned and shared by students, filterable by class, stream and subject. Every file credited to whoever wrote it. Free to read and download.',
    intent: ['class 11 handwritten notes pdf', 'physics handwritten notes class 11'],
    og: {
      kicker: 'Notes library',
      headline: 'Handwritten notes, credited to whoever wrote them',
    },
  },
  {
    path: '/tools',
    title: 'CBSE calculators — best of five, attendance, grade points',
    description:
      'Seven calculators. Work out your CBSE percentage with best of five, check whether you meet the 75% attendance rule, convert marks to grade points and CGPA, and see what your last paper needs to score. Nothing leaves your browser.',
    intent: [
      'cbse best of five calculator',
      'cbse percentage calculator class 12',
      '75 percent attendance calculator',
      'cgpa to percentage cbse',
    ],
    og: {
      kicker: 'CBSE calculators',
      headline: 'Best of five, attendance, and what your last paper needs',
      stat: '7',
      statLabel: 'calculators',
    },
  },
  {
    path: '/strategy',
    title: 'CBSE exam strategy from a 95.2% and 92.8% student — what actually worked',
    description:
      'How to use the 15 minutes of reading time, what order to attempt in, why you should never cut an answer, what to do when you run out of time, and an honest subject-by-subject account including the paper I got wrong. Plus what CBSE moderation really looks like.',
    intent: [
      'cbse exam strategy class 12',
      'how to score good marks in cbse boards',
      'cbse reading time 15 minutes tips',
      'cbse moderation grace marks',
      'how to write board exam answers',
    ],
    og: {
      kicker: 'Exam strategy',
      headline: 'What I actually did in the exam hall',
      stat: '92.8%',
      statLabel: 'studying last minute',
    },
  },
  {
    path: '/results',
    title: 'My CBSE marksheets, and proof that moderation is real',
    description:
      'Both my board marksheets in full — 95.2% in Class 10 and 92.8% in Class 12 — rebuilt subject by subject, never scanned. Then my evaluated answer scripts next to the marksheet they became: three subjects match exactly, two gained marks. Documented proof that CBSE moderation happens.',
    intent: [
      'is cbse moderation real',
      'cbse grace marks proof',
      'cbse moderation policy class 12',
      'osm answer sheet vs marksheet difference',
      'how many marks does cbse add',
    ],
    og: {
      kicker: 'The evidence',
      headline: 'CBSE moderation is real. Here’s the receipt.',
      stat: '+9',
      statLabel: 'marks, across five papers',
    },
  },
  {
    path: '/paper',
    title: 'What happens to your CBSE paper after you hand it in',
    description:
      'Inside a real evaluated Class 12 answer script, bought back from CBSE and read page by page. How papers are scanned and marked on screen, what every stamp and code on the booklet means, the full question-wise marks summary, and six things it changed about how I would write a paper.',
    intent: [
      'how are cbse papers checked',
      'cbse on screen marking osm',
      'cbse evaluated answer sheet photocopy',
      'what does a checked cbse answer sheet look like',
      'cbse question wise marks summary',
      'cbse re-evaluation photocopy process',
    ],
    og: {
      kicker: 'The answer script',
      headline: 'What happens to your paper after you hand it in',
      stat: '35',
      statLabel: 'pages, read one by one',
    },
  },
  {
    path: '/paper/script/computer-science',
    title: 'A real evaluated CBSE answer script — Computer Science, all 35 pages',
    description:
      'My whole Class 12 Computer Science answer book exactly as CBSE returned it after evaluation: every page, every tick, every red cross, the blank pages and the rough work. Only the script barcode is covered. Probably the only complete evaluated CBSE script published anywhere.',
    intent: [
      'cbse evaluated answer sheet sample',
      'what does a checked cbse answer sheet look like',
      'cbse answer script photocopy example',
      'cbse topper answer sheet computer science',
      'osm answer book scan',
    ],
    og: {
      kicker: 'The whole document',
      headline: 'A real evaluated CBSE answer script, every page',
      stat: '35',
      statLabel: 'pages, nothing left out',
    },
  },
  {
    path: '/paper/script/physics',
    title: 'A real evaluated CBSE Physics answer script — every half mark shown',
    description:
      'My whole Class 12 Physics answer book as CBSE returned it. Physics is marked in half marks and the evaluator wrote the arithmetic on the page — you can watch a five-mark answer being scored fragment by fragment, including the electrostatics question that scored 0 + 0 + 0 + 0 + 0.',
    intent: [
      'cbse physics evaluated answer sheet',
      'how are physics board answers marked',
      'cbse physics step marking half marks',
      'cbse answer script physics sample',
      'why did i lose marks in physics board',
    ],
    og: {
      kicker: 'Physics · marked in halves',
      headline: 'Watch a five-mark answer being scored fragment by fragment',
      stat: '0.5',
      statLabel: 'at a time',
    },
  },
  {
    path: '/tonight',
    title: 'Pull an all nighter — an honest plan for the hours you have left',
    description:
      'Tomorrow’s exam? Four taps, Class 11 or 12, and you get a realistic read on where you stand — including the marks you can actually expect, next to the pass mark — plus an hour-by-hour plan for the time you really have once breaks and 3am are taken off it. It names what you’re skipping, and it tells you when to sleep.',
    intent: [
      'exam tomorrow what to study',
      'last minute study plan cbse',
      'how to study night before exam',
      'one night before board exam plan',
      'what to study if exam is tomorrow',
      'can i pass if i study one night before',
      'how many marks can i get studying one night',
      'class 11 exam tomorrow nothing prepared',
    ],
    og: {
      kicker: 'Tomorrow’s exam?',
      headline: 'Let’s survive it. An honest plan for the hours you have left.',
      stat: '4',
      statLabel: 'taps, no typing',
    },
  },
  {
    path: '/privacy',
    title: 'Privacy — what this site does with your data',
    description:
      'No account, no database, and nothing here knows who you are. What the planner keeps on your device, what leaves it (page views and the AI step), how the ads work and how to turn off personalised ones. Written plainly, including the unflattering parts.',
    intent: ['allnighter privacy policy', 'what data does this site collect'],
    og: {
      kicker: 'Privacy',
      headline: 'No account, no database, and nothing that knows who you are',
    },
  },
  {
    path: '/print',
    title: 'Free CBSE wall charts and a one-page letter for parents',
    description:
      'Print-ready A3 wall charts — Class 12 Physics formulae, Maths formulae, and the organic conversions — plus a single page for a parent on what actually helps the night before an exam. Free, no account, designed for paper.',
    intent: [
      'cbse formula sheet pdf class 12',
      'physics formula chart class 12',
      'organic chemistry conversions chart',
      'what should parents do before board exams',
    ],
    og: {
      kicker: 'Print',
      headline: 'Things worth putting on a wall',
      stat: '4',
      statLabel: 'free, designed for paper',
    },
  },
  {
    path: '/print/physics-formulae',
    title: 'Class 12 Physics formula sheet — free A3 wall chart',
    description:
      'Every Class 12 Physics formula the paper assumes you already know, on one printable sheet: electrostatics, current electricity, magnetism and induction, optics, modern physics and electronic devices. Free, no account.',
    intent: ['class 12 physics formula sheet pdf', 'physics formulas class 12 all chapters', 'cbse physics formula chart'],
    og: { kicker: 'Wall chart', headline: 'Class 12 Physics — the formulae, and nothing else', stat: 'A3', statLabel: 'free to print' },
  },
  {
    path: '/print/maths-formulae',
    title: 'Class 12 Maths formula sheet — free A3 wall chart',
    description:
      'The derivatives, integrals, definite-integral properties, vectors, matrices and probability formulae you are expected to produce from memory. Calculus is 35 of the 80 marks, so this is the half worth having on a wall.',
    intent: ['class 12 maths formula sheet pdf', 'integration formulas class 12', 'cbse maths formula chart'],
    og: { kicker: 'Wall chart', headline: 'Class 12 Maths — calculus is 35 of the 80 marks', stat: 'A3', statLabel: 'free to print' },
  },
  {
    path: '/print/organic-conversions',
    title: 'Organic conversions chart — Class 12 Chemistry, free to print',
    description:
      'The named conversions and distinguishing tests that come round every year: haloalkanes, alcohols and phenols, carbonyls, amines. Chemistry is scored in half marks, so the reagent alone is worth writing even when you cannot finish the chain.',
    intent: ['organic chemistry conversions class 12', 'name reactions class 12 chemistry chart', 'organic conversions cbse pdf'],
    og: { kicker: 'Wall chart', headline: 'Organic conversions — the reagent above the arrow', stat: 'A3', statLabel: 'free to print' },
  },
  {
    path: '/print/for-parents',
    title: 'For a parent, the night before a board exam — one page',
    description:
      'What actually helps and what does not, written by a student who has just been through it. Food on time, a quiet house, and letting them sleep. Plus the two things about the exam itself worth knowing — including that CBSE moderation is real.',
    intent: ['what should parents do night before exam', 'how to support child before board exams', 'parents board exam stress advice'],
    og: { kicker: 'One page', headline: 'For a parent, the night before', stat: '1', statLabel: 'page, send it on' },
  },
  {
    path: '/guide',
    title: 'CBSE Class 12 subject guides — every unit, its marks, what to study first',
    description:
      'All five Class 12 science-stream subjects mapped in one place: official unit-wise weightage, what each unit actually asks, and what to do first if you are short on time. Physics, Chemistry, Maths, English and Computer Science, each with my own marks attached.',
    intent: [
      'cbse class 12 chapter wise weightage',
      'class 12 important chapters all subjects',
      'cbse class 12 syllabus marks distribution',
      'what to study first class 12 boards',
    ],
    og: {
      kicker: 'Subject guides',
      headline: 'Every Class 12 subject, put together properly',
      stat: '5',
      statLabel: 'subjects mapped',
    },
  },
  {
    path: '/guide/class-12-physics',
    title: 'Class 12 Physics — every unit, its marks, and what to study first',
    description:
      'The whole of CBSE Class 12 Physics in one place: official unit-wise weightage for all 70 theory marks, what each unit actually asks, and why Optics being 14 marks at the back of the book ruins so many timetables. Plus the half-mark scoring shown on my own evaluated script, including the five-mark question that scored zero.',
    intent: [
      'class 12 physics weightage 2026',
      'cbse class 12 physics unit wise marks',
      'important chapters class 12 physics',
      'cbse physics step marking half marks',
      'class 12 physics optics weightage',
    ],
    og: {
      kicker: 'Class 12 Physics',
      headline: 'Every unit, its marks, and what to study first',
      stat: '14',
      statLabel: 'marks in optics alone',
    },
  },
  {
    path: '/guide/class-12-chemistry',
    title: 'Class 12 Chemistry — every unit, its marks, and what to study first',
    description:
      'The whole of CBSE Class 12 Chemistry in one place: official unit-wise weightage for all 70 theory marks, what each unit actually asks, where the marks really are, and the order to study in if you are short on time. Written by a student who scored 89 and will tell you why it should have been more.',
    intent: [
      'class 12 chemistry weightage 2026',
      'cbse class 12 chemistry unit wise marks',
      'which chapters are important class 12 chemistry',
      'class 12 chemistry how to study last minute',
      'cbse chemistry electrochemistry weightage',
    ],
    og: {
      kicker: 'Class 12 Chemistry',
      headline: 'Every unit, its marks, and what to study first',
      stat: '70',
      statLabel: 'marks, mapped',
    },
  },
  {
    path: '/paper/script/chemistry',
    title: 'A real evaluated CBSE Chemistry answer script — my worst paper, published',
    description:
      'My whole Class 12 Chemistry answer book as CBSE returned it. Evaluated at 51.5, rounded to 52, moderated to 59 — the biggest jump of my five papers. Every zero, every half mark and every crossed-out false start, including a Section E attempt I abandoned mid-sentence.',
    intent: [
      'cbse chemistry evaluated answer sheet',
      'how are chemistry board answers marked',
      'cbse chemistry step marking half marks',
      'why did i lose marks in chemistry board',
      'cbse chemistry answer script sample',
    ],
    og: {
      kicker: 'Chemistry · my worst paper',
      headline: 'The one I did badly, published in full',
      stat: '51.5',
      statLabel: 'before rounding',
    },
  },
  {
    path: '/paper/script/mathematics',
    title: 'A real evaluated CBSE Maths answer script — all 43 pages',
    description:
      'My whole Class 12 Mathematics answer book as CBSE returned it, graph paper included. The cleanest of my five papers at 71/80 theory, marked in half marks throughout, with every crossed-out false start and four pages of rough work left in.',
    intent: [
      'cbse maths evaluated answer sheet',
      'how are maths board answers marked step marking',
      'cbse class 12 maths answer script sample',
      'cbse maths half marks steps',
      'what does a checked maths answer sheet look like',
    ],
    og: {
      kicker: 'Mathematics · 43 pages',
      headline: 'The cleanest of my five papers, published in full',
      stat: '71',
      statLabel: 'unchanged by moderation',
    },
  },
  {
    path: '/books',
    title: 'The best books for CBSE Class 12 — and the subject you shouldn’t buy one for',
    description:
      'Three books I would actually buy for Class 12 — MTG Previous 10 Years Questions for Physics, Chemistry and English — and why I would not buy anything at all for Maths, where NCERT and past papers got me 71 out of 80. No affiliate links, no sponsorship, nothing earned if you buy.',
    intent: [
      'best books for class 12 cbse',
      'mtg previous years questions class 12',
      'best reference book class 12 maths',
      'do i need reference books for cbse boards',
      'cbse class 12 books to buy',
    ],
    og: {
      kicker: 'The shelf',
      headline: 'Three books worth buying, and one subject worth buying nothing for',
      stat: '0',
      statLabel: 'affiliate links',
    },
  },
  {
    path: '/paper/script/english',
    title: 'A real evaluated CBSE English answer script — all 35 pages',
    description:
      'My whole Class 12 English Core answer book as CBSE returned it. 76 out of 80, and the marks are almost entirely in the formats — notice, invitation, letter, article — which are fixed and learnable, unlike the literature answers everyone spends their time on.',
    intent: [
      'cbse english evaluated answer sheet',
      'how are english board answers marked',
      'cbse class 12 english notice letter format marks',
      'english core answer script sample',
      'how to score full marks english writing section',
    ],
    og: {
      kicker: 'English Core · 80 marks',
      headline: 'The subject people think you cannot study for',
      stat: '76',
      statLabel: 'and it was the formats',
    },
  },
  {
    path: '/guide/class-12-maths',
    title: 'Class 12 Maths — every unit, its marks, and why Calculus is half the paper',
    description:
      'The whole of CBSE Class 12 Mathematics in one place: official unit-wise weightage for all 80 theory marks, why Calculus alone is 35 of them, and why you should not buy a reference book for this subject. From a student who scored 71 out of 80 using only NCERT and past papers.',
    intent: [
      'class 12 maths weightage 2026',
      'cbse class 12 maths unit wise marks',
      'best book for class 12 maths cbse',
      'class 12 maths important chapters',
      'cbse maths calculus weightage',
    ],
    og: {
      kicker: 'Class 12 Maths',
      headline: 'Calculus alone is 35 of the 80 marks',
      stat: '35',
      statLabel: 'of 80, one unit',
    },
  },
  {
    path: '/guide/class-12-english',
    title: 'Class 12 English — where the marks actually are, and it is not the literature',
    description:
      'CBSE Class 12 English Core, mapped: 22 marks of reading you cannot prepare, 18 marks of writing formats you absolutely can, and 40 marks of literature that wants shorter answers than you think. From a student who scored 76 out of 80 by learning four layouts.',
    intent: [
      'class 12 english weightage',
      'cbse english core writing section format',
      'how to score full marks in english class 12',
      'class 12 english notice invitation letter format',
      'english core important chapters',
    ],
    og: {
      kicker: 'Class 12 English',
      headline: '18 marks of pure format that nobody studies',
      stat: '18',
      statLabel: 'marks in the layouts',
    },
  },
  {
    path: '/guide/class-12-computer-science',
    title: 'Class 12 Computer Science — the only paper marked in whole marks',
    description:
      'CBSE Class 12 Computer Science, mapped: Python is 40 of the 70, databases another 20, and it is the only one of my five papers with no half marks anywhere in it — which changes how you should write the code. From a student who scored 68 out of 70.',
    intent: [
      'class 12 computer science weightage',
      'cbse computer science 083 syllabus marks',
      'class 12 cs sql questions marks',
      'computer science important chapters class 12',
      'how to score full marks computer science',
    ],
    og: {
      kicker: 'Class 12 CS',
      headline: 'The only paper marked in whole marks',
      stat: '40',
      statLabel: 'of 70 is Python',
    },
  },
  {
    path: '/resources',
    title: 'Best free YouTube channels & sites for CBSE Class 11 and 12',
    description:
      'The channels I actually studied from for Physics, Chemistry, Maths, English and Computer Science, plus checked links to CBSE syllabus, sample papers, NCERT books and exemplars. All free.',
    intent: [
      'best youtube channel for class 12 chemistry',
      'free cbse study resources',
      'cbse sample papers download',
    ],
    og: {
      kicker: 'Verified channels',
      headline: 'The channels I actually studied from, and nothing else',
    },
  },
  {
    path: '/day',
    title: 'School day & bell timings',
    description:
      'See which period is running right now and how many minutes are left. Set your section’s bell timings once and this device remembers them.',
    intent: ['school bell timings', 'what period is it'],
    og: {
      kicker: 'School day',
      headline: 'Which period is running, and how long is left',
    },
  },
  {
    path: '/about',
    title: 'About All Nighter & how to add your notes',
    description:
      'A student-run study library — who made it, why it’s free, and how to send in your own notes to be published with your name on them.',
    intent: ['all nighter contribute notes', 'submit cbse notes'],
    og: {
      kicker: 'About',
      headline: 'A study library run by students, free and staying that way',
    },
  },
]

const BY_PATH = new Map(PAGES.map((p) => [p.path, p]))

export function metaFor(path: string): PageMeta {
  return BY_PATH.get(path) ?? PAGES[0]!
}

/**
 * Keeps the tab title and meta description correct as you navigate.
 *
 * Prerendered HTML already carries the right tags for the first paint; this
 * handles every route change after that.
 */
export function useSeo(override?: { title?: string; description?: string }) {
  const { pathname } = useLocation()

  useEffect(() => {
    const base = metaFor(pathname)
    const title = override?.title ?? base.title
    const description = override?.description ?? base.description

    // Only routes we actually have a card for; anything else keeps the last
    // one rather than pointing at a 404 image.
    const image = BY_PATH.has(pathname) ? ogImageFor(pathname) : undefined

    document.title = title
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', SITE.origin + pathname)
    if (image) {
      setMeta('property', 'og:image', image)
      setMeta('name', 'twitter:image', image)
    }
    setLink('canonical', SITE.origin + pathname)
  }, [pathname, override?.title, override?.description])
}

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    document.head.appendChild(el)
  }
  el.href = href
}
