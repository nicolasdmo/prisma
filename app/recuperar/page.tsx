import type { Metadata } from 'next';
import Link from 'next/link';
import RecuperarForm from '@/components/RecuperarForm';

export const metadata: Metadata = {
  title: 'Recuperar mi reporte — PRISMA',
  description: 'Recuperá el acceso a tu Reporte Completo con los datos de tu pago de MercadoPago.',
  robots: { index: false, follow: false },
};

export default function RecuperarPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md flex flex-col gap-8">
        <div className="text-center">
          <p className="eyebrow mb-3">Recuperar acceso</p>
          <h1 className="font-serif text-3xl text-ink mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
            ¿Perdiste el link de tu reporte?
          </h1>
          <p className="text-ink-mute text-sm leading-relaxed">
            Ingresá el <strong className="text-ink-soft">número de operación</strong> de MercadoPago
            (lo encontrás en tu comprobante o en la app de MP, sección Actividad) y el email con el
            que pagaste.
          </p>
        </div>

        <RecuperarForm />

        <p className="text-center font-mono text-[10px] text-ink-faint tracking-wider">
          ¿No encontrás el número de operación?{' '}
          <Link href="/" className="underline hover:text-ink transition-colors">
            Escribinos desde el botón de contacto
          </Link>
        </p>
      </div>
    </main>
  );
}
