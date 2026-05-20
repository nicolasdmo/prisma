/* ============================================================
   PRISMA — Data: Preguntas y Arquetipos
   ============================================================ */

const PREGUNTAS = [
  /* ---- PREGUNTA 1 — Eje 1: Energía ---- */
  {
    id: 1, eje: 1,
    emoji: '🌅',
    texto: 'Terminaste una semana muy intensa. El sábado a la mañana...',
    opciones: [
      { emoji: '🏠', texto: 'Me quedo en casa — silencio, café y mi propio ritmo', polo: 'A' },
      { emoji: '📱', texto: 'Ya estoy pensando a quién llamar — necesito gente para recargar', polo: 'B' }
    ]
  },
  /* ---- PREGUNTA 2 — Eje 2: Percepción ---- */
  {
    id: 2, eje: 2,
    emoji: '🚀',
    texto: 'Te presentan un proyecto nuevo. ¿Qué querés saber primero?',
    opciones: [
      { emoji: '📊', texto: 'Los números, los datos, la evidencia — ¿funcionó en otros casos?', polo: 'A' },
      { emoji: '✨', texto: 'El potencial, la visión — ¿adónde puede llegar? ¿qué impacto puede tener?', polo: 'B' }
    ]
  },
  /* ---- PREGUNTA 3 — Eje 3: Decisión ---- */
  {
    id: 3, eje: 3,
    emoji: '🤝',
    texto: 'Un amigo te pide consejo sobre una decisión muy difícil. Lo primero que hacés...',
    opciones: [
      { emoji: '🧮', texto: 'Le ayudo a analizar los pros y contras objetivamente', polo: 'A' },
      { emoji: '❤️', texto: 'Le pregunto cómo se siente con cada opción antes de cualquier análisis', polo: 'B' }
    ]
  },
  /* ---- PREGUNTA 4 — Eje 4: Estilo ---- */
  {
    id: 4, eje: 4,
    emoji: '✈️',
    texto: 'Antes de un viaje largo...',
    opciones: [
      { emoji: '🗓️', texto: 'Tengo el itinerario armado, reservas hechas y lista de lo que llevo', polo: 'A' },
      { emoji: '🎲', texto: 'Compro el pasaje y veo qué surge — lo espontáneo es parte del plan', polo: 'B' }
    ]
  },
  /* ---- PREGUNTA 5 — Eje 1: Energía ---- */
  {
    id: 5, eje: 1,
    emoji: '🧩',
    texto: 'Cuando tenés que resolver un problema muy difícil...',
    opciones: [
      { emoji: '🧘', texto: 'Lo proceso solo — necesito espacio y silencio para pensar bien', polo: 'A' },
      { emoji: '🗣️', texto: 'Lo hablo con alguien — las ideas fluyen cuando las digo en voz alta', polo: 'B' }
    ]
  },
  /* ---- PREGUNTA 6 — Eje 2: Percepción ---- */
  {
    id: 6, eje: 2,
    emoji: '📚',
    texto: 'Cuando aprendés algo completamente nuevo...',
    opciones: [
      { emoji: '📖', texto: 'Quiero entender la teoría y los fundamentos antes de arrancar', polo: 'A' },
      { emoji: '🏊', texto: 'Me tiro al agua y entiendo cómo funciona sobre la marcha', polo: 'B' }
    ]
  },
  /* ---- PREGUNTA 7 — Eje 3: Decisión ---- */
  {
    id: 7, eje: 3,
    emoji: '⚖️',
    texto: 'Cuando tomás una decisión importante para tu vida...',
    opciones: [
      { emoji: '📋', texto: 'Armás una lista, comparás opciones y elegís lo más lógico', polo: 'A' },
      { emoji: '🌱', texto: 'Chequeás si está alineado con tus valores y cómo lo sentís por dentro', polo: 'B' }
    ]
  },
  /* ---- PREGUNTA 8 — Eje 4: Estilo ---- */
  {
    id: 8, eje: 4,
    emoji: '🖥️',
    texto: 'Tu espacio de trabajo o tu casa...',
    opciones: [
      { emoji: '📐', texto: 'Cada cosa tiene su lugar — el desorden me quita concentración', polo: 'A' },
      { emoji: '🌀', texto: 'Puede parecer caótico pero yo sé exactamente dónde está todo', polo: 'B' }
    ]
  },
  /* ---- PREGUNTA 9 — Eje 1: Energía ---- */
  {
    id: 9, eje: 1,
    emoji: '💬',
    texto: 'En una reunión con muchas ideas volando en el aire...',
    opciones: [
      { emoji: '🎯', texto: 'Escucho, proceso y hablo cuando tengo algo sólido que aportar', polo: 'A' },
      { emoji: '⚡', texto: 'Lanzo ideas al vuelo — construirlas en grupo es lo que más disfruto', polo: 'B' }
    ]
  },
  /* ---- PREGUNTA 10 — Eje 2: Percepción ---- */
  {
    id: 10, eje: 2,
    emoji: '🔍',
    texto: 'Cuando algo no te cierra en una situación...',
    opciones: [
      { emoji: '🔬', texto: 'Busco el dato o la inconsistencia lógica que no encaja con el resto', polo: 'A' },
      { emoji: '💡', texto: 'Sigo mi corazonada aunque no pueda explicarla del todo', polo: 'B' }
    ]
  },
  /* ---- PREGUNTA 11 — Eje 3: Decisión ---- */
  {
    id: 11, eje: 3,
    emoji: '💼',
    texto: 'Alguien de tu equipo comete un error importante. Primero...',
    opciones: [
      { emoji: '🎯', texto: 'Analizás qué salió mal para que no vuelva a pasar', polo: 'A' },
      { emoji: '💬', texto: 'Te asegurás de que la persona esté bien antes de hablar del error', polo: 'B' }
    ]
  },
  /* ---- PREGUNTA 12 — Eje 4: Estilo ---- */
  {
    id: 12, eje: 4,
    emoji: '📅',
    texto: 'Un plan importante cambia de último momento...',
    opciones: [
      { emoji: '🧱', texto: 'Me genera fricción — prefiero ajustar sobre algo definido', polo: 'A' },
      { emoji: '🌊', texto: 'Lo tomo bien — adaptarme rápido es una de mis fortalezas', polo: 'B' }
    ]
  },
  /* ---- PREGUNTA 13 — Eje 1: Energía ---- */
  {
    id: 13, eje: 1,
    emoji: '👥',
    texto: '¿Con cuál te identificás más?',
    opciones: [
      { emoji: '🌊', texto: 'Tengo pocos amigos pero vínculos muy profundos', polo: 'A' },
      { emoji: '🌐', texto: 'Tengo muchos conocidos y me resulta fácil conectar con gente nueva', polo: 'B' }
    ]
  },
  /* ---- PREGUNTA 14 — Eje 2: Percepción ---- */
  {
    id: 14, eje: 2,
    emoji: '💭',
    texto: '¿Cómo llegás a tus mejores ideas?',
    opciones: [
      { emoji: '⚙️', texto: 'Analizando y comparando opciones de forma sistemática', polo: 'A' },
      { emoji: '🚿', texto: 'De repente — en la ducha, manejando, casi dormido — me llegan solas', polo: 'B' }
    ]
  },
  /* ---- PREGUNTA 15 — Eje 3: Decisión ---- */
  {
    id: 15, eje: 3,
    emoji: '💬',
    texto: '¿Con cuál de estas frases te identificás más?',
    opciones: [
      { emoji: '🔬', texto: '"Los hechos no mienten — los sentimientos pueden engañar"', polo: 'A' },
      { emoji: '🌱', texto: '"Si no está bien para las personas, no importa cuánto sentido tenga en papel"', polo: 'B' }
    ]
  },
  /* ---- PREGUNTA 16 — Eje 4: Estilo ---- */
  {
    id: 16, eje: 4,
    emoji: '🗓️',
    texto: 'Tu semana ideal se parece más a...',
    opciones: [
      { emoji: '📅', texto: 'Agenda definida, objetivos claros, avanzar según lo planificado', polo: 'A' },
      { emoji: '🎨', texto: 'Estructura mínima, espacio para lo inesperado, libertad de flujo', polo: 'B' }
    ]
  }
];

