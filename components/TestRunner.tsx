'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { QUESTIONS } from '@/data/questions';
import { computeCode, type Answers, type AnswerLetter } from '@/lib/scoring';

const AXIS_LABELS: Record<string, string> = {
  E1: 'Energía',
  E2: 'Percepción',
  E3: 'Decisión',
  E4: 'Estilo',
};

// Each axis gets a subtle tint on the question background
const AXIS_TINT: Record<string, string> = {
  E1: 'rgba(139,132,120,0.04)',
  E2: 'rgba(100,120,139,0.04)',
  E3: 'rgba(139,100,120,0.04)',
  E4: 'rgba(120,139,100,0.04)',
};

export default function TestRunner() {
  const router  = useRouter();
  const [current,  setCurrent]  = useState(0);
  const [answers,  setAnswers]  = useState<Answers>({});
  const [selected, setSelected] = useState<AnswerLetter | null>(null);
  const [direction, setDirection] = useState(1);

  const question = QUESTIONS[current];
  const progress  = current / QUESTIONS.length;
  const isLast    = current === QUESTIONS.length - 1;

  const handleSelect = useCallback(
    (letter: AnswerLetter) => {
      if (selected) return;
      setSelected(letter);

      const newAnswers = { ...answers, [question.id]: letter };
      setAnswers(newAnswers);

      setTimeout(() => {
        if (isLast) {
          const code = computeCode(newAnswers);
          router.push(`/r/${code}`);
        } else {
          setDirection(1);
          setCurrent((c) => c + 1);
          setSelected(null);
        }
      }, 420);
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
    <div
      className="min-h-screen flex flex-col bg-bg transition-colors duration-700"
      style={{ background: AXIS_TINT[question.axis] ? `linear-gradient(180deg, ${AXIS_TINT[question.axis]} 0%, var(--bg) 40%)` : undefined }}
    >
      {/* ── Progress bar ─────────────────────────────────────── */}
      <div className="flex items-center gap-4 px-6 sm:px-10 py-5 border-b border-line-soft">
        <span className="font-mono text-[11px] text-ink-faint tracking-widest shrink-0 w-12">
          {String(current + 1).padStart(2, '0')}&thinsp;/&thinsp;{QUESTIONS.length}
        </span>
        <div className="progress-track">
          <motion.div
            className="progress-fill"
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1] }}
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

      {/* ── Question card ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-10 py-10">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={question.id}
              custom={direction}
              variants={{
                enter:  (d: number) => ({ x: d > 0 ? 52 : -52, opacity: 0 }),
                center: { x: 0, opacity: 1 },
                exit:   (d: number) => ({ x: d > 0 ? -52 : 52, opacity: 0 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.26, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Intro */}
              <p className="eyebrow mb-3">{question.intro}</p>

              {/* Question text */}
              <h2
                className="font-serif text-3xl sm:text-4xl text-ink leading-snug mb-8"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                {question.text}
              </h2>

              {/* 4 options — 2×2 on md+, stack on mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {question.options.map((opt) => {
                  const isChosen = selected === opt.letter;
                  const isDimmed = selected !== null && !isChosen;

                  return (
                    <motion.button
                      key={opt.letter}
                      onClick={() => handleSelect(opt.letter)}
                      animate={{
                        opacity: isDimmed ? 0.28 : 1,
                        scale:   isChosen ? 0.97 : 1,
                      }}
                      transition={{ duration: 0.18 }}
                      whileHover={!selected ? { scale: 1.01 } : {}}
                      className={`
                        w-full text-left flex items-start gap-3 p-4 rounded-md border
                        transition-colors duration-150 cursor-pointer
                        ${isChosen
                          ? 'bg-ink border-ink text-bg-card shadow-sm'
                          : 'bg-bg-elev border-line hover:border-ink-soft hover:bg-bg-card'
                        }
                      `}
                      disabled={selected !== null}
                    >
                      {/* Letter badge */}
                      <span
                        className={`font-mono text-[10px] tracking-widest mt-0.5 shrink-0 w-5 h-5 flex items-center justify-center rounded-full border ${
                          isChosen
                            ? 'border-bg-card/40 text-bg-card/60'
                            : 'border-line text-ink-faint'
                        }`}
                      >
                        {opt.letter}
                      </span>

                      <div className="flex flex-col gap-0.5 flex-1">
                        {/* Emoji + label row */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-base leading-none">{opt.emoji}</span>
                          <span className={`font-mono text-[10px] tracking-wider uppercase ${isChosen ? 'text-bg-card/70' : 'text-ink-mute'}`}>
                            {opt.label}
                          </span>
                        </div>
                        {/* Option text */}
                        <p className={`text-sm leading-snug ${isChosen ? 'text-bg-card' : 'text-ink-soft'}`}>
                          {opt.text}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Back & skip row ──────────────────────────────────── */}
      <div className="px-6 sm:px-10 pb-8 flex justify-between items-center max-w-2xl mx-auto w-full">
        <button
          onClick={handleBack}
          disabled={current === 0}
          className="font-mono text-xs text-ink-faint tracking-wider uppercase hover:text-ink transition-colors disabled:opacity-0"
        >
          ← Anterior
        </button>
        <span className="font-mono text-[10px] text-ink-faint tracking-wider">
          {QUESTIONS.length - current - 1} restantes
        </span>
      </div>
    </div>
  );
}
