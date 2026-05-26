'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ARCHETYPES } from '@/data/archetypes';
import { PREMIUM, type PremiumContent } from '@/data/premiumContent';

// ── Reused sub-components ────────────────────────────────────────

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
        {title && <p className="eyebrow mb-1">{title}</p>}
        {subtitle && <p className="text-ink-mute text-sm">{subtitle}</p>}
      </div>
      {children}
    </motion.div>
  );
}

function ActionItem({ text, index, color }: { text: string; index: number; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.4 }}
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

function ShadowBlock({ premium, color }: { premium: PremiumContent; color: string }) {
  return (
    <div className="rounded-lg border p-6 flex flex-col gap-6" style={{ borderColor: `${color}30`, background: `${color}06` }}>
      <div>
        <p className="eyebrow mb-1">Lectura de sombra</p>
        <p className="font-serif text-xl" style={{ fontFamily: 'var(--font-serif)', color }}>
          {premium.shadowTitle}
        </p>
      </div>
      <blockquote className="font-serif text-lg italic text-ink-soft border-l-2 pl-4 leading-relaxed" style={{ borderColor: color }}>
        {premium.shadowQuote}
      </blockquote>
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

function CareerBlock({ premium, color }: { premium: PremiumContent; color: string }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="font-mono text-[10px] tracking-wider text-ink-mute uppercase mb-3">Roles donde sobresalés</p>
        <div className="flex flex-wrap gap-2">
          {premium.idealRoles.map((role) => (
            <span key={role} className="font-mono text-xs tracking-wider px-3 py-1.5 rounded-pill border"
              style={{ borderColor: `${color}50`, color, background: `${color}10` }}>
              {role}
            </span>
          ))}
        </div>
      </div>
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

// ── Main ─────────────────────────────────────────────────────────

export default function ExitoClient({ code, paymentId }: { code: string; paymentId: string }) {
  const archetype = ARCHETYPES[code];
  const premium   = PREMIUM[code];
  const [copied,    setCopied]    = useState(false);
  const [reportUrl, setReportUrl] = useState('');

  // Save the access link locally so the user can come back later from this device
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    setReportUrl(url);
    try { localStorage.setItem(`prisma_report_${code}`, url); } catch {}
  }, [code]);

  if (!archetype || !premium) return null;

  const handleCopy = () => {
    if (!reportUrl) return;
    navigator.clipboard.writeText(reportUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-line">
        <Link href={`/r/${code}`} className="eyebrow hover:text-ink transition-colors">← {archetype.name}</Link>
        <div className="flex items-center gap-2">
          <span className="text-xl">{archetype.emoji}</span>
          <span className="font-mono text-xs tracking-wider" style={{ color: archetype.color }}>{code}</span>
        </div>
      </div>

      {/* Color flash */}
      <motion.div
        className="fixed inset-0 z-50 pointer-events-none"
        style={{ background: archetype.color }}
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1] }}
      />

      <div className="flex-1 px-6 sm:px-10 py-14 max-w-2xl mx-auto w-full">

        {/* Success banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          className="rounded-xl p-6 mb-12 text-center"
          style={{ background: `${archetype.color}15`, border: `1px solid ${archetype.color}40` }}
        >
          <motion.span
            initial={{ scale: 0.5, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            className="text-4xl block mb-3"
          >
            ✨
          </motion.span>
          <motion.p
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="font-serif text-xl text-ink mb-1" style={{ fontFamily: 'var(--font-serif)' }}
          >
            ¡Tu reporte está listo, {archetype.name}!
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="text-ink-mute text-sm"
          >
            Pago verificado · ID {paymentId.slice(0, 8)}…
          </motion.p>
        </motion.div>

        {/* Access link banner — save this! */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-lg p-5 mb-12 border"
          style={{ borderColor: `${archetype.color}40`, background: `${archetype.color}06` }}
        >
          <div className="flex items-start gap-3 mb-4">
            <span className="text-xl">🔖</span>
            <div>
              <p className="font-mono text-[10px] tracking-widest uppercase mb-1" style={{ color: archetype.color }}>
                Tu link permanente
              </p>
              <p className="text-ink text-sm leading-relaxed">
                Guardá este link en favoritos — es tu acceso al reporte para siempre.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={reportUrl}
              onClick={(e) => (e.target as HTMLInputElement).select()}
              className="flex-1 min-w-0 bg-bg-card border border-line rounded-md px-3 py-2 text-xs font-mono text-ink-soft truncate"
            />
            <button
              onClick={handleCopy}
              className="bg-ink text-bg-card px-4 py-2 rounded-md font-mono text-[10px] tracking-widest uppercase whitespace-nowrap hover:opacity-80 transition-opacity"
            >
              {copied ? '✓' : 'Copiar'}
            </button>
          </div>
        </motion.div>

        <div className="flex flex-col gap-14">

          {/* Deep dive */}
          <Section title="Análisis profundo" delay={0.1}>
            <div className="flex flex-col gap-4">
              {premium.deepDive.split('\n\n').map((para, i) => (
                <motion.p key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.1 }} className="text-ink-soft leading-relaxed">
                  {para}
                </motion.p>
              ))}
            </div>
          </Section>

          <div className="h-px bg-line" />

          {/* Communication */}
          <Section title="Tu estilo de comunicación" delay={0.18}>
            <div className="rounded-md p-5 border border-line bg-bg-elev">
              <p className="text-ink-soft text-sm leading-relaxed">{premium.communicationStyle}</p>
            </div>
          </Section>

          <div className="h-px bg-line" />

          {/* Action plan */}
          <Section title="Tu plan de acción — próximas 4 semanas" subtitle="Cinco pasos concretos para tu arquetipo." delay={0.22}>
            <div className="flex flex-col gap-3">
              {premium.actionPlan.map((step, i) => (
                <ActionItem key={i} text={step} index={i} color={archetype.color} />
              ))}
            </div>
          </Section>

          <div className="h-px bg-line" />

          {/* Energy drains */}
          <Section title="Lo que te drena" subtitle="Situaciones que te cuestan más de lo que parecen." delay={0.26}>
            <div className="flex flex-col gap-2">
              {premium.energyDrains.map((drain, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex items-start gap-3 p-3 rounded-md border border-line bg-bg-elev">
                  <span className="text-ink-faint shrink-0 mt-0.5">—</span>
                  <p className="text-ink-soft text-sm">{drain}</p>
                </motion.div>
              ))}
            </div>
          </Section>

          <div className="h-px bg-line" />

          {/* Shadow */}
          <Section title="" delay={0.3}>
            <ShadowBlock premium={premium} color={archetype.color} />
          </Section>

          <div className="h-px bg-line" />

          {/* Career */}
          <Section title="Guía de carrera" subtitle="Dónde y cómo brillás profesionalmente." delay={0.35}>
            <CareerBlock premium={premium} color={archetype.color} />
          </Section>

          <div className="h-px bg-line" />

          {/* Relationships */}
          <Section title="Vínculos y relaciones" subtitle="Tu perfil en la intimidad y el conflicto." delay={0.4}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-md p-5 border border-line bg-bg-elev">
                <p className="font-mono text-[10px] tracking-wider text-ink-mute uppercase mb-2">Cómo amás</p>
                <p className="text-ink-soft text-sm leading-relaxed">{premium.loveStyle}</p>
              </div>
              <div className="rounded-md p-5 border border-line bg-bg-elev">
                <p className="font-mono text-[10px] tracking-wider text-ink-mute uppercase mb-2">Cómo manejás el conflicto</p>
                <p className="text-ink-soft text-sm leading-relaxed">{premium.conflictPattern}</p>
              </div>
            </div>
          </Section>

          <div className="h-px bg-line" />

          {/* Footer actions */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2"
          >
            <Link
              href={`/r/${code}`}
              className="inline-flex items-center gap-2 border border-line text-ink px-6 py-3 rounded-pill font-mono text-xs tracking-widest uppercase hover:bg-bg-elev transition-colors"
            >
              ← Mi resultado gratuito
            </Link>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 bg-ink text-bg-card px-6 py-3 rounded-pill font-mono text-xs tracking-widest uppercase hover:opacity-80 transition-opacity"
            >
              {copied ? '✓ Copiado' : 'Copiar link del reporte'}
            </button>
          </motion.div>

          <p className="text-center font-mono text-[10px] text-ink-faint tracking-wider pb-4">
            Este reporte es tuyo. Guardá el link para volver cuando quieras.
          </p>

        </div>
      </div>
    </main>
  );
}
