/**
 * Things meant to leave the screen.
 *
 * Two kinds, both free, both designed for paper rather than for scrolling:
 *
 *   - **Wall charts.** The cheapest revision there is — you look at one for
 *     months without meaning to. Formulae only, no worked examples, because a
 *     chart you have to read is a chart you stop looking at.
 *   - **The parent page.** Deliberately not a "For Parents" section. A tab
 *     written for parents collides with a voice built on *"I've been through
 *     this"*, and no student clicks one. This is a single sheet the student
 *     sends to their mum — a gift they give, not a room the site keeps.
 *
 * Everything here is standard CBSE curriculum content stated plainly. Nothing
 * is invented and nothing is worked through; if a line needs explaining it does
 * not belong on a wall.
 */

export interface ChartGroup {
  heading: string
  /** `term` on the left, `value` on the right. Value may be an equation. */
  rows: { term: string; value: string }[]
}

export interface Printable {
  slug: string
  kind: 'chart' | 'letter'
  title: string
  subtitle: string
  /** Shown on screen, never printed. */
  blurb: string
  groups?: ChartGroup[]
  /** Used by the parent letter instead of groups. */
  sections?: { heading: string; items: string[] }[]
  footnote?: string
}

/* --- Wall charts ---------------------------------------------------------- */

const PHYSICS_FORMULAE: Printable = {
  slug: 'physics-formulae',
  kind: 'chart',
  title: 'Class 12 Physics',
  subtitle: 'The formulae, and nothing else',
  blurb:
    'Every formula the paper assumes you already know, on one sheet. Print it at A3, put it where you brush your teeth, and stop looking things up.',
  groups: [
    {
      heading: 'Electrostatics',
      rows: [
        { term: "Coulomb's law", value: 'F = (1/4πε₀) · q₁q₂/r²' },
        { term: 'Electric field', value: 'E = F/q₀ = (1/4πε₀) · q/r²' },
        { term: 'Dipole moment', value: 'p = q · 2a' },
        { term: 'Torque on dipole', value: 'τ = p × E' },
        { term: "Gauss's law", value: '∮ E·dA = q_enc/ε₀' },
        { term: 'Potential', value: 'V = (1/4πε₀) · q/r' },
        { term: 'Capacitance (parallel plate)', value: 'C = ε₀A/d' },
        { term: 'Energy in a capacitor', value: 'U = ½CV² = ½QV = Q²/2C' },
        { term: 'Capacitors in series', value: '1/C = 1/C₁ + 1/C₂ + …' },
        { term: 'Capacitors in parallel', value: 'C = C₁ + C₂ + …' },
      ],
    },
    {
      heading: 'Current electricity',
      rows: [
        { term: 'Drift velocity', value: 'v_d = eEτ/m,  I = neAv_d' },
        { term: 'Resistivity', value: 'R = ρL/A' },
        { term: 'Conductivity', value: 'σ = 1/ρ = ne²τ/m' },
        { term: "Kirchhoff's rules", value: 'Σ I = 0 at a junction · Σ V = 0 round a loop' },
        { term: 'Wheatstone balance', value: 'P/Q = R/S' },
        { term: 'Cells in series', value: 'ε = ε₁ + ε₂,  r = r₁ + r₂' },
      ],
    },
    {
      heading: 'Magnetism & induction',
      rows: [
        { term: 'Biot–Savart', value: 'dB = (μ₀/4π) · I dl sinθ / r²' },
        { term: 'Field, straight wire', value: 'B = μ₀I / 2πr' },
        { term: 'Field, solenoid centre', value: 'B = μ₀nI' },
        { term: 'Force on a conductor', value: 'F = BIL sinθ' },
        { term: 'Torque on a loop', value: 'τ = NBIA sinθ' },
        { term: "Faraday's law", value: 'ε = −N dΦ/dt' },
        { term: 'Self inductance', value: 'ε = −L dI/dt' },
        { term: 'Transformer', value: 'V_s/V_p = N_s/N_p = I_p/I_s' },
        { term: 'Resonance (LCR)', value: 'f = 1 / 2π√(LC)' },
      ],
    },
    {
      heading: 'Optics',
      rows: [
        { term: 'Mirror formula', value: '1/v + 1/u = 1/f,  f = R/2' },
        { term: 'Lens formula', value: '1/v − 1/u = 1/f' },
        { term: 'Magnification', value: 'm = v/u (lens) · m = −v/u (mirror)' },
        { term: 'Lens maker', value: '1/f = (n−1)(1/R₁ − 1/R₂)' },
        { term: 'Power', value: 'P = 1/f (metres), dioptres' },
        { term: 'Refractive index', value: 'n = c/v = sin i / sin r' },
        { term: 'Critical angle', value: 'sin C = 1/n' },
        { term: "Young's fringe width", value: 'β = λD/d' },
        { term: 'Compound microscope', value: 'M = (L/f_o)(D/f_e)' },
        { term: 'Telescope', value: 'M = f_o/f_e' },
      ],
    },
    {
      heading: 'Modern physics',
      rows: [
        { term: 'Photoelectric', value: 'hν = φ₀ + ½mv²_max' },
        { term: 'Stopping potential', value: 'eV₀ = hν − φ₀' },
        { term: 'de Broglie', value: 'λ = h/p = h/mv' },
        { term: 'Bohr radius', value: 'r_n = 0.529 n²/Z Å' },
        { term: 'Bohr energy', value: 'E_n = −13.6 Z²/n² eV' },
        { term: 'Mass–energy', value: 'E = mc²' },
        { term: 'Radioactive decay', value: 'N = N₀e^(−λt),  t½ = 0.693/λ' },
      ],
    },
    {
      heading: 'Electronic devices',
      rows: [
        { term: 'Diode, forward bias', value: 'Low resistance, current flows' },
        { term: 'Half-wave rectifier', value: 'Output for one half cycle · ripple 1.21' },
        { term: 'Full-wave rectifier', value: 'Output for both halves · ripple 0.48' },
        { term: 'Energy gap', value: 'Conductor ≈ 0 · Semiconductor ≈ 1 eV · Insulator > 3 eV' },
      ],
    },
  ],
  footnote:
    'Standard CBSE Class 12 Physics formulae. Check anything you are unsure of against NCERT before you rely on it — this is a memory aid, not a source.',
}

