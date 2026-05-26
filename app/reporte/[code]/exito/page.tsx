import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ARCHETYPES } from '@/data/archetypes';
import { processApprovedPayment } from '@/lib/processPayment';

interface Props {
  params:       Promise<{ code: string }>;
  searchParams: Promise<{
    payment_id?:   string;
    collection_id?: string;
    status?:       string;
  }>;
}

export default async function ExitoPage({ params, searchParams }: Props) {
  const { code } = await params;
  const sp       = await searchParams;
  const upper    = code?.toUpperCase();
  const archetype = ARCHETYPES[upper];
  if (!archetype) notFound();

  // MP sometimes uses payment_id, sometimes collection_id
  const paymentId = sp.payment_id || sp.collection_id;

  // Try to verify the payment server-side and redirect straight to the report.
  // This is the happy path → no email needed, instant access.
  let redirectUrl: string | null = null;
  let processingError = false;

  if (paymentId) {
    try {
      const result = await processApprovedPayment(paymentId);
      if (result && result.archetypeCode === upper) {
        redirectUrl = `/reporte/${upper}/ver?token=${result.accessToken}`;
      }
    } catch (err) {
      console.error('[exito] processPayment error:', err);
      processingError = true;
    }
  }

  // `redirect` must be outside the try/catch (it throws a special NEXT_REDIRECT)
  if (redirectUrl) redirect(redirectUrl);

  // ── Fallback: payment_id missing, pending, or processing error ─
  const isPending = sp.status === 'pending' || sp.status === 'in_process';

  return (
    <>
      {/* Auto-refresh every 4s so cash payments / late webhooks eventually land */}
      {!processingError && <meta httpEquiv="refresh" content="4" />}

      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-8 relative">
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{ background: `radial-gradient(ellipse 60% 40% at 50% 20%, ${archetype.color}18 0%, transparent 70%)` }}
        />

        <div className="relative z-10 flex flex-col items-center gap-6 max-w-md">
          <span className="text-5xl">{processingError ? '⚠️' : '⏳'}</span>

          <div>
            <p className="eyebrow mb-2" style={{ color: archetype.color }}>
              {processingError ? 'Algo no salió bien' : isPending ? 'Pago pendiente' : 'Verificando pago'}
            </p>
            <h1
              className="font-serif text-3xl text-ink mb-3"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {processingError
                ? 'No pudimos confirmar tu pago'
                : isPending
                ? 'Tu pago se está procesando'
                : 'Procesando tu compra...'}
            </h1>
            <p className="text-ink-mute text-sm leading-relaxed">
              {processingError
                ? 'Si el pago salió bien, refrescá esta página en unos segundos. Si el problema persiste, contactanos.'
                : 'Esta página se va a actualizar sola apenas MercadoPago confirme el pago.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={`/reporte/${upper}/exito${paymentId ? `?payment_id=${paymentId}` : ''}`}
              className="inline-flex items-center gap-2 border border-line text-ink px-6 py-3 rounded-pill font-mono text-xs tracking-widest uppercase hover:bg-bg-elev transition-colors"
            >
              Refrescar
            </Link>
            <Link
              href={`/r/${upper}`}
              className="inline-flex items-center gap-2 bg-ink text-bg-card px-6 py-3 rounded-pill font-mono text-xs tracking-widest uppercase hover:opacity-80 transition-opacity"
            >
              Volver a mi resultado
            </Link>
          </div>

          <p className="font-mono text-[10px] text-ink-faint tracking-wider">
            {archetype.emoji} {archetype.name} · {upper}
          </p>
        </div>
      </main>
    </>
  );
}
