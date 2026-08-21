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
 *
 * ## Cost — the key is paid, so every uncached call is money
 *
 * This is a public endpoint with no account behind it, so the defences against
 * running up a bill are structural rather than authenticated:
 *
 * 1. **It is a GET, and that is the whole point.** It began as a POST carrying a
 *    `s-maxage` header, which did nothing at all — CDNs do not cache POST, so
 *    every single plan ever generated was a paid Gemini call. As a cacheable GET
 *    the same request costs one call per day globally instead of one per student.
 * 2. **The query is deliberately low-cardinality.** The block length is sent as
 *    one of three letters, never as raw minutes, because the prompt only ever
 *    needed "short/moderate/long". Minutes would have made almost every URL
 *    unique and defeated the cache completely.
 * 3. **A per-IP burst limit** catches the cache-miss flood a determined caller
 *    could still generate by walking valid combinations.
 */

const PREPS = ['nothing', 'some', 'most'] as const
type Prep = (typeof PREPS)[number]

/**
 * Aliases, not pinned versions — Google retires pinned models, which is how
 * `gemini-2.5-*` died the week this key was created.
 *
 * **Lite first, and that is not a compromise.** Measured on this key: lite
 * answers this prompt in about 1.1s, while `gemini-flash-latest` returned 503
 * "high demand" on every attempt across two sessions. The good output this
 * feature shipped with came from lite — flash never once succeeded. Asking the
 * bigger model first bought nothing and cost the entire request budget, which
 * is how the first production call died with FUNCTION_INVOCATION_TIMEOUT.
 *
 * The task is four imperative sentences about a chapter. It does not need the
 * larger model, and flash stays only as a second chance if lite is rate-limited.
 *
 * Do NOT add `thinkingConfig: { thinkingBudget: 0 }` — lite rejects it outright
 * with a 400, and it is not needed anyway at this latency.
 */
const MODELS = ['gemini-flash-lite-latest', 'gemini-flash-latest'] as const

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

const SIZES = { s: 'a short block', m: 'a moderate block', l: 'a long block' } as const
type SizeKey = keyof typeof SIZES

/**
 * A per-IP burst limit, held in module scope.
 *
 * Serverless instances are ephemeral and there are several of them, so this is
 * emphatically not a global quota — it cannot be, without the database this
 * project deliberately does not have. What it does do is stop one caller in a
 * loop from turning a warm instance into a billing incident, which is the
 * realistic threat for a page like this. The cache above handles honest load.
 */
const HITS = new Map<string, { n: number; resetAt: number }>()
const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 15

function overLimit(ip: string, now: number): boolean {
  const seen = HITS.get(ip)
  if (!seen || now > seen.resetAt) {
    HITS.set(ip, { n: 1, resetAt: now + WINDOW_MS })
    // Cheap sweep so a long-lived instance cannot grow this map without bound.
    if (HITS.size > 5_000) {
      for (const [k, v] of HITS) if (now > v.resetAt) HITS.delete(k)
    }
    return false
  }
  seen.n += 1
  return seen.n > MAX_PER_WINDOW
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

/**
 * A NAMED METHOD EXPORT, not a default one — this is load-bearing.
 *
 * Vercel's Node runtime reads `export default` as the classic
 * `(req, res) => void` signature and *ignores whatever it returns*. Exporting a
 * web-standard `(Request) => Response` handler as the default therefore does not
 * error: the function runs, builds a perfectly good Response, returns it into
 * the void, and the request hangs until it is killed at `maxDuration`. It
 * presents as `FUNCTION_INVOCATION_TIMEOUT`, which sends you hunting for a slow
 * upstream that isn't slow.
 *
 * `export async function POST` is the fix, and it also means the runtime handles
 * method routing — a GET gets a 405 without any code here.
 */
export async function GET(request: Request): Promise<Response> {
  const key = process.env.GEMINI_API_KEY
  // Not configured is not an error the student should ever see — the plan is
  // complete without this.
  if (!key) return json({ error: 'unconfigured' }, 503)

  const url = new URL(request.url)
  const paper = paperBySlug(url.searchParams.get('p') ?? '')
  if (!paper) return json({ error: 'unknown paper' }, 400)

  const prep = PREPS.find((x) => x === url.searchParams.get('prep'))
  if (!prep) return json({ error: 'unknown prep' }, 400)

  // `u` is `unit:size` pairs — `4:l,10:m`. Sizes are letters rather than minutes
  // so that the set of possible URLs stays small enough to actually cache.
  const pairs = (url.searchParams.get('u') ?? '').split(',').filter(Boolean)
  if (!pairs.length || pairs.length > 12) return json({ error: 'bad blocks' }, 400)

  const blocks: { unit: (typeof paper.units)[number]; size: SizeKey }[] = []
  for (const pair of pairs) {
    const [nStr, sizeStr] = pair.split(':')
    const unit = paper.units.find((u) => String(u.n) === nStr)
    const size = (Object.keys(SIZES) as SizeKey[]).find((k) => k === sizeStr)
    if (!unit || !size) return json({ error: 'bad block' }, 400)
    if (!blocks.some((x) => x.unit.n === unit.n)) blocks.push({ unit, size })
  }

  // Only past validation, so a flood of malformed requests costs nothing and a
  // flood of valid ones is what actually gets limited.
  const ip =
    request.headers.get('x-vercel-forwarded-for') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  if (overLimit(ip, Date.now())) return json({ error: 'slow down' }, 429)

  // Built here, from our data — never from anything the caller wrote.
  const userText = [
    `Subject: Class ${paper.grade} ${paper.subject} (CBSE code ${paper.code}).`,
    `The student ${PREP_WORDS[prep]}.`,
    '',
    'Blocks the site has already scheduled, in order:',
    ...blocks.map(
      ({ unit, size }, i) =>
        `${i + 1}. unit n=${unit.n} — "${unit.name}" (${SIZES[size]} relative to how much is in it).\n   What this unit covers: ${unit.asked}`,
    ),
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
    const deadline = setTimeout(() => abort.abort(), 8_000)
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
