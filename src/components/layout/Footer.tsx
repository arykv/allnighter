import { Link } from 'react-router-dom'
import { Github, Mail } from 'lucide-react'

/** Stamped at build time so the prerendered HTML and the client never disagree. */
const YEAR = __BUILD_YEAR__

const COLUMNS = [
  {
    title: 'Find things',
    links: [
      { label: 'Library', to: '/library' },
      { label: 'By subject', to: '/library?view=subjects' },
      { label: 'Recently added', to: '/library?sort=recent' },
      { label: 'Saved', to: '/library?saved=1' },
    ],
  },
  {
    title: 'Use things',
    links: [
      { label: 'Pull an all nighter', to: '/tonight' },
      { label: 'Calculators', to: '/tools' },
      { label: 'Bell timings', to: '/day' },
      { label: 'NCERT chapters', to: '/chapters/class-11' },
      { label: 'Subject guides', to: '/guide' },
      { label: 'Books worth buying', to: '/books' },
      { label: 'Wall charts to print', to: '/print' },
      { label: 'Resources & channels', to: '/resources' },
    ],
  },
  {
    title: 'This site',
    links: [
      { label: 'Results & proof', to: '/results' },
      { label: 'CBSE moderation', to: '/results#moderation' },
      { label: 'What happens to your paper', to: '/paper' },
      { label: 'A real answer script', to: '/paper/script/computer-science' },
      { label: 'About', to: '/about' },
      { label: 'Add your notes', to: '/about#contribute' },
      { label: 'Privacy & ads', to: '/privacy' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-line mt-24 border-t">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="border-line-strong text-mark grid h-7 place-items-center rounded-[3px] border px-1.5 font-mono text-[11px] font-medium tracking-[0.1em]">
                AN
              </span>
              <span className="font-display text-[15px] font-bold tracking-tight">All Nighter</span>
            </div>
            <p className="text-muted mt-4 max-w-xs text-sm leading-relaxed">
              Not where you study all year. Where you go when you didn&rsquo;t. Written by one CBSE
              student who did it twice, with the marksheets and the answer scripts to show for it.
            </p>
            <div className="mt-5 flex gap-2">
              <a
                href="https://github.com/arykv/allnighter"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Source on GitHub"
                className="surface-2 border-line text-muted hover:text-[var(--text)] grid size-9 place-items-center rounded-[6px] border transition-colors"
              >
                <Github className="size-4" />
              </a>
              <a
                href="mailto:dpsgnotes@gmail.com"
                aria-label="Email dpsgnotes@gmail.com"
                className="surface-2 border-line text-muted hover:text-[var(--text)] grid size-9 place-items-center rounded-[6px] border transition-colors"
              >
                <Mail className="size-4" />
              </a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="eyebrow mb-3.5">{col.title}</p>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-muted text-sm transition-colors hover:text-[var(--text)]"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-line text-faint mt-12 flex flex-col gap-3 border-t pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            Not affiliated with any school or board. Notes belong to the students who wrote them.
          </p>
          {/* Quiet, but on every page and machine-readable via rel="author". */}
          <p className="tabular">
            <span>&copy; {YEAR} All Nighter</span>
            <span aria-hidden className="mx-1.5 opacity-50">
              ·
            </span>
            <span>
              Built by{' '}
              <a
                href="https://github.com/arykv"
                target="_blank"
                rel="author noreferrer noopener"
                className="hover:text-[var(--text)] underline decoration-dotted underline-offset-2 transition-colors"
              >
                Aryan Rao
              </a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  )
}
