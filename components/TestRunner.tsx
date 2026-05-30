'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { track } from '@vercel/analytics';
import { useRouter } from 'next/navigation';
import { QUESTIONS } from '@/data/questions';
import { computeCode, computeScores, type Answers, type AnswerLetter } from '@/lib/scoring';
import { ARCHETYPES } from '@/data/archetypes';

/* ── Per-axis vibrant palette ──────────────────────────────────── */
type AxisStyle = { label: string; c1: string; c2: string };
const AXIS: Record<string, AxisStyle> = {
  E1: { label: 'Energía',    c1: '#FF7A18', c2: '#FFB627' }, // fuego
  E2: { label: 'Percepción', c1: '#19C9F0', c2: '#3B82F6' }, // cian → azul
  E3: { label: 'Decisión',   c1: '#B14BF4', c2: '#FF4D9D' }, // violeta → fucsia
  E4: { label: 'Estilo',     c1: '#22D37A', c2: '#A6F23D' }, // verde → lima
};
const grad = (a: AxisStyle) => `linear-gradient(135deg, ${a.c1}, ${a.c2})`;
const BG = '#070611';

type Phase = 'intro' | 'quiz' | 'computing' | 'reveal';

export default function TestRunner() {
  const router = useRouter();
  const [phase,    setPhase]    = useState<Phase>('intro');
  const [current,  setCurrent]  = useState(0);
  const [answers,  setAnswers]  = useState<Answers>({});
  const [selected, setSelected] = useState<AnswerLetter | null>(null);
  const [resultCode, setResultCode] = useState<string | null>(null);

  const total    = QUESTIONS.length;
  const question = QUESTIONS[current];
  const axis     = AXIS[question.axis] ?? AXIS.E1;
  const isLast   = current === total - 1;
  const progress = (current + (selected ? 1 : 0)) / total;

  /* Paint the page background dark while the test is mounted. */
  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = BG;
    return () => { document.body.style.background = prev; };
  }, []);

  const handleSelect = useCallback(
    (letter: AnswerLetter) => {
      if (selected) return;
      setSelected(letter);
      const next = { ...answers, [question.id]: letter };
      setAnswers(next);

      setTimeout(() => {
        if (isLast) {
          const code = computeCode(next);
          try { localStorage.setItem('prisma_scores', JSON.stringify(computeScores(next))); } catch {}
          track('test_completed', { code });
          setResultCode(code);
          setPhase('computing');
          setTimeout(() => setPhase('reveal'), 1300);
          setTimeout(() => router.push(`/r/${code}`), 3500);
        } else {
          setCurrent((c) => c + 1);
          setSelected(null);
        }
      }, 460);
    },
    [selected, answers, question, isLast, router],
  );

  /* Keyboard 1–4 for fast answering */
  useEffect(() => {
    if (phase !== 'quiz') return;
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, number> = { '1': 0, '2': 1, '3': 2, '4': 3 };
      const idx = map[e.key];
      if (idx === undefined) return;
      const opt = question.options[idx];
      if (opt) handleSelect(opt.letter);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, question, handleSelect]);

  const handleBack = () => {
    if (current === 0) return;
    setCurrent((c) => c - 1);
    setSelected(null);
  };

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden" style={{ background: BG }}>
      <Orbs axis={axis} />

      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <Intro key="intro" total={total} onStart={() => setPhase('quiz')} />
        )}

        {phase === 'quiz' && (
          <motion.section
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="relative z-10 min-h-[100dvh] flex flex-col"
          >
            {/* Top: back · progress (no numbers) · axis */}
            <div className="px-5 sm:px-8 pt-6 pb-2">
              <div className="flex items-center gap-3 max-w-xl mx-auto w-full">
                <button
                  onClick={handleBack}
                  disabled={current === 0}
                  aria-label="Anterior"
                  className="text-white/35 hover:text-white transition-colors disabled:opacity-0 shrink-0"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M12 5l-5 5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className="relative flex-1 h-1.5 rounded-full overflow-hidden bg-white/10">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ background: grad(axis) }}
                    animate={{ width: `${progress * 100}%` }}
                    transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
                  />
                </div>
                <motion.span
                  key={axis.label}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="shrink-0 text-[10px] font-mono uppercase tracking-[0.18em] font-semibold"
                  style={{ color: axis.c1 }}
                >
                  {axis.label}
                </motion.span>
              </div>
            </div>

            {/* Question + options */}
            <div className="flex-1 flex flex-col items-center justify-center px-5 sm:px-8 pb-10">
              <div className="w-full max-w-xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, x: 44, scale: 0.98 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -44, scale: 0.98 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <motion.h2
                      className="font-serif text-white text-2xl sm:text-[2rem] leading-snug text-center mb-7"
                      style={{ fontFamily: 'var(--font-serif)' }}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.06 }}
                    >
                      {question.text}
                    </motion.h2>

                    <div className="flex flex-col gap-3">
                      {question.options.map((opt, i) => {
                        const chosen = selected === opt.letter;
                        const dimmed = selected !== null && !chosen;

                        return (
                          <motion.button
                            key={opt.letter}
                            onClick={() => handleSelect(opt.letter)}
                            disabled={selected !== null}
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: dimmed ? 0.25 : 1, y: 0, scale: chosen ? 1.02 : 1 }}
                            transition={{ delay: selected ? 0 : 0.1 + i * 0.06, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            whileHover={!selected ? { scale: 1.015, x: 2 } : {}}
                            whileTap={!selected ? { scale: 0.975 } : {}}
                            className={`group w-full text-left flex items-center gap-4 rounded-2xl px-4 py-4 border cursor-pointer
                              ${chosen ? 'border-transparent' : 'bg-white/[0.045] border-white/10 hover:border-white/30 hover:bg-white/[0.07]'}`}
                            style={chosen ? { background: grad(axis), boxShadow: `0 12px 34px ${axis.c1}40` } : undefined}
                          >
                            <span
                              className="flex items-center justify-center rounded-xl shrink-0 text-2xl"
                              style={{ width: 48, height: 48, background: chosen ? 'rgba(0,0,0,0.16)' : 'rgba(255,255,255,0.06)' }}
                            >
                              {opt.emoji}
                            </span>
                            <span className={`text-[15px] leading-snug font-medium ${chosen ? 'text-[#0b0712]' : 'text-white/90'}`}>
                              {opt.text}
                            </span>
                            {chosen && (
                              <motion.span
                                initial={{ scale: 0, rotate: -20 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                                className="ml-auto shrink-0 text-[#0b0712]"
                              >
                                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                                  <path d="M5 11.5l4 4 8-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </motion.span>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>

                    {current === 0 && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-5 text-center font-mono text-[10px] tracking-wider text-white/30"
                      >
                        tocá una opción · o usá las teclas 1–4
                      </motion.p>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.section>
        )}

        {phase === 'computing' && <Computing key="computing" />}

        {phase === 'reveal' && resultCode && <Reveal key="reveal" code={resultCode} />}
      </AnimatePresence>
    </div>
  );
}

/* ── Animated background orbs (follow the active axis colour) ───── */
function Orbs({ axis }: { axis: AxisStyle }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute rounded-full blur-[90px]"
        style={{ width: 440, height: 440, top: '-10%', left: '-12%', opacity: 0.5 }}
        animate={{ backgroundColor: axis.c1, x: [0, 34, 0], y: [0, 22, 0] }}
        transition={{
          backgroundColor: { duration: 0.9 },
          x: { duration: 13, repeat: Infinity, ease: 'easeInOut' },
          y: { duration: 10, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
      <motion.div
        className="absolute rounded-full blur-[100px]"
        style={{ width: 400, height: 400, bottom: '-12%', right: '-10%', opacity: 0.42 }}
        animate={{ backgroundColor: axis.c2, x: [0, -28, 0], y: [0, -20, 0] }}
        transition={{
          backgroundColor: { duration: 0.9 },
          x: { duration: 15, repeat: Infinity, ease: 'easeInOut' },
          y: { duration: 12, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(120% 80% at 50% -5%, transparent 45%, rgba(7,6,17,0.78) 100%)' }}
      />
    </div>
  );
}

/* ── Intro: states the count once, sells precision ─────────────── */
function Intro({ total, onStart }: { total: number; onStart: () => void }) {
  const dims = [
    { label: 'Energía',    c: '#FF9A3D' },
    { label: 'Percepción', c: '#3BC9F0' },
    { label: 'Decisión',   c: '#C46BFF' },
    { label: 'Estilo',     c: '#5BE39A' },
  ];

  return (
    <motion.section
      key="intro"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5 }}
      className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center px-6 py-16 text-center"
    >
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-[0.18em] text-white/70 border border-white/15 bg-white/5 mb-8"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Test de personalidad
      </motion.span>

      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="font-serif text-white leading-[0.98] text-5xl sm:text-6xl md:text-7xl mb-6"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        ¿Cuál de los<br />
        <span style={{ background: 'linear-gradient(120deg,#FFB627,#FF4D9D 50%,#19C9F0)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
          16 sos?
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-white/70 text-lg max-w-md mb-8 leading-relaxed"
      >
        {total} preguntas calibradas para encontrar tu arquetipo real entre 16 perfiles. Respondé con el instinto: tu primera reacción es la más sincera.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.28 }}
        className="flex flex-wrap items-center justify-center gap-2 mb-10"
      >
        {dims.map((d) => (
          <span
            key={d.label}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/80 border border-white/10 bg-white/5"
          >
            <span className="w-2 h-2 rounded-full" style={{ background: d.c, boxShadow: `0 0 10px ${d.c}` }} />
            {d.label}
          </span>
        ))}
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.34 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={onStart}
        className="inline-flex items-center gap-3 px-10 py-4 rounded-full text-base font-bold text-[#0a0a14]"
        style={{ background: 'linear-gradient(120deg,#FFB627,#FF4D9D 55%,#B14BF4)', boxShadow: '0 12px 44px rgba(255,77,157,0.4)' }}
      >
        Empezar
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M3 9h12M10 4l5 5-5 5" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.42 }}
        className="mt-6 font-mono text-[11px] tracking-wider text-white/40"
      >
        ⚡ 2 minutos · sin respuestas correctas · solo vos
      </motion.p>
    </motion.section>
  );
}

/* ── Computing: brief reveal before the result ─────────────────── */
function Computing() {
  return (
    <motion.section
      key="computing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center px-6 text-center"
    >
      <div className="relative mb-8" style={{ width: 96, height: 96 }}>
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{ border: '3px solid transparent', borderTopColor: '#FFB627', borderRightColor: '#FF4D9D' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <motion.span
          className="absolute inset-[10px] rounded-full"
          style={{ border: '3px solid transparent', borderTopColor: '#B14BF4', borderLeftColor: '#19C9F0' }}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
        />
        <motion.span
          className="absolute inset-[22px] rounded-full"
          style={{ background: 'linear-gradient(135deg,#FFB627,#FF4D9D)' }}
          animate={{ scale: [1, 0.82, 1], opacity: [0.9, 0.5, 0.9] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      <motion.p
        className="font-serif text-2xl sm:text-3xl text-white mb-2"
        style={{ fontFamily: 'var(--font-serif)' }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Analizando tus respuestas
      </motion.p>
      <motion.p
        className="text-white/45 text-sm font-mono tracking-wider"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Cruzando tus 4 ejes...
      </motion.p>
    </motion.section>
  );
}

/* ── Reveal: dramatic archetype drop, bridges into the report ──── */
function lighten(hex: string, amt: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const up = (c: number) => Math.round(c + (255 - c) * amt).toString(16).padStart(2, '0');
  return `#${up(r)}${up(g)}${up(b)}`;
}

function Reveal({ code }: { code: string }) {
  const a = ARCHETYPES[code];
  if (!a) return null;
  const accent = lighten(a.color, 0.42); // archetype colours are tuned for cream — lift them for the dark reveal

  return (
    <motion.section
      key="reveal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center px-6 text-center"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(60% 50% at 50% 44%, ${accent}33 0%, transparent 70%)` }}
      />

      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="relative font-mono text-xs uppercase tracking-[0.3em] text-white/55 mb-5"
      >
        Sos
      </motion.span>

      <motion.div
        initial={{ scale: 0.4, opacity: 0, rotate: -12 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 15, delay: 0.1 }}
        className="relative mb-5 flex items-center justify-center rounded-[28px]"
        style={{ width: 120, height: 120, background: 'rgba(255,255,255,0.06)', border: `1px solid ${accent}66`, boxShadow: `0 0 70px ${accent}55` }}
      >
        <span className="text-[64px] leading-none">{a.emoji}</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.5 }}
        className="relative font-serif text-5xl sm:text-6xl mb-3"
        style={{ fontFamily: 'var(--font-serif)', color: accent, textShadow: `0 0 40px ${accent}55` }}
      >
        {a.name}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.5 }}
        className="relative text-white/65 text-base max-w-sm mb-6"
      >
        {a.tagline}
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="relative flex gap-1.5"
      >
        {code.split('').map((l, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.64 + i * 0.08 }}
            className="font-mono text-xs tracking-widest px-2.5 py-1 rounded-md border"
            style={{ borderColor: `${accent}55`, color: accent, background: `${accent}14` }}
          >
            {l}
          </motion.span>
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="relative mt-8 font-mono text-[11px] tracking-wider text-white/35"
      >
        Preparando tu perfil…
      </motion.p>
    </motion.section>
  );
}