/* ====================================================
   ARQUETIPOS — 16 tipos completos
   ==================================================== */
const ARQUETIPOS = {
  'I-A-R-P': {
    nombre: 'El Arquitecto',
    emoji: '🏛️',
    color: '#3b82f6',
    colorDark: '#1e3a8a',
    tagline: 'No construyo proyectos. Construyo sistemas que duran.',
    descripcion: [
      'Sos de las mentes más raras y más poderosas que existen. Mientras otros reaccionan al mundo, vos lo analizás, lo modelás y lo rediseñás desde adentro. Tenés una capacidad casi sobrenatural para ver sistemas donde otros ven caos, y para encontrar la solución óptima antes de que el problema sea obvio para los demás.',
      'No hablás mucho en reuniones — pero cuando hablás, todos escuchan. Cada palabra que decís pasó por un filtro de análisis que la mayoría ni sabe que existe. Tu cabeza funciona como un plano de arquitecto: todo tiene su lugar, su función, su razón de ser.',
      'Necesitás silencio para pensar, no porque seas distante, sino porque tu cerebro opera a una profundidad que requiere espacio. Sos exigente con vos mismo y con los demás — eso genera fricción a veces, pero también es exactamente lo que hace que todo lo que tocás termine siendo extraordinario.'
    ],
    fortalezas: [
      { emoji: '🧩', titulo: 'Pensamiento sistémico', desc: 'Ves la estructura detrás de cualquier problema antes de intentar resolverlo' },
      { emoji: '🔭', titulo: 'Visión de largo plazo', desc: 'Planificás con una precisión que otros confunden con suerte' },
      { emoji: '⚡', titulo: 'Autonomía intelectual', desc: 'No necesitás validación externa para avanzar con convicción' },
      { emoji: '📐', titulo: 'Estándares elevados', desc: 'Tu nivel de exigencia eleva a todos los que trabajan con vos' },
      { emoji: '🎯', titulo: 'Ejecución silenciosa', desc: 'Producís resultados sólidos sin necesitar el centro de la escena' }
    ],
    crecimiento: 'Tendés a trabajar tanto en soledad que olvidás involucrar a otros en el proceso. El resultado puede ser brillante — pero si nadie lo entiende o lo abraza, pierde fuerza. Aprender a comunicar tu visión con más calidez y paciencia es lo que multiplica tu impacto de manera exponencial.',
    referentes: [{ emoji: '💻', nombre: 'Bill Gates' }, { emoji: '🍎', nombre: 'Isaac Newton' }, { emoji: '🇩🇪', nombre: 'Angela Merkel' }, { emoji: '📜', nombre: 'Immanuel Kant' }]
  },

  'I-A-R-F': {
    nombre: 'El Detective',
    emoji: '🔍',
    color: '#94a3b8',
    colorDark: '#1e293b',
    tagline: 'Todos miran. Yo veo.',
    descripcion: [
      'Tu mente no descansa. Siempre hay una pregunta sin respuesta, un patrón que no cuadra, una inconsistencia que te llama la atención cuando todos los demás ya pasaron de largo. Sos la persona que encuentra el error en el contrato, el dato que nadie chequeó, la conexión entre dos ideas que parecían no tener nada que ver.',
      'Trabajás mejor solo — no porque no te guste la gente, sino porque en silencio tu mente puede moverse libremente, sin filtros sociales ni presiones del contexto. Esa libertad es donde hacés tu mejor trabajo.',
      'Tu ventaja más diferencial es que combinás análisis riguroso con flexibilidad real: cuando aparece un dato nuevo que contradice tu hipótesis, la actualizás sin drama. Eso te hace casi imposible de manipular y extraordinariamente confiable como pensador.'
    ],
    fortalezas: [
      { emoji: '👁️', titulo: 'Observación de precisión', desc: 'Captás detalles que escapan a cualquier otro radar' },
      { emoji: '🎯', titulo: 'Objetividad genuina', desc: 'Tus conclusiones siguen a la evidencia, no al deseo' },
      { emoji: '🔄', titulo: 'Adaptabilidad táctica', desc: 'Cambiás de enfoque cuando los datos lo justifican, sin fricción emocional' },
      { emoji: '🚀', titulo: 'Aprendizaje veloz', desc: 'Dominás nuevas áreas más rápido que casi cualquier persona' },
      { emoji: '❓', titulo: 'Pensamiento crítico', desc: 'Hacés las preguntas incómodas que salvan proyectos enteros' }
    ],
    crecimiento: 'La búsqueda de la respuesta perfecta puede volverse paralizante. A veces la acción imperfecta genera más valor que el estudio eterno. Tu desafío es desarrollar el instinto para saber cuándo ya tenés suficiente información para dar el paso.',
    referentes: [{ emoji: '⚛️', nombre: 'Albert Einstein' }, { emoji: '🧪', nombre: 'Marie Curie' }, { emoji: '🦋', nombre: 'Charles Darwin' }, { emoji: '💻', nombre: 'Ada Lovelace' }]
  },

  'I-A-M-P': {
    nombre: 'El Guardián',
    emoji: '🛡️',
    color: '#22c55e',
    colorDark: '#14532d',
    tagline: 'Soy el que sostiene todo cuando nadie está mirando.',
    descripcion: [
      'Sos el tipo de persona en quien todos confían sin saber exactamente por qué. La razón es que combinás algo que muy pocas personas tienen al mismo tiempo: la lógica para hacer lo correcto y el corazón para preocuparte genuinamente por los demás mientras lo hacés.',
      'No sos el que habla más fuerte en la sala. Sos el que cumple lo que promete, recuerda lo que otros olvidan, y aparece cuando más se necesita. Tu presencia genera una estabilidad que los demás perciben incluso antes de entenderla.',
      'Tenés una memoria extraordinaria para los detalles que importan: lo que alguien necesita, lo que prometiste, lo que funcionó y lo que no. En un mundo que privilegia lo llamativo y lo nuevo, tu tipo de mente es el que hace que las cosas realmente duren.'
    ],
    fortalezas: [
      { emoji: '✅', titulo: 'Confiabilidad absoluta', desc: 'Cuando decís que algo va a estar, está' },
      { emoji: '🧠', titulo: 'Memoria de detalle', desc: 'Recordás lo que importa, cuando importa' },
      { emoji: '🤝', titulo: 'Empatía estructurada', desc: 'Cuidás a las personas con método, no solo con buenas intenciones' },
      { emoji: '💎', titulo: 'Lealtad profunda', desc: 'Tus vínculos — personales y profesionales — son de los más sólidos que existen' },
      { emoji: '⚓', titulo: 'Estabilidad bajo presión', desc: 'Sos el ancla cuando todo lo demás se mueve' }
    ],
    crecimiento: 'Tu tendencia a poner las necesidades de otros antes que las propias puede agotarte sin que lo notes. Aprender a poner límites no es traicionar tu naturaleza: es lo que te permite seguir siendo el guardián que sos sin romperte en el proceso.',
    referentes: [{ emoji: '📈', nombre: 'Warren Buffett' }, { emoji: '✊', nombre: 'Rosa Parks' }, { emoji: '✝️', nombre: 'Juan Pablo II' }, { emoji: '👑', nombre: 'Queen Elizabeth II' }]
  },

  'I-A-M-F': {
    nombre: 'El Sanador',
    emoji: '🌿',
    color: '#2dd4bf',
    colorDark: '#134e4a',
    tagline: 'No vengo a arreglar. Vengo a acompañar — que es mucho más difícil.',
    descripcion: [
      'Tenés una sensibilidad que es, al mismo tiempo, tu mayor regalo y tu mayor desafío. Percibís capas de la realidad que otros ni saben que existen: las emociones no dichas, la tensión detrás de las palabras, el dolor que alguien esconde bajo una sonrisa. Y en lugar de alejarte, te acercás.',
      'Combinás esa empatía con una mente que observa y analiza con precisión. No reaccionás desde el impulso — procesás, entendés, y recién entonces respondés. Eso te convierte en una presencia rara: alguien que siente profundo pero actúa con claridad.',
      'La gente siente que con vos puede decir lo que no le dice a nadie más. No porque seas terapeuta, sino porque transmitís algo genuino: que lo que les pasa te importa de verdad, y que no vas a juzgar.'
    ],
    fortalezas: [
      { emoji: '👂', titulo: 'Escucha profunda', desc: 'Escuchás lo que se dice y lo que no se dice' },
      { emoji: '💙', titulo: 'Empatía sin performance', desc: 'Tu cuidado es real, no estratégico' },
      { emoji: '🔮', titulo: 'Observación emocional', desc: 'Lees situaciones complejas con una claridad que parece magia' },
      { emoji: '🕊️', titulo: 'Presencia sanadora', desc: 'Tu sola presencia reduce la ansiedad de quienes te rodean' },
      { emoji: '🌈', titulo: 'Adaptabilidad relacional', desc: 'Conectás con personas muy distintas sin perder tu esencia' }
    ],
    crecimiento: 'Absorbés el dolor ajeno como si fuera propio, y eso tiene un costo que suele pasarse factura más tarde. El límite entre empatía y fusión emocional es tu frontera más importante. Acompañar sin cargarte — estar presente sin disolverse — es el trabajo central de tu tipo.',
    referentes: [{ emoji: '🎨', nombre: 'Frida Kahlo' }, { emoji: '👸', nombre: 'Princesa Diana' }, { emoji: '📖', nombre: 'Dostoievski' }, { emoji: '🌟', nombre: 'Fred Rogers' }]
  },

  'I-N-R-P': {
    nombre: 'El Estratega',
    emoji: '♟️',
    color: '#60a5fa',
    colorDark: '#1e3a8a',
    tagline: 'Mientras todos juegan al ajedrez, yo ya estoy pensando en el partido siguiente.',
    descripcion: [
      'Jugás al ajedrez cuando todos los demás juegan a las damas. No te interesa la jugada de hoy — te interesa la posición del tablero en quince movimientos. Ves patrones donde otros ven ruido, anticipás consecuencias que aún no ocurrieron, y planificás con una precisión que parece casi profética.',
      'No actuás por impulso. Cada movimiento está pensado — y cuando finalmente actuás, suele ser definitivo. Tu mente combina visión intuitiva con pensamiento lógico implacable, lo que te permite diseñar soluciones elegantes a problemas que otros ni habían formulado bien todavía.',
      'Sos introvertido, lo que significa que tu mayor trabajo ocurre en silencio. Cuando salís a compartir una idea o tomar una decisión, ya pasó por un proceso de refinamiento que la mayoría nunca ve. Eso genera respeto — y a veces, cierta distancia que no siempre buscaste.'
    ],
    fortalezas: [
      { emoji: '🔭', titulo: 'Visión anticipatoria', desc: 'Ves el futuro de los sistemas antes de que se manifieste' },
      { emoji: '⏳', titulo: 'Pensamiento de largo plazo', desc: 'Tu horizonte natural es donde otros apenas imaginan' },
      { emoji: '🧭', titulo: 'Independencia de criterio', desc: 'No te dejás llevar por el consenso si tu análisis dice otra cosa' },
      { emoji: '🏗️', titulo: 'Diseño de sistemas', desc: 'Creás estructuras que funcionan aunque vos no estés' },
      { emoji: '💎', titulo: 'Decisiones de alta calidad', desc: 'Tus elecciones suelen ser las correctas — incluso cuando son impopulares' }
    ],
    crecimiento: 'Tu certeza en tu propia visión puede hacer que descartes perspectivas valiosas de otros demasiado rápido. La mejor estrategia siempre integra información de fuentes diversas. Aprender a escuchar sin asumir que ya sabés la respuesta es probablemente tu mayor palanca de crecimiento.',
    referentes: [{ emoji: '🏺', nombre: 'Napoleón Bonaparte' }, { emoji: '🌌', nombre: 'Stephen Hawking' }, { emoji: '🔭', nombre: 'Carl Sagan' }, { emoji: '🏛️', nombre: 'Sheryl Sandberg' }]
  },

  'I-N-R-F': {
    nombre: 'El Alquimista',
    emoji: '⚗️',
    color: '#c084fc',
    colorDark: '#3b0764',
    tagline: 'Tomo lo que no tiene solución y lo convierto en algo que nadie esperaba.',
    descripcion: [
      'Convertís lo que para otros es un callejón sin salida en una solución que nadie esperaba. Tu mente trabaja en los intersticios — en el espacio entre disciplinas, entre campos, entre ideas que parecen incompatibles. Tomás un concepto de un área y lo aplicás a otra completamente diferente, y el resultado es algo genuinamente nuevo.',
      'Trabajás mejor solo y en libertad. La estructura rígida y los procesos repetitivos apagan tu chispa de una manera casi física. Cuando tenés espacio para explorar sin límites preestablecidos, producís cosas que el mundo no había visto antes.',
      'Sos racional pero flexible — no te casás con ninguna metodología ni resultado. Si aparece algo mejor, lo incorporás sin duelo. Esa combinación de rigor intelectual y apertura radical es lo que te convierte en un pensador verdaderamente original.'
    ],
    fortalezas: [
      { emoji: '🌉', titulo: 'Pensamiento transdisciplinario', desc: 'Conectás campos distantes de maneras que generan valor real' },
      { emoji: '💡', titulo: 'Creatividad con sustancia', desc: 'Tus ideas son originales Y funcionan — no es decoración' },
      { emoji: '🔄', titulo: 'Reinvención constante', desc: 'Te actualizás más rápido que casi cualquier persona' },
      { emoji: '🗝️', titulo: 'Soluciones no convencionales', desc: 'Donde hay un callejón sin salida, encontrás la puerta oculta' },
      { emoji: '🌫️', titulo: 'Tolerancia a la ambigüedad', desc: 'Podés trabajar sin mapa claro más tiempo que nadie' }
    ],
    crecimiento: 'Tenés tantas ideas brillantes simultáneamente que completar proyectos puede ser un desafío real. El comienzo es emocionante; la ejecución final, mucho menos. Desarrollar sistemas simples para llevar cosas hasta el final multiplica tu impacto de manera decisiva.',
    referentes: [{ emoji: '🎭', nombre: 'Leonardo da Vinci' }, { emoji: '💻', nombre: 'Alan Turing' }, { emoji: '⚡', nombre: 'Nikola Tesla' }, { emoji: '🎨', nombre: 'Salvador Dalí' }]
  },

  'I-N-M-P': {
    nombre: 'El Filósofo',
    emoji: '🦉',
    color: '#818cf8',
    colorDark: '#312e81',
    tagline: 'No me conformo con entender cómo funciona el mundo. Necesito saber por qué importa.',
    descripcion: [
      'Vivís haciendo preguntas que otros evitan. ¿Por qué estamos acá? ¿Qué hace que una vida valga la pena? ¿Cuál es el sentido detrás de esto que todos dan por hecho? No es angustia existencial — es una sed genuina de comprensión profunda que te distingue de la mayoría.',
      'Tenés una visión clara de cómo deberían ser las cosas, y esa visión está anclada en valores humanos concretos. No sos solo teórico: querés que tus ideas tengan impacto real en la vida de las personas. Esa combinación de profundidad filosófica y compromiso con lo humano es extraordinariamente rara.',
      'Sos planificador e intuitivo al mismo tiempo — tenés tanto la visión de hacia dónde ir como la estructura para diseñar el camino. Cuando encontrás la causa o el proyecto correcto, podés sostener el esfuerzo con una consistencia que muy pocos igualan.'
    ],
    fortalezas: [
      { emoji: '🔮', titulo: 'Profundidad de pensamiento', desc: 'Llegás a capas que la mayoría ni sabe que existen' },
      { emoji: '🧭', titulo: 'Brújula moral sólida', desc: 'Sabés con claridad qué te importa y por qué' },
      { emoji: '✨', titulo: 'Capacidad de inspirar', desc: 'Cambiás perspectivas sin necesitar autoridad formal' },
      { emoji: '🔗', titulo: 'Coherencia de vida', desc: 'Lo que pensás, lo que decís y lo que hacés están alineados' },
      { emoji: '🌍', titulo: 'Visión con corazón', desc: 'Construís hacia el futuro sin olvidar a las personas de hoy' }
    ],
    crecimiento: 'Tus estándares son tan elevados que la realidad rara vez los alcanza — y eso puede generar frustración o parálisis ante lo imperfecto. Aprender a actuar con lo que hay, sin esperar condiciones ideales, es donde tu filosofía se convierte en transformación real.',
    referentes: [{ emoji: '🧠', nombre: 'Carl Jung' }, { emoji: '☮️', nombre: 'Gandhi' }, { emoji: '✒️', nombre: 'Simone de Beauvoir' }, { emoji: '🌟', nombre: 'Martin Luther King' }]
  },

  'I-N-M-F': {
    nombre: 'El Soñador',
    emoji: '🌙',
    color: '#38bdf8',
    colorDark: '#0c4a6e',
    tagline: 'Vivo en dos mundos. El que todos ven — y el que yo imagino.',
    descripcion: [
      'Vivís en dos mundos al mismo tiempo: el que todos ven y el que solo vos podés imaginar. Y el tuyo es más rico, más profundo, más lleno de posibilidades. No es escapismo — es visión. Los grandes cambios del mundo siempre empezaron en la cabeza de alguien capaz de imaginar algo que todavía no existía.',
      'Sos profundamente empático: sentís lo que sienten los demás con una intensidad que puede abrumarte, pero que también te convierte en un creador capaz de tocar el alma de las personas. Lo que hacés, lo hacés desde un lugar auténtico — y la gente lo percibe.',
      'No fingís ser lo que no sos, no seguís tendencias que no te resuenan, no sacrificás tu esencia por conveniencia. En un mundo lleno de máscaras, esa autenticidad radical no es solo una cualidad personal — es revolucionaria.'
    ],
    fortalezas: [
      { emoji: '🌌', titulo: 'Imaginación sin límites', desc: 'Generás ideas genuinamente originales, no derivadas' },
      { emoji: '💙', titulo: 'Empatía universal', desc: 'Conectás con la experiencia humana en su dimensión más profunda' },
      { emoji: '🦋', titulo: 'Autenticidad radical', desc: 'Lo que creás viene de un lugar real — y se nota' },
      { emoji: '🌟', titulo: 'Capacidad de inspirar', desc: 'Tu visión mueve a otros hacia posibilidades que no habían considerado' },
      { emoji: '🎨', titulo: 'Riqueza interior', desc: 'Tenés un mundo interno tan desarrollado que nunca te quedás sin recursos' }
    ],
    crecimiento: 'El mundo interior es tan rico que el exterior puede sentirse ruidoso o simplemente menos interesante. El desafío es encontrar formas de traer tu visión hacia afuera sin perder lo que sos. La disciplina creativa — pequeños compromisos diarios — es lo que convierte sueños en realidad concreta.',
    referentes: [{ emoji: '🏰', nombre: 'Walt Disney' }, { emoji: '🎸', nombre: 'John Lennon' }, { emoji: '📖', nombre: 'J.R.R. Tolkien' }, { emoji: '✒️', nombre: 'Virginia Woolf' }]
  },

  'E-A-R-P': {
    nombre: 'El Comandante',
    emoji: '⚡',
    color: '#f87171',
    colorDark: '#7f1d1d',
    tagline: 'Cuando entro a una sala, el ambiente cambia. No lo busco — simplemente sucede.',
    descripcion: [
      'Cuando entrás a una sala, el ambiente cambia. No porque lo intentes — sino porque irradiás una claridad y determinación que la gente percibe instintivamente. Sabés exactamente adónde vas, tenés el plan para llegar ahí, y tenés la capacidad de llevar a otros con vos sin que parezca un esfuerzo.',
      'No tolerás el tiempo perdido, la mediocridad innecesaria ni las excusas sin sustento. Lo que algunos llaman exigencia, vos lo llamás respeto — respeto por el potencial real que tienen las personas y los proyectos. Creés que la gente puede más, y los empujás hacia ese más con convicción.',
      'Sos de los que entregan resultados cuando otros todavía están debatiendo los primeros pasos. Esa velocidad de ejecución, combinada con tu capacidad de análisis y organización, te convierte en alguien extraordinariamente efectivo en cualquier entorno que requiera resultados reales.'
    ],
    fortalezas: [
      { emoji: '👑', titulo: 'Liderazgo natural', desc: 'Tu autoridad viene de la claridad, no del rango' },
      { emoji: '🚀', titulo: 'Ejecución impecable', desc: 'Hacés que las cosas sucedan cuando otros todavía planean' },
      { emoji: '💎', titulo: 'Decisiones bajo presión', desc: 'Cuanto más difícil la situación, más claro pensás' },
      { emoji: '⚙️', titulo: 'Organización de recursos', desc: 'Convertís equipos y materiales en máquinas de resultados' },
      { emoji: '📈', titulo: 'Estándares que elevan', desc: 'Tu nivel de exigencia sube el piso de todos a tu alrededor' }
    ],
    crecimiento: 'Tu ritmo y tus estándares pueden ser difíciles de seguir, y eso genera distancia con personas que podrían aportar mucho. Desarrollar paciencia para los procesos ajenos — sin resignar tus propios estándares — amplía tu capacidad de liderazgo de manera decisiva.',
    referentes: [{ emoji: '🏛️', nombre: 'Margaret Thatcher' }, { emoji: '🍎', nombre: 'Steve Jobs' }, { emoji: '⚔️', nombre: 'Julio César' }, { emoji: '💼', nombre: 'Indra Nooyi' }]
  },

  'E-A-R-F': {
    nombre: 'El Explorador',
    emoji: '🧭',
    color: '#fb923c',
    colorDark: '#7c2d12',
    tagline: 'La vida es un laboratorio. Cada fracaso es un dato. Cada éxito, una hipótesis confirmada.',
    descripcion: [
      'La vida para vos es un laboratorio. Cada situación nueva es un experimento, cada fracaso es un dato, cada éxito es una hipótesis confirmada que te lleva al próximo desafío. No necesitás tenerlo todo resuelto antes de actuar — aprendés en movimiento, y esa velocidad de aprendizaje es tu ventaja más difícil de igualar.',
      'Tenés una energía que atrae a los demás de manera natural. No solo porque sos sociable — sino porque generás la sensación de que con vos pasan cosas. La gente que está cerca de vos tiende a animarse a intentar cosas que sola no hubiera intentado.',
      'Donde otros ven riesgo, vos ves información pendiente de recolectar. Eso no es imprudencia — es una relación diferente con la incertidumbre, más sana y más productiva que la que tiene la mayoría.'
    ],
    fortalezas: [
      { emoji: '⚡', titulo: 'Velocidad de aprendizaje', desc: 'Dominás nuevas habilidades y contextos más rápido que casi nadie' },
      { emoji: '🎯', titulo: 'Tolerancia al riesgo', desc: 'Actuás con información incompleta sin paralizarte' },
      { emoji: '🔥', titulo: 'Energía movilizadora', desc: 'Generás momentum donde otros generan debates' },
      { emoji: '🌊', titulo: 'Adaptabilidad real', desc: 'No solo tolerás el cambio — lo buscás activamente' },
      { emoji: '💡', titulo: 'Mentalidad de oportunidad', desc: 'En cualquier problema, encontrás el ángulo productivo' }
    ],
    crecimiento: 'La búsqueda constante de lo nuevo puede hacer que subestimes el valor de la profundidad — en proyectos, en relaciones, en habilidades. Algunas de las mejores cosas de la vida requieren quedarse cuando la novedad ya pasó. La pregunta que te transforma es: ¿qué emerge cuando no huyo hacia lo siguiente?',
    referentes: [{ emoji: '✈️', nombre: 'Richard Branson' }, { emoji: '🌎', nombre: 'Theodore Roosevelt' }, { emoji: '🛩️', nombre: 'Amelia Earhart' }, { emoji: '✒️', nombre: 'Ernest Hemingway' }]
  },

  'E-A-M-P': {
    nombre: 'El Diplomático',
    emoji: '🌐',
    color: '#fbbf24',
    colorDark: '#78350f',
    tagline: 'Construyo puentes que duran — no acuerdos que se rompen a la primera tensión.',
    descripcion: [
      'Tenés un don poco común: podés hacer que personas muy diferentes se entiendan. No porque simplifiques ni ignores las diferencias — sino porque las entendés profundamente, y sabés encontrar el terreno común sin que nadie sienta que perdió algo en el proceso.',
      'Combinás empatía genuina con una mente estructurada que te permite navegar conversaciones complejas con precisión. No improvisás en situaciones delicadas — llegás preparado, con contexto, con opciones, con una lectura clara de lo que cada parte necesita.',
      'En el mundo de hoy, donde la polarización y la desconfianza son la norma, tu tipo de mente es más necesaria que nunca. Sos de los que construyen cosas que duran — vínculos, equipos, instituciones, acuerdos — porque las bases que ponés son sólidas.'
    ],
    fortalezas: [
      { emoji: '🌉', titulo: 'Mediación genuina', desc: 'Generás consenso real, no apariencia de consenso' },
      { emoji: '🧠', titulo: 'Inteligencia social + estructura', desc: 'La combinación más difícil de encontrar en una sola persona' },
      { emoji: '🔮', titulo: 'Lectura de clima emocional', desc: 'Sabés cómo está un grupo antes de que lo digan' },
      { emoji: '🤝', titulo: 'Construcción de confianza', desc: 'Las personas te dan su confianza rápido — y raramente se arrepienten' },
      { emoji: '🗺️', titulo: 'Visión relacional', desc: 'Entendés cómo se conectan las personas y qué mueve esas conexiones' }
    ],
    crecimiento: 'Tu necesidad de mantener la armonía puede llevarte a evitar conflictos que son necesarios e incluso saludables. A veces el verdadero cuidado hacia alguien requiere una conversación incómoda. Desarrollar la capacidad de tenerla sin perder la relación es tu próximo nivel de madurez.',
    referentes: [{ emoji: '🏛️', nombre: 'Barack Obama' }, { emoji: '📜', nombre: 'Abraham Lincoln' }, { emoji: '🌿', nombre: 'Jacinda Ardern' }, { emoji: '🕊️', nombre: 'Kofi Annan' }]
  },

  'E-A-M-F': {
    nombre: 'El Conector',
    emoji: '🕸️',
    color: '#facc15',
    colorDark: '#713f12',
    tagline: 'La gente se siente vista cuando está conmigo. No lo finjo — genuinamente me importa.',
    descripcion: [
      'La gente se siente vista cuando está con vos. No es un truco ni una técnica — es que genuinamente te importa, genuinamente prestás atención, y genuinamente recordás lo que las personas te cuentan mucho después de que la conversación terminó.',
      'Tenés una red de personas muy diversas no por estrategia sino porque cada persona te parece interesante por razones distintas. Tu curiosidad humana es auténtica, y la gente la percibe de inmediato. Eso hace que en pocos minutos alguien que acaba de conocerte sienta que tiene años de vínculo con vos.',
      'Sos el pegamento invisible que mantiene unidas a comunidades, equipos y grupos sin que nadie lo note. Tu capacidad de moverte fluidamente entre diferentes tipos de personas y contextos es extraordinaria.'
    ],
    fortalezas: [
      { emoji: '🌐', titulo: 'Red genuina y amplia', desc: 'No coleccionás contactos — construís vínculos' },
      { emoji: '🌟', titulo: 'Presencia que incluye', desc: 'Hacés que cualquiera se sienta bienvenido desde el primer momento' },
      { emoji: '🌊', titulo: 'Flexibilidad social', desc: 'Te adaptás a contextos muy distintos sin perder tu esencia' },
      { emoji: '🧠', titulo: 'Memoria relacional', desc: 'Recordás detalles que hacen que las personas se sientan especiales' },
      { emoji: '🔮', titulo: 'Intuición interpersonal', desc: 'Sabés qué necesita cada persona casi antes de que lo digan' }
    ],
    crecimiento: 'Dás tanto que a veces no sabés cómo recibir. Y tu adaptabilidad puede llevarte a perder de vista qué querés vos, más allá de lo que los demás necesitan. Conocerte a vos mismo con la misma atención que das a otros es el trabajo más importante que tenés pendiente.',
    referentes: [{ emoji: '🎤', nombre: 'Oprah Winfrey' }, { emoji: '💛', nombre: 'Tony Hsieh' }, { emoji: '😄', nombre: 'Ellen DeGeneres' }, { emoji: '✌️', nombre: 'Malala Yousafzai' }]
  },

  'E-N-R-P': {
    nombre: 'El Visionario',
    emoji: '🔮',
    color: '#e879f9',
    colorDark: '#581c87',
    tagline: 'Veo el futuro con claridad. Lo que me falta es gente que corra a la velocidad de mis ideas.',
    descripcion: [
      'Ves el futuro con una claridad que otros no pueden alcanzar — y tenés la energía y la estructura para llevarlo a la realidad. No sos solo un soñador: sos alguien que transforma visiones en planes, planes en equipos, y equipos en resultados que cambian el estado de las cosas.',
      'Tu mente opera siempre en el horizonte. Mientras resolvés el problema de hoy, ya estás diseñando la solución de mañana — y conceptualizando la oportunidad de pasado mañana. Eso puede ser agotador para quienes te rodean, pero para vos es simplemente cómo funciona tu cabeza.',
      'Lo que te diferencia de otros visionarios es que no esperás que todos entiendan tu visión antes de empezar a moverla. Creás momentum, generás evidencia temprana, y vas convenciendo mientras avanzás.'
    ],
    fortalezas: [
      { emoji: '🔭', titulo: 'Visión estratégica', desc: 'Tu horizonte natural está donde otros recién empiezan a mirar' },
      { emoji: '🌪️', titulo: 'Liderazgo inspirador', desc: 'Arrastrás a otros hacia metas que ellos solos no hubieran perseguido' },
      { emoji: '🎯', titulo: 'Tolerancia a la incertidumbre', desc: 'Actuás con convicción sin tener todas las respuestas' },
      { emoji: '🏗️', titulo: 'Pensamiento sistémico aplicado', desc: 'No solo imaginás — diseñás cómo llegar' },
      { emoji: '⚡', titulo: 'Creación de momentum', desc: 'Hacés que las cosas empiecen a moverse antes de que estén listas' }
    ],
    crecimiento: 'Cuando tu visión es muy nítida para vos, puede volverse opaca para todos los demás — y esa brecha genera frustración en ambas direcciones. Invertir tiempo en comunicar el por qué antes del qué y el cómo multiplica exponencialmente tu capacidad de arrastrar a otros.',
    referentes: [{ emoji: '🚀', nombre: 'Elon Musk' }, { emoji: '📦', nombre: 'Jeff Bezos' }, { emoji: '👑', nombre: 'Catalina la Grande' }, { emoji: '📊', nombre: 'Peter Drucker' }]
  },

  'E-N-R-F': {
    nombre: 'El Emprendedor',
    emoji: '🔥',
    color: '#f97316',
    colorDark: '#7c2d12',
    tagline: 'El status quo me aburre. Siempre hay una forma mejor — y yo la encuentro.',
    descripcion: [
      'El status quo te aburre de una manera casi física. Siempre hay una forma mejor, más rápida, más inteligente de hacer las cosas — y vos sos el que la encuentra antes que los demás. Tu mente genera ideas a una velocidad que puede ser difícil de seguir para quienes te rodean.',
      'El caos no te asusta — funciona como combustible. Donde otros ven desorden, vos ves oportunidades sin explotar, recursos mal utilizados, conexiones que nadie hizo todavía. Esa capacidad de encontrar el ángulo productivo en cualquier situación es una de las habilidades más valiosas que existen.',
      'Sos extrovertido e intuitivo — lo que significa que te movés bien entre personas y captás el pulso de los contextos rápidamente. Sabés qué quiere la gente, qué falta en el mercado, qué conversación nadie está teniendo todavía.'
    ],
    fortalezas: [
      { emoji: '💡', titulo: 'Generación de ideas', desc: 'Producís más ideas originales por día que la mayoría por mes' },
      { emoji: '🎯', titulo: 'Tolerancia al riesgo', desc: 'Actuás con información incompleta sin el costo emocional que eso tiene para otros' },
      { emoji: '⚡', titulo: 'Velocidad de ejecución', desc: 'De la idea al primer paso hay muy poca distancia en tu cabeza' },
      { emoji: '🔍', titulo: 'Lectura de oportunidades', desc: 'Ves lo que falta antes de que el mercado lo pida' },
      { emoji: '🗣️', titulo: 'Capacidad de venta', desc: 'Podés convencer a otros de seguirte hacia algo que todavía no existe' }
    ],
    crecimiento: 'La disciplina de terminar lo que empezás es tu desafío central — y probablemente lo sabés. Las ideas nuevas siempre parecen más emocionantes que ejecutar las que ya empezaste. El sistema que te permite completar sin matar la chispa es lo que convierte tu potencial en resultados reales y duraderos.',
    referentes: [{ emoji: '📜', nombre: 'Benjamin Franklin' }, { emoji: '🐉', nombre: 'Jack Ma' }, { emoji: '🎩', nombre: 'Winston Churchill' }, { emoji: '☕', nombre: 'Howard Schultz' }]
  },

  'E-N-M-P': {
    nombre: 'El Mentor',
    emoji: '🌱',
    color: '#4ade80',
    colorDark: '#14532d',
    tagline: 'Veo en vos lo que todavía no ves en vos mismo. Y eso cambia todo.',
    descripcion: [
      'Tenés un regalo que no se puede enseñar: la capacidad de ver en los demás lo que ellos todavía no ven en sí mismos. No solo lo notás — hacés algo al respecto. Guiás, desafiás, sostenés, y celebrás el crecimiento ajeno con una energía genuina que no se puede fingir.',
      'Sos extrovertido e intuitivo — lo que significa que te movés cómodamente entre personas y captás rápidamente el potencial de cada una. Pero también sos planificador: tu forma de desarrollar a otros no es aleatoria. Tenés una visión de hacia dónde puede llegar esa persona, y construís el camino con ella, no para ella.',
      'Lo que te diferencia de otros que también "quieren ayudar" es que tu apoyo tiene estructura y dirección. No solo contenés — empujás hacia adelante. No solo escuchás — desafiás. Esa combinación de calidez y exigencia es lo que produce transformaciones reales.'
    ],
    fortalezas: [
      { emoji: '🔮', titulo: 'Detección de potencial', desc: 'Ves en las personas lo que ellas mismas todavía no pueden ver' },
      { emoji: '🌱', titulo: 'Liderazgo que desarrolla', desc: 'No solo dirigís — hacés crecer' },
      { emoji: '❤️', titulo: 'Empatía con dirección', desc: 'Acompañás desde el corazón y empujás desde la convicción' },
      { emoji: '🏛️', titulo: 'Constructor de comunidades', desc: 'Los grupos que liderás se convierten en culturas fuertes' },
      { emoji: '🌟', titulo: 'Inspiración genuina', desc: 'Motivás desde el ser, no desde el miedo o la presión' }
    ],
    crecimiento: 'Invertís tanto en el crecimiento de otros que podés descuidar el propio sin darte cuenta. El síndrome del cuidador — dar sin parar hasta vaciarse — es tu riesgo más frecuente. Recordá que solo podés dar lo que tenés: tu propio desarrollo no es egoísmo, es la fuente de todo lo que ofrecés.',
    referentes: [{ emoji: '✊', nombre: 'Nelson Mandela' }, { emoji: '✒️', nombre: 'Maya Angelou' }, { emoji: '💬', nombre: 'Tony Robbins' }, { emoji: '📖', nombre: 'Paulo Coelho' }]
  },

  'E-N-M-F': {
    nombre: 'El Catalizador',
    emoji: '✨',
    color: '#f472b6',
    colorDark: '#831843',
    tagline: 'Donde yo llego, las cosas cambian. No sé explicarlo — simplemente sucede.',
    descripcion: [
      'Donde vos llegás, las cosas cambian. No porque lo planifiques — sino porque tu energía, tu curiosidad y tu calidez transforman cualquier ambiente de manera instintiva. Tenés el don de hacer que las personas se sientan más vivas, más creativas, más valientes, más conectadas con lo que de verdad les importa.',
      'Sos intuitivo y empático al mismo tiempo, lo que te da una comprensión casi instantánea de lo que siente una sala, un equipo, una persona. Y sos flexible — podés adaptarte a lo que necesita el momento sin perder tu esencia en el proceso.',
      'La gente te recuerda mucho tiempo después de que la conversación terminó. No porque dijiste algo importante — sino porque en ese momento hiciste que algo se moviera adentro de ellos. Ese efecto que generás en las personas es tu legado más real.'
    ],
    fortalezas: [
      { emoji: '⚡', titulo: 'Energía contagiosa', desc: 'Transformás el clima de cualquier espacio con tu sola presencia' },
      { emoji: '🔮', titulo: 'Lectura instantánea', desc: 'Entendés lo que necesita alguien antes de que lo diga' },
      { emoji: '💡', titulo: 'Creatividad espontánea', desc: 'Generás soluciones inesperadas en tiempo real' },
      { emoji: '🌟', titulo: 'Conexión auténtica', desc: 'La gente siente que te conoce de antes, aunque sea la primera vez' },
      { emoji: '🔥', titulo: 'Inspiración sin esfuerzo', desc: 'Tu entusiasmo genuino es más poderoso que cualquier discurso preparado' }
    ],
    crecimiento: 'Tu energía es tan poderosa que a veces te comprometés con más personas y proyectos de los que podés sostener bien — y eso termina diluyendo tu impacto. La selección consciente es tu superpoder latente: cuando decidís deliberadamente en qué y en quién invertir tu energía, tu transformación en los demás se vuelve más profunda.',
    referentes: [{ emoji: '🎭', nombre: 'Robin Williams' }, { emoji: '🎤', nombre: 'Lady Gaga' }, { emoji: '✒️', nombre: 'Oscar Wilde' }, { emoji: '📖', nombre: 'Gabriel García Márquez' }]
  }
};

/* ---- Eje Labels ---- */
const EJE_LABELS = {
  1: { label: 'ENERGÍA', A: 'Interior', B: 'Exterior' },
  2: { label: 'PERCEPCIÓN', A: 'Analítico', B: 'Intuitivo' },
  3: { label: 'DECISIÓN', A: 'Racional', B: 'Empático' },
  4: { label: 'ESTILO', A: 'Planificador', B: 'Flexible' }
};
