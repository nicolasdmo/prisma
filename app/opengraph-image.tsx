import { ImageResponse } from 'next/og';

export const size        = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt         = 'PRISMA — Hay 16 arquetipos. Solo uno sos vos.';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width:          '100%',
          height:         '100%',
          display:        'flex',
          flexDirection:  'column',
          background:     '#0e0d0b',
          position:       'relative',
          overflow:       'hidden',
        }}
      >
        {/* Diagonal texture lines */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            style={{
              position:   'absolute',
              width:      '200%',
              height:     '1px',
              background: 'rgba(255,255,255,0.04)',
              top:        `${i * 9}%`,
              left:       '-50%',
              transform:  'rotate(-14deg)',
            }}
          />
        ))}

        {/* Glow orb — top left */}
        <div
          style={{
            position:     'absolute',
            top:          -120,
            left:         -80,
            width:        500,
            height:       500,
            borderRadius: '50%',
            background:   'rgba(180,140,100,0.12)',
            filter:       'blur(80px)',
          }}
        />

        {/* Brand — top left */}
        <div
          style={{
            position:    'absolute',
            top:         52,
            left:        64,
            display:     'flex',
            alignItems:  'center',
            gap:         12,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <polygon points="12,2 22,20 2,20" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" />
          </svg>
          <span
            style={{
              fontFamily:    'monospace',
              fontSize:      13,
              letterSpacing: '0.20em',
              color:         'rgba(255,255,255,0.45)',
            }}
          >
            PRISMA
          </span>
        </div>

        {/* Main hero — left-anchored, vertically centered */}
        <div
          style={{
            position:      'absolute',
            top:           '50%',
            left:          64,
            right:         280,
            transform:     'translateY(-50%)',
            display:       'flex',
            flexDirection: 'column',
            gap:           18,
          }}
        >
          <div
            style={{
              fontFamily:    'monospace',
              fontSize:      11,
              letterSpacing: '0.22em',
              color:         'rgba(255,255,255,0.38)',
              textTransform: 'uppercase',
            }}
          >
            Test de personalidad
          </div>

          <div
            style={{
              color:      'rgba(255,255,255,0.92)',
              fontSize:   96,
              fontFamily: 'Georgia, serif',
              lineHeight: 1.0,
              fontWeight: 400,
            }}
          >
            Hay 16.
          </div>

          <div
            style={{
              color:      'rgba(255,255,255,0.60)',
              fontSize:   52,
              fontFamily: 'Georgia, serif',
              lineHeight: 1.15,
              fontWeight: 400,
            }}
          >
            Solo uno sos vos.
          </div>

          <div
            style={{
              marginTop:     8,
              display:       'flex',
              alignItems:    'center',
              gap:           20,
            }}
          >
            <span
              style={{
                fontFamily:    'monospace',
                fontSize:      13,
                letterSpacing: '0.12em',
                color:         'rgba(255,255,255,0.32)',
              }}
            >
              12 preguntas · 3 minutos
            </span>
          </div>
        </div>

        {/* Prism triangle — right side */}
        <div
          style={{
            position:      'absolute',
            right:         72,
            top:           '50%',
            transform:     'translateY(-50%)',
            display:       'flex',
            alignItems:    'center',
            justifyContent:'center',
          }}
        >
          <svg width="160" height="160" viewBox="0 0 100 100" fill="none">
            <polygon
              points="50,5 95,87 5,87"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="1.5"
              fill="rgba(255,255,255,0.04)"
            />
            <polygon
              points="50,20 82,75 18,75"
              stroke="rgba(255,255,255,0.10)"
              strokeWidth="1"
              fill="rgba(255,255,255,0.02)"
            />
            <polygon
              points="50,35 70,65 30,65"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
              fill="rgba(255,255,255,0.03)"
            />
          </svg>
        </div>

        {/* Bottom strip */}
        <div
          style={{
            position:   'absolute',
            bottom:     0,
            left:       0,
            right:      0,
            height:     3,
            background: 'rgba(255,255,255,0.15)',
          }}
        />
      </div>
    ),
    { ...size },
  );
}
