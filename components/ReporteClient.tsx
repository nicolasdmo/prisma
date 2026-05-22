'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ARCHETYPES } from '@/data/archetypes';
import { PREMIUM, type PremiumContent } from '@/data/premiumContent';

// ── Section wrapper ─────────────────────────────────────────────

function Section({ title, subtitle, children, delay = 0 }: {
  title: string; subtitle?: string; children: React.ReactNode; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="flex flex-col gap-5"
    >
      <div>
        <p className="eyebrow mb-1">{title}</p>
        {subtitle && <p className="text-ink-mute text-sm">{subtitle}</p>}
      </div>
      {children}
    </motion.div>
  );
}

// ── Included item card (on product page) ───────────────────────

function IncludedCard({ icon, title, items, color }: {
  icon: string; title: string; items: string[]; color: string;
}) {
  return (
    <div
      className="rounded-md p-5 border border-line bg-bg-elev flex flex-col gap-3"
      style={{ borderLeftColor: color, borderLeftWidth: 2 }}
    >
      <div className="flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <span className="font-mono text-xs tracking-wider text-ink-soft uppercase">{title}</span>
      </div>
      <ul className="flex flex-col gap-1.5">
        {items.map((item) => (
          <li key={item} className="text-sm text-ink-mute flex items-start gap-2">
            <span className="mt-0.5 shrink-0" style={{ color }}>·</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Action plan item ────────────────────────────────────────────

function ActionItem({ text, index, color }: { text: string; index: number; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="flex items-start gap-4 p-4 rounded-md border border-line bg-bg-elev"
    >
      <span
        className="font-mono text-[10px] tracking-widest shrink-0 w-6 h-6 rounded-full flex items-center justify-center border"
        style={{ color, borderColor: `${color}50`, background: `${color}12` }}
      >
        {index + 1}
      </span>
      <p className="text-ink-soft text-sm leading-relaxed">{text}</p>
    </motion.div>
  );
}

// ── Shadow reading block ────────────────────────────────────────

function ShadowBlock({ premium, color }: { premium: PremiumContent; color: string }) {
  return (
    <div className="rounded-lg border p-6 flex flex-col gap-6" style={{ borderColor: `${color}30`, background: `${color}06` }}>
      <div>
        <p className="eyebrow mb-1">Lectura de sombra</p>
        <p className="font-serif text-xl text-ink" style={{ fontFamily: 'var(--font-serif)', color }}>
          {premium.shadowTitle}
        </p>
      </div>

      {/* Quote */}
      <blockquote
        className="font-serif text-lg italic text-ink-soft border-l-2 pl-4 leading-relaxed"
        style={{ borderColor: color }}
      >
        {premium.shadowQuote}
      </blockquote>

      {/* Description */}
      <div className="flex flex-col gap-4">
        {premium.shadowDescription.split('\n\n').map((para, i) => (
          <p key={i} className="text-ink-soft text-sm leading-relaxed">{para}</p>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-md p-4 bg-bg border border-line">
          <p className="font-mono text-[10px] tracking-wider text-ink-mute uppercase mb-2">El miedo raíz</p>
          <p className="text-ink-soft text-sm leading-relaxed">{premium.deepFear}</p>
        </div>
        <div className="rounded-md p-4 bg-bg border border-line">
          <p className="font-mono text-[10px] tracking-wider text-ink-mute uppercase mb-2">El camino de sanación</p>
          <p className="text-ink-soft text-sm leading-relaxed">{premium.healingPath}</p>
        </div>
      </div>
    </div>
  );
}

// ── Career block ─────────────────────────────────────────────────

function CareerBlock({ premium, color }: { premium: PremiumContent; color: string }) {
  return (
    <div className="flex flex-col gap-6">
      {/* Roles */}
      <div>
        <p className="font-mono text-[10px] tracking-wider text-ink-mute uppercase mb-3">Roles donde sobresalés</p>
        <div className="flex flex-wrap gap-2">
          {premium.idealRoles.map((role) => (
            <span
              key={role}
              className="font-mono text-xs tracking-wider px-3 py-1.5 rounded-pill border"
              style={{ borderColor: `${color}50`, color, background: `${color}10` }}
            >
              {role}
            </span>
          ))}
        </div>
      </div>

      {/* Environment + Negotiation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-md p-4 border border-line bg-bg-elev">
          <p className="font-mono text-[10px] tracking-wider text-ink-mute uppercase mb-2">Tu ambiente ideal</p>
          <p className="text-ink-soft text-sm leading-relaxed">{premium.workEnvironment}</p>
        </div>
        <div className="rounded-md p-4 border border-line bg-bg-elev">
          <p className="font-mono text-[10px] tracking-wider text-ink-mute uppercase mb-2">Cómo negociás</p>
          <p className="text-ink-soft text-sm leading-relaxed">{premium.negotiationStyle}</p>
        </div>
      </div>

      {/* Pitfalls */}
      <div>
        <p className="font-mono text-[10px] tracking-wider text-ink-mute uppercase mb-3">Errores típicos de tu arquetipo</p>
        <div className="flex flex-col gap-2">
          {premium.careerPitfalls.map((pitfall, i) => (
            <div key={i} className="flex items-start gap-3 text-sm text-ink-mute">
              <span className="shrink-0 mt-0.5 font-mono text-[10px]" style={{ color }}>⚠</span>
              {pitfall}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Relationships block ──────────────────────────────────────────

function RelationshipsBlock({ premium, color }: { premium: PremiumContent; color: string }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="rounded-md p-5 border border-line bg-bg-elev">
        <p className="font-mono text-[10px] tracking-wider text-ink-mute uppercase mb-2">Cómo amás</p>
        <p className="text-ink-soft text-sm leading-relaxed">{premium.loveStyle}</p>
      </div>
      <div className="rounded-md p-5 border border-line bg-bg-elev">
        <p className="font-mono text-[10px] tracking-wider text-ink-mute uppercase mb-2">Cómo manejás el conflicto</p>
        <p className="text-ink-soft text-sm leading-relaxed">{premium.conflictPattern}</p>
      </div>
      <div className="rounded-md p-5 border border-line bg-bg-elev sm:col-span-2">
        <p className="font-mono text-[10px] tracking-wider text-ink-mute uppercase mb-2">Tu estilo de comunicación</p>
        <p className="text-ink-soft text-sm leading-relaxed">{premium.communicationStyle}</p>
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────

export default function ReporteClient({ code }: { code: string }) {
  const archetype = ARCHETYPES[code.toUpperCase()];
  const premium   = PREMIUM[code.toUpperCase()];
  const [purchased, setPurchased] = useState(false);
  const [loading, setLoading]     = useState(false);

  if (!archetype || !premium) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-6">
        <div>
          <p className="eyebrow mb-4">Reporte no disponible</p>
          <Link href={`/r/${code}`} className="font-mono text-sm text-ink underline">
            Volver a tu resultado
          </Link>
        </div>
      </div>
    );
  }

  // ── Initiate MercadoPago Checkout Pro ───────────────────────
  const handlePurchase = async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Error al crear el pago');
      if (data.init_point) {
        window.location.href = data.init_point; // redirect to MP checkout
      }
    } catch (err) {
      console.error(err);
      alert('Hubo un problema al iniciar el pago. Intentá de nuevo.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-line">
        <Link href={`/r/${code}`} className="eyebrow hover:text-ink transition-colors">
          ← {archetype.name}
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xl">{archetype.emoji}</span>
          <span className="font-mono text-xs tracking-wider" style={{ color: archetype.color }}>{archetype.code}</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!purchased ? (
          /* ─────────────────── PRODUCT PAGE ─────────────────── */
          <motion.div
            key="product"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -12 }}
            className="flex-1"
          >
            {/* Hero */}
            <section className="px-6 sm:px-10 pt-14 pb-12 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2 }}
                style={{ background: `radial-gradient(ellipse 70% 50% at 50% 0%, ${archetype.color}18 0%, transparent 70%)` }}
              />
              <div className="max-w-2xl mx-auto relative text-center">
                <motion.span
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                  className="text-5xl block mb-6"
                >
                  {archetype.emoji}
                </motion.span>
                <motion.p
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="eyebrow mb-3"
                >
                  Reporte completo · {archetype.name}
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.55 }}
                  className="font-serif text-4xl sm:text-5xl leading-tight mb-4"
                  style={{ fontFamily: 'var(--font-serif)', color: archetype.color }}
                >
                  Conocete en profundidad
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                  className="text-ink-soft text-lg leading-relaxed mb-10 max-w-lg mx-auto"
                >
                  Tu análisis psicológico completo: la sombra, la carrera, los vínculos y el plan de acción concreto para las próximas 4 semanas.
                </motion.p>

                {/* Price + CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 16, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                  className="inline-flex flex-col items-center gap-4"
                >
                  <button
                    onClick={handlePurchase}
                    disabled={loading}
                    className="flex items-center gap-3 px-8 py-4 rounded-pill text-bg-card font-mono text-sm tracking-widest uppercase transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
                    style={{ background: archetype.color }}
                  >
                    {loading ? (
                      <>
                        <span className="inline-block w-4 h-4 border-2 border-bg-card/40 border-t-bg-card rounded-full animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        Obtener mi reporte — USD $9.99
                      </>
                    )}
                  </button>
                  <p className="font-mono text-[10px] tracking-wider text-ink-faint">
                    Pago único · Acceso inmediato · 30 días de garantía
                  </p>
                </motion.div>
              </div>
            </section>

            {/* What's included */}
            <section className="px-6 sm:px-10 pb-16 max-w-2xl mx-auto w-full">
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                className="eyebrow mb-6 text-center"
              >
                Qué incluye
              </motion.p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12">
                {[
                  {
                    icon: '🧠',
                    title: 'Análisis profundo',
                    items: ['Dos capas extra de tu personalidad', 'Tu estilo de comunicación real', 'Plan de acción de 30 días', 'Lo que te drena energía'],
                  },
                  {
                    icon: '💼',
                    title: 'Guía de carrera',
                    items: ['6 roles donde sobresalés', 'Tu ambiente de trabajo ideal', 'Cómo negociás naturalmente', 'Los 3 errores típicos de tu tipo'],
                  },
                  {
                    icon: '🌑',
                    title: 'Lectura de sombra',
                    items: ['El patrón inconsciente que te frena', 'El miedo raíz detrás de la sombra', 'El camino concreto de integración', 'La frase que resume tu sombra'],
                  },
                  {
                    icon: '❤️',
                    title: 'Vínculos y relaciones',
                    items: ['Cómo amás y cómo recibís amor', 'Tu patrón en el conflicto', 'Tu estilo de comunicación afectiva', 'Lo que más necesitás en un vínculo'],
                  },
                ].map((card, i) => (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.65 + i * 0.08 }}
                  >
                    <IncludedCard {...card} color={archetype.color} />
                  </motion.div>
                ))}
              </div>

              {/* Preview snippets (blurred) */}
              <div className="mb-10 relative rounded-lg border border-line overflow-hidden">
                <div className="p-6 blur-sm pointer-events-none select-none">
                  <p className="eyebrow mb-3">Análisis profundo</p>
                  <p className="text-ink-soft text-sm leading-relaxed">
                    {premium.deepDive.split('\n\n')[0].slice(0, 120)}...
                  </p>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg/60 backdrop-blur-sm gap-2">
                  <span className="text-2xl">🔒</span>
                  <p className="font-mono text-xs tracking-wider text-ink-mute">Desbloqueás con tu compra</p>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="text-center">
                <button
                  onClick={handlePurchase}
                  disabled={loading}
                  className="px-8 py-4 rounded-pill text-bg-card font-mono text-sm tracking-widest uppercase transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
                  style={{ background: archetype.color }}
                >
                  {loading ? 'Procesando...' : `Obtener mi reporte — USD $9.99`}
                </button>
              </div>
            </section>
          </motion.div>

        ) : (
          /* ─────────────────── PREMIUM REPORT ─────────────────── */
          <motion.div
            key="report"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 px-6 sm:px-10 py-14 max-w-2xl mx-auto w-full"
          >
            {/* Unlock banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
              className="rounded-lg p-5 mb-12 text-center"
              style={{ background: `${archetype.color}15`, border: `1px solid ${archetype.color}40` }}
            >
              <span className="text-2xl block mb-2">✨</span>
              <p className="font-serif text-lg text-ink mb-1" style={{ fontFamily: 'var(--font-serif)' }}>
                Tu reporte completo está listo
              </p>
              <p className="text-ink-mute text-sm">Guardalo o tomá nota — es tuyo para siempre.</p>
            </motion.div>

            <div className="flex flex-col gap-14">

              {/* Deep dive */}
              <Section title="Análisis profundo" delay={0.1}>
                <div className="flex flex-col gap-4">
                  {premium.deepDive.split('\n\n').map((para, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.1 }}
                      className="text-ink-soft leading-relaxed"
                    >
                      {para}
                    </motion.p>
                  ))}
                </div>
              </Section>

              <div className="h-px bg-line" />

              {/* Action plan */}
              <Section title="Tu plan de acción — próximas 4 semanas" subtitle="Cinco pasos concretos diseñados para tu arquetipo." delay={0.2}>
                <div className="flex flex-col gap-3">
                  {premium.actionPlan.map((step, i) => (
                    <ActionItem key={i} text={step} index={i} color={archetype.color} />
                  ))}
                </div>
              </Section>

              <div className="h-px bg-line" />

              {/* Energy drains */}
              <Section title="Lo que te drena" subtitle="Situaciones que te cuestan más de lo que parecen." delay={0.25}>
                <div className="flex flex-col gap-2">
                  {premium.energyDrains.map((drain, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.08 }}
                      className="flex items-start gap-3 p-3 rounded-md border border-line bg-bg-elev"
                    >
                      <span className="text-ink-faint shrink-0 mt-0.5">—</span>
                      <p className="text-ink-soft text-sm">{drain}</p>
                    </motion.div>
                  ))}
                </div>
              </Section>

              <div className="h-px bg-line" />

              {/* Shadow reading */}
              <Section title="" delay={0.3}>
                <ShadowBlock premium={premium} color={archetype.color} />
              </Section>

              <div className="h-px bg-line" />

              {/* Career guide */}
              <Section title="Guía de carrera" subtitle="Dónde y cómo brillás profesionalmente." delay={0.35}>
                <CareerBlock premium={premium} color={archetype.color} />
              </Section>

              <div className="h-px bg-line" />

              {/* Relationships */}
              <Section title="Vínculos y relaciones" subtitle="Tu perfil en la intimidad y el conflicto." delay={0.4}>
                <RelationshipsBlock premium={premium} color={archetype.color} />
              </Section>

              <div className="h-px bg-line" />

              {/* Back CTA */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
                <Link
                  href={`/r/${code}`}
                  className="inline-flex items-center gap-2 border border-line text-ink px-6 py-3 rounded-pill font-mono text-xs tracking-widest uppercase hover:bg-bg-elev transition-colors"
                >
                  ← Volver a mi resultado
                </Link>
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/reporte/${code}`;
                    navigator.clipboard.writeText(url).catch(() => {});
                    alert('¡Link al reporte copiado!');
                  }}
                  className="inline-flex items-center gap-2 bg-ink text-bg-card px-6 py-3 rounded-pill font-mono text-xs tracking-widest uppercase hover:opacity-80 transition-opacity"
                >
                  Copiar link
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
