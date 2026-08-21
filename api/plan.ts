// Generated from src/data/papers.ts by scripts/build-api-papers.mjs.
// Importing '../src/data/papers' directly typechecks, builds, and then dies in
// production with ERR_MODULE_NOT_FOUND — Vercel transpiles this file but emits
// nothing it imports from outside api/. See that script's header.
import { PAPERS, paperBySlug } from './_papers.js'

/*
 * The only place this site talks to a model.
 *
 * ## What it is for
 *
 * `/tonight` already decides *which* units to study and *for how long* — that
 * is arithmetic, it lives in `src/lib/allnighter.ts`, and it is deterministic.
 * What it could never say is what to actually DO inside a ninety-minute block
 * on Electrochemistry. That gap is the whole reason this endpoint exists.
 *
 * ## The rule this inherits from Rally, and it is not negotiable
 *
 * **The model writes; it never computes.** Every number a student sees —
 * minutes, marks, the expected range, the pass mark — is rendered by the site
 * from the deterministic plan. The model is handed those numbers as context and
 * is forbidden from restating or recalculating them. If a number is ever wrong
 * on this site, the bug is findable in a TypeScript file rather than lurking in
 * a language model.
 *
 * ## Why this is not an open LLM relay
 *
 * The site has no accounts and no database, so there is no token to check. The
 * defence is the payload instead: the caller sends a **paper slug, a prep level,
 * and unit numbers with minutes**, and nothing else. Every one of those is
 * validated against `papers.ts` before anything is spent, and the prompt is
 * assembled *here* from our own copy of the unit data. There is no field an
 * attacker can put arbitrary text into, so the endpoint cannot be turned into a
 * free general-purpose Gemini proxy. That is worth more than a rate limit.
 *
 * ## It must never break the plan
 *
 * Every failure path returns a status the client treats as "carry on without
 * me". The plan is complete and useful with no AI at all; this only ever adds.
 */

const PREPS = ['nothing', 'some', 'most'] as const
type Prep = (typeof PREPS)[number]

/**
 * Aliases, not pinned versions — Google retires pinned models, which is how
 * `gemini-2.5-*` died the week this key was created.
 *
 * Two of them, tried in order, because the free tier returns a 503 "high demand"
 * often enough that a single attempt is not a working feature — it happened on
 * the very first live call from this file. The lite model draws on a separate
 * quota and is more than good enough for four imperative sentences about
 * Electrochemistry, so falling back to it beats showing the student nothing.
 */
const MODELS = ['gemini-flash-latest', 'gemini-flash-lite-latest'] as const

const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    opening: { type: 'string' },
    blocks: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          n: { type: 'integer' },
          steps: { type: 'array', items: { type: 'string' } },
        },
        required: ['n', 'steps'],
        propertyOrdering: ['n', 'steps'],
      },
    },
    beforeYouGoIn: { type: 'array', items: { type: 'string' } },
  },
  required: ['opening', 'blocks', 'beforeYouGoIn'],
  propertyOrdering: ['opening', 'blocks', 'beforeYouGoIn'],
} as const

const PREP_WORDS: Record<Prep, string> = {
  nothing: 'has not opened this subject properly all year — tonight is first contact with most of it',
  some: 'has done about half of it — some chapters are solid, most are not',
  most: 'knows most of it and is revising rather than learning',
}

const SYSTEM = `You write the inside of a study plan for CBSE students, for a site called All Nighter. It is used by one kind of person: someone whose exam is very soon and who has less time than they need.

The site has ALREADY worked out which units they will study and for exactly how many minutes each. You are not being asked to plan. You are being asked, for each block, what to physically DO in those minutes.

HARD RULES

1. Never state, restate, recalculate or predict any number of marks, any percentage, any duration, or any grade. The page prints all of those itself, right next to your words. If you mention a number that disagrees with the page, you have broken the site's only real asset. Refer to time as "this block" or "the first half", never in minutes.
2. Never invent syllabus content. Only use what the unit description gives you plus genuinely standard CBSE knowledge for that subject. If you are unsure whether a topic is in the unit, leave it out.
3. Be concrete and physical. "Revise Electrochemistry" is worthless. "Write the Nernst equation from memory, then do three cell-EMF numericals with the solutions covered" is the job. Name the equation, the reaction type, the question format, the derivation.
4. Fit the instruction to the block. A short block buys definitions and standard results; a long one buys worked questions. Say what to SKIP as readily as what to do — choosing the loss is the site's whole method.
5. No motivational language. No "you've got this", no "stay positive", no exclamation marks, no emoji. Warm and level, never a poster. The student is stressed and being cheered at is insulting.
6. Never promise an outcome. Do not say this will get them marks, a pass, or a grade.

VOICE

Second person. Plain British-flavoured English, short sentences, no jargon about studying. Written by someone who sat these papers two years ago and remembers it, not by a teacher and not by a brand.

SHAPE

- opening: two or three sentences on how to approach this specific night for this specific subject. Not a summary of the plan — the student can see the plan. Say the thing about this subject that is easy to get wrong tonight.
- blocks: for each unit number given, three to five imperative steps, in the order they should be done.
- beforeYouGoIn: two or three things to do in the last stretch before the paper. Practical only.`

