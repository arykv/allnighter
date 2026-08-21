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

/** One entry per unit, with the minutes summed across split blocks. */
function unitMinutes(plan: Plan) {
  const totals = new Map<number, number>()
  for (const b of plan.blocks) {
    totals.set(b.unit.n, (totals.get(b.unit.n) ?? 0) + b.minutes)
  }
  return [...totals].map(([n, minutes]) => ({ n, minutes }))
}

export async function fetchAiPlan(plan: Plan, signal: AbortSignal): Promise<AiPlan | null> {
  const blocks = unitMinutes(plan)
  if (!blocks.length) return null

  const res = await fetch('/api/plan', {
    method: 'POST',
    signal,
    headers: { 'content-type': 'application/json' },
    // Deliberately the smallest payload that identifies the work: a paper slug,
    // a preparation level, and unit numbers. No free text, which is what stops
    // the endpoint being usable as a general-purpose model relay.
    body: JSON.stringify({ paper: plan.paper.slug, prep: plan.prep, blocks }),
  })

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
