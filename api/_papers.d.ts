// Types for the generated `_papers.js`. Kept by hand and deliberately minimal —
// it only has to describe what api/plan.ts reads.
export interface ApiUnit {
  n: number
  name: string
  marks: number
  asked: string
}
export interface ApiPaper {
  slug: string
  subject: string
  code: string
  grade: 11 | 12
  theoryMarks: number
  internalMarks: number
  units: ApiUnit[]
}
export declare const PAPERS: ApiPaper[]
export declare function paperBySlug(slug: string): ApiPaper | undefined
