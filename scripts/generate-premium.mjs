// Run once: node scripts/generate-premium.mjs
// Generates premium content for all 16 archetypes via Gemini and writes data/premiumContent.ts

import { writeFileSync } from 'fs';

const API_KEY = 'AIzaSyAeDPWiRY2B6Q_wByHKKDE8WqXNBB_UG68';
const MODEL   = 'nano-banana-pro-preview';
const URL     = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

const ARCHETYPES = [
  { code:'ISLP', name:'El Arquitecto',  tagline:'Construís sistemas donde otros ven caos.' },
  { code:'ISLF', name:'El Artesano',    tagline:'Aprendés haciendo. Pensás tocando.' },
  { code:'ISVP', name:'El Guardián',    tagline:'Sostenés el mundo para que todos puedan moverse.' },
  { code:'ISVF', name:'El Sanador',     tagline:'Tu presencia calma antes de que digas nada.' },
  { code:'INLP', name:'El Estratega',   tagline:'Ves el tablero entero cuando otros ven una sola pieza.' },
  { code:'INLF', name:'El Pensador',    tagline:'Mientras el mundo actúa, vos encontrás el patrón.' },
  { code:'INVP', name:'El Visionario',  tagline:'Sentís el futuro antes de que llegue.' },
  { code:'INVF', name:'El Soñador',     tagline:'Tu mundo interior es más rico que el exterior.' },
  { code:'ESLP', name:'El Director',    tagline:'No esperás que las cosas pasen. Las hacés pasar.' },
  { code:'ESLF', name:'El Emprendedor', tagline:'Donde otros ven riesgo, vos ves oportunidad.' },
  { code:'ESVP', name:'El Cuidador',    tagline:'Hacés que todos sientan que pertenecen.' },
  { code:'ESVF', name:'El Animador',    tagline:'Tu energía es el lugar al que todos quieren llegar.' },
  { code:'ENLP', name:'El Comandante',  tagline:'No solo tenés la visión — sabés cómo ejecutarla.' },
  { code:'ENLF', name:'El Innovador',   tagline:'Conectás puntos que nadie más veía relacionados.' },
  { code:'ENVP', name:'El Mentor',      tagline:'Sabés exactamente qué necesita escuchar cada persona.' },
  { code:'ENVF', name:'El Explorador',  tagline:'Tu entusiasmo abre puertas que otros ni ven.' },
];

function buildPrompt(batch) {
  const list = batch.map(a => `- ${a.code}: ${a.name} — "${a.tagline}"`).join('\n');

  return `Sos un psicólogo y coach especializado en arquetipos de personalidad.
Vas a generar contenido premium en español rioplatense (Argentina) para los siguientes arquetipos de personalidad:

${list}

Para CADA arquetipo, generá un objeto JSON con exactamente estas claves:

{
  "code": "XXXX",
  "deepDive": "2 párrafos cortos (4-5 oraciones cada uno) de análisis psicológico profundo. Nuevo ángulo — no repetir la descripción base. Tono: directo, íntimo, honesto.",
  "communicationStyle": "2-3 oraciones sobre cómo comunica este tipo naturalmente. Qué dice con facilidad, qué le cuesta decir, cómo escucha.",
  "actionPlan": ["5 acciones concretas y específicas para las próximas 4 semanas. Cada una empieza con un verbo. Cortas y accionables."],
  "energyDrains": ["3 situaciones o dinámicas que drenan a este tipo. Concretas y reconocibles."],
  "idealRoles": ["6 roles o títulos laborales específicos donde este tipo sobresale"],
  "workEnvironment": "2 oraciones sobre el ambiente de trabajo ideal. Físico, cultural y social.",
  "negotiationStyle": "2 oraciones sobre cómo negocia este tipo. Fortaleza y punto ciego.",
  "careerPitfalls": ["3 errores de carrera típicos de este tipo. Concretos y evitables."],
  "shadowTitle": "Un nombre en español para el patrón de sombra de este tipo (ej: 'El Control Disfrazado', 'La Huida Perfecta'). 3-5 palabras.",
  "shadowDescription": "2 párrafos cortos sobre el lado oscuro inconsciente de este tipo. Honesto sin ser cruel. Qué hace cuando está en modo sombra.",
  "deepFear": "1-2 oraciones sobre el miedo raíz que activa la sombra.",
  "healingPath": "2-3 oraciones sobre lo que necesita integrar o trabajar para crecer.",
  "shadowQuote": "Una frase corta (máx 12 palabras) que captura la sombra. Primera persona. Reveladora.",
  "loveStyle": "2 oraciones sobre cómo da y recibe amor. Qué necesita en un vínculo para sentirse seguro.",
  "conflictPattern": "2 oraciones sobre cómo maneja el conflicto. Qué hace, qué evita."
}

Responde con un array JSON válido con ${batch.length} objetos, uno por arquetipo. Solo JSON, sin texto adicional.`;
}

async function callGemini(prompt) {
  const res = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.75,
        maxOutputTokens: 8192,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('No text in response: ' + JSON.stringify(data));
  return JSON.parse(text);
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  const BATCH_SIZE = 4;
  const all = [];

  for (let i = 0; i < ARCHETYPES.length; i += BATCH_SIZE) {
    const batch = ARCHETYPES.slice(i, i + BATCH_SIZE);
    console.log(`\n⏳ Batch ${Math.floor(i/BATCH_SIZE)+1}/${Math.ceil(ARCHETYPES.length/BATCH_SIZE)}: ${batch.map(a=>a.code).join(', ')}`);

    const results = await callGemini(buildPrompt(batch));
    all.push(...results);
    console.log(`✅ Got ${results.length} archetypes`);

    if (i + BATCH_SIZE < ARCHETYPES.length) {
      console.log('⏸  Waiting 4s to respect rate limit...');
      await sleep(4000);
    }
  }

  // Index by code
  const indexed = {};
  for (const item of all) {
    indexed[item.code] = item;
  }

  // Verify all 16 are present
  const missing = ARCHETYPES.map(a => a.code).filter(c => !indexed[c]);
  if (missing.length > 0) {
    console.warn('⚠️  Missing archetypes:', missing);
  }

  const ts = `// AUTO-GENERATED — do not edit manually
// Run: node scripts/generate-premium.mjs

export interface PremiumContent {
  code: string;
  deepDive: string;
  communicationStyle: string;
  actionPlan: string[];
  energyDrains: string[];
  idealRoles: string[];
  workEnvironment: string;
  negotiationStyle: string;
  careerPitfalls: string[];
  shadowTitle: string;
  shadowDescription: string;
  deepFear: string;
  healingPath: string;
  shadowQuote: string;
  loveStyle: string;
  conflictPattern: string;
}

export const PREMIUM: Record<string, PremiumContent> = ${JSON.stringify(indexed, null, 2)};
`;

  writeFileSync('data/premiumContent.ts', ts, 'utf-8');
  console.log('\n🎉 Written to data/premiumContent.ts');
  console.log(`   ${Object.keys(indexed).length}/16 archetypes generated`);
}

main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
