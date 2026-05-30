'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { track } from '@vercel/analytics';
import Link from 'next/link';
import { ARCHETYPES, type Archetype } from '@/data/archetypes';
import { PRICE_DISPLAY, PRICE_ANCHOR_DISPLAY } from '@/lib/config';
import GoogleAuthGate from '@/components/GoogleAuthGate';
import { getContrastText } from '@/lib/colorUtils';

const POLE_LABELS = [
  { axis: 'E1', a: 'Introspectivo', b: 'Expresivo',   label: 'Energía' },
  { axis: 'E2', a: 'Sensitivo',     b: 'Intuitivo',   label: 'Percepción' },
  { axis: 'E3', a: 'Lógico',        b: 'Valores',     label: 'Decisión' },
  { axis: 'E4', a: 'Planificador',  b: 'Flexible',    label: 'Estilo' },
];
const POLE_A = ['I', 'S', 'L', 'P'];

function decodePoles(code: string) {
  return code.split('').map((letter, i) =>
    POLE_A[i] === letter ? POLE_LABELS[i].a : POLE_LABELS[i].b
  );
}

// ── Code letters ────────────────────────────────────────────────
function CodeReveal({ code, color }: { code: string; color: string }) {
  return (
    <div className="flex gap-1.5">
      {code.split('').map((letter, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 10, rotateX: -40 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.8 + i * 0.12, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          className="font-mono text-xs tracking-widest px-2.5 py-1 rounded-sm border"
          style={{ borderColor: `${color}60`, color, background: `${color}12` }}
        >
          {letter}
        </motion.span>
      ))}
    </div>
  );
}

// ── Pole tag ────────────────────────────────────────────────────
function PoleTag({ label, color, delay }: { label: string; color: string; delay: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      className="font-mono text-xs tracking-wider px-3 py-1.5 rounded-pill border"
      style={{ borderColor: `${color}50`, color, background: `${color}10` }}
    >
      {label}
    </motion.span>
  );
}