interface Body {
  paper?: unknown
  prep?: unknown
  blocks?: unknown
}

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json',
      // The answer depends only on (paper, prep, block shape) and costs quota,
      // so let the edge keep it. Two students revising the same Chemistry units
      // the same night should not spend two calls.
      'cache-control': status === 200 ? 'public, s-maxage=86400, stale-while-revalidate=604800' : 'no-store',
    },
  })

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') return json({ error: 'POST only' }, 405)

  const key = process.env.GEMINI_API_KEY
  // Not configured is not an error the student should ever see — the plan is
  // complete without this.
  if (!key) return json({ error: 'unconfigured' }, 503)

  let body: Body
  try {
    body = (await request.json()) as Body
  } catch {
    return json({ error: 'bad json' }, 400)
  }

  const paper = typeof body.paper === 'string' ? paperBySlug(body.paper) : undefined
  if (!paper) return json({ error: 'unknown paper' }, 400)

  const prep = PREPS.find((p) => p === body.prep)
  if (!prep) return json({ error: 'unknown prep' }, 400)

  if (!Array.isArray(body.blocks) || body.blocks.length === 0 || body.blocks.length > 12) {
    return json({ error: 'bad blocks' }, 400)
  }

  // Every block must name a real unit of that real paper. This is the check that
  // makes the endpoint useless to anyone who is not the site.
  const blocks: { unit: (typeof paper.units)[number]; minutes: number }[] = []
  for (const raw of body.blocks as unknown[]) {
    const b = raw as { n?: unknown; minutes?: unknown }
    const unit = paper.units.find((u) => u.n === b.n)
    const minutes = typeof b.minutes === 'number' ? Math.round(b.minutes) : NaN
    if (!unit || !Number.isFinite(minutes) || minutes < 5 || minutes > 24 * 60) {
      return json({ error: 'bad block' }, 400)
    }
    if (!blocks.some((x) => x.unit.n === unit.n)) blocks.push({ unit, minutes })
  }

  // Built here, from our data — never from anything the caller wrote.
  const userText = [
    `Subject: Class ${paper.grade} ${paper.subject} (CBSE code ${paper.code}).`,
    `The student ${PREP_WORDS[prep]}.`,
    '',
    'Blocks the site has already scheduled, in order:',
    ...blocks.map(({ unit, minutes }, i) => {
      const share = minutes / (unit.marks * 12)
      const size = share < 0.35 ? 'a short block' : share < 0.8 ? 'a moderate block' : 'a long block'
      return `${i + 1}. unit n=${unit.n} — "${unit.name}" (${size} relative to how much is in it).\n   What this unit covers: ${unit.asked}`
    }),
    '',
    'Write the opening, the steps for each unit n above, and the last-stretch list.',
  ].join('\n')

  const payload = JSON.stringify({
    systemInstruction: { parts: [{ text: SYSTEM }] },
    contents: [{ role: 'user', parts: [{ text: userText }] }],
    generationConfig: {
      temperature: 0.6,
      // These models think before they write and thought tokens count against
      // the ceiling — a low limit truncates mid-sentence.
      maxOutputTokens: 4096,
      responseMimeType: 'application/json',
      responseSchema: RESPONSE_SCHEMA,
    },
  })

  let res: Response | null = null
  for (const model of MODELS) {
    const abort = new AbortController()
    const deadline = setTimeout(() => abort.abort(), 20_000)
    try {
      res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: 'POST',
          signal: abort.signal,
          headers: { 'x-goog-api-key': key, 'content-type': 'application/json' },
          body: payload,
        },
      )
    } catch (err) {
      console.error('gemini', model, (err as Error)?.name === 'AbortError' ? 'timeout' : err)
      res = null
    } finally {
      clearTimeout(deadline)
    }

    // Overloaded or rate-limited is the next model's problem, not the student's.
    if (res && res.ok) break
    if (res && res.status !== 429 && res.status !== 503) break
    if (res) console.error('gemini', model, res.status)
    res = res && res.ok ? res : null
  }

  if (!res) return json({ error: 'unavailable' }, 503)
  if (res.status === 429) return json({ error: 'quota' }, 429)
  if (!res.ok) {
    console.error('gemini', res.status, (await res.text()).slice(0, 300))
    return json({ error: 'upstream' }, 502)
  }

  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[]
  }
  const raw = (data.candidates?.[0]?.content?.parts ?? []).map((p) => p.text ?? '').join('').trim()
  if (!raw) return json({ error: 'empty' }, 502)

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return json({ error: 'unparseable' }, 502)
  }

  // Trust the schema, but only hand back blocks that match units we sent — a
  // hallucinated unit number would render against the wrong chapter.
  const out = parsed as { opening?: string; blocks?: { n?: number; steps?: string[] }[]; beforeYouGoIn?: string[] }
  const clean = {
    opening: typeof out.opening === 'string' ? out.opening.trim() : '',
    blocks: (out.blocks ?? [])
      .filter((b) => blocks.some((x) => x.unit.n === b.n))
      .map((b) => ({ n: b.n as number, steps: (b.steps ?? []).filter((s) => typeof s === 'string' && s.trim()).slice(0, 6) }))
      .filter((b) => b.steps.length > 0),
    beforeYouGoIn: (out.beforeYouGoIn ?? []).filter((s) => typeof s === 'string' && s.trim()).slice(0, 4),
  }
  if (!clean.opening && clean.blocks.length === 0) return json({ error: 'empty' }, 502)

  return json(clean, 200)
}

/** Exported so a build-time check can prove the slug list the client sends is real. */
export const KNOWN_PAPERS = PAPERS.map((p) => p.slug)
