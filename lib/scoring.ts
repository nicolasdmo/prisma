import { QUESTIONS } from '@/data/questions';

export type AnswerLetter = 'a' | 'b' | 'c' | 'd';
export type Answers = Record<number, AnswerLetter>;

/**
 * Weighted pole model.
 *   a = strong Pole-A (+2)   b = mild Pole-A (+1)
 *   c = mild  Pole-B (-1)    d = strong Pole-B (-2)
 *
 * Using the answer intensity (not just a binary a|b vs c|d count) makes the
 * result more accurate and lets axes have an even number of questions without
 * the systematic tie-bias a plain majority count would introduce.
 */
const WEIGHT: Record<AnswerLetter, number> = { a: 2, b: 1, c: -1, d: -2 };

/** a | b → Pole-A. Kept for any external callers. */
export const isAPole = (letter: AnswerLetter): boolean =>
  letter === 'a' || letter === 'b';

const AXES = ['E1', 'E2', 'E3', 'E4'] as const;
const POLE_A = ['I', 'S', 'L', 'P'];
const POLE_B = ['E', 'N', 'V', 'F'];

/**
 * Compute the 4-letter archetype code.
 *
 * Axis  Pole-A  Pole-B
 * E1    I       E      (Introspectivo / Expresivo)
 * E2    S       N      (Sensitivo    / iNtuitivo)
 * E3    L       V      (Lógico       / Valores)
 * E4    P       F      (Planificador / Flexible)
 *
 * Positive weighted sum → Pole-A, negative → Pole-B. On an exact tie we break
 * toward whichever pole got the more extreme single answer; if still perfectly
 * symmetric we alternate the default per axis so neither pole is favoured overall.
 */
export function computeCode(answers: Answers): string {
  return AXES
    .map((axis, i) => {
      const axisQs = QUESTIONS.filter((q) => q.axis === axis);

      let sum = 0;
      for (const q of axisQs) {
        const ans = answers[q.id];
        if (ans !== undefined) sum += WEIGHT[ans];
      }

      if (sum > 0) return POLE_A[i];
      if (sum < 0) return POLE_B[i];

      // Exact tie — break by strongest single pick, then alternate by axis.
      const strongA = axisQs.filter((q) => answers[q.id] === 'a').length;
      const strongB = axisQs.filter((q) => answers[q.id] === 'd').length;
      if (strongA !== strongB) return strongA > strongB ? POLE_A[i] : POLE_B[i];
      return i % 2 === 0 ? POLE_A[i] : POLE_B[i];
    })
    .join('');
}

/**
 * Per-axis lean toward Pole-A as a 0–100 percentage (for result visualisation).
 * 100 = fully Pole-A, 0 = fully Pole-B, 50 = balanced.
 */
export function computeScores(answers: Answers): Record<string, number> {
  const scores: Record<string, number> = {};
  for (const axis of AXES) {
    const axisQs = QUESTIONS.filter((q) => q.axis === axis);

    let sum = 0;
    let maxAbs = 0;
    for (const q of axisQs) {
      const ans = answers[q.id];
      if (ans !== undefined) {
        sum += WEIGHT[ans];
        maxAbs += 2; // strongest possible weight per answered question
      }
    }

    scores[axis] = maxAbs === 0
      ? 50
      : Math.round(((sum + maxAbs) / (2 * maxAbs)) * 100);
  }
  return scores;
}
