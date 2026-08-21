import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDown, Download, ExternalLink, Search } from 'lucide-react'
import { NCERT_BOOKS, type NcertBook } from '@/data/ncert'
import { subjectName } from '@/data/subjects'
import type { Grade, Stream } from '@/data/types'
import { STREAM_LABELS } from '@/lib/format'
import { useDebounced } from '@/lib/hooks'
import { Badge, EmptyState, SectionHead, Segmented } from '@/components/ui/primitives'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { rise, stagger } from '@/lib/motion'

const STREAMS: (Stream | 'all')[] = ['all', 'science', 'commerce', 'arts']

/**
 * Every NCERT chapter for Class 11 and 12, as a direct link to the PDF on
 * ncert.nic.in.
 *
 * The books are free and the board sets papers from them, but finding one
 * chapter normally means three clicks through a government site or an ad-farm
 * mirror. This is the same files, one click, no interstitials.
 */
export default function Chapters() {
  const [params, setParams] = useSearchParams()
  const { classSlug } = useParams<{ classSlug?: string }>()
  const navigate = useNavigate()

  // The class lives in the path, not a query string, so each year is a real
  // page that can be linked to, shared and indexed on its own.
  const grade = (classSlug === 'class-10' ? 10 : classSlug === 'class-12' ? 12 : 11) as Grade
  const stream = (params.get('stream') as Stream | null) ?? 'all'
  const [query, setQuery] = useState('')
  const search = useDebounced(query, 100).trim().toLowerCase()

  function setParam(key: string, value: string | null) {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (value === null) next.delete(key)
        else next.set(key, value)
        return next
      },
      { replace: true },
    )
  }

  const books = useMemo(() => {
    let list = NCERT_BOOKS.filter((b) => b.grade === grade)
    if (stream !== 'all') list = list.filter((b) => b.stream === stream || b.stream === 'common')

    if (search) {
      list = list
        .map((b) => ({
          ...b,
          chapters: b.chapters.filter(
            (c) =>
              c.title.toLowerCase().includes(search) ||
              subjectName(b.subject).toLowerCase().includes(search),
          ),
        }))
        .filter((b) => b.chapters.length > 0)
    }
    return list
  }, [grade, stream, search])

  const chapterCount = books.reduce((n, b) => n + b.chapters.length, 0)

  return (
    <div className="register mx-auto max-w-4xl px-4 pt-12 pl-5 sm:px-6 sm:pl-16">
      <SectionHead
        level={1}
        eyebrow="NCERT · chapterwise"
        title={`Class ${grade} NCERT chapters, one click each`}
        description="The actual NCERT PDFs, straight from ncert.nic.in — no interstitials, no sign-up, no “download” button that opens three tabs. Papers are set from these books."
      />

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Segmented
          label="Class"
          value={String(grade)}
          onChange={(v) =>
            navigate(`/chapters/class-${v}${stream === 'all' ? '' : `?stream=${stream}`}`)
          }
          options={[
            { value: '10', label: 'Class 10' },
            { value: '11', label: 'Class 11' },
            { value: '12', label: 'Class 12' },
          ]}
        />

        <div className={cn('flex flex-wrap gap-1.5', grade === 10 && 'hidden')}>
          {STREAMS.map((s) => (
            <button
              key={s}
              onClick={() => setParam('stream', s === 'all' ? null : s)}
              aria-pressed={stream === s}
              className={cn(
                'rounded-[5px] border px-2.5 py-1 text-[13px] font-medium transition-colors',
                stream === s
                  ? 'border-[var(--mark)] text-mark'
                  : 'border-line text-muted hover:border-line-strong hover:text-[var(--text)]',
              )}
            >
              {s === 'all' ? 'All streams' : STREAM_LABELS[s]}
            </button>
          ))}
        </div>

        <div className="relative ml-auto min-w-52 flex-1 sm:flex-none">
          <Search className="text-faint pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a chapter…"
            aria-label="Search chapters"
            className="surface border-line focus:border-[var(--mark)] h-9 w-full rounded-[5px] border pr-3 pl-8 text-[13px] outline-none placeholder:text-[var(--text-faint)]"
          />
        </div>
      </div>

      <p className="text-faint mb-4 font-mono text-[11px] tabular">
        {books.length} books · {chapterCount} chapters
      </p>

      {/* Radix renders each Accordion.Header as an h3, so the list needs a
          heading of its own or the page jumps h1 → h3. */}
      <h2 className="sr-only">Books</h2>

      {books.length > 0 ? (
        <motion.div initial="hidden" animate="show" variants={stagger(0.03)} className="pb-8">
          <Accordion.Root
            type="multiple"
            defaultValue={search ? books.map((b) => b.code) : [books[0]?.code ?? '']}
            className="space-y-2"
          >
            {books.map((book) => (
              <BookRow key={book.code} book={book} />
            ))}
          </Accordion.Root>
        </motion.div>
      ) : (
        <EmptyState
          icon={<Search className="size-5" />}
          title="No chapter matches that"
          description="Try the chapter name rather than the number, or switch stream — commerce and humanities books live under their own filters."
          action={
            <Button variant="secondary" size="sm" onClick={() => setQuery('')}>
              Clear search
            </Button>
          }
        />
      )}

      <nav className="border-line mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t pt-5 text-sm">
        {([10, 11, 12] as const)
          .filter((g) => g !== grade)
          .map((g) => (
            <Link
              key={g}
              to={`/chapters/class-${g}`}
              className="text-accent font-medium underline underline-offset-2"
            >
              All Class {g} NCERT chapters
            </Link>
          ))}
      </nav>

      <p className="text-faint mt-4 text-xs leading-relaxed">
        These files are hosted by NCERT and open from ncert.nic.in. Nothing is copied or
        re-uploaded here — this is only a faster index into them.
      </p>
    </div>
  )
}

