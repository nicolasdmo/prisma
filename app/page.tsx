import Link from 'next/link';
import PrismIcon from '@/components/PrismIcon';
import { ARCHETYPES } from '@/data/archetypes';

const ARCHETYPE_LIST = Object.values(ARCHETYPES);

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="flex flex-col items-center justify-center flex-1 px-6 pt-20 pb-16 text-center">

        <p className="eyebrow mb-8">Prisma · Test de arquetipos</p>

        <PrismIcon size={100} className="text-ink mb-8" />

        <h1
          className="font-serif text-5xl sm:text-6xl md:text-7xl text-ink leading-tight mb-6"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Hay 16.<br />Solo uno<br />es vos.
        </h1>

        <p className="text-ink-soft text-lg sm:text-xl max-w-md mb-10 leading-relaxed">
          12 preguntas honestas. 3 minutos. El arquetipo que ya intuías que eras — descrito sin vueltas.
        </p>

        <Link
          href="/test"
          className="btn-cta inline-flex items-center gap-3 bg-ink text-bg-card px-9 py-4 rounded-pill text-sm font-mono tracking-widest uppercase hover:scale-[1.03] active:scale-95 transition-transform"
        >
          Empezar el test
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-70">
            <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>

        <p className="mt-5 text-ink-faint font-mono text-xs tracking-wider">
          ~3 min · 12 preguntas · 16 arquetipos
        </p>
      </section>

      {/* ── Divider ──────────────────────────────────────────── */}
      <div className="h-px bg-line mx-6 sm:mx-16" />

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="py-16 px-6 max-w-content mx-auto w-full">
        <p className="eyebrow text-center mb-12">Cómo funciona</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { n: '01', title: 'Respondé sin pensar', text: 'Doce preguntas que nadie te hace. La primera respuesta — la honesta — vale el doble.' },
            { n: '02', title: 'Cruzamos tu patrón', text: 'Cuatro ejes. Dieciséis combinaciones posibles. Una sola se parece a vos.' },
            { n: '03', title: 'Te ves desde afuera', text: 'Tu arquetipo, tus fortalezas, dónde te trabás. Vas a leerte y decir: "esto soy yo".' },
          ].map(({ n, title, text }) => (
            <div key={n} className="flex flex-col gap-3">
              <span className="font-mono text-xs text-ink-faint tracking-wider">{n}</span>
              <h3 className="font-serif text-2xl text-ink" style={{ fontFamily: 'var(--font-serif)' }}>{title}</h3>
              <p className="text-ink-mute text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Divider ──────────────────────────────────────────── */}
      <div className="h-px bg-line mx-6 sm:mx-16" />

      {/* ── Archetype grid ───────────────────────────────────── */}
      <section className="py-16 px-6 max-w-content mx-auto w-full">
        <p className="eyebrow text-center mb-3">Los 16 arquetipos</p>
        <p className="text-center text-ink-mute text-sm mb-10">Uno te va a doler. Otro te va a explicar todo.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ARCHETYPE_LIST.map((a) => (
            <div
              key={a.code}
              className="bg-bg-elev border border-line rounded-md px-4 py-4 flex flex-col gap-1"
            >
              <span className="text-xl">{a.emoji}</span>
              <span className="font-serif text-base text-ink" style={{ fontFamily: 'var(--font-serif)' }}>{a.name}</span>
              <span className="font-mono text-[10px] text-ink-faint tracking-widest uppercase">{a.code}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer CTA ───────────────────────────────────────── */}
      <section className="py-16 px-6 text-center border-t border-line">
        <h2 className="font-serif text-3xl sm:text-4xl text-ink mb-6" style={{ fontFamily: 'var(--font-serif)' }}>
          ¿Te bancás saber?
        </h2>
        <Link
          href="/test"
          className="btn-cta inline-flex items-center gap-3 bg-ink text-bg-card px-9 py-4 rounded-pill text-sm font-mono tracking-widest uppercase hover:scale-[1.03] active:scale-95 transition-transform"
        >
          Empezar ahora
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-70">
            <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="py-6 px-6 border-t border-line-soft text-center">
        <p className="font-mono text-xs text-ink-faint tracking-wider">
          PRISMA · {new Date().getFullYear()}
        </p>
      </footer>
    </main>
  );
}
