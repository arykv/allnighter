import { Suspense, lazy, useCallback, useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, MotionConfig, motion, useScroll, useSpring } from 'motion/react'
// `/react`, not `/next` — Vercel's setup page hands you the Next.js import by
// default and this is a Vite SPA, where that entry point does not exist.
import { Analytics } from '@vercel/analytics/react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CommandPalette } from '@/components/CommandPalette'
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary'
import { TooltipProvider } from '@/components/ui/primitives'
import { ThemeProvider } from '@/lib/theme'
import { useHotkey } from '@/lib/hooks'
import { page } from '@/lib/motion'
import { useSeo } from '@/lib/seo'
import Home from '@/routes/Home'

// Home ships in the entry bundle because it's what most visits load; the rest
// arrive when someone actually navigates there.
const Library = lazy(() => import('@/routes/Library'))
const Viewer = lazy(() => import('@/routes/Viewer'))
const Tools = lazy(() => import('@/routes/Tools'))
const SchoolDay = lazy(() => import('@/routes/SchoolDay'))
const Chapters = lazy(() => import('@/routes/Chapters'))
const Resources = lazy(() => import('@/routes/Resources'))
const Strategy = lazy(() => import('@/routes/Strategy'))
const Results = lazy(() => import('@/routes/Results'))
const Paper = lazy(() => import('@/routes/Paper'))
const Script = lazy(() => import('@/routes/Script'))
const Guide = lazy(() => import('@/routes/Guide'))
const Books = lazy(() => import('@/routes/Books'))
const AllNighter = lazy(() => import('@/routes/AllNighter'))
const Print = lazy(() => import('@/routes/Print'))
const About = lazy(() => import('@/routes/About'))
const Privacy = lazy(() => import('@/routes/Privacy'))
const NotFound = lazy(() => import('@/routes/NotFound'))

export default function App() {
  const [paletteOpen, setPaletteOpen] = useState(false)
  const location = useLocation()

  // Prerendered HTML carries the right tags on first paint; this keeps them
  // correct for every route change after that.
  useSeo()

  useHotkey(
    useCallback((e: KeyboardEvent) => (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k', []),
    () => setPaletteOpen((v) => !v),
  )
  // "/" is the shortcut everyone already has muscle memory for.
  useHotkey(
    useCallback((e: KeyboardEvent) => e.key === '/' && !e.metaKey && !e.ctrlKey, []),
    () => setPaletteOpen(true),
  )

  return (
    // `prefers-reduced-motion` in CSS only reaches CSS animations. Every
    // entrance on this site is a JS-driven spring, which sails straight past
    // that media query — so the preference has to be handed to Motion as well
    // or the setting does nothing on the pages that move the most.
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <TooltipProvider>
          <SkipLink />
          <ScrollProgress />
          <Header onOpenSearch={() => setPaletteOpen(true)} />

          <main id="content">
            {/* Suspense sits OUTSIDE AnimatePresence on purpose.
                Inside, a lazy route that suspends part-way through the previous
                page's exit animation could leave AnimatePresence holding an
                unmounted child — the page went blank and only a refresh brought
                it back. Keeping the boundary out here means a chunk that is still
                loading shows the fallback instead of interrupting the exit. */}
            <RouteErrorBoundary>
              <Suspense fallback={<RouteFallback />}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={location.pathname}
                    variants={page}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                  >
                    <Routes location={location}>
                      <Route path="/" element={<Home onOpenSearch={() => setPaletteOpen(true)} />} />
                      <Route path="/library" element={<Library />} />
                      <Route path="/library/:id" element={<Viewer />} />
                      <Route path="/tools" element={<Tools />} />
                      <Route path="/day" element={<SchoolDay />} />
                      <Route path="/chapters" element={<Navigate to="/chapters/class-10" replace />} />
                      <Route path="/chapters/:classSlug" element={<Chapters />} />
                      <Route path="/resources" element={<Resources />} />
                      <Route path="/strategy" element={<Strategy />} />
                      <Route path="/results" element={<Results />} />
                      <Route path="/paper" element={<Paper />} />
                      <Route path="/paper/script" element={<Navigate to="/paper/script/computer-science" replace />} />
                      <Route path="/paper/script/:slug" element={<Script />} />
                      <Route path="/guide" element={<Guide />} />
                      <Route path="/guide/:slug" element={<Guide />} />
                      <Route path="/books" element={<Books />} />
                      <Route path="/tonight" element={<AllNighter />} />
                      <Route path="/print" element={<Print />} />
                      <Route path="/print/:slug" element={<Print />} />
                      <Route path="/links" element={<Navigate to="/resources" replace />} />
                      <Route path="/about" element={<About />} />
                    <Route path="/privacy" element={<Privacy />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </motion.div>
                </AnimatePresence>
              </Suspense>
            </RouteErrorBoundary>
          </main>

          <Footer />
          <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
          <ScrollReset />
          {/* Page views only, and cookieless. Worth being precise about on a
              site that tells people what it does with their data: this counts
              which pages get opened. It never sees the answers you give
              /tonight — those are worked out in the browser and stay there. */}
          <Analytics />
        </TooltipProvider>
      </ThemeProvider>
    </MotionConfig>
  )
}

function SkipLink() {
  return (
    <a
      href="#content"
      className="surface border-line sr-only z-50 rounded-[5px] border px-4 py-2 text-sm font-medium focus:not-sr-only focus:absolute focus:top-3 focus:left-3"
    >
      Skip to content
    </a>
  )
}

/** A hairline that fills as you read. Cheap, and it makes long pages feel finite. */
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const width = useSpring(scrollYProgress, { stiffness: 340, damping: 40, restDelta: 0.001 })
  return (
    <motion.div
      style={{ scaleX: width }}
      className="bg-[var(--mark)] fixed inset-x-0 top-0 z-50 h-0.5 origin-left"
      aria-hidden
    />
  )
}

function ScrollReset() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) return
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, hash])
  return null
}

function RouteFallback() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="surface-2 h-8 w-48 animate-pulse rounded-[5px]" />
      <div className="surface-2 mt-4 h-4 w-80 animate-pulse rounded-[5px]" />
    </div>
  )
}
