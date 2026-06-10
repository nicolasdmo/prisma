import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de privacidad — PRISMA',
  description: 'Cómo PRISMA recolecta, usa y protege tus datos: test, login, pagos y analítica.',
};

const UPDATED = 'junio de 2026';

export default function PrivacidadPage() {
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
          Política de privacidad
        </h1>
        <p className="text-ink-mute text-sm mb-10">Última actualización: {UPDATED}</p>

        <div className="space-y-8 text-ink-soft leading-relaxed">
          <p>
            En <strong>PRISMA</strong> tratamos tus datos con cuidado y transparencia. Esta página explica,
            sin vueltas, qué información recolectamos, para qué la usamos y qué control tenés sobre ella.
          </p>

          <section>
            <h2 className="font-serif text-2xl text-ink mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
              1. Qué datos recolectamos
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Tus respuestas del test y tu arquetipo:</strong> para calcular y mostrarte tu resultado.</li>
              <li><strong>Nombre y email:</strong> cuando desbloqueás tu perfil completo iniciando sesión con Google, o cuando dejás tu correo.</li>
              <li><strong>Tu cuenta de Google:</strong> al iniciar sesión recibimos tu nombre y email (no tu contraseña).</li>
              <li><strong>Datos de compra:</strong> si comprás el Reporte Completo, el pago lo procesa MercadoPago. Guardamos el identificador del pago, el monto y tu email; <strong>no almacenamos datos de tu tarjeta</strong>.</li>
              <li><strong>Datos de uso:</strong> métricas anónimas de navegación a través de Google Analytics y Vercel Analytics.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-ink mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
              2. Para qué los usamos
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Calcular y mostrarte tu arquetipo y tu perfil completo.</li>
              <li>Entregarte por email el Reporte Completo que hayas comprado.</li>
              <li>Enviarte novedades o contenido relacionado, si dejaste tu email (podés pedir la baja cuando quieras).</li>
              <li>Entender cómo se usa el sitio para mejorarlo.</li>
              <li>Responder tus consultas si nos escribís.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-ink mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
              3. Con quién compartimos datos
            </h2>
            <p className="mb-3">
              <strong>No vendemos tus datos.</strong> Solo los compartimos con los proveedores que hacen funcionar el servicio:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Supabase</strong> — base de datos donde se guardan leads y compras.</li>
              <li><strong>MercadoPago</strong> — procesamiento de pagos.</li>
              <li><strong>Google</strong> — inicio de sesión y analítica.</li>
              <li><strong>Vercel</strong> — hosting y métricas de rendimiento.</li>
            </ul>
            <p className="mt-3">Cada uno trata los datos bajo sus propias políticas de privacidad.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-ink mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
              4. Cookies y analítica
            </h2>
            <p>
              Usamos Google Analytics y Vercel Analytics para medir el uso del sitio mediante cookies e
              identificadores. Podés bloquear las cookies desde la configuración de tu navegador; el test
              funciona igual sin ellas.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-ink mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
              5. Tus derechos
            </h2>
            <p>
              Podés pedirnos acceder a tus datos, corregirlos o eliminarlos por completo. Escribinos desde el
              botón de contacto del sitio y lo resolvemos. En Argentina, la autoridad de control es la
              Agencia de Acceso a la Información Pública (AAIP).
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-ink mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
              6. Conservación y seguridad
            </h2>
            <p>
              Guardamos tus datos solo mientras sean necesarios para los fines descritos. Aplicamos medidas
              técnicas razonables para protegerlos, aunque ningún sistema es 100% infalible.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-ink mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
              7. Importante sobre el test
            </h2>
            <p>
              PRISMA es una herramienta de autoconocimiento y entretenimiento. <strong>No es un diagnóstico
              psicológico profesional</strong> ni reemplaza la consulta con un especialista.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-ink mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
              8. Cambios y contacto
            </h2>
            <p>
              Si actualizamos esta política, vas a ver la nueva fecha arriba. Ante cualquier duda sobre tus
              datos, usá el botón de contacto del sitio.
            </p>
          </section>

          <p className="pt-4 text-sm text-ink-mute">
            Ver también nuestros <Link href="/terminos" className="text-ink underline">términos y condiciones</Link>.
          </p>
        </div>
      </div>
    </main>
  );
}
