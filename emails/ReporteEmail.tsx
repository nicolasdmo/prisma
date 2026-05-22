import {
  Html, Head, Body, Container, Section, Row, Column,
  Heading, Text, Link, Hr, Preview,
} from '@react-email/components';
import { ARCHETYPES } from '@/data/archetypes';
import { PREMIUM }    from '@/data/premiumContent';

interface Props {
  code:        string;
  accessToken: string;
  baseUrl:     string;
}

const font = "'Georgia', 'Times New Roman', serif";
const mono = "'Courier New', Courier, monospace";

export default function ReporteEmail({ code, accessToken, baseUrl }: Props) {
  const archetype = ARCHETYPES[code];
  const premium   = PREMIUM[code];
  if (!archetype || !premium) return null;

  const reportUrl = `${baseUrl}/reporte/${code}/ver?token=${accessToken}`;
  const hex       = archetype.color;

  // Axis labels for the visual chart
  const axes = [
    { label: 'Energía',    left: 'Introspectivo', right: 'Expresivo',  key: 'E1' },
    { label: 'Percepción', left: 'Sensitivo',     right: 'Intuitivo',  key: 'E2' },
    { label: 'Decisión',   left: 'Lógico',        right: 'Valores',    key: 'E3' },
    { label: 'Estilo',     left: 'Planificador',  right: 'Flexible',   key: 'E4' },
  ];

  const POLE_A = ['I','S','L','P'];
  const poles  = code.split('').map((l, i) => POLE_A[i] === l ? axes[i].left : axes[i].right);

  return (
    <Html lang="es">
      <Head />
      <Preview>Tu Reporte Completo PRISMA · {archetype.name} ({code})</Preview>
      <Body style={{ backgroundColor: '#0e0d0c', fontFamily: 'Arial, sans-serif', margin: 0, padding: 0 }}>

        {/* ── Header ── */}
        <Container style={{ maxWidth: 600, margin: '0 auto', padding: '0 0 40px' }}>

          <Section style={{ padding: '32px 40px 24px', borderBottom: '1px solid #2a2826' }}>
            <Text style={{ fontFamily: mono, fontSize: 10, letterSpacing: 4, color: '#6b6560', margin: 0, textTransform: 'uppercase' }}>
              PRISMA · Reporte Completo
            </Text>
          </Section>

          {/* ── Hero ── */}
          <Section style={{ padding: '48px 40px 40px', background: `linear-gradient(180deg, ${hex}18 0%, transparent 100%)` }}>
            <Text style={{ fontSize: 56, margin: '0 0 16px', textAlign: 'center' }}>{archetype.emoji}</Text>
            <Text style={{ fontFamily: mono, fontSize: 10, letterSpacing: 4, color: hex, margin: '0 0 8px', textTransform: 'uppercase', textAlign: 'center' }}>
              Tu arquetipo
            </Text>
            <Heading style={{ fontFamily: font, fontSize: 40, color: hex, margin: '0 0 12px', textAlign: 'center', fontWeight: 400 }}>
              {archetype.name}
            </Heading>
            <Text style={{ fontSize: 16, color: '#b8b0a6', lineHeight: '1.6', textAlign: 'center', margin: '0 0 24px' }}>
              {archetype.tagline}
            </Text>

            {/* Pole tags */}
            <Row style={{ textAlign: 'center' }}>
              {poles.map((pole) => (
                <Column key={pole} style={{ display: 'inline-block', padding: '0 4px' }}>
                  <Text style={{ display: 'inline-block', fontFamily: mono, fontSize: 9, letterSpacing: 2, color: hex, border: `1px solid ${hex}50`, borderRadius: 20, padding: '5px 12px', margin: 0, backgroundColor: `${hex}12` }}>
                    {pole.toUpperCase()}
                  </Text>
                </Column>
              ))}
            </Row>
          </Section>

          {/* ── Code pills ── */}
          <Section style={{ padding: '0 40px 32px', textAlign: 'center' }}>
            {code.split('').map((letter, i) => (
              <Text key={i} style={{ display: 'inline-block', fontFamily: mono, fontSize: 11, letterSpacing: 2, color: hex, border: `1px solid ${hex}40`, borderRadius: 4, padding: '6px 10px', margin: '0 3px', backgroundColor: `${hex}10` }}>
                {letter}
              </Text>
            ))}
          </Section>

          <Hr style={{ borderColor: '#2a2826', margin: '0 40px' }} />

          {/* ── Rareza ── */}
          <Section style={{ padding: '32px 40px' }}>
            <Row>
              <Column style={{ background: `${hex}10`, border: `1px solid ${hex}30`, borderRadius: 8, padding: '20px 24px' }}>
                <Text style={{ fontFamily: mono, fontSize: 9, letterSpacing: 3, color: hex, margin: '0 0 6px', textTransform: 'uppercase' }}>
                  Arquetipo poco frecuente
                </Text>
                <Text style={{ fontSize: 14, color: '#b8b0a6', lineHeight: '1.6', margin: 0 }}>
                  Solo el <strong style={{ color: '#e8e0d8' }}>{archetype.rarity}%</strong> de las personas tiene el perfil de <strong style={{ color: '#e8e0d8' }}>{archetype.name}</strong>. Tu forma de ver el mundo es genuinamente distintiva.
                </Text>
              </Column>
            </Row>
          </Section>

          <Hr style={{ borderColor: '#2a2826', margin: '0 40px' }} />

          {/* ── Análisis profundo ── */}
          <Section style={{ padding: '32px 40px' }}>
            <Text style={{ fontFamily: mono, fontSize: 9, letterSpacing: 3, color: '#6b6560', margin: '0 0 16px', textTransform: 'uppercase' }}>
              Análisis profundo
            </Text>
            {premium.deepDive.split('\n\n').map((para, i) => (
              <Text key={i} style={{ fontSize: 14, color: '#b8b0a6', lineHeight: '1.7', margin: '0 0 14px' }}>
                {para}
              </Text>
            ))}
          </Section>

          <Hr style={{ borderColor: '#2a2826', margin: '0 40px' }} />

          {/* ── Ejes visuales ── */}
          <Section style={{ padding: '32px 40px' }}>
            <Text style={{ fontFamily: mono, fontSize: 9, letterSpacing: 3, color: '#6b6560', margin: '0 0 20px', textTransform: 'uppercase' }}>
              Tus ejes de personalidad
            </Text>
            {axes.map((axis, i) => {
              const isA      = POLE_A[i] === code[i];
              const dominant = isA ? axis.left : axis.right;
              return (
                <Row key={axis.key} style={{ marginBottom: 16 }}>
                  <Column>
                    <Text style={{ fontFamily: mono, fontSize: 9, letterSpacing: 2, color: '#6b6560', margin: '0 0 6px', textTransform: 'uppercase' }}>
                      {axis.label}
                    </Text>
                    <Row>
                      <Column style={{ width: '30%' }}>
                        <Text style={{ fontSize: 11, color: isA ? '#e8e0d8' : '#4a4540', margin: 0, fontFamily: mono }}>
                          {axis.left}
                        </Text>
                      </Column>
                      <Column style={{ width: '40%', padding: '0 8px' }}>
                        {/* Bar */}
                        <div style={{ background: '#2a2826', borderRadius: 4, height: 6, position: 'relative' }}>
                          <div style={{
                            position: 'absolute',
                            top: 0, bottom: 0,
                            left: isA ? '0%' : '60%',
                            width: '40%',
                            background: hex,
                            borderRadius: 4,
                          }} />
                        </div>
                      </Column>
                      <Column style={{ width: '30%', textAlign: 'right' }}>
                        <Text style={{ fontSize: 11, color: !isA ? '#e8e0d8' : '#4a4540', margin: 0, fontFamily: mono, textAlign: 'right' }}>
                          {axis.right}
                        </Text>
                      </Column>
                    </Row>
                    <Text style={{ fontFamily: mono, fontSize: 9, color: hex, margin: '4px 0 0', letterSpacing: 1 }}>
                      → {dominant}
                    </Text>
                  </Column>
                </Row>
              );
            })}
          </Section>

          <Hr style={{ borderColor: '#2a2826', margin: '0 40px' }} />

          {/* ── Fortalezas ── */}
          <Section style={{ padding: '32px 40px' }}>
            <Text style={{ fontFamily: mono, fontSize: 9, letterSpacing: 3, color: '#6b6560', margin: '0 0 16px', textTransform: 'uppercase' }}>
              Tus fortalezas
            </Text>
            {archetype.strengths.map((s) => (
              <Row key={s} style={{ marginBottom: 10 }}>
                <Column style={{ width: 20 }}>
                  <Text style={{ color: hex, fontSize: 14, margin: 0 }}>✦</Text>
                </Column>
                <Column>
                  <Text style={{ fontSize: 14, color: '#b8b0a6', margin: 0 }}>{s}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Hr style={{ borderColor: '#2a2826', margin: '0 40px' }} />

          {/* ── Plan de acción ── */}
          <Section style={{ padding: '32px 40px' }}>
            <Text style={{ fontFamily: mono, fontSize: 9, letterSpacing: 3, color: '#6b6560', margin: '0 0 6px', textTransform: 'uppercase' }}>
              Plan de acción
            </Text>
            <Text style={{ fontSize: 12, color: '#6b6560', margin: '0 0 20px', fontFamily: mono }}>
              Próximas 4 semanas · diseñado para tu arquetipo
            </Text>
            {premium.actionPlan.map((step, i) => (
              <Row key={i} style={{ marginBottom: 12 }}>
                <Column style={{ width: 32, verticalAlign: 'top' }}>
                  <Text style={{ fontFamily: mono, fontSize: 10, color: hex, border: `1px solid ${hex}40`, borderRadius: '50%', width: 22, height: 22, lineHeight: '22px', textAlign: 'center', margin: 0, backgroundColor: `${hex}12`, display: 'inline-block' }}>
                    {i + 1}
                  </Text>
                </Column>
                <Column>
                  <Text style={{ fontSize: 13, color: '#b8b0a6', lineHeight: '1.5', margin: 0 }}>{step}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Hr style={{ borderColor: '#2a2826', margin: '0 40px' }} />

          {/* ── Lo que te drena ── */}
          <Section style={{ padding: '32px 40px' }}>
            <Text style={{ fontFamily: mono, fontSize: 9, letterSpacing: 3, color: '#6b6560', margin: '0 0 16px', textTransform: 'uppercase' }}>
              Lo que te drena
            </Text>
            {premium.energyDrains.map((drain, i) => (
              <Row key={i} style={{ marginBottom: 10 }}>
                <Column style={{ width: 20 }}>
                  <Text style={{ color: '#4a4540', fontSize: 12, margin: 0, fontFamily: mono }}>—</Text>
                </Column>
                <Column>
                  <Text style={{ fontSize: 13, color: '#b8b0a6', margin: 0 }}>{drain}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Hr style={{ borderColor: '#2a2826', margin: '0 40px' }} />

          {/* ── Lectura de sombra ── */}
          <Section style={{ padding: '32px 40px' }}>
            <Row>
              <Column style={{ background: `${hex}08`, border: `1px solid ${hex}25`, borderRadius: 8, padding: '24px' }}>
                <Text style={{ fontFamily: mono, fontSize: 9, letterSpacing: 3, color: '#6b6560', margin: '0 0 6px', textTransform: 'uppercase' }}>
                  Lectura de sombra
                </Text>
                <Text style={{ fontFamily: font, fontSize: 22, color: hex, margin: '0 0 16px', fontWeight: 400, fontStyle: 'italic' }}>
                  {premium.shadowTitle}
                </Text>
                <Text style={{ fontFamily: font, fontSize: 16, color: '#8a8078', fontStyle: 'italic', borderLeft: `2px solid ${hex}`, paddingLeft: 16, margin: '0 0 20px', lineHeight: '1.6' }}>
                  "{premium.shadowQuote}"
                </Text>
                {premium.shadowDescription.split('\n\n').map((para, i) => (
                  <Text key={i} style={{ fontSize: 13, color: '#9a9088', lineHeight: '1.6', margin: '0 0 12px' }}>
                    {para}
                  </Text>
                ))}
                <Row style={{ marginTop: 16 }}>
                  <Column style={{ width: '48%', background: '#1a1816', borderRadius: 6, padding: '14px 16px', marginRight: '4%' }}>
                    <Text style={{ fontFamily: mono, fontSize: 8, letterSpacing: 2, color: '#6b6560', margin: '0 0 6px', textTransform: 'uppercase' }}>
                      El miedo raíz
                    </Text>
                    <Text style={{ fontSize: 12, color: '#9a9088', lineHeight: '1.5', margin: 0 }}>
                      {premium.deepFear}
                    </Text>
                  </Column>
                  <Column style={{ width: '48%', background: '#1a1816', borderRadius: 6, padding: '14px 16px' }}>
                    <Text style={{ fontFamily: mono, fontSize: 8, letterSpacing: 2, color: '#6b6560', margin: '0 0 6px', textTransform: 'uppercase' }}>
                      El camino
                    </Text>
                    <Text style={{ fontSize: 12, color: '#9a9088', lineHeight: '1.5', margin: 0 }}>
                      {premium.healingPath}
                    </Text>
                  </Column>
                </Row>
              </Column>
            </Row>
          </Section>

          <Hr style={{ borderColor: '#2a2826', margin: '0 40px' }} />

          {/* ── Guía de carrera ── */}
          <Section style={{ padding: '32px 40px' }}>
            <Text style={{ fontFamily: mono, fontSize: 9, letterSpacing: 3, color: '#6b6560', margin: '0 0 20px', textTransform: 'uppercase' }}>
              Guía de carrera
            </Text>
            <Text style={{ fontFamily: mono, fontSize: 9, letterSpacing: 2, color: '#6b6560', margin: '0 0 10px', textTransform: 'uppercase' }}>
              Roles donde sobresalés
            </Text>
            <Row style={{ marginBottom: 20, flexWrap: 'wrap' }}>
              {premium.idealRoles.map((role) => (
                <Column key={role} style={{ display: 'inline-block', marginBottom: 6, marginRight: 6 }}>
                  <Text style={{ fontFamily: mono, fontSize: 9, color: hex, border: `1px solid ${hex}40`, borderRadius: 20, padding: '4px 10px', margin: 0, backgroundColor: `${hex}10`, display: 'inline-block', letterSpacing: 1 }}>
                    {role}
                  </Text>
                </Column>
              ))}
            </Row>
            <Row>
              <Column style={{ width: '48%', background: '#1a1816', borderRadius: 6, padding: '14px 16px', marginRight: '4%' }}>
                <Text style={{ fontFamily: mono, fontSize: 8, letterSpacing: 2, color: '#6b6560', margin: '0 0 6px', textTransform: 'uppercase' }}>
                  Tu ambiente ideal
                </Text>
                <Text style={{ fontSize: 12, color: '#9a9088', lineHeight: '1.5', margin: 0 }}>
                  {premium.workEnvironment}
                </Text>
              </Column>
              <Column style={{ width: '48%', background: '#1a1816', borderRadius: 6, padding: '14px 16px' }}>
                <Text style={{ fontFamily: mono, fontSize: 8, letterSpacing: 2, color: '#6b6560', margin: '0 0 6px', textTransform: 'uppercase' }}>
                  Cómo negociás
                </Text>
                <Text style={{ fontSize: 12, color: '#9a9088', lineHeight: '1.5', margin: 0 }}>
                  {premium.negotiationStyle}
                </Text>
              </Column>
            </Row>
            <Text style={{ fontFamily: mono, fontSize: 9, letterSpacing: 2, color: '#6b6560', margin: '20px 0 10px', textTransform: 'uppercase' }}>
              Errores a evitar
            </Text>
            {premium.careerPitfalls.map((p, i) => (
              <Row key={i} style={{ marginBottom: 8 }}>
                <Column style={{ width: 20 }}>
                  <Text style={{ color: '#6b6560', fontSize: 10, margin: 0, fontFamily: mono }}>⚠</Text>
                </Column>
                <Column>
                  <Text style={{ fontSize: 12, color: '#9a9088', margin: 0, lineHeight: '1.5' }}>{p}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Hr style={{ borderColor: '#2a2826', margin: '0 40px' }} />

          {/* ── Vínculos ── */}
          <Section style={{ padding: '32px 40px' }}>
            <Text style={{ fontFamily: mono, fontSize: 9, letterSpacing: 3, color: '#6b6560', margin: '0 0 20px', textTransform: 'uppercase' }}>
              Vínculos y relaciones
            </Text>
            <Row style={{ marginBottom: 12 }}>
              <Column style={{ background: '#1a1816', borderRadius: 6, padding: '14px 16px', marginBottom: 10 }}>
                <Text style={{ fontFamily: mono, fontSize: 8, letterSpacing: 2, color: '#6b6560', margin: '0 0 6px', textTransform: 'uppercase' }}>
                  Cómo amás
                </Text>
                <Text style={{ fontSize: 13, color: '#9a9088', lineHeight: '1.6', margin: 0 }}>
                  {premium.loveStyle}
                </Text>
              </Column>
            </Row>
            <Row>
              <Column style={{ background: '#1a1816', borderRadius: 6, padding: '14px 16px' }}>
                <Text style={{ fontFamily: mono, fontSize: 8, letterSpacing: 2, color: '#6b6560', margin: '0 0 6px', textTransform: 'uppercase' }}>
                  Cómo manejás el conflicto
                </Text>
                <Text style={{ fontSize: 13, color: '#9a9088', lineHeight: '1.6', margin: 0 }}>
                  {premium.conflictPattern}
                </Text>
              </Column>
            </Row>
          </Section>

          <Hr style={{ borderColor: '#2a2826', margin: '0 40px' }} />

          {/* ── Zona de crecimiento ── */}
          <Section style={{ padding: '32px 40px' }}>
            <Row>
              <Column style={{ background: `${hex}10`, border: `1px solid ${hex}30`, borderRadius: 8, padding: '20px 24px' }}>
                <Text style={{ fontFamily: mono, fontSize: 9, letterSpacing: 3, color: hex, margin: '0 0 10px', textTransform: 'uppercase' }}>
                  Tu zona de crecimiento
                </Text>
                <Text style={{ fontSize: 14, color: '#b8b0a6', lineHeight: '1.7', margin: 0, fontStyle: 'italic' }}>
                  {archetype.growthZone}
                </Text>
              </Column>
            </Row>
          </Section>

          <Hr style={{ borderColor: '#2a2826', margin: '0 40px' }} />

          {/* ── CTA ver reporte web ── */}
          <Section style={{ padding: '40px 40px', textAlign: 'center' }}>
            <Text style={{ fontFamily: font, fontSize: 22, color: '#e8e0d8', margin: '0 0 10px', fontWeight: 400 }}>
              Accedé a tu reporte interactivo
            </Text>
            <Text style={{ fontSize: 13, color: '#6b6560', margin: '0 0 28px', lineHeight: '1.6' }}>
              Este link es tuyo. Podés volver cuando quieras.
            </Text>
            <Link
              href={reportUrl}
              style={{
                display: 'inline-block',
                backgroundColor: hex,
                color: '#0e0d0c',
                fontFamily: mono,
                fontSize: 11,
                letterSpacing: 3,
                textTransform: 'uppercase',
                padding: '14px 32px',
                borderRadius: 40,
                textDecoration: 'none',
                fontWeight: 700,
              }}
            >
              Ver mi reporte completo →
            </Link>
            <Text style={{ fontFamily: mono, fontSize: 9, color: '#4a4540', margin: '16px 0 0', letterSpacing: 1 }}>
              Link personal · no compartir
            </Text>
          </Section>

          {/* ── Footer ── */}
          <Section style={{ padding: '24px 40px 40px', borderTop: '1px solid #2a2826', textAlign: 'center' }}>
            <Text style={{ fontFamily: mono, fontSize: 9, color: '#4a4540', margin: '0 0 6px', letterSpacing: 3, textTransform: 'uppercase' }}>
              PRISMA · {archetype.code} · {archetype.name}
            </Text>
            <Text style={{ fontFamily: mono, fontSize: 9, color: '#3a3530', margin: 0, letterSpacing: 1 }}>
              Este reporte fue generado exclusivamente para vos.
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}
