export type Axis = 'E1' | 'E2' | 'E3' | 'E4';

export interface Option {
  emoji:  string;
  letter: 'a' | 'b' | 'c' | 'd';
  text:   string;
}

export interface Question {
  id:      number;
  axis:    Axis;
  text:    string;
  options: [Option, Option, Option, Option];
}

// Scoring:  a | b → Pole-A   c | d → Pole-B

export const QUESTIONS: Question[] = [

  // ─── E1 — Energía ─────────────────────────────────────────────
  {
    id: 1, axis: 'E1',
    text: '¿Cómo cerrás una semana muy intensa?',
    options: [
      { emoji: '🏠', letter: 'a', text: 'En casa, solo. Silencio total.' },
      { emoji: '📖', letter: 'b', text: 'Un libro o algo que tenía pendiente.' },
      { emoji: '☕', letter: 'c', text: 'Un café con alguien de confianza.' },
      { emoji: '📱', letter: 'd', text: 'Organizo algo — necesito gente y movimiento.' },
    ],
  },
  {
    id: 5, axis: 'E1',
    text: 'Cuando algo te preocupa, ¿cómo lo resolvés?',
    options: [
      { emoji: '🧘', letter: 'a', text: 'Solo y en silencio, hasta que lo ordeno.' },
      { emoji: '🪑', letter: 'b', text: 'Lo pienso primero, después lo hablo si hace falta.' },
      { emoji: '🗣️', letter: 'c', text: 'Hablándolo — mientras lo cuento, lo entiendo.' },
      { emoji: '⚡', letter: 'd', text: 'En voz alta con alguien — ahí es donde me activo.' },
    ],
  },
  {
    id: 13, axis: 'E1',
    text: '¿Cómo son tus vínculos más importantes?',
    options: [
      { emoji: '🌊', letter: 'a', text: 'Pocos y profundos. Calidad total.' },
      { emoji: '🔒', letter: 'b', text: 'Selectivos — los elijo con mucho cuidado.' },
      { emoji: '🗂️', letter: 'c', text: 'Distintos grupos según el contexto.' },
      { emoji: '🌐', letter: 'd', text: 'Una red amplia — me resulta fácil conectar.' },
    ],
  },

  // ─── E2 — Percepción ──────────────────────────────────────────
  {
    id: 6, axis: 'E2',
    text: '¿Cómo encarás algo que nunca hiciste antes?',
    options: [
      { emoji: '📖', letter: 'a', text: 'Leo todo lo que puedo antes de empezar.' },
      { emoji: '📐', letter: 'b', text: 'Entiendo bien los pasos y después arranco.' },
      { emoji: '🏃', letter: 'c', text: 'Arranco y busco respuestas cuando me trabo.' },
      { emoji: '🏊', letter: 'd', text: 'Me tiro de cabeza — aprendo haciendo.' },
    ],
  },
  {
    id: 14, axis: 'E2',
    text: '¿De dónde vienen tus mejores ideas?',
    options: [
      { emoji: '⚙️', letter: 'a', text: 'De analizar bien todas las opciones.' },
      { emoji: '📋', letter: 'b', text: 'De revisar lo hecho y ver qué mejorar.' },
      { emoji: '🛁', letter: 'c', text: 'En la ducha, caminando — cuando me desconecto.' },
      { emoji: '🚀', letter: 'd', text: 'De la nada. Me llegan sin buscarlas.' },
    ],
  },

  // ─── E3 — Decisión ────────────────────────────────────────────
  {
    id: 3, axis: 'E3',
    text: 'Un amigo te pide consejo. ¿Qué hacés primero?',
    options: [
      { emoji: '🧮', letter: 'a', text: 'Le ayudo a ver la situación de forma objetiva.' },
      { emoji: '📋', letter: 'b', text: 'Le hago preguntas para entender bien qué pasó.' },
      { emoji: '🤝', letter: 'c', text: 'Le pregunto cómo se siente antes de opinar.' },
      { emoji: '❤️', letter: 'd', text: 'Lo que necesita es sentirse escuchado.' },
    ],
  },
  {
    id: 7, axis: 'E3',
    text: '¿Qué pesás más cuando tomás una decisión importante?',
    options: [
      { emoji: '📋', letter: 'a', text: 'Lo que tiene más sentido lógicamente.' },
      { emoji: '🔍', letter: 'b', text: 'Las consecuencias reales de cada opción.' },
      { emoji: '🌱', letter: 'c', text: 'Si está alineado con lo que realmente me importa.' },
      { emoji: '🫀', letter: 'd', text: 'Cómo lo siento — si no me cierra, no lo hago.' },
    ],
  },
  {
    id: 15, axis: 'E3',
    text: '¿Con qué frase te identificás más?',
    options: [
      { emoji: '🔬', letter: 'a', text: '"Los hechos no mienten. Las emociones, a veces sí."' },
      { emoji: '📐', letter: 'b', text: '"Primero analizar bien, después decidir."' },
      { emoji: '🌱', letter: 'c', text: '"Si no sirve a las personas, no importa cuánto sentido tenga."' },
      { emoji: '💞', letter: 'd', text: '"Lo más valioso no se mide — se siente."' },
    ],
  },

  // ─── E4 — Estilo ──────────────────────────────────────────────
  {
    id: 4, axis: 'E4',
    text: '¿Cómo organizás un viaje?',
    options: [
      { emoji: '🗓️', letter: 'a', text: 'Todo planificado: itinerario, reservas y lista revisada.' },
      { emoji: '📍', letter: 'b', text: 'Vuelos y hotel. El resto lo veo cuando llegue.' },
      { emoji: '🎲', letter: 'c', text: 'Tengo la idea general pero dejo espacio para improvisar.' },
      { emoji: '🌊', letter: 'd', text: 'Compro el pasaje y fluyo — la espontaneidad es parte del plan.' },
    ],
  },
  {
    id: 12, axis: 'E4',
    text: '¿Cómo reaccionás cuando un plan cambia de último momento?',
    options: [
      { emoji: '🧱', letter: 'a', text: 'Me descoloca — los cambios bruscos me sacan del ritmo.' },
      { emoji: '😤', letter: 'b', text: 'No me gusta, pero lo manejo si es necesario.' },
      { emoji: '🌊', letter: 'c', text: 'Sin drama — me adapto fácilmente.' },
      { emoji: '⚡', letter: 'd', text: 'A veces los cambios inesperados sacan lo mejor de mí.' },
    ],
  },

];
