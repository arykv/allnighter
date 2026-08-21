import { useEffect, useState } from 'react'
import type { Plan } from './allnighter'

/**
 * The AI half of "Pull an all nighter".
 *
 * `allnighter.ts` decides *which* units and *for how long*. That is arithmetic
 * and it stays deterministic — see the header of that file for why. This asks
 * a model the one thing arithmetic cannot answer: what to physically do inside
 * a block on this specific unit of this specific paper.
 *
 * **It is additive, always.** Every failure here is silent: no error banner, no
 * retry prompt, no empty state. The plan is complete and useful with nothing
 * from this file, and a student at 1am does not need to be told that a service
 * they never asked for is unavailable. If it works, the plan gets better; if it
 * doesn't, they never learn it exists.
 */

export interface AiPlan {
  /** Two or three sentences on how to approach this night for this subject. */
  opening: string
  /** Keyed by `Unit.n`. */
  blocks: { n: number; steps: string[] }[]
  beforeYouGoIn: string[]
}

/**
 * One entry per unit, with minutes summed across split blocks and then thrown
 * away in favour of a single letter.
 *
 * **The bucketing is a cost decision, not a simplification.** The prompt only
 * ever asked whether a block was short, moderate or long relative to the size
 * of the unit — it never used the raw number. Sending minutes would make almost
 * every request URL unique, so the CDN could never serve two students the same
 * answer, and the key is paid. Three letters collapse that to a handful of URLs
 * per paper.
 */
function unitSizes(plan: Plan) {
  const totals = new Map<number, { minutes: number; marks: number }>()
  for (const b of plan.blocks) {
    const seen = totals.get(b.unit.n)
    totals.set(b.unit.n, {
      minutes: (seen?.minutes ?? 0) + b.minutes,
      marks: b.unit.marks,
    })
  }
  return [...totals].map(([n, { minutes, marks }]) => {
    // Same thresholds the server used to apply to raw minutes.
    const share = minutes / (marks * 12)
    const size = share < 0.35 ? 's' : share < 0.8 ? 'm' : 'l'
    return `${n}:${size}`
  })
}

export async function fetchAiPlan(plan: Plan, signal: AbortSignal): Promise<AiPlan | null> {
  const units = unitSizes(plan)
  if (!units.length) return null

  // A GET, so the answer can actually be cached at the edge — as a POST the
  // cache header on the response did nothing and every plan cost a paid call.
  // The query carries a paper slug, a preparation level and unit numbers: no
  // free text, which is what stops this being usable as a model relay, and
  // nothing that identifies the person asking.
  const qs = new URLSearchParams({ p: plan.paper.slug, prep: plan.prep, u: units.join(',') })
  const res = await fetch(`/api/plan?${qs}`, { signal })

  if (!res.ok) return null
  return (await res.json()) as AiPlan
}

export type AiState =
  | { status: 'off' }
  | { status: 'loading' }
  | { status: 'ready'; data: AiPlan }

export function useAiPlan(plan: Plan | null): AiState {
  const [state, setState] = useState<AiState>({ status: 'off' })

  useEffect(() => {
    if (!plan || !plan.blocks.length) {
      setState({ status: 'off' })
      return
    }

    const controller = new AbortController()
    setState({ status: 'loading' })

    fetchAiPlan(plan, controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return
        // No data is not an error state on this page — it is simply the plan
        // without the extra layer.
        setState(data ? { status: 'ready', data } : { status: 'off' })
      })
      .catch(() => {
        if (!controller.signal.aborted) setState({ status: 'off' })
      })

    return () => controller.abort()
    // The plan object is rebuilt only when the student changes an answer, and
    // that is exactly when this should run again.
  }, [plan])

  return state
}

export const stepsFor = (ai: AiState, n: number) =>
  ai.status === 'ready' ? (ai.data.blocks.find((b) => b.n === n)?.steps ?? null) : null
