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

// Scoring (see lib/scoring.ts): a/b lean Pole-A, c/d lean Pole-B.
//   a = strong A · b = mild A · c = mild B · d = strong B
// Axis poles:  E1 I/E · E2 S/N · E3 L/V · E4 P/F
// 16 questions · 4 per axis · interleaved so every question switches dimension (and colour).

export const QUESTIONS: Question[] = [

  // ─── Ronda 1 ──────────────────────────────────────────────────
  {
    id: 1, axis: 'E1',
    text: '¿Cómo cerrás una semana muy intensa?',
    options: [
      { emoji: '🏠', letter: 'a', text: 'En casa, solo. Silencio total.' },
      { emoji: '📖', letter: 'b', text: 'Un libro o algo que tenía pendiente.' },
      { emoji: '☕', letter: 'c', text: 'Un café con alguien de confianza.' },
      { emoji: '🎟️', letter: 'd', text: 'Organizo algo — necesito gente y movimiento.' },
    ],
  },
  {
    id: 6, axis: 'E2',
    text: 'Tenés un rato libre y la mente se te va sola. ¿Hacia dónde?',
    options: [
      { emoji: '✅', letter: 'a', text: 'A lo concreto: pendientes y cosas que tengo que resolver.' },
      { emoji: '🔁', letter: 'b', text: 'A repasar algo que ya pasó y darle vueltas.' },
      { emoji: '🔗', letter: 'c', text: 'A conectar ideas sueltas: "esto se parece a aquello".' },
      { emoji: '💭', letter: 'd', text: 'A imaginar escenarios: "¿y si...?".' },
    ],
  },
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
    id: 4, axis: 'E4',
    text: '¿Cómo organizás un viaje?',
    options: [
      { emoji: '🗓️', letter: 'a', text: 'Todo planificado: itinerario, reservas y lista revisada.' },
      { emoji: '📍', letter: 'b', text: 'Vuelos y hotel. El resto lo veo cuando llegue.' },
      { emoji: '🎲', letter: 'c', text: 'Tengo la idea general pero dejo espacio para improvisar.' },
      { emoji: '🌊', letter: 'd', text: 'Compro el pasaje y fluyo — la espontaneidad es parte del plan.' },
    ],
  },

  // ─── Ronda 2 ──────────────────────────────────────────────────
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
    id: 16, axis: 'E2',
    text: '¿Qué te llama más la atención de una situación nueva?',
    options: [
      { emoji: '🔍', letter: 'a', text: 'Los detalles concretos: qué es, cómo funciona exactamente.' },
      { emoji: '📊', letter: 'b', text: 'Los datos verificables — lo que se puede comprobar.' },
      { emoji: '🪢', letter: 'c', text: 'Las conexiones con otras cosas que ya conozco.' },
      { emoji: '💡', letter: 'd', text: 'El potencial — a dónde podría llegar.' },
    ],
  },
  {
    id: 15, axis: 'E3',
    text: 'Tenés que dar una noticia difícil en el trabajo. ¿Qué te preocupa más?',
    options: [
      { emoji: '🎯', letter: 'a', text: 'Que el mensaje quede claro y no se preste a confusión.' },
      { emoji: '📋', letter: 'b', text: 'Tener bien los argumentos por si me los discuten.' },
      { emoji: '❤️', letter: 'c', text: 'Cómo se va a sentir la persona que la recibe.' },
      { emoji: '🤝', letter: 'd', text: 'Decirlo de una forma que no lastime el vínculo.' },
    ],
  },
  {
    id: 12, axis: 'E4',
    text: 'Un plan cambia de último momento. ¿Cómo reaccionás?',
    options: [
      { emoji: '🧱', letter: 'a', text: 'Me descoloca — los cambios bruscos me sacan del ritmo.' },
      { emoji: '😤', letter: 'b', text: 'No me gusta, pero lo manejo si es necesario.' },
      { emoji: '🌊', letter: 'c', text: 'Sin drama — me adapto fácilmente.' },
      { emoji: '🤸', letter: 'd', text: 'A veces los cambios inesperados sacan lo mejor de mí.' },
    ],
  },

  // ─── Ronda 3 ──────────────────────────────────────────────────
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
  {
    id: 9, axis: 'E2',
    text: 'Comprás un mueble para armar. ¿Cómo arrancás?',
    options: [
      { emoji: '📄', letter: 'a', text: 'Sigo las instrucciones al pie de la letra.' },
      { emoji: '🔩', letter: 'b', text: 'Miro las piezas y voy entendiendo sobre la marcha.' },
      { emoji: '🧩', letter: 'c', text: 'Capto la idea general y lo armo a mi manera.' },
      { emoji: '🌌', letter: 'd', text: 'Imagino el resultado final y voy hacia ahí.' },
    ],
  },
  {
    id: 11, axis: 'E3',
    text: 'Tenés que elegir entre dos trabajos. ¿Qué pesa más?',
    options: [
      { emoji: '📊', letter: 'a', text: 'Los números: sueldo, horario, crecimiento.' },
      { emoji: '⚖️', letter: 'b', text: 'Cuál tiene más sentido para mi carrera.' },
      { emoji: '🌱', letter: 'c', text: 'Dónde me voy a sentir más yo mismo.' },
      { emoji: '🫶', letter: 'd', text: 'Con qué equipo y qué valores conecto más.' },
    ],
  },
  {
    id: 19, axis: 'E4',
    text: 'Tu espacio de trabajo, ¿cómo es?',
    options: [
      { emoji: '🗂️', letter: 'a', text: 'Ordenado: cada cosa en su lugar.' },
      { emoji: '📌', letter: 'b', text: 'Tengo mi sistema, aunque otros no lo entiendan.' },
      { emoji: '🌀', letter: 'c', text: 'Un caos organizado — yo me encuentro.' },
      { emoji: '🪁', letter: 'd', text: 'Cambia todo el tiempo según lo que esté haciendo.' },
    ],
  },

  // ─── Ronda 4 ──────────────────────────────────────────────────
  {
    id: 2, axis: 'E1',
    text: 'Llegás a una fiesta donde casi no conocés a nadie. ¿Qué hacés?',
    options: [
      { emoji: '🪑', letter: 'a', text: 'Busco una charla tranquila en un rincón.' },
      { emoji: '👀', letter: 'b', text: 'Observo un rato antes de sumarme.' },
      { emoji: '🙌', letter: 'c', text: 'Me acerco a un grupo y me meto en la conversación.' },
      { emoji: '🎤', letter: 'd', text: 'En diez minutos ya conozco a media fiesta.' },
    ],
  },
  {
    id: 10, axis: 'E2',
    text: 'Te enganchás más con la gente que...',
    options: [
      { emoji: '🧱', letter: 'a', text: 'Habla de cosas concretas y reales.' },
      { emoji: '🗺️', letter: 'b', text: 'Cuenta lo que pasó con todos los detalles.' },
      { emoji: '💬', letter: 'c', text: 'Tira ideas locas y teorías.' },
      { emoji: '🔮', letter: 'd', text: 'Te hace pensar en lo que todavía no existe.' },
    ],
  },
  {
    id: 18, axis: 'E3',
    text: 'Alguien opina algo con lo que no estás de acuerdo. ¿Qué te sale?',
    options: [
      { emoji: '🧠', letter: 'a', text: 'Le marco dónde no cierra su razonamiento.' },
      { emoji: '🔍', letter: 'b', text: 'Le pido datos que respalden lo que dice.' },
      { emoji: '🤲', letter: 'c', text: 'Trato de entender de dónde viene antes de opinar.' },
      { emoji: '🕊️', letter: 'd', text: 'Si no es importante, lo dejo pasar para no incomodar.' },
    ],
  },
  {
    id: 20, axis: 'E4',
    text: 'Faltan dos semanas para una entrega importante. ¿Vos?',
    options: [
      { emoji: '🧭', letter: 'a', text: 'Ya tengo un plan con fechas para cada parte.' },
      { emoji: '📈', letter: 'b', text: 'Arranco temprano y avanzo de a poco.' },
      { emoji: '⏳', letter: 'c', text: 'Le doy vueltas y arranco cuando me sale.' },
      { emoji: '🔥', letter: 'd', text: 'Rindo mejor con la presión del último momento.' },
    ],
  },

];
