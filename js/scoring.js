/* ============================================================
   PRISMA — Scoring Algorithm
   ============================================================ */

/**
 * Configuración única de los 4 ejes (fuente de verdad para todo el scoring).
 *  - indices: posiciones (0–15) de las 4 preguntas del eje.
 *  - pesos:   peso de cada pregunta (misma posición que `indices`).
 *
 * Por qué pesos distintos: antes cada eje se decidía por mayoría simple, y
 * todo empate 2–2 caía SIEMPRE del lado 'A' (Interior / Analítico / Racional /
 * Planificador), sesgando los resultados hacia el arquetipo I-A-R-P.
 * Los pesos suman 4.3 (en décimas: 43, impar), así que ningún subconjunto de
 * respuestas puede sumar exactamente la mitad (2.15) → los empates exactos son
 * imposibles y el desempate depende de QUÉ preguntas se respondieron a cada
 * lado, no de un sesgo fijo. Son sutiles (0.9–1.3) y podés ajustarlos.
 */
const EJES = {
  1: { indices: [0, 4, 8, 12],  pesos: [0.9, 1.0, 1.1, 1.3], letterA: 'I', letterB: 'E', labelA: 'Interior',     labelB: 'Exterior'  },
  2: { indices: [1, 5, 9, 13],  pesos: [0.9, 1.0, 1.1, 1.3], letterA: 'A', letterB: 'N', labelA: 'Analítico',    labelB: 'Intuitivo' },
  3: { indices: [2, 6, 10, 14], pesos: [0.9, 1.0, 1.1, 1.3], letterA: 'R', letterB: 'M', labelA: 'Racional',     labelB: 'Empático'  },
  4: { indices: [3, 7, 11, 15], pesos: [0.9, 1.0, 1.1, 1.3], letterA: 'P', letterB: 'F', labelA: 'Planificador', labelB: 'Flexible'  }
};

/**
 * Puntúa un eje sumando los pesos de cada polo.
 * @returns {{scoreA:number, scoreB:number, total:number, countA:number, countB:number}}
 */
function puntuarEje(respuestas, config) {
  let scoreA = 0, scoreB = 0, countA = 0, countB = 0;
  config.indices.forEach((idx, k) => {
    const peso = config.pesos[k];
    if (respuestas[idx] === 'A') { scoreA += peso; countA++; }
    else                         { scoreB += peso; countB++; }
  });
  return { scoreA, scoreB, total: scoreA + scoreB, countA, countB };
}

/**
 * Calcula el arquetipo a partir de un array de respuestas.
 * @param {Array<'A'|'B'>} respuestas - Array de 16 respuestas (índices 0–15)
 * @returns {string} Código del arquetipo, ej: 'I-A-R-P'
 */
function calcularArquetipo(respuestas) {
  return Object.values(EJES).map(config => {
    const { scoreA, scoreB } = puntuarEje(respuestas, config);
    // Con los pesos elegidos nunca hay empate exacto; el '>=' es sólo una red
    // de seguridad por si alguien ajusta los pesos y crea uno.
    return scoreA >= scoreB ? config.letterA : config.letterB;
  }).join('-');
}

/**
 * Retorna los scores detallados por eje (para mostrar barra de rasgos)
 * @param {Array<'A'|'B'>} respuestas
 * @returns {Object} scores por eje
 */
function calcularScores(respuestas) {
  const scores = {};
  Object.entries(EJES).forEach(([eje, config]) => {
    const { scoreA, scoreB, total, countA, countB } = puntuarEje(respuestas, config);
    const percentA = (scoreA / total) * 100;
    scores[eje] = {
      labelA: config.labelA,
      labelB: config.labelB,
      countA,
      countB,
      percentA,
      percentB: 100 - percentA, // garantiza que las barras sumen exactamente 100%
      dominant: scoreA >= scoreB ? 'A' : 'B'
    };
  });
  return scores;
}
