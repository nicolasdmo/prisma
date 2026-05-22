import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ARCHETYPES } from '@/data/archetypes';

interface Props {
  params:       Promise<{ code: string }>;
  searchParams: Promise<{ payment_id?: string; status?: string }>;
}

export default async function ExitoPage({ params, searchParams }: Props) {
  const { code }       = await params;
  const { status }     = await searchParams;
  const upper          = code?.toUpperCase();
  const archetype      = ARCHETYPES[upper];
  if (!archetype) notFound();

  const approved = status === 'approved' || status === 'authorized';

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-8">

      {/* Color accent */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{ background: `radial-gradient(ellipse 60% 40% at 50% 20%, ${archetype.color}18 0%, transparent 70%)` }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-md">

        <span className="text-5xl">{approved ? '📬' : '⏳'}</span>

        <div>
          <p className="eyebrow mb-2" style={{ color: archetype.color }}>
            {approved ? 'Pago confirmado' : 'Procesando pago'}
          </p>
          <h1 className="font-serif text-3xl text-ink mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
            {approved
              ? 'Revisá tu correo'
              : 'Tu pago está siendo verificado'}
          </h1>
          <p className="text-ink-mute text-sm leading-relaxed">
            {approved
              ? `Te enviamos el Reporte Completo de ${archetype.name} al mail que usaste en MercadoPago. Revisá también la carpeta de spam.`
              : 'Cuando MercadoPago confirme el pago, te mandamos el reporte a tu correo automáticamente.'}
          </p>
        </div>

        {/* What's coming */}
        <div
          className="rounded-lg border p-5 w-full text-left"
          style={{ borderColor: `${archetype.color}30`, background: `${archetype.color}08` }}
        >
          <p className="eyebrow mb-4">Tu reporte incluye</p>
          <div className="flex flex-col gap-2">
            {[
              '🧠 Análisis psicológico profundo',
              '🌑 Lectura de sombra + miedo raíz',
              '💼 Guía de carrera con roles ideales',
              '📋 Plan de acción para 4 semanas',
              '❤️ Tu perfil en vínculos y conflicto',
              '🔗 Link personal para verlo en la web',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-ink-soft">
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/r/${upper}`}
            className="inline-flex items-center gap-2 border border-line text-ink px-6 py-3 rounded-pill font-mono text-xs tracking-widest uppercase hover:bg-bg-elev transition-colors"
          >
            ← Ver mi resultado
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-ink text-bg-card px-6 py-3 rounded-pill font-mono text-xs tracking-widest uppercase hover:opacity-80 transition-opacity"
          >
            Volver al inicio
          </Link>
        </div>

        <p className="font-mono text-[10px] text-ink-faint tracking-wider">
          {archetype.emoji} {archetype.name} · {upper}
        </p>
      </div>
    </main>
  );
}
