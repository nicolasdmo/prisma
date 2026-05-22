'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { track } from '@vercel/analytics';
import Link from 'next/link';
import { ARCHETYPES } from '@/data/archetypes';
import { PREMIUM } from '@/data/premiumContent';
import { PRICE_DISPLAY } from '@/lib/config';

// ── Included item card ──────────────────────────────────────────

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

// ── Main component ───────────────────────────────────────────────

export default function ReporteClient({ code }: { code: string }) {
  const archetype = ARCHETYPES[code.toUpperCase()];
  const premium   = PREMIUM[code.toUpperCase()];
  const [loading, setLoading] = useState(false);

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
    track('checkout_started', { code });
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

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1">

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
                className="btn-cta-color flex items-center gap-3 px-8 py-4 rounded-pill text-bg-card font-mono text-sm tracking-widest uppercase transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
                style={{ background: archetype.color }}
              >
                {loading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-bg-card/40 border-t-bg-card rounded-full animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    Obtener mi reporte — {PRICE_DISPLAY}
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

          {/* Preview snippet (blurred) */}
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
              className="btn-cta-color px-8 py-4 rounded-pill text-bg-card font-mono text-sm tracking-widest uppercase transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
              style={{ background: archetype.color }}
            >
              {loading ? 'Procesando...' : `Obtener mi reporte — ${PRICE_DISPLAY}`}
            </button>
          </div>
        </section>

      </motion.div>
    </main>
  );
}