const MATHS_FORMULAE: Printable = {
  slug: 'maths-formulae',
  kind: 'chart',
  title: 'Class 12 Maths',
  subtitle: 'Calculus is 35 of the 80 marks',
  blurb:
    'The integrals and derivatives you are expected to produce from memory. Calculus alone is nearly half the paper — this is the half worth having on a wall.',
  groups: [
    {
      heading: 'Derivatives',
      rows: [
        { term: 'd/dx (xⁿ)', value: 'n·xⁿ⁻¹' },
        { term: 'd/dx (sin x)', value: 'cos x' },
        { term: 'd/dx (cos x)', value: '−sin x' },
        { term: 'd/dx (tan x)', value: 'sec² x' },
        { term: 'd/dx (eˣ)', value: 'eˣ' },
        { term: 'd/dx (ln x)', value: '1/x' },
        { term: 'd/dx (sin⁻¹x)', value: '1/√(1−x²)' },
        { term: 'd/dx (tan⁻¹x)', value: '1/(1+x²)' },
        { term: 'Product rule', value: '(uv)′ = u′v + uv′' },
        { term: 'Quotient rule', value: '(u/v)′ = (u′v − uv′)/v²' },
      ],
    },
    {
      heading: 'Integrals',
      rows: [
        { term: '∫ xⁿ dx', value: 'xⁿ⁺¹/(n+1) + C,  n ≠ −1' },
        { term: '∫ 1/x dx', value: 'ln|x| + C' },
        { term: '∫ eˣ dx', value: 'eˣ + C' },
        { term: '∫ sin x dx', value: '−cos x + C' },
        { term: '∫ sec²x dx', value: 'tan x + C' },
        { term: '∫ 1/(x²+a²) dx', value: '(1/a)·tan⁻¹(x/a) + C' },
        { term: '∫ 1/√(a²−x²) dx', value: 'sin⁻¹(x/a) + C' },
        { term: '∫ 1/(x²−a²) dx', value: '(1/2a)·ln|(x−a)/(x+a)| + C' },
        { term: '∫ √(a²−x²) dx', value: '(x/2)√(a²−x²) + (a²/2)sin⁻¹(x/a) + C' },
        { term: 'By parts', value: '∫u·v dx = u∫v dx − ∫(u′∫v dx) dx' },
      ],
    },
    {
      heading: 'Definite integral properties',
      rows: [
        { term: '∫₀ᵃ f(x) dx', value: '∫₀ᵃ f(a−x) dx' },
        { term: '∫₋ₐᵃ f(x) dx', value: '2∫₀ᵃ f(x) dx if even · 0 if odd' },
        { term: '∫ₐᵇ f(x) dx', value: '−∫_bᵃ f(x) dx' },
      ],
    },
    {
      heading: 'Vectors & 3D',
      rows: [
        { term: 'Dot product', value: 'a·b = |a||b|cosθ' },
        { term: 'Cross product', value: '|a×b| = |a||b|sinθ' },
        { term: 'Projection of a on b', value: '(a·b)/|b|' },
        { term: 'Line, vector form', value: 'r = a + λb' },
        { term: 'Shortest distance (skew)', value: '|(a₂−a₁)·(b₁×b₂)| / |b₁×b₂|' },
        { term: 'Plane', value: 'r·n̂ = d' },
      ],
    },
    {
      heading: 'Matrices & probability',
      rows: [
        { term: 'Inverse', value: 'A⁻¹ = adj(A)/|A|,  |A| ≠ 0' },
        { term: 'System AX = B', value: 'X = A⁻¹B' },
        { term: 'Conditional probability', value: 'P(A|B) = P(A∩B)/P(B)' },
        { term: "Bayes' theorem", value: 'P(Eᵢ|A) = P(Eᵢ)P(A|Eᵢ) / Σ P(Eⱼ)P(A|Eⱼ)' },
      ],
    },
  ],
  footnote:
    'Standard CBSE Class 12 Mathematics formulae. Check anything you are unsure of against NCERT before you rely on it.',
}

