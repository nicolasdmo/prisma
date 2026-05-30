'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ARCHETYPES } from '@/data/archetypes';

const ARCHETYPE_LIST = Object.values(ARCHETYPES);

const BG = '#070611';

/* Vibrant per-axis accents (match the test) */
const DIMS = [
  { label: 'Energía',    c: '#FF7A18' },
  { label: 'Percepción', c: '#19C9F0' },
  { label: 'Decisión',   c: '#FF4D9D' },
  { label: 'Estilo',     c: '#22D37A' },
];

function CtaButton({ children }: { children: React.ReactNode }) {
  return (
    <Link href="/test" className="inline-block">
      <motion.span
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="inline-flex items-center gap-3 px-10 py-4 rounded-full text-base font-bold text-[#0a0a14]"
        style={{ background: 'linear-gradient(120deg,#FFB627,#FF4D9D 55%,#B14BF4)', boxShadow: '0 12px 44px rgba(255,77,157,0.4)' }}
      >
        {children}
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M3 9h12M10 4l5 5-5 5" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.span>
    </Link>
  );
}

export default function LandingPage() {
  return (
    <main className="relative flex flex-col min-h-screen overflow-hidden text-white" style={{ background: BG }}>

      {/* ── Animated background orbs ─────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          className="absolute rounded-full blur-[110px]"
          style={{ width: 480, height: 480, top: '-12%', left: '-12%', background: '#FF7A18', opacity: 0.34 }}
          animate={{ x: [0, 40, 0], y: [0, 26, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute rounded-full blur-[120px]"
          style={{ width: 460, height: 460, top: '20%', right: '-14%', background: '#B14BF4', opacity: 0.3 }}
          animate={{ x: [0, -34, 0], y: [0, 30, 0] }}
          transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute rounded-full blur-[120px]"
          style={{ width: 420, height: 420, bottom: '-14%', left: '20%', background: '#19C9F0', opacity: 0.24 }}
          animate={{ x: [0, 30, 0], y: [0, -24, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(120% 80% at 50% -5%, transparent 40%, rgba(7,6,17,0.82) 100%)' }}
        />
      </div>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 pt-20 pb-16 text-center">

        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-[0.18em] text-white/65 border border-white/15 bg-white/5 mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Prisma · Test de arquetipos
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="font-serif text-6xl sm:text-7xl md:text-8xl leading-[0.95] mb-6"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Hay 16.<br />Solo uno<br />
          <span style={{ background: 'linear-gradient(120deg,#FFB627,#FF4D9D 50%,#19C9F0)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
            es vos.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="text-white/70 text-lg sm:text-xl max-w-md mb-9 leading-relaxed"
        >
          16 preguntas calibradas. 2 minutos. El arquetipo que ya intuías que eras — descrito sin vueltas.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.24 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-9"
        >
          {DIMS.map((d) => (
            <span
              key={d.label}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/80 border border-white/10 bg-white/5"
            >
              <span className="w-2 h-2 rounded-full" style={{ background: d.c, boxShadow: `0 0 10px ${d.c}` }} />
              {d.label}
            </span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <CtaButton>Empezar el test</CtaButton>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 font-mono text-[11px] tracking-wider text-white/40"
        >
          ⚡ 2 min · 16 preguntas · 16 arquetipos
        </motion.p>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="relative z-10 py-16 px-6 max-w-content mx-auto w-full">
        <p className="text-center font-mono text-[11px] uppercase tracking-[0.18em] text-white/45 mb-12">Cómo funciona</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { n: '01', c: '#FF7A18', title: 'Respondé sin pensar', text: 'Dieciséis preguntas que nadie te hace. La primera respuesta — la honesta — vale el doble.' },
            { n: '02', c: '#FF4D9D', title: 'Cruzamos tu patrón', text: 'Cuatro ejes. Dieciséis combinaciones posibles. Una sola se parece a vos.' },
            { n: '03', c: '#19C9F0', title: 'Te ves desde afuera', text: 'Tu arquetipo, tus fortalezas, dónde te trabás. Vas a leerte y decir: "esto soy yo".' },
          ].map(({ n, c, title, text }, i) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              className="flex flex-col gap-3 p-6 rounded-2xl border border-white/10 bg-white/[0.04]"
            >
              <span className="font-mono text-sm font-bold" style={{ color: c }}>{n}</span>
              <h3 className="font-serif text-2xl text-white" style={{ fontFamily: 'var(--font-serif)' }}>{title}</h3>
              <p className="text-white/55 text-sm leading-relaxed">{text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Archetype grid ───────────────────────────────────── */}
      <section className="relative z-10 py-16 px-6 max-w-content mx-auto w-full">
        <p className="text-center font-mono text-[11px] uppercase tracking-[0.18em] text-white/45 mb-3">Los 16 arquetipos</p>
        <p className="text-center text-white/55 text-sm mb-10">Uno te va a doler. Otro te va a explicar todo.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ARCHETYPE_LIST.map((a, i) => (
            <motion.div
              key={a.code}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: (i % 4) * 0.05, duration: 0.4 }}
              whileHover={{ y: -4 }}
              className="relative rounded-xl px-4 py-4 flex flex-col gap-1 border border-white/10 bg-white/[0.04] overflow-hidden group"
            >
              <span
                className="absolute -top-8 -right-8 w-20 h-20 rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition-opacity"
                style={{ background: a.color }}
              />
              <span className="text-2xl relative">{a.emoji}</span>
              <span className="font-serif text-base text-white relative" style={{ fontFamily: 'var(--font-serif)' }}>{a.name}</span>
              <span className="font-mono text-[10px] tracking-widest uppercase relative" style={{ color: a.color }}>{a.code}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Footer CTA ───────────────────────────────────────── */}
      <section className="relative z-10 py-20 px-6 text-center border-t border-white/10">
        <h2 className="font-serif text-4xl sm:text-5xl text-white mb-7" style={{ fontFamily: 'var(--font-serif)' }}>
          ¿Te bancás saber?
        </h2>
        <CtaButton>Empezar ahora</CtaButton>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="relative z-10 py-6 px-6 border-t border-white/5 text-center">
        <p className="font-mono text-xs text-white/30 tracking-wider">
          PRISMA · {new Date().getFullYear()}
        </p>
      </footer>
    </main>
  );
}
