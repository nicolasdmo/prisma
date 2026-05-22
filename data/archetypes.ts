export interface Archetype {
  code: string;
  name: string;
  tagline: string;
  description: string;
  strengths: string[];
  growthZone: string;
  famousExamples: string[];
  color: string;
  colorName: string;
  emoji: string;
  // Extended profile — shown after email gate
  rarity: number;                // estimated % of population
  workStyle: string;             // how they work best
  teamRole: string;              // role in team settings
  underPressure: string;         // behavior under stress
  inRelationships: string;       // in personal relationships
  complementaryCodes: [string, string]; // 2 complementary archetype codes
}

export const ARCHETYPES: Record<string, Archetype> = {
  ISLP: {
    code: 'ISLP',
    name: 'El Arquitecto',
    tagline: 'Construís sistemas donde otros ven caos.',
    description:
      'Tu mente funciona como un plano: todo tiene un lugar, todo tiene un por qué. Antes de actuar ya tenés el mapa completo en la cabeza, y esa claridad previa es lo que te diferencia de casi todos los demás. No te molesta el detalle — lo necesitás para sentirte seguro de lo que estás haciendo.\n\nCuando otros ya quieren saltar a la acción, vos estás terminando de evaluar los últimos puntos de falla. Esa paciencia no es timidez: es precisión. Tu entorno sabe que cuando decís que algo va a funcionar, lo va a funcionar.\n\nLo tuyo es el largo plazo: no construís para hoy, construís para que dure. Esa combinación de visión estructurada y ejecución confiable es un activo que pocas personas tienen.',
    strengths: ['Pensamiento sistemático', 'Confiabilidad total', 'Precisión en la ejecución', 'Planificación de largo plazo'],
    growthZone: 'Aprender a soltar el control cuando el plan cambia y confiar en la intuición de las personas que te rodean.',
    famousExamples: ['Angela Merkel', 'Aristóteles', 'Warren Buffett'],
    color: '#2E4A6E', colorName: 'Azul Noche', emoji: '🏛️',
    rarity: 11,
    workStyle: 'Rendís mejor con tareas claras, tiempo sin interrupciones y autonomía para ejecutar. La calidad no es negociable para vos.',
    teamRole: 'Sos el que cumple lo que promete. Tu consistencia y precisión dan confianza y previsibilidad al grupo.',
    underPressure: 'Te volvés más metódico y concreto. Cuando el entorno se vuelve caótico, buscás orden inmediatamente.',
    inRelationships: 'Sos leal de manera profunda pero discreta. Los actos importan más que las palabras para vos.',
    complementaryCodes: ['ENVF', 'ESLF'],
  },

  ISLF: {
    code: 'ISLF',
    name: 'El Artesano',
    tagline: 'Aprendés haciendo. Pensás tocando.',
    description:
      'No necesitás que te expliquen cómo funciona algo — lo tomás en tus manos y ya lo entendés. Sos práctico de una manera que pocos comprenden de verdad: tu lógica no vive en el papel sino en los objetos, los procesos, los sistemas reales que podés ver y tocar.\n\nNo te vas por las ramas con teorías abstractas. Querés saber qué funciona ahora, en esta situación, con lo que tenés disponible. Esa inmediatez no es impaciencia — es eficiencia pura. La gente aprecia que no prometés lo que no podés cumplir.\n\nTu espontaneidad dentro de un marco lógico te hace increíblemente adaptable. Cuando algo sale mal, sos el primero en encontrar la solución creativa que nadie más vio.',
    strengths: ['Habilidad práctica', 'Adaptabilidad rápida', 'Resolución concreta de problemas', 'Observación aguda'],
    growthZone: 'Proyectarte al futuro y comunicar tu visión más allá del momento presente para que otros puedan acompañarte.',
    famousExamples: ['Bruce Lee', 'Steve Irwin', 'Michael Jordan'],
    color: '#3D6B3A', colorName: 'Verde Bosque', emoji: '⚒️',
    rarity: 5,
    workStyle: 'Rendís mejor cuando podés tocar, hacer y ajustar en tiempo real. Los procesos rígidos y las reuniones largas te frenan.',
    teamRole: 'Sos la persona que resuelve lo que nadie más puede en el momento. Tu agilidad práctica salva situaciones críticas.',
    underPressure: 'Te activás. El problema urgente y concreto es donde más brillás — el caos no te paraliza.',
    inRelationships: 'Sos de actos, no de palabras. Mostrás que te importa alguien estando presente y resolviendo.',
    complementaryCodes: ['INVP', 'ENVP'],
  },

  ISVP: {
    code: 'ISVP',
    name: 'El Guardián',
    tagline: 'Sostenés el mundo para que todos puedan moverse.',
    description:
      'Sos el tipo de persona que recuerda el aniversario de todos, que pregunta "¿cómo estás?" y espera la respuesta de verdad. Tu fortaleza no grita — actúa en silencio, en los detalles: la agenda organizada, el lugar preparado, el plan que considera a cada persona.\n\nValorás la tradición no por resistencia al cambio, sino porque creés en lo que ya demostró que funciona. Cuando das tu palabra, la cumplís. Esa consistencia es tu forma más genuina de amar y cuidar a los que te importan.\n\nTu combinación de estructura y sensibilidad te hace irremplazable en cualquier equipo o familia. Sos el ancla invisible que estabiliza todo sin pedir reconocimiento.',
    strengths: ['Lealtad inquebrantable', 'Atención al detalle humano', 'Organización empática', 'Memoria emocional'],
    growthZone: 'Poner tus propias necesidades en la misma lista de prioridades que las de los demás — cuidarte a vos también es cuidar al grupo.',
    famousExamples: ['Madre Teresa', 'Nelson Mandela', 'Fred Rogers'],
    color: '#7A5C3A', colorName: 'Ámbar Tierra', emoji: '🛡️',
    rarity: 14,
    workStyle: 'Sos más productivo en ambientes estables con roles claros. Tu atención al detalle y tu confiabilidad son tu mayor activo.',
    teamRole: 'Sos el pegamento del equipo. Recordás lo que cada uno necesita y te asegurás de que nadie quede afuera.',
    underPressure: 'Tendés a absorber el estrés del entorno y priorizás a los demás antes que a vos. Ese es tu límite a trabajar.',
    inRelationships: 'Te entregás profundamente. Recordás los detalles, los aniversarios, lo que la otra persona necesita antes de que lo pida.',
    complementaryCodes: ['ENLF', 'ESLF'],
  },

  ISVF: {
    code: 'ISVF',
    name: 'El Sanador',
    tagline: 'Tu presencia calma antes de que digas nada.',
    description:
      'Tenés una sensibilidad que la mayoría no sabe cómo explicar pero sí cómo sentir: cuando entrás en una sala, el ambiente cambia. No buscás el centro, pero tu calidez llega igual a quienes más la necesitan.\n\nLo concreto te ancla — no necesitás grandes ideas abstractas para conectar con alguien, sino un gesto preciso, una pregunta en el momento exacto. Tu espontaneidad no es desorden: es que respondés al presente con toda tu presencia, sin filtros ni poses.\n\nSos de las personas que otros buscan en los momentos difíciles. No porque tengas todas las respuestas, sino porque sabés estar ahí de una forma que es difícil de replicar.',
    strengths: ['Empatía profunda', 'Presencia genuina', 'Adaptabilidad emocional', 'Observación sensible'],
    growthZone: 'Aprender a expresar tus propias necesidades sin sentir que eso es una carga para los demás.',
    famousExamples: ['Lady Di', 'Bob Ross', 'Frida Kahlo'],
    color: '#7B5E8C', colorName: 'Violeta Suave', emoji: '🌿',
    rarity: 9,
    workStyle: 'Necesitás libertad y autenticidad para rendir bien. Lo que hacés tiene que tener sentido personal — el trabajo vacío te drena.',
    teamRole: 'Sos el termómetro emocional del grupo. Detectás tensiones antes que nadie y creás espacios donde todos se sienten seguros.',
    underPressure: 'Podés cerrarte hacia adentro. Necesitás procesar emocionalmente antes de poder actuar con claridad.',
    inRelationships: 'Amás con mucha intensidad pero de manera selectiva. Los vínculos que formás son auténticos y duraderos.',
    complementaryCodes: ['ENLP', 'ESLP'],
  },

  INLP: {
    code: 'INLP',
    name: 'El Estratega',
    tagline: 'Ves el tablero entero cuando otros ven una sola pieza.',
    description:
      'Tu mente no descansa — siempre está construyendo modelos, proyectando escenarios, buscando la lógica detrás de lo que nadie más está mirando todavía. La mediocridad te aburre profundamente; lo que te activa es el problema que todavía no tiene solución.\n\nTenés pocos vínculos pero son intensos y elegidos con cuidado. No necesitás aprobación externa — tenés una claridad interna sobre tus objetivos que funciona como brújula propia. Cuando te fijás un objetivo, el camino para llegar ya está casi resuelto en tu cabeza antes de dar el primer paso.\n\nEso que a veces parece arrogancia es, en realidad, una confianza construida en años de pensar más profundo que el promedio. Tu visión sistemática a largo plazo es un activo extraordinariamente raro.',
    strengths: ['Pensamiento estratégico', 'Independencia intelectual', 'Visión de largo plazo', 'Determinación enfocada'],
    growthZone: 'Conectar tu visión con las emociones de las personas que necesitás sumar — el liderazgo real necesita ambas dimensiones.',
    famousExamples: ['Nikola Tesla', 'Elon Musk', 'Alan Turing'],
    color: '#1A3A5C', colorName: 'Azul Profundo', emoji: '♟️',
    rarity: 2,
    workStyle: 'Rendís mejor con autonomía total y problemas complejos sin solución evidente. Los entornos burocráticos te agotan profundamente.',
    teamRole: 'Aportás la visión que nadie más tiene. Sos el que ve adónde va el barco cuando todos están mirando las olas.',
    underPressure: 'Te volvés más frío y analítico. Cortás el ruido emocional y te enfocás exclusivamente en la solución.',
    inRelationships: 'Sos selectivo y profundo. No cualquiera entra a tu círculo — pero los que entran reciben lealtad total e incondicional.',
    complementaryCodes: ['ESVF', 'ESLF'],
  },

  INLF: {
    code: 'INLF',
    name: 'El Pensador',
    tagline: 'Mientras el mundo actúa, vos encontrás el patrón.',
    description:
      'Vivís con una pregunta que otros no llegaron a formularse aún. Tu mente conecta puntos que parecen no tener relación — y de esa conexión surge algo que genuinamente vale la pena. No te apurás para llegar a conclusiones; preferís un razonamiento impecable a una respuesta rápida.\n\nLa profundidad te seduce: la conversación superficial te agota, pero una buena pregunta puede tenerte horas despierto con energía. Tu curiosidad es genuina y sostenida — no es performance, es la forma en que procesas el mundo.\n\nTu apertura intelectual te permite cambiar de opinión cuando la evidencia lo justifica, algo que muy pocas personas pueden hacer de verdad. Eso te hace más confiable, no menos.',
    strengths: ['Pensamiento original', 'Análisis profundo', 'Objetividad real', 'Apertura intelectual'],
    growthZone: 'Traducir tus ideas abstractas en acciones concretas que otros puedan seguir — el impacto necesita ejecución.',
    famousExamples: ['Albert Einstein', 'Charles Darwin', 'Bill Gates'],
    color: '#3D4A6E', colorName: 'Azul Pizarra', emoji: '🔭',
    rarity: 3,
    workStyle: 'Necesitás tiempo para pensar sin interrupciones. Tus mejores ideas aparecen cuando tenés espacio mental real, no en reuniones.',
    teamRole: 'Sos el que hace las preguntas que nadie quería hacer. Tu análisis previo previene errores que cuestan muy caro después.',
    underPressure: 'Podés paralizarte si el problema no tiene suficiente información. Necesitás datos para poder moverte con confianza.',
    inRelationships: 'Valorás profundamente la conexión intelectual. Una conversación estimulante vale más que mil gestos vacíos.',
    complementaryCodes: ['ESVP', 'ENVF'],
  },

  INVP: {
    code: 'INVP',
    name: 'El Visionario',
    tagline: 'Sentís el futuro antes de que llegue.',
    description:
      'Hay algo en vos que sabe cosas antes de poder explicarlas. No es magia — es que procesás cantidades enormes de señales sutiles y tu intuición las convierte en claridad antes de que el análisis llegue.\n\nTe importan profundamente las personas, pero necesitás silencio para poder servirlas bien. Tu vida tiene dirección — no siempre la podés articular, pero la sentís con certeza. Cuando encontrás una causa que coincide con tus valores, te entregás completamente.\n\nEsa combinación de profundidad empática y visión de largo plazo es extraordinariamente rara. Tenés la capacidad de inspirar y al mismo tiempo de construir sistemas que sostienen esa inspiración en el tiempo.',
    strengths: ['Intuición social aguda', 'Profundidad empática', 'Visión sistémica', 'Capacidad de inspirar genuinamente'],
    growthZone: 'Evitar cargarte con los problemas de todos — tu bienestar es la condición para que puedas ayudar.',
    famousExamples: ['Martin Luther King Jr.', 'Oprah Winfrey', 'Carl Jung'],
    color: '#5C3A6E', colorName: 'Violeta Oscuro', emoji: '🔮',
    rarity: 2,
    workStyle: 'Rendís mejor con propósito claro y autonomía real. Necesitás que tu trabajo tenga impacto genuino, no solo output medible.',
    teamRole: 'Sos el que conecta la visión con las personas. Inspirás sin necesitar el spotlight — tu influencia es profunda y silenciosa.',
    underPressure: 'Podés absorber demasiado de los demás. Tu mayor desafío bajo presión es proteger tu propia energía.',
    inRelationships: 'Amás profundamente y de manera muy selectiva. Tu presencia sostenida en un vínculo es transformadora.',
    complementaryCodes: ['ISLF', 'ESLF'],
  },

  INVF: {
    code: 'INVF',
    name: 'El Soñador',
    tagline: 'Tu mundo interior es más rico que el exterior.',
    description:
      'Tenés un universo adentro que pocas personas llegan a conocer del todo. Sos selectivo con quién dejás entrar — no por distancia, sino porque la conexión que buscás es real o no es nada.\n\nLos valores para vos no son decorativos: son el criterio con el que medís cada decisión importante de tu vida. La rutina te ahoga; el significado te alimenta. Cuando encontrás algo que te inspira de verdad, te vas a fondo — y en ese fondo suelen estar tus mejores creaciones.\n\nTu sensibilidad al mundo emocional y tus valores firmes te permiten ver matices que la mayoría ignora. Eso que a veces se siente como intensidad excesiva es, en realidad, tu mayor diferencial creativo.',
    strengths: ['Creatividad profunda', 'Integridad genuina', 'Empatía selectiva e intensa', 'Idealismo fértil'],
    growthZone: 'Bajar las ideas del mundo ideal para actuar en el mundo real — la perfección postergada es menos valiosa que lo imperfecto en movimiento.',
    famousExamples: ['J.R.R. Tolkien', 'Vincent van Gogh', 'Albert Camus'],
    color: '#8C5E7B', colorName: 'Rosa Antigua', emoji: '🌙',
    rarity: 4,
    workStyle: 'Necesitás trabajar en algo con significado real. La rutina sin propósito te agota emocionalmente en poco tiempo.',
    teamRole: 'Sos la conciencia del equipo. Recordás los valores cuando el grupo se desvía y lo hacés con tacto y profundidad.',
    underPressure: 'Tendés a idealizar cómo deberían ir las cosas. Aceptar la imperfección del proceso es tu trabajo constante.',
    inRelationships: 'Buscás conexión auténtica y muy profunda. No tolerás la superficialidad — preferís estar solo que mal acompañado.',
    complementaryCodes: ['ESLP', 'ENLP'],
  },

  ESLP: {
    code: 'ESLP',
    name: 'El Director',
    tagline: 'No esperás que las cosas pasen. Las hacés pasar.',
    description:
      'Entrás a una sala y enseguida identificás quién hace qué, qué está faltando y cuál es el camino más directo al resultado. La eficiencia es tu idioma nativo — no porque seas frío, sino porque respetás el tiempo de todos y querés que las cosas funcionen.\n\nTe cuesta poco tomar decisiones difíciles: cuando los datos hablan, actuás. No necesitás validación externa para moverte — tu criterio propio es suficientemente sólido. La lealtad que te dan viene de que la gente sabe exactamente qué esperar de vos. Sin vueltas, sin sorpresas.\n\nTu combinación de energía social, lógica práctica y estructura clara te convierte en el tipo de persona que los equipos buscan cuando las cosas se complican.',
    strengths: ['Liderazgo claro y directo', 'Toma de decisiones rápida', 'Organización de equipos', 'Orientación a resultados concretos'],
    growthZone: 'Escuchar el "cómo se siente" tanto como el "qué hay que hacer" — los equipos que se sienten vistos rinden mejor.',
    famousExamples: ['Gordon Ramsay', 'Indira Gandhi', 'Henry Ford'],
    color: '#6E2D2D', colorName: 'Rojo Oscuro', emoji: '📌',
    rarity: 9,
    workStyle: 'Sos altamente productivo en entornos estructurados con objetivos claros y métricas reales. La ambigüedad te frustra.',
    teamRole: 'Organizás, delegás y ejecutás. Sos el que convierte las ideas en planes concretos con deadlines y responsables.',
    underPressure: 'Te volvés más directivo y enfocado. Podés ser percibido como rígido cuando el tiempo apremia — pero entregás.',
    inRelationships: 'Sos confiable y leal. Mostrás amor siendo responsable y presente — no con grandes gestos, sino con hechos constantes.',
    complementaryCodes: ['INVF', 'INLF'],
  },

  ESLF: {
    code: 'ESLF',
    name: 'El Emprendedor',
    tagline: 'Donde otros ven riesgo, vos ves oportunidad.',
    description:
      'Sos de movimiento constante — no porque no puedas parar, sino porque hay demasiado por hacer y el presente es donde sucede todo. Tu energía es contagiosa: cuando entrás en modo acción, arrastrás a los demás casi sin querer.\n\nNo necesitás un plan perfecto para arrancar — necesitás suficiente información para dar el primer paso y aprender al andar. Esa agilidad es tu diferencial más real. Mientras otros están terminando de analizar, vos ya estás ejecutando y ajustando.\n\nTu capacidad para leer situaciones rápido, adaptarte al instante y mantener la energía alta bajo presión hace que el caos no te paralice — te active.',
    strengths: ['Energía y velocidad de acción', 'Agilidad mental', 'Pragmatismo efectivo', 'Liderazgo por el ejemplo'],
    growthZone: 'Terminar lo que empezás — el compromiso sostenido es donde tu impacto se multiplica.',
    famousExamples: ['Richard Branson', 'Amelia Earhart', 'Theodore Roosevelt'],
    color: '#8C5A2D', colorName: 'Naranja Quemado', emoji: '⚡',
    rarity: 4,
    workStyle: 'Rendís mejor con acción, variedad y desafíos nuevos. Los procesos lentos y las reuniones largas te consumen energía.',
    teamRole: 'Sos el que rompe el hielo, arranca los proyectos y contagia energía cuando el equipo pierde momentum.',
    underPressure: 'Te activás. La adrenalina del problema urgente saca lo mejor de vos — el caos es tu elemento.',
    inRelationships: 'Sos intenso y presente cuando estás comprometido, pero necesitás espacio y novedad para no sentirte limitado.',
    complementaryCodes: ['INVP', 'INLP'],
  },

  ESVP: {
    code: 'ESVP',
    name: 'El Cuidador',
    tagline: 'Hacés que todos sientan que pertenecen.',
    description:
      'Tenés un don que es raro y precioso: lográs que las personas se sientan incluidas y valoradas casi sin esfuerzo aparente. No es performance — es que realmente te importan. Recordás lo que cada uno mencionó semanas atrás, sabés cómo hacer que una sala de extraños se convierta en comunidad.\n\nTu estructura no es rigidez: es la forma en que creás seguridad para que otros puedan ser ellos mismos. La gente llega a vos cuando necesita contención, y vos siempre tenés espacio para darla.\n\nEsa combinación de calidez genuina y organización te hace irremplazable en cualquier contexto social o laboral. Sos el pegamento invisible que mantiene los grupos unidos.',
    strengths: ['Inteligencia social alta', 'Lealtad inquebrantable', 'Organización empática', 'Calidez auténtica'],
    growthZone: 'Reconocer que decir que no también es una forma de cuidar — tanto a los demás como a vos mismo.',
    famousExamples: ['Taylor Swift', 'Oprah Winfrey', 'Magic Johnson'],
    color: '#4A6E2D', colorName: 'Verde Oliva', emoji: '🤝',
    rarity: 12,
    workStyle: 'Rendís mejor en ambientes colaborativos y armoniosos. El conflicto sostenido sin resolución te drena profundamente.',
    teamRole: 'Sos el hub social del equipo. Sabés quién necesita qué y creás el ambiente donde todos pueden dar lo mejor.',
    underPressure: 'Tendés a priorizar la paz del grupo sobre decir lo que realmente pensás. Tu voz también importa.',
    inRelationships: 'Sos de los vínculos más generosos que existen. Das mucho — asegurate de recibir también.',
    complementaryCodes: ['INLF', 'INLP'],
  },

  ESVF: {
    code: 'ESVF',
    name: 'El Animador',
    tagline: 'Tu energía es el lugar al que todos quieren llegar.',
    description:
      'Traés algo que no se puede fingir: presencia. Cuando estás en un lugar, ese lugar tiene más vida. No buscás ser el centro — simplemente lo sos porque tu entusiasmo es genuino, tu apertura es real y tu capacidad de disfrutar el momento es difícil de ignorar.\n\nNo vivís para el futuro ni lamentás el pasado: el ahora es donde tu magia ocurre. Esa capacidad de estar completamente presente hace que las personas que comparten su tiempo con vos se sientan especiales.\n\nTu espontaneidad y tu calor crean experiencias que la gente recuerda. No necesitás grandes planes — necesitás gente con quien compartir lo que ya es bueno.',
    strengths: ['Carisma espontáneo', 'Empatía cálida y directa', 'Presencia magnética', 'Capacidad de hacer sentir bien a otros'],
    growthZone: 'Construir estructura para sostener tus compromisos más allá del impulso del momento.',
    famousExamples: ['Jennifer Lawrence', 'Will Smith', 'Shakira'],
    color: '#C4823D', colorName: 'Ámbar Dorado', emoji: '🎭',
    rarity: 7,
    workStyle: 'Rendís mejor cuando el trabajo es dinámico, social y te da libertad de expresión. La monotonía te apaga lentamente.',
    teamRole: 'Sos el que eleva el ánimo cuando las cosas se ponen pesadas. Tu energía es un activo colectivo real.',
    underPressure: 'Podés buscar algo más entretenido en lugar de resolver el conflicto. La disciplina sostenida es tu work in progress.',
    inRelationships: 'Sos cálido, espontáneo y generoso. Hacés que la gente se sienta especial con una naturalidad que no se puede imitar.',
    complementaryCodes: ['INLP', 'ISLP'],
  },

  ENLP: {
    code: 'ENLP',
    name: 'El Comandante',
    tagline: 'No solo tenés la visión — sabés cómo ejecutarla.',
    description:
      'Combinás algo que es genuinamente poco común: la capacidad de ver el futuro con claridad y la determinación de construirlo sin esperar que otros den el primer paso. No te conformás con lo que existe si sabés que puede ser mejor.\n\nTus estándares son altos — para vos y para quienes elegís tener cerca. Cuando tomás un proyecto, no lo soltás hasta que funciona como vos lo imaginaste. Eso genera un respeto que no se pide: se gana con el tiempo.\n\nTu energía empuja hacia adelante a quienes te rodean, incluso cuando no lo pedís. La gente te sigue porque ve que sabés adónde vas y que el camino tiene sentido.',
    strengths: ['Liderazgo estratégico', 'Visión de largo plazo', 'Determinación inquebrantable', 'Capacidad de inspirar acción real'],
    growthZone: 'Incorporar la perspectiva emocional como dato estratégico, no como distracción — los equipos que se sienten comprendidos ejecutan mejor.',
    famousExamples: ['Steve Jobs', 'Margaret Thatcher', 'Simone Biles'],
    color: '#2D2D6E', colorName: 'Índigo', emoji: '🎯',
    rarity: 2,
    workStyle: 'Rendís mejor con responsabilidad real y problemas de alto impacto. Los ambientes mediocres te frustran profundamente.',
    teamRole: 'Sos el líder que marca el norte. Tu claridad y energía hacen que otros den más de lo que creían posible.',
    underPressure: 'Te volvés más intenso y exigente. Tu mayor riesgo es olvidar que las personas no son máquinas.',
    inRelationships: 'Sos leal y comprometido cuando elegís estarlo, pero necesitás que el otro pueda sostenerte — no todos pueden.',
    complementaryCodes: ['ISVF', 'INVF'],
  },

  ENLF: {
    code: 'ENLF',
    name: 'El Innovador',
    tagline: 'Conectás puntos que nadie más veía relacionados.',
    description:
      'Tu mente funciona como un laboratorio de ideas en tiempo real. Te entusiasma el debate, las hipótesis, los "¿y si...?" que otros descartan antes de terminar de formularlos. La conversación intelectual con alguien que piensa diferente a vos es una de tus experiencias favoritas.\n\nNo es que no te importen las personas — es que creés genuinamente que las mejores ideas van a beneficiar a todos eventualmente. Tenés una energía especial para los comienzos: cuando algo es nuevo, estás en tu elemento absoluto.\n\nLa implementación te convoca menos, pero el impulso inicial que generás — y la forma en que ves conexiones que otros no ven — es irremplazable en cualquier proceso creativo o de innovación.',
    strengths: ['Pensamiento lateral', 'Capacidad de debate constructivo', 'Generación constante de ideas', 'Energía en contextos nuevos'],
    growthZone: 'Llevar las ideas hasta el final — la ejecución es donde tu impacto se vuelve real y tangible.',
    famousExamples: ['Leonardo da Vinci', 'Mark Zuckerberg', 'Voltaire'],
    color: '#2D6E6E', colorName: 'Teal Oscuro', emoji: '💡',
    rarity: 3,
    workStyle: 'Rendís mejor en contextos de innovación con libertad para explorar sin burocracia que te frene a cada paso.',
    teamRole: 'Sos el generador de ideas que expande los límites de lo posible. Necesitás a alguien que ejecute lo que imaginás.',
    underPressure: 'Podés saltar de problema en problema sin resolver ninguno. Terminar lo empezado es tu desafío constante.',
    inRelationships: 'Sos estimulante e intenso. Los vínculos profundos aparecen cuando te comprometés a estar presente de verdad.',
    complementaryCodes: ['ISVP', 'ISLP'],
  },

  ENVP: {
    code: 'ENVP',
    name: 'El Mentor',
    tagline: 'Sabés exactamente qué necesita escuchar cada persona.',
    description:
      'Tenés una capacidad notable para ver el potencial en los demás — a veces antes de que ellos mismos lo vean. No solo inspirás: organizás, planificás, creás las condiciones para que otros puedan florecer de verdad.\n\nTu calidez no es blanda: tiene dirección y propósito. Cuando creés en alguien, lo decís y lo mostrás. Cuando algo no está funcionando, también lo decís — con cuidado, pero sin rodearlo. Esa honestidad empática es tu sello más distintivo.\n\nLa gente que pasa tiempo con vos sale cambiada. No porque los hayas convencido de algo, sino porque les mostraste algo de sí mismos que no habían visto.',
    strengths: ['Empatía estratégica', 'Liderazgo inspirador', 'Comunicación que transforma', 'Visión clara del potencial humano'],
    growthZone: 'Darte permiso de tener tus propias necesidades sin que eso te haga sentir egoísta — los mejores mentores también se dejan acompañar.',
    famousExamples: ['Barack Obama', 'Malala Yousafzai', 'Brené Brown'],
    color: '#6E2D5C', colorName: 'Rosa Profundo', emoji: '🌟',
    rarity: 3,
    workStyle: 'Rendís mejor cuando tu trabajo tiene impacto en personas reales. Necesitás ver el efecto concreto de lo que hacés.',
    teamRole: 'Sos el que saca lo mejor de cada integrante individualmente. Tu capacidad de inspirar en uno a uno es extraordinaria.',
    underPressure: 'Tendés a absorber el estrés del grupo. Tu bienestar afecta directamente el de todos los que te rodean.',
    inRelationships: 'Das mucho en los vínculos — a veces más de lo que recibís. Aprender a recibir es tu tarea pendiente.',
    complementaryCodes: ['ISLF', 'ISLP'],
  },

  ENVF: {
    code: 'ENVF',
    name: 'El Explorador',
    tagline: 'Tu entusiasmo abre puertas que otros ni ven.',
    description:
      'Vivís con una energía que es difícil de explicar y fácil de sentir: la de alguien que genuinamente cree que el mundo está lleno de posibilidades todavía sin explorar. Esa fe no es ingenuidad — es una forma de ver que te permite encontrar caminos donde otros ven muros.\n\nConectás con facilidad, inspirás sin querer, y cuando te apasionás por algo, ese fuego se transmite a quienes te rodean. Las personas se sienten mejor después de hablar con vos — más livianas, más posibles.\n\nTu mayor regalo es hacerle sentir a la gente que sus sueños son reales y alcanzables. Eso no tiene precio.',
    strengths: ['Entusiasmo genuino y contagioso', 'Creatividad emocional', 'Conexión auténtica con las personas', 'Adaptabilidad natural'],
    growthZone: 'Profundizar en lo que ya tenés antes de saltar a lo siguiente — la raíz es lo que permite que el árbol crezca.',
    famousExamples: ['Robin Williams', 'Walt Disney', 'Isabel Allende'],
    color: '#C43D6E', colorName: 'Rosa Vibrante', emoji: '🧭',
    rarity: 8,
    workStyle: 'Necesitás variedad, propósito y conexión con personas para rendir bien. La rutina sin sentido te apaga lentamente.',
    teamRole: 'Sos el puente entre personas e ideas. Tu entusiasmo y tu capacidad de conectar son activos únicos e irremplazables.',
    underPressure: 'Podés disiparte en muchas direcciones a la vez. El foco sostenido en una sola cosa es donde más necesitás trabajar.',
    inRelationships: 'Sos intenso, cálido y genuinamente generoso. Cuando te comprometés de verdad, sos de los mejores compañeros posibles.',
    complementaryCodes: ['ISLP', 'INLP'],
  },
};

export const ARCHETYPE_CODES = Object.keys(ARCHETYPES);
