'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { track } from '@vercel/analytics';
import { useRouter } from 'next/navigation';
import { QUESTIONS } from '@/data/questions';
import { computeCode, computeScores, type Answers, type AnswerLetter } from '@/lib/scoring';

const AXIS_LABELS: Record<string, string> = {
  E1: 'Energía',
  E2: 'Percepción',
  E3: 'Decisión',
  E4: 'Estilo',
};

export default function TestRunner() {
  const router   = useRouter();
  const [current,   setCurrent]   = useState(0);
  const [answers,   setAnswers]   = useState<Answers>({});
  const [selected,  setSelected]  = useState<AnswerLetter | null>(null);
  const [direction, setDirection] = useState(1);

  const question = QUESTIONS[current];
  const total    = QUESTIONS.length;
  const progress = current / total;
  const isLast   = current === total - 1;

  const handleSelect = useCallback(
    (letter: AnswerLetter) => {
      if (selected) return;
      setSelected(letter);

      const newAnswers = { ...answers, [question.id]: letter };
      setAnswers(newAnswers);

      setTimeout(() => {
        if (isLast) {
          const code   = computeCode(newAnswers);
          const scores = computeScores(newAnswers);
          try { localStorage.setItem('prisma_scores', JSON.stringify(scores)); } catch {}
          track('test_completed', { code });
          router.push(`/r/${code}`);
        } else {
          setDirection(1);
          setCurrent((c) => c + 1);
          setSelected(null);
        }
      }, 380);
    },
    [selected, answers, question.id, isLast, router]
  );

  const handleBack = () => {
    if (current === 0) return;
    setDirection(-1);
    setCurrent((c) => c - 1);
    setSelected(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg">

      {/* ── Progress bar ──────────────────────────────────────── */}
      <div className="flex items-center gap-4 px-5 sm:px-10 py-4 border-b border-line-soft">
        <span className="font-mono text-[11px] text-ink-mute tracking-widest shrink-0">
          {current + 1}&thinsp;/&thinsp;{total}
        </span>
        <div className="progress-track flex-1">
          <motion.div
            className="progress-fill"
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
          />
        </div>
        <motion.span
          key={question.axis}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="eyebrow shrink-0"
        >
          {AXIS_LABELS[question.axis]}
        </motion.span>
      </div>

      {/* ── Question + options ────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 sm:px-10 py-8">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={question.id}
              custom={direction}
              variants={{
                enter:  (d: number) => ({ x: d > 0 ? 48 : -48, opacity: 0 }),
                center: { x: 0, opacity: 1 },
                exit:   (d: number) => ({ x: d > 0 ? -48 : 48, opacity: 0 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Question — single unified text */}
              <h2
                className="font-serif text-2xl sm:text-3xl text-ink leading-snug mb-7"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                {question.text}
              </h2>

              {/* Options — single column always, compact */}
              <div className="flex flex-col gap-2.5">
                {question.options.map((opt) => {
                  const isChosen = selected === opt.letter;
                  const isDimmed = selected !== null && !isChosen;

                  return (
                    <motion.button
                      key={opt.letter}
                      onClick={() => handleSelect(opt.letter)}
                      animate={{ opacity: isDimmed ? 0.22 : 1, scale: isChosen ? 0.98 : 1 }}
                      transition={{ duration: 0.16 }}
                      whileHover={!selected ? { scale: 1.005 } : {}}
                      disabled={selected !== null}
                      className={`
                        w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-xl border-2
                        transition-all duration-150 cursor-pointer
                        ${isChosen
                          ? 'bg-ink border-ink text-bg-card shadow-sm'
                          : 'bg-bg-card border-line hover:border-ink-soft hover:shadow-sm'
                        }
                      `}
                    >
                      <span className="text-xl shrink-0">{opt.emoji}</span>
                      <span className={`text-sm leading-snug ${isChosen ? 'text-bg-card' : 'text-ink'}`}>
                        {opt.text}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Back / counter ────────────────────────────────────── */}
      <div className="px-5 sm:px-10 pb-6 flex justify-between items-center max-w-lg mx-auto w-full">
        <button
          onClick={handleBack}
          disabled={current === 0}
          className="font-mono text-xs text-ink-faint tracking-wider uppercase hover:text-ink transition-colors disabled:opacity-0"
        >
          ← Anterior
        </button>
        <span className="font-mono text-[10px] text-ink-faint tracking-wider">
          {total - current - 1} restantes
        </span>
      </div>
    </div>
  );
}
