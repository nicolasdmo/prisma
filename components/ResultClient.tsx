'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ARCHETYPES } from '@/data/archetypes';
import EmailGate from '@/components/EmailGate';
import ShareCard from '@/components/ShareCard';

const POLE_LABELS = [
  { a: 'Introspectivo', b: 'Expresivo' },
  { a: 'Sensitivo',     b: 'iNtuitivo' },
  { a: 'Lógico',        b: 'Valores' },
  { a: 'Planificador',  b: 'Flexible' },
];
const POLE_A = ['I', 'S', 'L', 'P'];

function decodePoles(code: string) {
  return code.split('').map((letter, i) => {
    const entry = POLE_LABELS[i];
    return POLE_A[i] === letter ? entry.a : entry.b;
  });
}

function CodeReveal({ code, color }: { code: string; color: string }) {
  return (
    <div className="flex gap-1.5">
      {code.split('').map((letter, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 12, rotateX: -45 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.8 + i * 0.12, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          className="font-mono text-xs tracking-widest px-2.5 py-1 rounded-sm border"
          style={{ borderColor: `${color}60`, color, background: `${color}12` }}
        >
          {letter}
        </motion.span>
      ))}
    </div>
  );
}

function PoleTag({ label, color, delay }: { label: string; color: string; delay: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      className="font-mono text-xs tracking-wider px-3 py-1.5 rounded-pill border"
      style={{ borderColor: `${color}50`, color, background: `${color}10` }}
    >
      {label}
    </motion.span>
  );
}

export default function ResultClient({ code }: { code: string }) {
  const archetype = ARCHETYPES[code.toUpperCase()];
  const [unlocked, setUnlocked] = useState(false);

  if (!archetype) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-6">
        <div>
          <p className="eyebrow mb-4">Arquetipo no encontrado</p>
          <Link href="/test" className="font-mono text-sm text-ink underline">
            Hacer el test de nuevo
          </Link>
        </div>
      </div>
    );
  }

  const poles = decodePoles(archetype.code);

  return (
    <>
      {/* ── Color flash ─────────────────────────────────── */}
      <motion.div
        className="fixed inset-0 z-50 pointer-events-none"
        style={{ background: archetype.color }}
        initial={{ opacity: 0.85 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
      />

      <main className="min-h-screen flex flex-col">

        {/* ── Header ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-line"
        >
          <Link href="/" className="eyebrow hover:text-ink transition-colors">← PRISMA</Link>
          <CodeReveal code={archetype.code} color={archetype.color} />
        </motion.div>

        {/* ── Hero ────────────────────────────────────────── */}
        <section className="px-6 sm:px-10 pt-14 sm:pt-20 pb-12 relative overflow-hidden">
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1.2 }}
            style={{
              background: `radial-gradient(ellipse 70% 60% at 30% 20%, ${archetype.color}20 0%, transparent 70%)`,
            }}
          />

          <div className="max-w-2xl mx-auto relative">
            <motion.span
              className="text-6xl block mb-6"
              initial={{ scale: 0.4, opacity: 0, rotate: -15 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ delay: 0.5, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
            >
              {archetype.emoji}
            </motion.span>

            <motion.p
              className="eyebrow mb-3"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.5 }}
            >
              Tu arquetipo
            </motion.p>

            <motion.h1
              className="font-serif text-5xl sm:text-6xl leading-tight mb-4"
              style={{ fontFamily: 'var(--font-serif)', color: archetype.color }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {archetype.name}
            </motion.h1>

            <motion.p
              className="text-ink-soft text-xl sm:text-2xl leading-relaxed mb-8"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.55 }}
            >
              {archetype.tagline}
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-2 mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
            >
              {poles.map((label, i) => (
                <PoleTag key={label} label={label} color={archetype.color} delay={1.1 + i * 0.08} />
              ))}
            </motion.div>

            <div className="flex flex-col gap-5">
              {archetype.description.split('\n\n').map((para, i) => (
                <motion.p
                  key={i}
                  className="text-ink-soft leading-relaxed"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + i * 0.14, duration: 0.5 }}
                >
                  {para}
                </motion.p>
              ))}
            </div>
          </div>
        </section>

        {/* ── Divider ─────────────────────────────────────── */}
        <motion.div
          className="h-px bg-line mx-6 sm:mx-10"
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.5, duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
        />

        {/* ── Gate / unlocked ─────────────────────────────── */}
        <section className="px-6 sm:px-10 py-14 max-w-2xl mx-auto w-full">
          <AnimatePresence mode="wait">
            {!unlocked ? (
              <motion.div
                key="gate"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ delay: 1.6, duration: 0.5 }}
              >
                <div className="mb-8 relative select-none">
                  <p className="eyebrow mb-4">Tus fortalezas</p>
                  <div className="flex flex-col gap-3 blur-sm pointer-events-none">
                    {archetype.strengths.map((s) => (
                      <div key={s} className="flex items-center gap-3">
                        <span style={{ color: archetype.color }} className="text-base shrink-0">✦</span>
                        <span className="text-ink-soft">{s}</span>
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-mono text-xs text-ink-mute tracking-wider bg-bg px-3 py-1.5 rounded-pill border border-line">
                      Completá tu perfil para desbloquear
                    </span>
                  </div>
                </div>
                <EmailGate archetypeCode={archetype.code} onUnlock={() => setUnlocked(true)} />
              </motion.div>
            ) : (
              <motion.div
                key="unlocked"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
                className="flex flex-col gap-12"
              >
                <div>
                  <p className="eyebrow mb-5">Tus fortalezas</p>
                  <div className="flex flex-col gap-3">
                    {archetype.strengths.map((s, i) => (
                      <motion.div
                        key={s}
                        initial={{ opacity: 0, x: -14 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.09, duration: 0.4 }}
                        className="flex items-center gap-3"
                      >
                        <span style={{ color: archetype.color }} className="text-base shrink-0">✦</span>
                        <span className="text-ink-soft">{s}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.45 }}
                  className="rounded-md p-6 border"
                  style={{ borderColor: `${archetype.color}40`, background: `${archetype.color}08` }}
                >
                  <p className="eyebrow mb-3">Zona de crecimiento</p>
                  <p className="text-ink-soft leading-relaxed">{archetype.growthZone}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.45 }}
                >
                  <p className="eyebrow mb-4">Referentes de tu arquetipo</p>
                  <div className="flex flex-wrap gap-2">
                    {archetype.famousExamples.map((name) => (
                      <span
                        key={name}
                        className="font-mono text-xs tracking-wider px-3 py-2 rounded-pill border border-line text-ink-soft"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </motion.div>

                <div className="h-px bg-line" />

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="flex flex-col items-center gap-6"
                >
                  <div className="text-center">
                    <p className="eyebrow mb-2">Compartí tu resultado</p>
                    <p className="text-ink-mute text-sm">Descargá tu tarjeta y compartila donde quieras.</p>
                  </div>
                  <ShareCard archetype={archetype} />
                </motion.div>

                <div className="text-center border-t border-line pt-8">
                  <p className="text-ink-mute text-sm mb-4">¿Querés que alguien más lo haga?</p>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 border border-line text-ink px-6 py-3 rounded-pill font-mono text-xs tracking-widest uppercase hover:bg-bg-elev transition-colors"
                  >
                    Compartir el test
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </>
  );
}
