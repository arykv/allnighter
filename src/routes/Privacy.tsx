import { motion } from 'motion/react'
import { SectionHead } from '@/components/ui/primitives'
import { ButtonLink } from '@/components/ui/Button'
import { inView, rise, stagger } from '@/lib/motion'

/**
 * What this site does with your data.
 *
 * Written because three things arrived at once — page-view analytics, an AI
 * endpoint on `/tonight`, and ads — and because a site whose entire pitch is
 * "the claims here are checkable" cannot then be vague about itself. It is also
 * a hard requirement: Google will not approve a site for AdSense without a page
 * disclosing third-party cookies.
 *
 * The rule for this page is the rule for the rest of the site: **say the
 * unflattering part.** Anything that leaves the reader's device is named here,
 * including the bits it would be easier not to mention.
 */
export default function Privacy() {
  return (
    <div className="register mx-auto max-w-3xl px-4 pt-12 pb-8 pl-5 sm:px-6 sm:pl-16">
      <SectionHead
        level={1}
        eyebrow="Privacy"
        title="What this site does with your data"
        description="Short version: there is no account, nothing here knows who you are, and the answers you type into the planner stay on your device. The longer version is below, including the parts that are less flattering."
      />

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={inView}
        variants={stagger(0.05)}
        className="mt-10 space-y-10"
      >
        <Block
          title="There is no account, and no database"
          body={[
            'You cannot sign up for this site, because there is nothing to sign up to. No email address is collected, no password exists, and there is no user record with your name on it anywhere — not hidden, not anonymised, simply never created.',
            'Notes are contributed by email rather than by an upload form, so there is no file store either.',
          ]}
        />

        <Block
          title="What stays on your device"
          body={[
            'The planner remembers your last four answers — year, paper, exam time and how prepared you said you were — so the page is filled in when you come back. It also remembers which files you last opened, which ones you saved, and whether you chose light or dark.',
            'All of that lives in your browser’s local storage on that one device. It is never sent anywhere, and clearing your browser data deletes it permanently. Nobody, including me, can read it.',
          ]}
        />

        <Block
          title="What leaves your device"
          body={[
            'Page views. The site counts which pages get opened, using Vercel Analytics. It sets no cookies and builds no profile of you — it records that a page was opened, roughly where in the world from, and on what kind of device. It cannot follow you to other websites.',
            'The planner’s AI step. When a plan is generated, the site sends the subject you picked, how prepared you said you were, and the list of units with the minutes each one got, to Google’s Gemini API, which writes the “in this block” instructions. That request contains no name, no email, no device identifier and nothing that could be traced back to you — it is a subject and a list of chapters. Every number on that page is worked out by the site, never by the model.',
            'Nothing else. The calculators, the percentage tools and the plan itself all run in your browser.',
          ]}
        />

        <Block
          title="Ads"
          body={[
            'Some pages carry ads, served by Google. That is what pays for the site, and it is the only thing that does — nothing here is sponsored, no company has asked for a mention, and no link on this site earns a commission.',
            'Google and its partners use cookies to serve those ads, and may use them to show ads based on your previous visits to this and other sites. That is how ad networks work and I cannot switch that part off from here — but you can. Google’s own controls let you turn off personalised advertising entirely, for every site, not just this one.',
          ]}
          links={[
            { label: 'Google Ads settings', href: 'https://adssettings.google.com/' },
            { label: 'How Google uses data from sites that use its services', href: 'https://policies.google.com/technologies/partner-sites' },
          ]}
        />

        <Block
          title="Things that go off-site"
          body={[
            'NCERT chapters open directly on ncert.nic.in. YouTube channels open on YouTube. Books link to a shop. Once you follow a link out, that site’s own rules apply and this page stops covering you.',
            'No content is copied or re-hosted here — the chapter links are an index into NCERT’s own files.',
          ]}
        />

        <Block
          title="Children"
          body={[
            'This site is written for school students, and a lot of its readers are under 18. That is exactly why it collects nothing: no account, no email capture, no form that asks for a name, and no analytics that identify a person. If you are under 13, the same is true — there is nothing here for you to hand over.',
          ]}
        />

        <Block
          title="Changes, and how to ask about it"
          body={[
            'If what this site does with data changes, this page changes with it and the date below moves. Nothing gets quietly added.',
            'Anything you want to ask — including “delete whatever you have about me”, which is a short conversation because the answer is that there is nothing to delete — goes to the email below.',
          ]}
        />
      </motion.div>

      <div className="border-line mt-12 border-t pt-6">
        <p className="text-faint text-[12px]">Last updated 30 July 2026.</p>
        <div className="mt-4 flex flex-wrap gap-2.5">
          <ButtonLink to="mailto:dpsgnotes@gmail.com" external size="sm" variant="secondary">
            dpsgnotes@gmail.com
          </ButtonLink>
          <ButtonLink to="/about" size="sm" variant="ghost">
            Who runs this
          </ButtonLink>
        </div>
      </div>
    </div>
  )
}

function Block({
  title,
  body,
  links,
}: {
  title: string
  body: string[]
  links?: { label: string; href: string }[]
}) {
  return (
    <motion.section variants={rise}>
      <h2 className="text-xl">{title}</h2>
      <div className="text-muted mt-2.5 space-y-3 text-[15px] leading-relaxed">
        {body.map((p) => (
          <p key={p.slice(0, 30)}>{p}</p>
        ))}
      </div>
      {links && (
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                target="_blank"
                rel="noreferrer noopener"
                className="text-mark text-[14px] font-medium underline underline-offset-2"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </motion.section>
  )
}