// ── Axis meter — redesigned ──────────────────────────────────────
function AxisMeter({ poleA, poleB, label, score, color, delay }: {
  poleA: string; poleB: string; label: string;
  score: number; color: string; delay: number;
}) {
  const isA        = score >= 50;
  const dominant   = isA ? poleA : poleB;
  const pct        = Math.round(isA ? score : 100 - score);
  // dot travels right=poleB; score=100 → fully left (poleA); score=0 → fully right (poleB)
  const dotLeft    = 100 - score; // 0 = poleA side, 100 = poleB side

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45 }}
      className="flex flex-col gap-3 p-4 rounded-lg border border-line bg-bg-elev"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <span className="font-mono text-xs tracking-widest uppercase text-ink-soft font-medium">{label}</span>
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-xs tracking-wider font-semibold" style={{ color }}>{dominant}</span>
          <span
            className="font-mono text-[10px] tracking-widest rounded-full px-2 py-0.5 font-medium"
            style={{ background: `${color}20`, color }}
          >
            {pct}%
          </span>
        </div>
      </div>

      {/* Track */}
      <div className="relative h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
        {/* Gradient fill toward dominant pole */}
        <motion.div
          className="absolute inset-y-0 rounded-full"
          style={{
            left:  isA ? 0 : 'auto',
            right: isA ? 'auto' : 0,
            background: `linear-gradient(${isA ? '90deg' : '270deg'}, ${color}, ${color}30)`,
          }}
          initial={{ width: '0%' }}
          animate={{ width: `${pct}%` }}
          transition={{ delay: delay + 0.15, duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
        />
        {/* Dot */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 shadow-lg"
          style={{
            background:  color,
            borderColor: 'var(--bg-card)',
            boxShadow:   `0 0 8px ${color}80`,
          }}
          initial={{ left: '50%', x: '-50%' }}
          animate={{ left: `${dotLeft}%`, x: '-50%' }}
          transition={{ delay: delay + 0.2, duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
        />
      </div>

      {/* Pole labels */}
      <div className="flex justify-between">
        <span className="font-mono text-xs font-medium" style={{ color: isA ? 'var(--ink-soft)' : 'var(--ink-faint)' }}>{poleA}</span>
        <span className="font-mono text-xs font-medium" style={{ color: !isA ? 'var(--ink-soft)' : 'var(--ink-faint)' }}>{poleB}</span>
      </div>
    </motion.div>
  );
}

// ── Context card — redesigned ────────────────────────────────────
const CTX_ICONS: Record<string, string> = {
  '💼': '💼', '🤝': '🤝', '🔥': '🔥', '❤️': '❤️',
};

function ContextCard({ icon, title, text, color, delay }: {
  icon: string; title: string; text: string; color: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45 }}
      className="rounded-xl p-5 border border-line bg-bg-elev flex flex-col gap-3 relative overflow-hidden"
    >
      {/* Subtle color accent top-left */}
      <div
        className="absolute top-0 left-0 w-24 h-24 rounded-br-full pointer-events-none"
        style={{ background: `${color}08` }}
      />
      <div className="flex items-center gap-3 relative">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0"
          style={{ background: `${color}18` }}
        >
          {icon}
        </div>
        <span
          className="font-mono text-[10px] tracking-widest uppercase"
          style={{ color: `${color}cc` }}
        >
          {title}
        </span>
      </div>
      <p className="text-ink text-sm leading-relaxed relative">{text}</p>
    </motion.div>
  );
}

// ── Strength pill ────────────────────────────────────────────────
function StrengthPill({ label, color, delay }: { label: string; color: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
      className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg border"
      style={{ borderColor: `${color}30`, background: `${color}08` }}
    >
      <span className="text-sm shrink-0" style={{ color }}>✦</span>
      <span className="text-ink-soft text-sm">{label}</span>
    </motion.div>
  );
}

// ── Complementary card — redesigned ─────────────────────────────
function ComplementaryCard({ code, myColor }: { code: string; myColor: string }) {
  const a = ARCHETYPES[code];
  if (!a) return null;
  return (
    <Link href={`/r/${code}`} className="block group">
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className="rounded-xl border border-line bg-bg-elev overflow-hidden transition-colors group-hover:border-ink-soft"
      >
        {/* Color band */}
        <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${myColor}, ${a.color})` }} />
        <div className="p-5 flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
            style={{ background: `${a.color}18` }}
          >
            {a.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="font-serif text-base text-ink" style={{ fontFamily: 'var(--font-serif)' }}>{a.name}</p>
              <span className="font-mono text-[9px] tracking-widest px-1.5 py-0.5 rounded border" style={{ borderColor: `${a.color}40`, color: a.color }}>{a.code}</span>
            </div>
            <p className="text-ink-mute text-xs leading-snug truncate">{a.tagline}</p>
          </div>
          <span className="text-ink-faint group-hover:text-ink transition-colors shrink-0">→</span>
        </div>
      </motion.div>
    </Link>
  );
}

// ── Rarity badge ─────────────────────────────────────────────────
function RarityBadge({ archetype, delay }: { archetype: Archetype; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      className="rounded-xl p-5 border flex items-center gap-5"
      style={{ borderColor: `${archetype.color}35`, background: `${archetype.color}0a` }}
    >
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 relative"
        style={{ background: `${archetype.color}15` }}
      >
        <svg viewBox="0 0 64 64" className="absolute inset-0 w-full h-full -rotate-90">
          <circle cx="32" cy="32" r="28" fill="none" stroke={`${archetype.color}20`} strokeWidth="3" />
          <motion.circle
            cx="32" cy="32" r="28" fill="none"
            stroke={archetype.color} strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 28}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 28 * (1 - archetype.rarity / 100) }}
            transition={{ delay: delay + 0.2, duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
          />
        </svg>
        <span className="font-mono text-sm font-bold relative z-10" style={{ color: archetype.color }}>
          {archetype.rarity}%
        </span>
      </div>
      <div>
        <p className="font-mono text-[10px] tracking-widest uppercase mb-1" style={{ color: archetype.color }}>
          Frecuencia global
        </p>
        <p className="text-ink text-sm leading-snug">
          Solo el <strong>{archetype.rarity}%</strong> de las personas es <strong>{archetype.name}</strong>.
        </p>
        <p className="text-ink-mute text-xs mt-1">Tu perspectiva es genuinamente escasa.</p>
      </div>
    </motion.div>
  );
}

// ── Viral share footer ───────────────────────────────────────────
function ViralShare({ archetype }: { archetype: Archetype }) {
  const [copied,   setCopied]   = useState(false);
  const [canShare, setCanShare] = useState(false);

  const testUrl = typeof window !== 'undefined' ? window.location.origin : 'https://prisma-v2-six.vercel.app';

  // Build share messages
  const msg    = `Hice el test PRISMA y soy ${archetype.name} (${archetype.code}) — "${archetype.tagline}". ¿Y vos qué sos? 👇`;
  const waUrl  = `https://wa.me/?text=${encodeURIComponent(`${msg}\n${testUrl}`)}`;
  const fbUrl  = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(testUrl)}`;
  const tgUrl  = `https://t.me/share/url?url=${encodeURIComponent(testUrl)}&text=${encodeURIComponent(msg)}`;
  const xUrl   = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`soy ${archetype.name} (${archetype.code}) — "${archetype.tagline}". probá el test ↓`)}&url=${encodeURIComponent(testUrl)}`;

  useEffect(() => {
    if (typeof navigator === 'undefined') return;
    if (typeof navigator.share !== 'function') return;
    const isTouch = 'ontouchstart' in window || (navigator.maxTouchPoints ?? 0) > 0;
    setCanShare(isTouch);
  }, []);

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: `Soy ${archetype.name} (${archetype.code})`,
        text:  `"${archetype.tagline}" — hacé el test PRISMA y descubrí tu arquetipo.`,
        url:   testUrl,
      });
    } catch { /* user cancelled */ }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(testUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="rounded-2xl border border-line overflow-hidden"
      style={{ background: 'var(--bg-elev)' }}
    >
      {/* Top accent */}
      <div className="h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${archetype.color}80, transparent)` }} />

      <div className="px-6 py-8 flex flex-col items-center gap-5 text-center">

        {/* Headline */}
        <div>
          <p className="eyebrow mb-3">Compartí</p>
          <p className="font-serif text-2xl text-ink leading-snug mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
            Ahora sabés quién sos vos.<br />¿Y ellos?
          </p>
          <p className="text-ink-soft text-sm max-w-xs mx-auto leading-relaxed">
            Mandales el test y comparás arquetipos. Muchos se sorprenden con lo que descubren.
          </p>
        </div>

        {/* Share buttons */}
        <div className="flex flex-col gap-2.5 w-full max-w-sm">

          {/* Native share — mobile only */}
          {canShare && (
            <button
              onClick={handleNativeShare}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-pill font-mono text-xs tracking-widest uppercase text-white active:scale-[0.98] transition-all"
              style={{
                background: 'linear-gradient(135deg, #FF006E 0%, #8338EC 100%)',
                boxShadow:  '0 8px 24px rgba(131,56,236,0.35)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M11 5l-3-3-3 3M8 2v9M3 9v3a1 1 0 001 1h8a1 1 0 001-1V9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Compartir
            </button>
          )}

          {/* WhatsApp */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-pill font-mono text-xs tracking-widest uppercase text-white hover:opacity-90 active:scale-[0.98] transition-all"
            style={{ background: '#25d366', boxShadow: '0 6px 20px rgba(37,211,102,0.30)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>

          {/* Facebook */}
          <a
            href={fbUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2.5 py-3 px-5 rounded-pill font-mono text-xs tracking-widest uppercase text-white hover:opacity-90 active:scale-[0.98] transition-all"
            style={{ background: '#1877F2', boxShadow: '0 4px 14px rgba(24,119,242,0.28)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </a>

          {/* Secondary row — Telegram + X + Copy */}
          <div className="grid grid-cols-3 gap-2">
            <a
              href={tgUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-3 py-3 rounded-pill font-mono text-[10px] tracking-widest uppercase font-semibold text-white hover:opacity-90 active:scale-95 transition-all"
              style={{ background: '#229ED9' }}
              aria-label="Compartir en Telegram"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              TG
            </a>

            <a
              href={xUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-3 py-3 rounded-pill font-mono text-[10px] tracking-widest uppercase font-semibold text-ink hover:opacity-80 active:scale-95 transition-all"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid var(--line)' }}
              aria-label="Compartir en X"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              X
            </a>

            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-1.5 px-3 py-3 rounded-pill font-mono text-[10px] tracking-widest uppercase font-semibold transition-all active:scale-95"
              style={{
                background:  copied ? `${archetype.color}15` : 'rgba(255,255,255,0.05)',
                border:      copied ? `1px solid ${archetype.color}60` : '1px solid var(--line)',
                color:       copied ? archetype.color : 'var(--ink)',
              }}
              aria-label="Copiar link"
            >
              {copied ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7l4 4 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  OK
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <rect x="4.5" y="1.5" width="7" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M1.5 4.5H3M1.5 4.5V11.5H9.5V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer nav */}
        <div className="flex items-center gap-4 pt-1">
          <Link
            href="/"
            className="font-mono text-[10px] tracking-widest uppercase text-ink-faint hover:text-ink transition-colors"
          >
            Volver al inicio
          </Link>
          <span className="text-line text-xs">·</span>
          <Link
            href="/test"
            className="font-mono text-[10px] tracking-widest uppercase text-ink-faint hover:text-ink transition-colors"
          >
            Hacer el test de nuevo
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ── Scroll hint — auto-scroll until user touches ─────────────────
function ScrollHint({ color }: { color: string }) {
  const [visible, setVisible] = useState(false);
  const [gone,    setGone]    = useState(false);
  const rafRef    = useRef<number>(0);
  const activeRef = useRef(false);

  useEffect(() => {
    // Any user interaction stops the scroll
    const stop = () => {
      if (!activeRef.current) return;
      activeRef.current = false;
      cancelAnimationFrame(rafRef.current);
      setGone(true);
    };
    window.addEventListener('touchstart', stop, { passive: true });
    window.addEventListener('wheel',      stop, { passive: true });
    window.addEventListener('mousedown',  stop);
    window.addEventListener('keydown',    stop);
    return () => {
      window.removeEventListener('touchstart', stop);
      window.removeEventListener('wheel',      stop);
      window.removeEventListener('mousedown',  stop);
      window.removeEventListener('keydown',    stop);
    };
  }, []);

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout>;

    const t = setTimeout(() => {
      setVisible(true);
      activeRef.current = true; // user interaction now dismisses the hint

      // Respect users who prefer reduced motion — no auto-scroll for them
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduceMotion) {
        hideTimer = setTimeout(() => {
          activeRef.current = false;
          setGone(true);
        }, 6000);
        return;
      }

      // Continuous scroll — 10 px/frame ≈ 600 px/s
      const tick = () => {
        if (!activeRef.current) return;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (window.scrollY >= max) {
          // Reached the bottom — stop
          activeRef.current = false;
          setGone(true);
          return;
        }
        window.scrollBy(0, 10);
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);

      // Hide indicator after 3 s; scroll keeps going
      hideTimer = setTimeout(() => setVisible(false), 3000);
    }, 1200);

    return () => {
      clearTimeout(t);
      clearTimeout(hideTimer);
      cancelAnimationFrame(rafRef.current);
      activeRef.current = false;
    };
  }, []);

  if (gone) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="scroll-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none"
        >
          {/* Gradient so content looks "cut off" below */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: '200px',
              background: 'linear-gradient(to top, var(--bg) 0%, var(--bg) 25%, transparent 100%)',
            }}
          />

          {/* Indicator */}
          <div className="relative flex flex-col items-center pb-8">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-3"
            >
              <div className="flex flex-col items-center" style={{ gap: '2px' }}>
                {[0, 1, 2].map((i) => (
                  <svg key={i} width="52" height="28" viewBox="0 0 52 28" fill="none"
                    style={{ opacity: 0.35 + i * 0.3 }}>
                    <path d="M3 3l23 20 23-20" stroke={color} strokeWidth="3.5"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ))}
              </div>
              <div
                className="px-8 py-3 rounded-full font-mono text-lg tracking-widest uppercase font-bold"
                style={{
                  color,
                  background: 'rgba(8,7,6,0.90)',
                  border: `2px solid ${color}80`,
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  boxShadow: `0 0 32px ${color}40, 0 8px 24px rgba(0,0,0,0.5)`,
                }}
              >
                Deslizá
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Main ─────────────────────────────────────────────────────────
export default function ResultClient({ code }: { code: string }) {
  const archetype = ARCHETYPES[code.toUpperCase()];
  const [unlocked, setUnlocked] = useState(false);
  const [scores, setScores]     = useState<Record<string, number> | null>(null);
  const [savedReportUrl, setSavedReportUrl] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('prisma_scores');
      if (raw) setScores(JSON.parse(raw));
    } catch {}
    // Restore session if already unlocked
    if (localStorage.getItem('prisma_unlocked') === code.toUpperCase()) {
      setUnlocked(true);
    }
    // Surface saved premium-report link so the user can come back to it
    try {
      const saved = localStorage.getItem(`prisma_report_${code.toUpperCase()}`);
      if (saved) setSavedReportUrl(saved);
    } catch {}
  }, [code]);

  const handleUnlock = useCallback((_email: string, _name: string) => {
    localStorage.setItem('prisma_unlocked', code.toUpperCase());
    track('result_unlocked', { code: code.toUpperCase() });
    setUnlocked(true);
  }, [code]);

  if (!archetype) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-6">
        <div>
          <p className="eyebrow mb-4">Arquetipo no encontrado</p>
          <Link href="/test" className="font-mono text-sm text-ink underline">Hacer el test de nuevo</Link>
        </div>
      </div>
    );
  }

  const poles = decodePoles(archetype.code);

  return (
    <>
      {/* Entrance veil — dark → cream crossfade carried over from the test reveal */}
      <motion.div
        aria-hidden
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 60, background: '#070611' }}
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      />

      {/* Color flash */}
      <motion.div
        className="fixed inset-0 z-50 pointer-events-none"
        style={{ background: archetype.color }}
        initial={{ opacity: 0.85 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
      />

      <ScrollHint color={archetype.color} />
      <main className="min-h-screen flex flex-col">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-line"
        >
          <Link href="/" className="eyebrow hover:text-ink transition-colors">← PRISMA</Link>
          <CodeReveal code={archetype.code} color={archetype.color} />
        </motion.div>

        {/* Returning-buyer banner */}
        {savedReportUrl && (
          <motion.a
            href={savedReportUrl}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-6 py-3 border-b border-line hover:opacity-90 transition-opacity"
            style={{ background: `${archetype.color}10` }}
          >
            <span className="text-sm">✨</span>
            <p className="text-ink text-sm">Ya tenés tu reporte premium completo.</p>
            <span
              className="font-mono text-[10px] tracking-widest uppercase underline"
              style={{ color: archetype.color }}
            >
              Abrirlo →
            </span>
          </motion.a>
        )}

        {/* ── Hero ── */}
        <section className="px-6 sm:px-10 pt-14 sm:pt-20 pb-12 relative overflow-hidden">
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1.2 }}
            style={{ background: `radial-gradient(ellipse 70% 60% at 30% 20%, ${archetype.color}22 0%, transparent 70%)` }}
          />
          <div className="max-w-2xl mx-auto relative">
            <motion.span
              className="text-6xl block mb-6"
              initial={{ scale: 0.4, opacity: 0, rotate: -15 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ delay: 0.5, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
            >
              {archetype.emoji}
            </motion.span>

            <motion.p className="eyebrow mb-3" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
              Tu arquetipo
            </motion.p>

            <motion.h1
              className="font-serif text-5xl sm:text-6xl leading-tight mb-4"
              style={{ fontFamily: 'var(--font-serif)', color: archetype.color }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {archetype.name}
            </motion.h1>

            <motion.p
              className="text-ink text-xl sm:text-2xl leading-relaxed mb-8 font-medium"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.55 }}
            >
              {archetype.tagline}
            </motion.p>

            <motion.div className="flex flex-wrap gap-2 mb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
              {poles.map((label, i) => (
                <PoleTag key={label} label={label} color={archetype.color} delay={1.1 + i * 0.08} />
              ))}
            </motion.div>

            <div className="flex flex-col gap-5">
              {archetype.description.split('\n\n').map((para, i) => (
                <motion.p
                  key={i}
                  className="text-ink leading-loose text-[1.05rem]"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + i * 0.14, duration: 0.5 }}
                >
                  {para}
                </motion.p>
              ))}
            </div>
          </div>
        </section>

        <motion.div
          className="h-px bg-line mx-6 sm:mx-10"
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        />

        {/* ── Gate / unlocked ── */}
        <section className="px-6 sm:px-10 py-14 max-w-2xl mx-auto w-full">
          <AnimatePresence mode="wait">
            {!unlocked ? (

              /* ── Google gate ── */
              <motion.div
                key="gate"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ delay: 1.6, duration: 0.5 }}
              >
                {/* Blurred teaser */}
                <div className="mb-10 relative select-none rounded-xl border border-line overflow-hidden">
                  <div className="p-6 blur-sm pointer-events-none">
                    <p className="eyebrow mb-4">Tus ejes de personalidad</p>
                    <div className="flex flex-col gap-3">
                      {POLE_LABELS.map((p) => (
                        <div key={p.axis} className="h-10 bg-bg-elev rounded-lg border border-line" />
                      ))}
                    </div>
                  </div>
                  <div className="absolute inset-0 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
                    <span className="text-2xl">🔒</span>
                    <span className="font-mono text-xs text-ink-mute tracking-wider">Ingresá para desbloquear</span>
                  </div>
                </div>

                <GoogleAuthGate
                  archetypeCode={archetype.code}
                  color={archetype.color}
                  onUnlock={handleUnlock}
                />
              </motion.div>

            ) : (

              /* ── Unlocked content ── */
              <motion.div
                key="unlocked"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
                className="flex flex-col gap-14"
              >

                {/* Rarity */}
                <RarityBadge archetype={archetype} delay={0.05} />

                {/* Axis meters */}
                {scores && (
                  <div>
                    <p className="eyebrow mb-2">Tus ejes de personalidad</p>
                    <p className="text-ink-soft text-sm mb-6">Basado en tus respuestas — dónde caés en cada espectro.</p>
                    <div className="flex flex-col gap-3">
                      {POLE_LABELS.map((p, i) => (
                        <AxisMeter
                          key={p.axis}
                          poleA={p.a} poleB={p.b}
                          label={p.label}
                          score={scores[p.axis] ?? 50}
                          color={archetype.color}
                          delay={i * 0.1}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Strengths */}
                <div>
                  <p className="eyebrow mb-2">Tus fortalezas</p>
                  <p className="text-ink-soft text-sm mb-5">Lo que hacés mejor que casi todos.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {archetype.strengths.map((s, i) => (
                      <StrengthPill key={s} label={s} color={archetype.color} delay={i * 0.08} />
                    ))}
                  </div>
                </div>

                {/* Famous examples */}
                <div>
                  <p className="eyebrow mb-2">Referentes de tu arquetipo</p>
                  <p className="text-ink-soft text-sm mb-4">Personas conocidas que comparten tu forma de ver el mundo.</p>
                  <div className="flex flex-wrap gap-2">
                    {archetype.famousExamples.map((name) => (
                      <span
                        key={name}
                        className="font-mono text-xs tracking-wider px-3 py-2 rounded-lg border border-line text-ink-soft bg-bg-elev"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Locked teaser — what's inside the premium */}
                <div>
                  <p className="eyebrow mb-2">Esto te falta saber</p>
                  <p className="text-ink-soft text-sm mb-5">Lo más jugoso de tu arquetipo está acá adentro.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { icon: '🌑', title: 'Tu lado oscuro',         text: 'Lo que sabotea sin que te des cuenta.' },
                      { icon: '❤️', title: 'En vínculos',             text: 'Cómo amás, cómo te trabás, qué necesitás.' },
                      { icon: '💼', title: 'En el trabajo',           text: 'Qué ambiente te potencia y cuál te apaga.' },
                      { icon: '🤝', title: 'Con quién encajás',       text: 'Tus arquetipos complementarios.' },
                    ].map(({ icon, title, text }) => (
                      <div
                        key={title}
                        className="rounded-xl p-4 border border-line bg-bg-elev relative overflow-hidden"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-base opacity-60">{icon}</span>
                          <span className="font-mono text-[10px] tracking-widest uppercase text-ink-faint">{title}</span>
                          <span className="ml-auto text-xs text-ink-faint">🔒</span>
                        </div>
                        <p className="text-ink-mute text-sm leading-relaxed blur-[3px] select-none">{text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-line" />

                {/* ── PREMIUM BUNDLE CTA ── */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="rounded-2xl overflow-hidden relative"
                  style={{
                    background: '#0e0d0c',
                    boxShadow: `0 0 0 1px ${archetype.color}30, 0 24px 48px rgba(0,0,0,0.35), 0 0 80px ${archetype.color}12`,
                  }}
                >
                  {/* Color glow top */}
                  <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 pointer-events-none"
                    style={{
                      background: `radial-gradient(ellipse at top, ${archetype.color}35 0%, transparent 70%)`,
                      animation: 'premium-glow 3s ease-in-out infinite',
                    }}
                  />

                  {/* Top accent line */}
                  <div className="h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${archetype.color}, transparent)` }} />

                  <div className="relative px-7 pt-8 pb-7 flex flex-col items-center gap-6 text-center">

                    {/* Badge */}
                    <span
                      className="font-mono text-[9px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-full border"
                      style={{ color: archetype.color, borderColor: `${archetype.color}40`, background: `${archetype.color}15` }}
                    >
                      Reporte premium completo
                    </span>

                    <div>
                      <p className="font-serif text-3xl mb-2" style={{ fontFamily: 'var(--font-serif)', color: '#f5f2eb' }}>
                        Conocete en profundidad
                      </p>
                      <p className="text-sm leading-relaxed max-w-sm mx-auto" style={{ color: '#8a857b' }}>
                        Todo en un solo pack: análisis psicológico, guía de carrera, lectura de sombra y plan de acción.
                      </p>
                    </div>

                    {/* Items */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 w-full max-w-xs text-left">
                      {[
                        ['🌑', 'Lectura de sombra'],
                        ['💼', 'Guía de carrera'],
                        ['📋', 'Plan de 30 días'],
                        ['🧠', 'Análisis profundo'],
                        ['❤️', 'Perfil en vínculos'],
                        ['⚡', 'Acceso web inmediato'],
                      ].map(([icon, label]) => (
                        <div key={label} className="flex items-center gap-2 text-sm" style={{ color: '#c2bdb1' }}>
                          <span className="text-base">{icon}</span>
                          <span>{label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />

                    {/* Price */}
                    <div className="flex flex-col items-center gap-1.5">
                      {/* Anchor: what it "should" cost */}
                      <div className="flex items-center gap-2">
                        <span
                          className="font-mono text-xs line-through"
                          style={{ color: '#5a5650' }}
                        >
                          {PRICE_ANCHOR_DISPLAY}
                        </span>
                        <span
                          className="font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-full"
                          style={{ background: `${archetype.color}22`, color: archetype.color }}
                        >
                          Precio de lanzamiento
                        </span>
                      </div>

                      {/* Real price */}
                      <p
                        className="font-serif leading-none"
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: '3rem',
                          color: '#f5f2eb',
                          animation: 'price-pop 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.5s both',
                        }}
                      >
                        {PRICE_DISPLAY}
                      </p>

                      <p className="font-mono text-[10px]" style={{ color: '#8a857b' }}>ARS · pago único · acceso permanente</p>

                      {/* Anchor justification */}
                      <p className="font-mono text-[9px] tracking-wide text-center max-w-[240px] leading-relaxed mt-0.5" style={{ color: '#5a5650' }}>
                        Una sesión con psicólogo cuesta entre $15.000 y $25.000.<br />
                        Tu informe cubre lo que una sesión no alcanza.
                      </p>
                    </div>

                    {/* CTA Button */}
                    <Link
                      href={`/reporte/${archetype.code}`}
                      className="btn-cta-color w-full flex items-center justify-center gap-3 px-8 py-4 rounded-pill font-mono text-sm tracking-widest uppercase hover:scale-[1.02] active:scale-95 transition-transform"
                      style={{
                        background: `linear-gradient(135deg, ${archetype.color}, ${archetype.color}cc)`,
                        color: getContrastText(archetype.color),
                        boxShadow: `0 0 0 1px ${archetype.color}60, 0 8px 32px ${archetype.color}50`,
                      }}
                    >
                      Ver pack completo
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Link>

                    <p className="font-mono text-[10px] tracking-wider" style={{ color: '#5a5650' }}>
                      Sin suscripción · Acceso permanente · Seguro
                    </p>
                  </div>
                </motion.div>

                {/* ── Viral share footer ── */}
                <ViralShare archetype={archetype} />

              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </>
  );
}