const ORGANIC_CONVERSIONS: Printable = {
  slug: 'organic-conversions',
  kind: 'chart',
  title: 'Organic conversions',
  subtitle: 'Class 12 Chemistry — the reagent above the arrow',
  blurb:
    'Organic is 26 of the 70 marks in Chemistry, and it is pattern-based — the same conversions come round every year. Chemistry is scored in half marks, so the reagent alone is worth writing even when you cannot finish the chain.',
  groups: [
    {
      heading: 'Haloalkanes',
      rows: [
        { term: 'Alcohol → Haloalkane', value: 'SOCl₂ (or PCl₅ / HX)' },
        { term: 'Haloalkane → Alcohol', value: 'aq. KOH' },
        { term: 'Haloalkane → Alkene', value: 'alc. KOH' },
        { term: 'Haloalkane → Nitrile', value: 'alc. KCN' },
        { term: 'Haloalkane → Amine', value: 'alc. NH₃, heat' },
        { term: 'Haloarene → Phenol', value: 'NaOH, 623 K, 300 atm' },
      ],
    },
    {
      heading: 'Alcohols & phenols',
      rows: [
        { term: 'Alkene → Alcohol', value: 'H₂O/H⁺ (Markovnikov)' },
        { term: 'Alkene → Anti-Markovnikov', value: 'B₂H₆ then H₂O₂/OH⁻' },
        { term: '1° Alcohol → Aldehyde', value: 'PCC' },
        { term: '1° Alcohol → Acid', value: 'KMnO₄/H⁺' },
        { term: '2° Alcohol → Ketone', value: 'PCC or CrO₃' },
        { term: 'Phenol → Salicylaldehyde', value: 'CHCl₃ + NaOH (Reimer–Tiemann)' },
        { term: 'Phenol → Salicylic acid', value: 'CO₂ + NaOH (Kolbe)' },
      ],
    },
    {
      heading: 'Carbonyls',
      rows: [
        { term: 'Acid → Acid chloride', value: 'SOCl₂' },
        { term: 'Acid chloride → Aldehyde', value: 'H₂/Pd–BaSO₄ (Rosenmund)' },
        { term: 'Nitrile → Aldehyde', value: 'SnCl₂/HCl then H₃O⁺ (Stephen)' },
        { term: 'Aldehyde → Alcohol', value: 'NaBH₄ or LiAlH₄' },
        { term: 'Carbonyl → Alkane', value: 'Zn-Hg/HCl (Clemmensen) · NH₂NH₂/KOH (Wolff–Kishner)' },
        { term: 'Aldol condensation', value: 'dil. NaOH — needs α-H' },
        { term: 'Cannizzaro', value: 'conc. NaOH — no α-H' },
      ],
    },
    {
      heading: 'Amines',
      rows: [
        { term: 'Nitro → Amine', value: 'Sn/HCl or H₂/Pd' },
        { term: 'Amide → 1° Amine (one C less)', value: 'Br₂/KOH (Hofmann)' },
        { term: 'Nitrile → 1° Amine', value: 'LiAlH₄ or H₂/Ni' },
        { term: 'Aniline → Diazonium', value: 'NaNO₂ + HCl, 273–278 K' },
        { term: 'Diazonium → Phenol', value: 'H₂O, warm' },
        { term: 'Diazonium → Halide', value: 'CuCl / CuBr (Sandmeyer)' },
        { term: 'Diazonium → Azo dye', value: 'Phenol / aniline, coupling' },
      ],
    },
    {
      heading: 'Distinguishing tests',
      rows: [
        { term: 'Aldehyde vs ketone', value: "Tollens' (silver mirror) · Fehling's (red ppt)" },
        { term: 'Methyl ketone', value: 'Iodoform test — I₂/NaOH, yellow ppt' },
        { term: '1° / 2° / 3° amine', value: 'Hinsberg test' },
        { term: 'Phenol', value: 'Neutral FeCl₃ — violet colour' },
        { term: 'Carboxylic acid', value: 'NaHCO₃ — effervescence' },
      ],
    },
  ],
  footnote:
    'Standard CBSE Class 12 Organic Chemistry conversions. Check anything you are unsure of against NCERT before you rely on it.',
}

