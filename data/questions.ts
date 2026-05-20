export type Axis = 'E1' | 'E2' | 'E3' | 'E4';

export interface Option {
  emoji: string;
  letter: 'a' | 'b' | 'c' | 'd';
  label: string;
  text: string;
}

export interface Question {
  id: number;
  axis: Axis;
  intro: string;
  text: string;
  options: [Option, Option, Option, Option];
}

// Scoring key:
//   options a & b  →  Pole-A  (Introvertido / Sensitivo / Lógico / Planificador)
//   options c & d  →  Pole-B  (Expresivo   / iNtuitivo / Valores / Flexible)

export const QUESTIONS: Question[] = [
  // ─── E1 — Energía ─────────────────────────────────────────────────────────
  {
    id: 1, axis: 'E1',
    intro: 'Un sábado a la mañana',
    text: 'Terminaste una semana muy intensa. ¿Qué hacés?',
    options: [
      { emoji: '🏠', letter: 'a', label: 'Solo en casa',     text: 'Silencio y café. Nadie que me interrumpa.' },
      { emoji: '📖', letter: 'b', label: 'Plan personal',    text: 'Un libro, una serie o algo que tenía pendiente.' },
      { emoji: '☕', letter: 'c', label: 'Salida tranquila', text: 'Un café con alguien de confianza. Nada masivo.' },
      { emoji: '📱', letter: 'd', label: 'Con toda la gente', text: 'Llamo a varios y organizo algo — necesito movimiento.' },
    ],
  },
  {
    id: 5, axis: 'E1',
    intro: 'Un problema difícil',
    text: '¿Cómo lo resolvés mejor?',
    options: [
      { emoji: '🧘', letter: 'a', label: 'Soledad total',  text: 'Necesito silencio absoluto para ordenar mis ideas.' },
      { emoji: '🪑', letter: 'b', label: 'Mi espacio',     text: 'Lo proceso solo primero. Después lo comparto si hace falta.' },
      { emoji: '🗣️', letter: 'c', label: 'Mientras hablo', text: 'Mientras explico entiendo mejor. Necesito a alguien que escuche.' },
      { emoji: '⚡', letter: 'd', label: 'Lluvia de ideas', text: 'Pensar en voz alta con otros es donde más me activo.' },
    ],
  },
  {
    id: 9, axis: 'E1',
    intro: 'Una reunión con muchas ideas',
    text: '¿Cómo participás?',
    options: [
      { emoji: '🎯', letter: 'a', label: 'Escucho y evalúo', text: 'Hablo cuando tengo algo claro y valioso para aportar.' },
      { emoji: '📝', letter: 'b', label: 'Tomo notas',       text: 'Proceso en tiempo real y contribuyo cuando veo la apertura.' },
      { emoji: '💬', letter: 'c', label: 'Voy participando', text: 'Me engancho cuando el tema me interesa, sin esperar demasiado.' },
      { emoji: '🔥', letter: 'd', label: 'Me lanzo',          text: 'Tiro ideas al vuelo — el intercambio rápido es donde mejor pienso.' },
    ],
  },
  {
    id: 13, axis: 'E1',
    intro: 'Tus relaciones',
    text: '¿Con cuál te identificás más?',
    options: [
      { emoji: '🌊', letter: 'a', label: 'Muy pocos, muy profundos', text: 'Un núcleo chico e intenso. Calidad total.' },
      { emoji: '🔒', letter: 'b', label: 'Selectivo',                text: 'Pocos vínculos pero elegidos con cuidado y tiempo.' },
      { emoji: '🗂️', letter: 'c', label: 'Varios círculos',          text: 'Grupos distintos por contexto y me muevo bien entre ellos.' },
      { emoji: '🌐', letter: 'd', label: 'Red amplia',               text: 'Me resulta fácil conectar y me gusta tener muchos vínculos.' },
    ],
  },

  // ─── E2 — Percepción ──────────────────────────────────────────────────────
  {
    id: 2, axis: 'E2',
    intro: 'Un proyecto nuevo',
    text: '¿Qué querés saber primero?',
    options: [
      { emoji: '📊', letter: 'a', label: 'Los datos',       text: '¿Funciona en otros casos? Quiero evidencia concreta antes de avanzar.' },
      { emoji: '📋', letter: 'b', label: 'El plan práctico', text: '¿Cuáles son los pasos concretos para arrancar desde ya?' },
      { emoji: '💫', letter: 'c', label: 'El impacto',      text: '¿A quién puede ayudar? ¿Qué problema real resuelve?' },
      { emoji: '✨', letter: 'd', label: 'El potencial',    text: '¿Adónde puede llegar en 5 años? La visión me importa más que el detalle.' },
    ],
  },
  {
    id: 6, axis: 'E2',
    intro: 'Algo completamente nuevo',
    text: '¿Cómo lo aprendés?',
    options: [
      { emoji: '📖', letter: 'a', label: 'Teoría primero',    text: 'Quiero entender los fundamentos antes de tocar nada.' },
      { emoji: '📐', letter: 'b', label: 'Manual en mano',   text: 'Leo las instrucciones, las entiendo, después arranco.' },
      { emoji: '🏃', letter: 'c', label: 'Hago y consulto',  text: 'Arranco y busco la teoría cuando me trabo en algo concreto.' },
      { emoji: '🏊', letter: 'd', label: 'Al agua',          text: 'Me tiro y aprendo sobre la marcha. La teoría aparece sola.' },
    ],
  },
  {
    id: 10, axis: 'E2',
    intro: 'Algo que no te cierra',
    text: '¿Cómo lo resolvés?',
    options: [
      { emoji: '🔬', letter: 'a', label: 'Busco el dato exacto', text: 'Encuentro la inconsistencia lógica y la resuelvo con información.' },
      { emoji: '📊', letter: 'b', label: 'Reviso los hechos',    text: 'Vuelvo al principio y valido cada paso hasta encontrar la falla.' },
      { emoji: '💡', letter: 'c', label: 'Intuición + verif.',   text: 'Mi corazonada da la dirección. Después busco el respaldo.' },
      { emoji: '🌀', letter: 'd', label: 'Confío en mi instinto', text: 'Lo siento antes de entenderlo. Rara vez me falla.' },
    ],
  },
  {
    id: 14, axis: 'E2',
    intro: 'Tus mejores ideas',
    text: '¿De dónde vienen?',
    options: [
      { emoji: '⚙️', letter: 'a', label: 'Del análisis',     text: 'Comparo opciones sistemáticamente y llego a la mejor combinación.' },
      { emoji: '📋', letter: 'b', label: 'De la revisión',   text: 'Cuando reviso lo que hice y veo lo que podría mejorarse.' },
      { emoji: '🛁', letter: 'c', label: 'Momentos off',     text: 'Ducha, caminata, cocina — cuando estoy "desconectado".' },
      { emoji: '🚀', letter: 'd', label: 'De la nada',       text: 'Me llegan completas. No las pienso — las recibo.' },
    ],
  },

  // ─── E3 — Decisión ────────────────────────────────────────────────────────
  {
    id: 3, axis: 'E3',
    intro: 'Un amigo pide consejo',
    text: '¿Qué hacés primero?',
    options: [
      { emoji: '🧮', letter: 'a', label: 'Análisis objetivo', text: 'Le ayudo a ver los pros y contras sin involucrar emociones.' },
      { emoji: '📋', letter: 'b', label: 'Orden y claridad',  text: 'Le hago preguntas concretas para entender bien la situación.' },
      { emoji: '🤝', letter: 'c', label: 'Escucho primero',   text: 'Le pregunto cómo se siente antes de cualquier consejo.' },
      { emoji: '❤️', letter: 'd', label: 'Contención total',  text: 'Lo que necesita es sentirse acompañado. El análisis puede esperar.' },
    ],
  },
  {
    id: 7, axis: 'E3',
    intro: 'Una decisión importante',
    text: '¿Qué peso más?',
    options: [
      { emoji: '📋', letter: 'a', label: 'Lista y comparación', text: 'Armo una tabla, pongo pros y contras, elijo lo más racional.' },
      { emoji: '🔍', letter: 'b', label: 'Análisis estructurado', text: 'Pienso en las consecuencias concretas de cada opción.' },
      { emoji: '🌱', letter: 'c', label: 'Mis valores',         text: 'Chequeo si la opción está alineada con lo que me importa.' },
      { emoji: '🫀', letter: 'd', label: 'Lo que siento',       text: 'Si no lo siento bien, no lo hago, aunque los números digan otra cosa.' },
    ],
  },
  {
    id: 11, axis: 'E3',
    intro: 'Un error en el equipo',
    text: '¿Qué hacés primero?',
    options: [
      { emoji: '🔍', letter: 'a', label: 'Analizo qué falló',  text: 'Entiendo el proceso que falló para que no vuelva a pasar.' },
      { emoji: '📝', letter: 'b', label: 'Busco la causa',      text: 'Reviso qué salió mal y cómo mejorar el sistema.' },
      { emoji: '💬', letter: 'c', label: 'Chequeo a la persona', text: 'Primero me aseguro de que esté bien. Después hablamos del error.' },
      { emoji: '🫂', letter: 'd', label: 'Apoyo primero',       text: 'El error puede esperar. La persona no.' },
    ],
  },
  {
    id: 15, axis: 'E3',
    intro: 'Una frase que te define',
    text: '¿Cuál resuena más?',
    options: [
      { emoji: '🔬', letter: 'a', label: 'Los hechos mandan',   text: '"Los datos no mienten — los sentimientos pueden engañar."' },
      { emoji: '📐', letter: 'b', label: 'Lógica ante todo',    text: '"Una buena decisión necesita información, no impulsos."' },
      { emoji: '🌱', letter: 'c', label: 'Las personas primero', text: '"Si no está bien para las personas, no importa cuánto sentido tenga."' },
      { emoji: '💞', letter: 'd', label: 'Lo más importante',   text: '"Lo más valioso nunca se mide — se siente."' },
    ],
  },

  // ─── E4 — Estilo ──────────────────────────────────────────────────────────
  {
    id: 4, axis: 'E4',
    intro: 'Antes de un viaje',
    text: '¿Cómo llegás al aeropuerto?',
    options: [
      { emoji: '🗓️', letter: 'a', label: 'Todo cerrado',      text: 'Itinerario armado, reservas hechas, lista revisada dos veces.' },
      { emoji: '📍', letter: 'b', label: 'Lo esencial',        text: 'Tengo vuelos y alojamiento. El resto lo veo sobre la marcha.' },
      { emoji: '🎲', letter: 'c', label: 'Esquema básico',     text: 'Tengo la idea general pero dejo espacio para improvisar.' },
      { emoji: '🌊', letter: 'd', label: 'A ver qué surge',    text: 'Compro el pasaje y fluyo. Lo espontáneo es parte del plan.' },
    ],
  },
  {
    id: 8, axis: 'E4',
    intro: 'Tu espacio de trabajo',
    text: '¿Cómo es?',
    options: [
      { emoji: '📐', letter: 'a', label: 'Todo en su lugar',    text: 'Cada cosa tiene su lugar. Si no está ahí, no puedo concentrarme.' },
      { emoji: '🗂️', letter: 'b', label: 'Organizado a mi manera', text: 'Tengo sistema propio. No es para todos pero funciona.' },
      { emoji: '🌀', letter: 'c', label: 'Organización flexible', text: 'Parece un poco caótico pero sé exactamente dónde está todo.' },
      { emoji: '🎨', letter: 'd', label: 'Caos creativo',         text: 'El orden excesivo me bloquea. Necesito libertad visual.' },
    ],
  },
  {
    id: 12, axis: 'E4',
    intro: 'Un plan que cambia de último momento',
    text: '¿Cómo reaccionás?',
    options: [
      { emoji: '🧱', letter: 'a', label: 'Me genera fricción',  text: 'Los cambios bruscos me cuestan. Necesito tiempo para adaptarme.' },
      { emoji: '😤', letter: 'b', label: 'Lo ajusto',           text: 'Prefiero no tener que hacerlo, pero lo manejo si es necesario.' },
      { emoji: '🌊', letter: 'c', label: 'Lo tomo bien',        text: 'La adaptabilidad es mi fortaleza. Me ajusto sin drama.' },
      { emoji: '⚡', letter: 'd', label: 'Me activa',            text: 'Los cambios inesperados a veces sacan lo mejor de mí.' },
    ],
  },
  {
    id: 16, axis: 'E4',
    intro: 'Tu semana ideal',
    text: '¿Cómo la organizás?',
    options: [
      { emoji: '📅', letter: 'a', label: 'Agenda definida',  text: 'Objetivos claros por día, horarios respetados, avance medible.' },
      { emoji: '🗒️', letter: 'b', label: 'Estructura flexible', text: 'Sé qué tengo que lograr, con cierta libertad en el cómo.' },
      { emoji: '🎨', letter: 'c', label: 'Estructura mínima', text: 'Puntos ancla que me orienten y mucho espacio para el flujo.' },
      { emoji: '🌈', letter: 'd', label: 'Totalmente libre',  text: 'Sin agenda fija. Me muevo según la energía y el contexto.' },
    ],
  },
];
