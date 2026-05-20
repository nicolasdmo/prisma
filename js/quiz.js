/* ============================================================
   PRISMA — Quiz Engine
   ============================================================ */

document.addEventListener('DOMContentLoaded', async () => {
  /* ---- State ---- */
  const state = {
    currentQ: 0,
    respuestas: new Array(16).fill(null),
    selectedPolo: null,
    timerInterval: null,
    timerSeconds: 30,
    audioReady: false,
    audioEnabled: false
  };

  /* ---- DOM refs ---- */
  const body           = document.body;
  const introScreen    = document.getElementById('intro-screen');
  const quizScreen     = document.getElementById('quiz-screen');
  const progressFill   = document.getElementById('progress-fill');
  const progressText   = document.getElementById('progress-text');
  const greetingEl     = document.getElementById('quiz-greeting');
  const ejeBadge       = document.getElementById('eje-badge');
  const timerNumber    = document.getElementById('timer-number');
  const timerProgress  = document.getElementById('timer-progress');
  const questionEmoji  = document.getElementById('question-emoji');
  const questionText   = document.getElementById('question-text');
  const optionsGrid    = document.getElementById('options-grid');
  const btnSiguiente   = document.getElementById('btn-siguiente');
  const btnStartAudio  = document.getElementById('btn-start-audio');
  const btnSkipAudio   = document.getElementById('btn-skip-audio');
  const btnStartQuiz   = document.getElementById('btn-start-quiz');
  const audioToggle    = document.getElementById('audio-toggle');

  /* ---- Get name from URL ---- */
  const params = new URLSearchParams(window.location.search);
  const nombre = params.get('nombre') || 'viajero';
  if (greetingEl) greetingEl.textContent = `Hola, ${nombre} 👋`;

  /* ---- Intro screen buttons ---- */
  if (btnStartAudio) {
    btnStartAudio.addEventListener('click', async () => {
      // Init audio on user gesture
      const ok = await window.prismaAudio.init();
      state.audioReady = ok;
      state.audioEnabled = ok;
      window.prismaAudio.start();
      beginQuiz();
    });
  }

  if (btnSkipAudio) {
    btnSkipAudio.addEventListener('click', () => {
      state.audioEnabled = false;
      beginQuiz();
    });
  }

  if (btnStartQuiz) {
    btnStartQuiz.addEventListener('click', () => {
      state.audioEnabled = false;
      beginQuiz();
    });
  }

  /* ---- Audio toggle ---- */
  if (audioToggle) {
    audioToggle.addEventListener('click', () => {
      if (!state.audioReady) return;
      state.audioEnabled = !state.audioEnabled;
      if (state.audioEnabled) {
        window.prismaAudio.resume();
        window.prismaAudio.setVolume(0.18);
        audioToggle.textContent = '🔊';
        audioToggle.title = 'Silenciar';
      } else {
        window.prismaAudio.setVolume(0);
        audioToggle.textContent = '🔇';
        audioToggle.title = 'Activar sonido';
      }
    });
  }

  /* ---- Begin quiz ---- */
  function beginQuiz() {
    if (introScreen) introScreen.classList.add('hidden');
    if (quizScreen) quizScreen.classList.remove('hidden');
    renderQuestion();
  }

  /* ---- Render current question ---- */
  function renderQuestion() {
    const q = PREGUNTAS[state.currentQ];
    if (!q) return;

    // Reset selected
    state.selectedPolo = null;
    btnSiguiente.classList.remove('active');

    // Update body class for axis color
    body.className = `quiz-body eje-${q.eje}`;

    // Update progress
    const progress = ((state.currentQ) / PREGUNTAS.length) * 100;
    progressFill.style.width = `${progress}%`;
    progressText.innerHTML = `<span>${state.currentQ + 1}</span> / ${PREGUNTAS.length}`;

    // Update eje badge
    const ejeNames = { 1: '⚡ ENERGÍA', 2: '🔮 PERCEPCIÓN', 3: '⚖️ DECISIÓN', 4: '🌊 ESTILO' };
    ejeBadge.textContent = ejeNames[q.eje];

    // Animate question in
    const card = document.getElementById('question-card');
    if (card) {
      card.style.animation = 'none';
      card.offsetHeight; // reflow
      card.style.animation = '';
    }

    // Set question content
    questionEmoji.textContent = q.emoji;
    questionText.textContent  = q.texto;

    // Render options
    optionsGrid.innerHTML = '';
    q.opciones.forEach((opcion, idx) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.dataset.polo = opcion.polo;
      btn.innerHTML = `
        <span class="option-emoji">${opcion.emoji}</span>
        <span class="option-text">${opcion.texto}</span>
      `;
      btn.addEventListener('click', () => selectOption(btn, opcion.polo, q.eje));

      // Restore previous selection if user came back
      if (state.respuestas[state.currentQ] === opcion.polo) {
        btn.classList.add('selected');
        state.selectedPolo = opcion.polo;
        btnSiguiente.classList.add('active');
      }

      optionsGrid.appendChild(btn);
    });

    // Start timer
    resetTimer();
    startTimer();

    // Update audio mood
    if (state.audioEnabled && window.prismaAudio.isPlaying) {
      // Don't update on render, only on answer
    }
  }

  /* ---- Select option ---- */
  function selectOption(btn, polo, eje) {
    // Remove previous selection
    document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));

    // Select this one
    btn.classList.add('selected');
    state.selectedPolo = polo;
    state.respuestas[state.currentQ] = polo;

    // Activate next button
    btnSiguiente.classList.add('active');

    // Sound effect
    if (state.audioEnabled) {
      window.prismaAudio.resume();
      window.prismaAudio.playClick();
      window.prismaAudio.updateMood(polo, eje);
    }

    // Haptic feedback on mobile
    if (navigator.vibrate) navigator.vibrate(30);

    // Ripple effect
    createRipple(btn);
  }

  /* ---- Ripple effect ---- */
  function createRipple(element) {
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255,255,255,0.15);
      width: 200px; height: 200px;
      margin: -100px;
      top: 50%; left: 50%;
      animation: rippleEffect 0.6s ease-out forwards;
      pointer-events: none;
    `;
    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }

  // Add ripple animation to page
  if (!document.getElementById('ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `@keyframes rippleEffect {
      from { transform: scale(0); opacity: 1; }
      to   { transform: scale(1); opacity: 0; }
    }`;
    document.head.appendChild(style);
  }

  /* ---- Next question ---- */
  btnSiguiente.addEventListener('click', () => {
    if (!btnSiguiente.classList.contains('active')) return;
    if (state.audioEnabled) window.prismaAudio.playTransition();

    clearInterval(state.timerInterval);

    if (state.currentQ < PREGUNTAS.length - 1) {
      // Animate out
      const card = document.getElementById('question-card');
      if (card) {
        card.classList.add('exit');
        setTimeout(() => {
          card.classList.remove('exit');
          state.currentQ++;
          renderQuestion();
        }, 300);
      } else {
        state.currentQ++;
        renderQuestion();
      }
    } else {
      // Quiz complete!
      finishQuiz();
    }
  });

  /* ---- Timer ---- */
  function startTimer() {
    state.timerSeconds = 30;
    const totalDash = 126; // circumference of r=20 circle

    state.timerInterval = setInterval(() => {
      state.timerSeconds--;
      if (timerNumber) timerNumber.textContent = state.timerSeconds;

      // Update SVG progress
      const offset = totalDash * (1 - state.timerSeconds / 30);
      if (timerProgress) timerProgress.style.strokeDashoffset = offset;

      // Color warning when < 10s
      if (state.timerSeconds <= 10 && timerProgress) {
        timerProgress.style.stroke = '#f87171';
      }

      if (state.timerSeconds <= 0) {
        clearInterval(state.timerInterval);
        // Auto-advance if no selection — pick random
        if (!state.selectedPolo) {
          const q = PREGUNTAS[state.currentQ];
          const polo = Math.random() < 0.5 ? 'A' : 'B';
          state.respuestas[state.currentQ] = polo;
          state.selectedPolo = polo;
        }
        // Advance
        if (state.currentQ < PREGUNTAS.length - 1) {
          state.currentQ++;
          renderQuestion();
        } else {
          finishQuiz();
        }
      }
    }, 1000);
  }

  function resetTimer() {
    clearInterval(state.timerInterval);
    state.timerSeconds = 30;
    if (timerNumber) timerNumber.textContent = '30';
    if (timerProgress) {
      timerProgress.style.strokeDashoffset = 0;
      timerProgress.style.stroke = ''; // Reset to CSS class color
    }
  }

  /* ---- Finish quiz ---- */
  function finishQuiz() {
    clearInterval(state.timerInterval);

    // Fill any unanswered questions
    state.respuestas = state.respuestas.map(r => r || (Math.random() < 0.5 ? 'A' : 'B'));

    // Calculate archetype
    const codigo = calcularArquetipo(state.respuestas);
    const scores = calcularScores(state.respuestas);

    // Store in localStorage
    localStorage.setItem('prisma_resultado', codigo);
    localStorage.setItem('prisma_scores', JSON.stringify(scores));
    localStorage.setItem('prisma_nombre', nombre);
    localStorage.setItem('prisma_respuestas', JSON.stringify(state.respuestas));

    // Play success sound
    if (state.audioEnabled) {
      window.prismaAudio.playSuccess();
      setTimeout(() => window.prismaAudio.stop(), 1500);
    }

    // Redirect to result
    setTimeout(() => {
      window.location.href = `resultado.html?tipo=${encodeURIComponent(codigo)}&nombre=${encodeURIComponent(nombre)}`;
    }, 800);
  }
});