/* --- The parent page ------------------------------------------------------ */

const FOR_PARENTS: Printable = {
  slug: 'for-parents',
  kind: 'letter',
  title: 'For a parent, the night before',
  subtitle: 'One page. Written by a student who has just done this.',
  blurb:
    'Not a section of this site — a single sheet meant to be printed or sent on. If your parents are worried and you do not know how to say any of this, send them this instead.',
  sections: [
    {
      heading: 'What actually helps',
      items: [
        'Food, on time, without being asked for. The single most useful thing anyone did for me.',
        'A quiet house after about nine. Not silence — just nobody starting conversations.',
        'Letting them sleep. Six or seven hours beats two more hours of revision, every time, and it is the hardest thing to allow when you can see the light on.',
        'Saying "you have done enough" once, and meaning it. Not repeatedly, and not as a question.',
        'Having the bag, the admit card and the pens ready by the door so the morning is not a search.',
      ],
    },
    {
      heading: 'What does not help, however kindly meant',
      items: [
        '"How much is left?" — there is no answer to this that makes anyone feel better.',
        'Comparisons to a cousin, a neighbour, or to yourself at their age.',
        'Asking what marks they expect. They do not know, and being made to guess out loud is its own kind of pressure.',
        'Bringing up admissions, cutoffs or careers on the night before a paper. All of it will still be there in June.',
        'Sitting with them to "supervise". It converts a study session into a performance.',
      ],
    },
    {
      heading: 'Two things worth knowing about the exam itself',
      items: [
        'CBSE moderation is real. I have my evaluated answer scripts and my marksheet, and two of my five papers gained marks after evaluation — nine marks in total. A paper that felt like a disaster on the day is often not the disaster it felt like.',
        'Nobody walks out of a board exam feeling they did well. That feeling is not information, and it is worth telling them so before they come home and tell you it went badly.',
      ],
    },
    {
      heading: 'And afterwards',
      items: [
        'Do not ask how it went in the car. Ask after they have eaten, if at all.',
        'There is another paper in two days. The most useful thing on the evening of a bad paper is helping them stop thinking about it.',
      ],
    },
  ],
  footnote:
    'Written by Aryan Rao, Class of 2026, who scored 95.2% and 92.8% studying mostly at the last minute. allnighter.in — no login, nothing locked.',
}

export const PRINTABLES: Printable[] = [
  FOR_PARENTS,
  PHYSICS_FORMULAE,
  MATHS_FORMULAE,
  ORGANIC_CONVERSIONS,
]

export const printableBySlug = (slug: string) => PRINTABLES.find((p) => p.slug === slug)
