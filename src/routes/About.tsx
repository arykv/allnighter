import { motion } from 'motion/react'
import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDown, Github, Mail, Upload } from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { SectionHead } from '@/components/ui/primitives'
import { inView, rise, stagger } from '@/lib/motion'

const FAQ = [
  {
    q: 'Who runs this?',
    a: 'Students. It started as a folder of scanned notes shared in a class group and turned into a site because nobody could ever find the right link twice. It isn’t run by the school and it isn’t official.',
  },
  {
    q: 'Is it free? What’s the catch?',
    a: 'Everything on the site is free to read and there is nothing to sign up for — no account, no app, no section that asks you to pay to see the rest. It is paid for by ads on some pages, and by nothing else: nothing here is sponsored, no company has asked for a mention, and no link on this site earns a commission. If that ever changes it will say so on the page it changes on.',
  },
  {
    q: 'Whose notes are these?',
    a: 'They belong to the students who wrote them, and every file credits its author by name. If you wrote something here and want it taken down, email and it goes down — no argument.',
  },
  {
    q: 'How do I add my notes?',
    a: 'Email them. There’s no upload form on purpose — every file is looked at by a person before it goes up, so juniors can trust what they find here. Scans are fine as long as the writing is readable. Put your name on it; credit is the whole point.',
  },
  {
    q: 'Can I trust these for the boards?',
    a: 'Treat them as a head start, not a source of truth. They’re student notes: fast to revise from, occasionally wrong. Anything that decides a mark should be checked against the NCERT book or the CBSE syllabus.',
  },
  {
    q: 'Are the NCERT chapters hosted here?',
    a: 'No. Those open straight from ncert.nic.in, where they’re published free. This site is only a faster index into them — nothing is copied or re-uploaded. Same for the outside links and channels.',
  },
  {
    q: 'Does it track me?',
    a: 'There’s basic page-view analytics and nothing else. Saved files, your timings and your marks stay in your own browser — none of it is sent anywhere.',
  },
]

export default function About() {
  return (
    <div className="register mx-auto max-w-3xl px-4 pt-12 pb-8 pl-5 sm:px-6 sm:pl-16">
      <SectionHead
        level={1}
        eyebrow="About"
        title="A library, not a product"
        description="Started at DPS Gandhinagar, open to anyone sitting the same papers."
      />

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={inView}
        variants={stagger(0.06)}
        className="space-y-6"
      >
        <motion.div variants={rise} className="surface border-line rounded-[8px] border p-6 shadow-card">
          <p className="text-[15px] leading-relaxed">
            The first version of this site was seven pages of hand-written HTML and it took six
            clicks to reach a PDF. It worked, in the sense that the files were technically on the
            internet.
          </p>
          <p className="text-muted mt-4 text-[15px] leading-relaxed">
            This version starts from the question that actually matters at 11pm the night before a
            paper: <em>how fast can someone get from “I need the chem notes” to reading them?</em>{' '}
            Search is the front door. Everything else — every NCERT chapter, the calculators, the
            bell timings, the channels — is here because students were opening a different tab for
            it anyway.
          </p>
          <p className="text-muted mt-4 text-[15px] leading-relaxed">
            Almost nothing here is hosted by us — it points at material that was already free
            and just badly signposted. The one part that has to be built from scratch is the
            handwritten notes library, and that only grows when people send things in.
          </p>
        </motion.div>

        {/* Contribute */}
        <motion.div
          variants={rise}
          id="contribute"
          className="surface border-line scroll-mt-24 rounded-[8px] border p-6 shadow-card"
        >
          <h2 className="text-xl">Add your notes</h2>
          <p className="text-muted mt-2 text-sm leading-relaxed">
            Anything useful is welcome: notes, past papers, formula sheets, practical files,
            a corrected answer key. Scans are fine. Put your name on it.
          </p>

          <ol className="mt-5 space-y-3">
            {[
              'Email the file, with your name, class and subject.',
              'It gets checked for readability and filed under the right class and stream.',
              'It goes up credited to you, usually within a day.',
            ].map((step, i) => (
              <li key={step} className="flex gap-3 text-sm">
                <span className="surface-2 text-accent grid size-6 shrink-0 place-items-center rounded-[4px] font-mono text-[11px] font-medium">
                  {i + 1}
                </span>
                <span className="text-muted leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>

          <div className="mt-6 flex flex-wrap gap-2">
            <ButtonLink
              to="mailto:dpsgnotes@gmail.com?subject=Notes%20for%20All%20Nighter"
              external
              variant="primary"
              size="md"
            >
              <Mail className="size-4" />
              dpsgnotes@gmail.com
            </ButtonLink>
            <ButtonLink
              to="https://github.com/arykv/allnighter"
              external
              variant="secondary"
              size="md"
            >
              <Github className="size-4" />
              Open a pull request
            </ButtonLink>
          </div>

          <p className="text-faint mt-5 flex items-start gap-2 text-xs leading-relaxed">
            <Upload className="mt-0.5 size-3.5 shrink-0" />
            Please don&rsquo;t send anything you don&rsquo;t have the right to share — coaching
            material and published books stay out.
          </p>
        </motion.div>

        {/* FAQ */}
        <motion.div variants={rise}>
          <h2 className="mb-4 text-xl">Questions people actually ask</h2>
          <Accordion.Root type="single" collapsible className="space-y-2">
            {FAQ.map((item) => (
              <Accordion.Item
                key={item.q}
                value={item.q}
                className="surface border-line overflow-hidden rounded-[6px] border"
              >
                <Accordion.Header>
                  <Accordion.Trigger className="group flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left text-sm font-medium transition-colors hover:bg-[var(--surface-hover)]">
                    {item.q}
                    <ChevronDown className="text-faint size-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="overflow-hidden data-[state=closed]:animate-[acc-up_180ms_ease] data-[state=open]:animate-[acc-down_220ms_ease]">
                  <p className="text-muted px-4 pb-4 text-[13px] leading-relaxed">{item.a}</p>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </motion.div>

        {/* Colophon */}
        <motion.div variants={rise} className="border-line rounded-[8px] border border-dashed p-6">
          <p className="eyebrow mb-3">Colophon</p>
          <p className="text-muted text-[13px] leading-relaxed">
            React, TypeScript, Tailwind and Motion, built with Vite and hosted on GitHub Pages.
            Type is Bricolage Grotesque, Archivo and Azeret Mono. The look is a school register —
            bottle-green board, ruled paper, one red margin line. Source is public — take it apart, fork it for your school.
          </p>
          <p className="dedication mt-5 text-lg">
            Class of 2026 — Aryan Rao. Best of luck, juniors.
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
