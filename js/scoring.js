/* ============================================================
   PRISMA — Scoring Algorithm
   ============================================================ */

/**
 * Calcula el arquetipo a partir de un array de respuestas.
 * @param {Array<'A'|'B'>} respuestas - Array de 16 respuestas (índices 0–15)
 * @returns {string} Código del arquetipo, ej: 'I-A-R-P'
 */
function calcularArquetipo(respuestas) {
  // Eje 1 — Energía: preguntas 1,5,9,13 → índices 0,4,8,12
  const eje1 = [0, 4, 8, 12].map(i => respuestas[i]);
  const e1A = eje1.filter(r => r === 'A').length;
  const E1 = e1A >= 2 ? 'I' : 'E'; // A=Interior, B=Exterior

  // Eje 2 — Percepción: preguntas 2,6,10,14 → índices 1,5,9,13
  const eje2 = [1, 5, 9, 13].map(i => respuestas[i]);
  const e2A = eje2.filter(r => r === 'A').length;
  const E2 = e2A >= 2 ? 'A' : 'N'; // A=Analítico, B=Intuitivo

  // Eje 3 — Decisión: preguntas 3,7,11,15 → índices 2,6,10,14
  const eje3 = [2, 6, 10, 14].map(i => respuestas[i]);
  const e3A = eje3.filter(r => r === 'A').length;
  const E3 = e3A >= 2 ? 'R' : 'M'; // A=Racional, B=Empático

  // Eje 4 — Estilo: preguntas 4,8,12,16 → índices 3,7,11,15
  const eje4 = [3, 7, 11, 15].map(i => respuestas[i]);
  const e4A = eje4.filter(r => r === 'A').length;
  const E4 = e4A >= 2 ? 'P' : 'F'; // A=Planificador, B=Flexible

  return `${E1}-${E2}-${E3}-${E4}`;
}

/**
 * Retorna los scores detallados por eje (para mostrar barra de rasgos)
 * @param {Array<'A'|'B'>} respuestas
 * @returns {Object} scores por eje
 */
function calcularScores(respuestas) {
  const ejes = {
    1: { indices: [0,4,8,12], labelA: 'Interior',    labelB: 'Exterior' },
    2: { indices: [1,5,9,13], labelA: 'Analítico',   labelB: 'Intuitivo' },
    3: { indices: [2,6,10,14],labelA: 'Racional',    labelB: 'Empático' },
    4: { indices: [3,7,11,15],labelA: 'Planificador', labelB: 'Flexible' }
  };

  const scores = {};
  Object.entries(ejes).forEach(([eje, config]) => {
    const answers = config.indices.map(i => respuestas[i]);
    const countA = answers.filter(r => r === 'A').length;
    const countB = 4 - countA;
    scores[eje] = {
      labelA: config.labelA,
      labelB: config.labelB,
      countA,
      countB,
      percentA: (countA / 4) * 100,
      percentB: (countB / 4) * 100,
      dominant: countA >= countB ? 'A' : 'B'
    };
  });
  return scores;
}
