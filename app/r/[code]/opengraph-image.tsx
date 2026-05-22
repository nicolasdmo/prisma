import { ImageResponse } from 'next/og';
import { ARCHETYPES, ARCHETYPE_CODES } from '@/data/archetypes';

export const size        = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Prerender one OG image per archetype at build time
export function generateStaticParams() {
  return ARCHETYPE_CODES.map((code) => ({ code }));
}

export default async function OgImage({ params }: { params: Promise<{ code: string }> }) {
  const { code: rawCode } = await params;
  const archetype = ARCHETYPES[rawCode?.toUpperCase()];

  // Fallback for invalid codes
  const color = archetype?.color ?? '#16140F';
  const name  = archetype?.name    ?? 'PRISMA';
  const tagline = archetype?.tagline ?? 'Descubrí tu arquetipo';
  const code  = archetype?.code    ?? '';
  const emoji = archetype?.emoji   ?? '◈';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: color,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* ── Diagonal texture lines ──────────────────────── */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '200%',
              height: '1px',
              background: 'rgba(255,255,255,0.08)',
              top: `${i * 11}%`,
              left: '-50%',
              transform: 'rotate(-18deg)',
            }}
          />
        ))}

        {/* ── Top bar ─────────────────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            top: 48,
            left: 64,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          {/* Mini prism triangle */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <polygon points="12,2 22,20 2,20" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
          </svg>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, letterSpacing: '0.18em', fontFamily: 'monospace' }}>
            PRISMA
          </span>
          {code && (
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, letterSpacing: '0.18em', fontFamily: 'monospace' }}>
              · {code}
            </span>
          )}
        </div>

        {/* ── Main content — bottom-left anchor ───────────── */}
        <div
          style={{
            position: 'absolute',
            bottom: 72,
            left: 64,
            right: 200,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          <div style={{ color: 'white', fontSize: 11, letterSpacing: '0.14em', fontFamily: 'monospace', opacity: 0.55 }}>
            TU ARQUETIPO
          </div>
          <div
            style={{
              color: 'white',
              fontSize: 88,
              fontFamily: 'Georgia, serif',
              lineHeight: 1.0,
              fontWeight: 400,
            }}
          >
            {name}
          </div>
          <div
            style={{
              color: 'rgba(255,255,255,0.75)',
              fontSize: 26,
              fontFamily: 'Georgia, serif',
              lineHeight: 1.35,
              maxWidth: 700,
            }}
          >
            {tagline}
          </div>
        </div>

        {/* ── Emoji — large, right side ────────────────────── */}
        <div
          style={{
            position: 'absolute',
            right: 72,
            bottom: 64,
            fontSize: 110,
            lineHeight: 1,
            opacity: 0.9,
          }}
        >
          {emoji}
        </div>

        {/* ── Bottom bar ───────────────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'rgba(255,255,255,0.25)',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
