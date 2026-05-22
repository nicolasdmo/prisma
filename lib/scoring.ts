import { QUESTIONS } from '@/data/questions';

export type AnswerLetter = 'a' | 'b' | 'c' | 'd';
export type Answers = Record<number, AnswerLetter>;

/**
 * Maps a raw answer letter to a binary pole.
 * a | b  →  Pole-A  (Introspectivo / Sensitivo / Lógico / Planificador)
 * c | d  →  Pole-B  (Expresivo / iNtuitivo / Valores / Flexible)
 */
export const isAPole = (letter: AnswerLetter): boolean =>
  letter === 'a' || letter === 'b';

/**
 * Given answers keyed by question id, compute the 4-letter archetype code.
 *
 * Axis  Pole-A  Pole-B
 * E1    I       E      (Introspectivo / Expresivo)
 * E2    S       N      (Sensitivo    / iNtuitivo)
 * E3    L       V      (Lógico       / Valores)
 * E4    P       F      (Planificador / Flexible)
 *
 * Majority wins: ≥ 3 out of 4 axis questions on Pole-A → Pole-A wins.
 * Tie (2–2) defaults to Pole-B.
 */
export function computeCode(answers: Answers): string {
  const axes  = ['E1', 'E2', 'E3', 'E4'] as const;
  const poleA = ['I', 'S', 'L', 'P'];
  const poleB = ['E', 'N', 'V', 'F'];

  return axes
    .map((axis, i) => {
      const axisQs = QUESTIONS.filter((q) => q.axis === axis);
      const aCount = axisQs.filter((q) => {
        const ans = answers[q.id];
        return ans !== undefined && isAPole(ans);
      }).length;
      // Strict majority → Pole A; ties go to Pole B (works for any axis length)
      return aCount * 2 > axisQs.length ? poleA[i] : poleB[i];
    })
    .join('');
}

/**
 * Returns per-axis A-pole percentage (0–100) — useful for result visualisation.
 */
export function computeScores(answers: Answers): Record<string, number> {
  const axes = ['E1', 'E2', 'E3', 'E4'] as const;
  const scores: Record<string, number> = {};
  for (const axis of axes) {
    const axisQs = QUESTIONS.filter((q) => q.axis === axis);
    const aCount = axisQs.filter((q) => {
      const ans = answers[q.id];
      return ans !== undefined && isAPole(ans);
    }).length;
    scores[axis] = Math.round((aCount / axisQs.length) * 100);
  }
  return scores;
}
