import type { Metadata } from 'next';
import Link from 'next/link';
import { PRICE_DISPLAY } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Términos y condiciones — PRISMA',
  description: 'Condiciones de uso del test PRISMA y del Reporte Completo premium.',
};

const UPDATED = 'junio de 2026';

export default function TerminosPage() {
  return (
    <main className="min-h-screen bg-bg text-ink">
      <div className="max-w-[760px] mx-auto px-6 py-16 sm:py-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-mute hover:text-ink transition-colors mb-10"
        >
          ← Volver al inicio
        </Link>

        <h1 className="font-serif text-4xl sm:text-5xl mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
          Términos y condiciones
        </h1>
        <p className="text-ink-mute text-sm mb-10">Última actualización: {UPDATED}</p>

        <div className="space-y-8 text-ink-soft leading-relaxed">
          <p>
            Al usar <strong>PRISMA</strong> aceptás estos términos. Si no estás de acuerdo, te pedimos que
            no uses el servicio.
          </p>

          <section>
            <h2 className="font-serif text-2xl text-ink mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
              1. Qué es PRISMA
            </h2>
            <p>
              PRISMA es un test de personalidad que te asigna uno de 16 arquetipos. El test y el resultado
              básico son <strong>gratuitos</strong>. De forma opcional, ofrecemos un <strong>Reporte Completo</strong> pago
              con un análisis más profundo.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-ink mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
              2. El test es orientativo
            </h2>
            <p>
              El contenido tiene fines de <strong>autoconocimiento y entretenimiento</strong>. No es un
              diagnóstico psicológico ni asesoramiento profesional, y no debe usarse para tomar decisiones
              médicas, clínicas o laborales sobre vos o terceros.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-ink mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
              3. Cuenta e inicio de sesión
            </h2>
            <p>
              Para desbloquear el perfil completo podés iniciar sesión con Google. Sos responsable de la
              información de tu cuenta. Tratamos esos datos según nuestra{' '}
              <Link href="/privacidad" className="text-ink underline">política de privacidad</Link>.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-ink mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
              4. Reporte Completo (compra)
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>El Reporte Completo tiene un precio de <strong>{PRICE_DISPLAY}</strong> (salvo promociones vigentes).</li>
              <li>El pago se procesa de forma segura a través de <strong>MercadoPago</strong>.</li>
              <li>Es un <strong>producto digital</strong>: una vez confirmado el pago, accedés al reporte de inmediato y te lo enviamos por email.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-ink mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
              5. Garantía y reembolsos
            </h2>
            <p>
              Tu compra incluye una garantía. Si tuviste un problema con el reporte o no quedaste conforme,
              podés solicitarla desde el propio reporte (opción «¿Problemas con tu compra?») o desde el botón
              de contacto. Cada solicitud se evalúa de forma individual — consideramos, entre otros factores,
              el tiempo transcurrido desde la compra — y, si corresponde, realizamos el reembolso a través
              de MercadoPago. Si pagaste y no recibiste tu reporte, escribinos y lo resolvemos siempre.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-ink mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
              6. Propiedad intelectual
            </h2>
            <p>
              Los textos, el diseño, el algoritmo y las descripciones de los arquetipos son propiedad de
              PRISMA. Podés compartir tu resultado, pero no reproducir ni revender el contenido del reporte
              sin autorización.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-ink mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
              7. Uso aceptable
            </h2>
            <p>
              Te comprometés a no abusar del servicio: no intentar vulnerar la seguridad, no automatizar
              accesos masivos ni usar el sitio con fines ilícitos.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-ink mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
              8. Limitación de responsabilidad
            </h2>
            <p>
              El servicio se ofrece “tal cual”. Hacemos nuestro mejor esfuerzo para que funcione bien, pero
              no garantizamos disponibilidad ininterrumpida ni resultados específicos. No somos responsables
              por decisiones que tomes en base al test.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-ink mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
              9. Cambios y ley aplicable
            </h2>
            <p>
              Podemos actualizar estos términos; la fecha de arriba refleja la última versión. Estos términos
              se rigen por las leyes de la República Argentina.
            </p>
          </section>

          <p className="pt-4 text-sm text-ink-mute">
            Ver también nuestra <Link href="/privacidad" className="text-ink underline">política de privacidad</Link>.
          </p>
        </div>
      </div>
    </main>
  );
}
