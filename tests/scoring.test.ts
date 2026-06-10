import { describe, it, expect } from 'vitest';
import { QUESTIONS, type Axis } from '@/data/questions';
import { ARCHETYPES } from '@/data/archetypes';
import { computeCode, computeScores, type Answers, type AnswerLetter } from '@/lib/scoring';

const AXES: Axis[] = ['E1', 'E2', 'E3', 'E4'];
const POLE_A = ['I', 'S', 'L', 'P'];
const POLE_B = ['E', 'N', 'V', 'F'];

const byAxis = (axis: Axis) => QUESTIONS.filter((q) => q.axis === axis);

/**
 * Builds an answer set per axis. A single letter answers every question of
 * the axis; an array assigns letters question-by-question (missing entries
 * stay unanswered).
 */
function buildAnswers(perAxis: Partial<Record<Axis, AnswerLetter | AnswerLetter[]>>): Answers {
  const answers: Answers = {};
  for (const axis of AXES) {
    const spec = perAxis[axis];
    if (spec === undefined) continue;
    byAxis(axis).forEach((q, i) => {
      const letter = Array.isArray(spec) ? spec[i] : spec;
      if (letter !== undefined) answers[q.id] = letter;
    });
  }
  return answers;
}

describe('question bank', () => {
  it('has 16 questions, 4 per axis, with unique ids and 4 options each', () => {
    expect(QUESTIONS).toHaveLength(16);
    for (const axis of AXES) expect(byAxis(axis)).toHaveLength(4);

    const ids = QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(16);

    for (const q of QUESTIONS) {
      expect(q.options.map((o) => o.letter).sort()).toEqual(['a', 'b', 'c', 'd']);
    }
  });
});

describe('computeCode', () => {
  it('all strong Pole-A answers (a) → ISLP', () => {
    expect(computeCode(buildAnswers({ E1: 'a', E2: 'a', E3: 'a', E4: 'a' }))).toBe('ISLP');
  });

  it('all mild Pole-A answers (b) → ISLP', () => {
    expect(computeCode(buildAnswers({ E1: 'b', E2: 'b', E3: 'b', E4: 'b' }))).toBe('ISLP');
  });

  it('all strong Pole-B answers (d) → ENVF', () => {
    expect(computeCode(buildAnswers({ E1: 'd', E2: 'd', E3: 'd', E4: 'd' }))).toBe('ENVF');
  });

  it('mild beats nothing: a single mild answer decides an axis', () => {
    // E1 only one 'c' (-1) answered → Pole B; rest of axes all 'a'
    const answers = buildAnswers({ E1: ['c'], E2: 'a', E3: 'a', E4: 'a' });
    expect(computeCode(answers)).toBe('ESLP');
  });

  it('every one of the 16 codes is reachable and exists in the catalogue', () => {
    for (let mask = 0; mask < 16; mask++) {
      const perAxis: Partial<Record<Axis, AnswerLetter>> = {};
      let expected = '';
      AXES.forEach((axis, i) => {
        const poleA = (mask & (1 << i)) === 0;
        perAxis[axis] = poleA ? 'a' : 'd';
        expected += poleA ? POLE_A[i] : POLE_B[i];
      });
      const code = computeCode(buildAnswers(perAxis));
      expect(code).toBe(expected);
      expect(ARCHETYPES[code]).toBeDefined();
    }
  });

  it('exact tie with equal strong picks falls back to per-axis alternation (INLF)', () => {
    // Per axis: a(+2), a(+2), d(-2), d(-2) → sum 0, strong picks 2 vs 2.
    const tie: AnswerLetter[] = ['a', 'a', 'd', 'd'];
    const answers = buildAnswers({ E1: tie, E2: tie, E3: tie, E4: tie });
    // Alternation: even axis index → Pole A, odd → Pole B.
    expect(computeCode(answers)).toBe('INLF');
  });

  it('exact tie is broken toward the side with the strongest single answer', () => {
    // E1 partial: d(-2), b(+1), b(+1) → sum 0, strong A=0, strong B=1 → Pole B (E).
    const answers = buildAnswers({ E1: ['d', 'b', 'b'], E2: 'a', E3: 'a', E4: 'a' });
    expect(computeCode(answers)).toBe('ESLP');
  });
});

describe('computeScores', () => {
  it('no answers → 50 (balanced) on every axis', () => {
    const scores = computeScores({});
    for (const axis of AXES) expect(scores[axis]).toBe(50);
  });

  it('all strong Pole-A → 100, all strong Pole-B → 0', () => {
    const allA = computeScores(buildAnswers({ E1: 'a', E2: 'a', E3: 'a', E4: 'a' }));
    const allD = computeScores(buildAnswers({ E1: 'd', E2: 'd', E3: 'd', E4: 'd' }));
    for (const axis of AXES) {
      expect(allA[axis]).toBe(100);
      expect(allD[axis]).toBe(0);
    }
  });

  it('all mild Pole-A (b) → 75', () => {
    const scores = computeScores(buildAnswers({ E1: 'b', E2: 'b', E3: 'b', E4: 'b' }));
    for (const axis of AXES) expect(scores[axis]).toBe(75);
  });

  it('symmetric answers → 50', () => {
    const tie: AnswerLetter[] = ['a', 'a', 'd', 'd'];
    const scores = computeScores(buildAnswers({ E1: tie, E2: tie, E3: tie, E4: tie }));
    for (const axis of AXES) expect(scores[axis]).toBe(50);
  });

  it('ignores unanswered questions when normalising', () => {
    // Only 2 of 4 E1 questions answered, both strong A → still 100.
    const scores = computeScores(buildAnswers({ E1: ['a', 'a'] }));
    expect(scores.E1).toBe(100);
    expect(scores.E2).toBe(50);
  });
});