function BookRow({ book }: { book: NcertBook }) {
  return (
    <motion.div variants={rise}>
      <Accordion.Item
        value={book.code}
        className="surface border-line overflow-hidden rounded-[6px] border"
      >
        <Accordion.Header>
          <Accordion.Trigger className="group flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-[var(--surface-hover)]">
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-2">
                <span className="text-[15px] font-semibold">{subjectName(book.subject)}</span>
                {book.label && <Badge tone="outline">{book.label}</Badge>}
              </span>
              <span className="text-faint mt-0.5 block font-mono text-[11px] tabular">
                {book.chapters.length} chapters
              </span>
            </span>
            <ChevronDown className="text-faint size-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </Accordion.Trigger>
        </Accordion.Header>

        {/* forceMount keeps every chapter name in the HTML even while its book
            is collapsed. It costs nothing visually — a closed panel is height 0
            — and it means all 316 titles are in the page a crawler receives
            rather than appearing only after someone clicks. */}
        <Accordion.Content
          forceMount
          className="overflow-hidden data-[state=closed]:h-0 data-[state=closed]:animate-[acc-up_180ms_ease] data-[state=open]:animate-[acc-down_220ms_ease]"
        >
          <ol className="border-line divide-y divide-[var(--line)] border-t">
            {book.chapters.map((c) => (
              <li key={c.ch}>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-[var(--surface-hover)]"
                >
                  <span className="text-faint w-6 shrink-0 font-mono text-[11px] tabular">
                    {String(c.ch).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px]">{c.title}</span>
                  </span>
                  <span className="text-faint hidden shrink-0 font-mono text-[10px] tabular sm:block">
                    {c.pages}p · {c.sizeMb} MB
                  </span>
                  <ExternalLink className="text-faint size-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                </a>
              </li>
            ))}
          </ol>

          {book.fullBookHref && (
            <div className="border-line border-t px-4 py-3">
              <a
                href={book.fullBookHref}
                target="_blank"
                rel="noreferrer noopener"
                className="text-accent inline-flex items-center gap-1.5 text-[13px] font-medium"
              >
                <Download className="size-3.5" />
                Whole book on ncert.nic.in
              </a>
            </div>
          )}
        </Accordion.Content>
      </Accordion.Item>
    </motion.div>
  )
}
