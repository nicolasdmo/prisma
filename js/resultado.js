/* ============================================================
   PRISMA — Resultado Page JS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const params  = new URLSearchParams(window.location.search);
  const codigo  = params.get('tipo') || localStorage.getItem('prisma_resultado') || 'I-N-M-F';
  const nombre  = params.get('nombre') || localStorage.getItem('prisma_nombre') || 'Viajero';
  const scores  = JSON.parse(localStorage.getItem('prisma_scores') || '{}');

  const arq = ARQUETIPOS[codigo];
  if (!arq) {
    document.body.innerHTML = '<div style="padding:40px;text-align:center"><h2>Resultado no encontrado</h2><a href="index.html">Volver al inicio</a></div>';
    return;
  }

  /* ---- Apply archetype color theme ---- */
  document.documentElement.style.setProperty('--arch-color', arq.color);
  document.documentElement.style.setProperty('--arch-color-dark', arq.colorDark);

  /* ---- Hero ---- */
  // Background glow
  const heroBg = document.getElementById('resultado-hero-bg');
  if (heroBg) {
    heroBg.style.background = `
      radial-gradient(ellipse 70% 50% at 50% 0%,
        ${arq.colorDark}80 0%, transparent 70%),
      radial-gradient(ellipse 40% 30% at 80% 50%,
        ${arq.color}20 0%, transparent 60%)
    `;
  }

  // Saludo
  const saludoEl = document.getElementById('resultado-saludo');
  if (saludoEl) saludoEl.textContent = `${nombre}, tu Prisma es`;

  // Icon
  const iconEl = document.getElementById('arquetipo-emoji');
  if (iconEl) iconEl.textContent = arq.emoji;

  // Title
  const titleEl = document.getElementById('resultado-titulo');
  if (titleEl) {
    titleEl.textContent = arq.nombre;
    titleEl.style.color = arq.color;
  }

  // Codigo
  const codigoEl = document.getElementById('resultado-codigo');
  if (codigoEl) codigoEl.textContent = codigo;

  // Tagline
  const taglineEl = document.getElementById('resultado-tagline');
  if (taglineEl) taglineEl.textContent = `"${arq.tagline}"`;

  // Page title
  document.title = `${arq.nombre} — PRISMA`;

  /* ---- Description ---- */
  const descEl = document.getElementById('resultado-descripcion');
  if (descEl) {
    descEl.innerHTML = arq.descripcion.map(p => `<p>${p}</p>`).join('');
  }

  /* ---- Fortalezas ---- */
  const fortEl = document.getElementById('fortalezas-grid');
  if (fortEl) {
    fortEl.innerHTML = arq.fortalezas.map(f => `
      <div class="fortaleza-item">
        <div class="fortaleza-icon">${f.emoji}</div>
        <div class="fortaleza-content">
          <div class="fortaleza-titulo">${f.titulo}</div>
          <div class="fortaleza-desc">${f.desc}</div>
        </div>
      </div>
    `).join('');
  }

  /* ---- Crecimiento ---- */
  const crec = document.getElementById('crecimiento-texto');
  if (crec) crec.textContent = arq.crecimiento;

  /* ---- Referentes ---- */
  const refEl = document.getElementById('referentes-grid');
  if (refEl) {
    refEl.innerHTML = arq.referentes.map(r => `
      <div class="referente-card">
        <div class="referente-avatar">${r.emoji}</div>
        <div class="referente-nombre">${r.nombre}</div>
      </div>
    `).join('');
  }

  /* ---- Scores Radar (trait bars) ---- */
  renderScoreBars(scores, arq);

  /* ---- Generate share card (Canvas) ---- */
  generateShareCard(arq, nombre);

  /* ---- Share buttons ---- */
  initShareButtons(arq, nombre, codigo);
});

/* ---- Trait bars ---- */
function renderScoreBars(scores, arq) {
  const container = document.getElementById('scores-container');
  if (!container || !scores || Object.keys(scores).length === 0) return;

  const ejeNames = {
    1: { emoji: '⚡', label: 'Energía' },
    2: { emoji: '🔮', label: 'Percepción' },
    3: { emoji: '⚖️', label: 'Decisión' },
    4: { emoji: '🌊', label: 'Estilo' }
  };

  container.innerHTML = Object.entries(scores).map(([eje, s]) => {
    const info = ejeNames[eje] || {};
    const pctA = s.percentA;
    const pctB = s.percentB;
    return `
      <div class="score-bar-item">
        <div class="score-bar-labels">
          <span class="score-label">${info.emoji} ${s.labelA}</span>
          <span class="score-label" style="text-align:right">${s.labelB}</span>
        </div>
        <div class="score-bar-track">
          <div class="score-bar-left"  style="width:${pctA}%; background:${arq.color}60"></div>
          <div class="score-bar-right" style="width:${pctB}%; background:${arq.color}30"></div>
        </div>
        <div class="score-bar-pcts">
          <span style="color:${arq.color}">${Math.round(pctA)}%</span>
          <span style="color:${arq.color}80">${Math.round(pctB)}%</span>
        </div>
      </div>
    `;
  }).join('');
}

/* ---- Canvas share card ---- */
function generateShareCard(arq, nombre) {
  const canvas = document.getElementById('shareCanvas');
  if (!canvas) return;

  const W = 1080, H = 1080;
  canvas.width  = W;
  canvas.height = H;
  canvas.style.width  = '100%';
  canvas.style.maxWidth = '400px';
  canvas.style.height = 'auto';

  const ctx = canvas.getContext('2d');

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, '#07070f');
  bgGrad.addColorStop(0.5, arq.colorDark + 'aa');
  bgGrad.addColorStop(1, '#07070f');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Glow circle
  const glow = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, W * 0.5);
  glow.addColorStop(0, arq.color + '40');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // Particles
  ctx.save();
  for (let i = 0; i < 60; i++) {
    ctx.beginPath();
    ctx.arc(
      Math.random() * W,
      Math.random() * H,
      Math.random() * 3 + 0.5,
      0, Math.PI * 2
    );
    ctx.fillStyle = arq.color + Math.floor(Math.random() * 80 + 20).toString(16);
    ctx.fill();
  }
  ctx.restore();

  // Top brand
  ctx.font = 'bold 48px "Arial"';
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.textAlign = 'center';
  ctx.fillText('◈ PRISMA', W/2, 80);

  // Emoji
  ctx.font = '180px serif';
  ctx.textAlign = 'center';
  ctx.fillText(arq.emoji, W/2, 380);

  // Archetype name
  ctx.font = 'bold 96px Arial';
  ctx.fillStyle = arq.color;
  ctx.textAlign = 'center';
  ctx.fillText(arq.nombre.toUpperCase(), W/2, 520);

  // Code badge
  ctx.font = 'bold 36px monospace';
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.fillText(arq.codigo || '', W/2, 580);

  // Tagline
  ctx.font = 'italic 38px Arial';
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.textAlign = 'center';
  const words = arq.tagline.split(' ');
  let line = '', lines = [];
  words.forEach(w => {
    const test = line + w + ' ';
    if (ctx.measureText(test).width > 860 && line) {
      lines.push(line.trim());
      line = w + ' ';
    } else {
      line = test;
    }
  });
  lines.push(line.trim());
  lines.forEach((l, i) => ctx.fillText(`"${l}${i === lines.length-1 ? '"' : ''}`, W/2, 680 + i * 52));

  // Separator
  const sep = ctx.createLinearGradient(100, 0, W-100, 0);
  sep.addColorStop(0, 'transparent');
  sep.addColorStop(0.5, arq.color + '80');
  sep.addColorStop(1, 'transparent');
  ctx.fillStyle = sep;
  ctx.fillRect(100, 820, W-200, 2);

  // Bottom text
  ctx.font = '36px Arial';
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.fillText('Descubrí tu arquetipo en prismatest.com', W/2, 890);

  // Name
  if (nombre && nombre !== 'Viajero') {
    ctx.font = 'bold 40px Arial';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText(nombre, W/2, 960);
  }
}

/* ---- Share Buttons ---- */
function initShareButtons(arq, nombre, codigo) {
  const shareText = `Soy ${arq.nombre} según PRISMA 🔮\n"${arq.tagline}"\n\n¿Cuál es tu arquetipo? → `;
  const shareUrl  = window.location.origin + '/index.html';

  // Download card
  const btnDown = document.getElementById('btn-download');
  if (btnDown) {
    btnDown.addEventListener('click', () => {
      const canvas = document.getElementById('shareCanvas');
      const link = document.createElement('a');
      link.download = `prisma-${codigo.toLowerCase()}.png`;
      link.href = canvas.toDataURL('image/png', 0.95);
      link.click();
    });
  }

  // Copy link
  const btnCopy = document.getElementById('btn-copy');
  if (btnCopy) {
    btnCopy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(shareText + shareUrl);
        btnCopy.textContent = '✅ ¡Copiado!';
        setTimeout(() => btnCopy.innerHTML = '🔗 Copiar link', 2000);
      } catch {
        btnCopy.textContent = '❌ Error';
      }
    });
  }

  // WhatsApp
  const btnWa = document.getElementById('btn-whatsapp');
  if (btnWa) {
    btnWa.addEventListener('click', () => {
      const url = `https://wa.me/?text=${encodeURIComponent(shareText + shareUrl)}`;
      window.open(url, '_blank');
    });
  }

  // Native share (mobile)
  const btnShare = document.getElementById('btn-share');
  if (btnShare) {
    if (navigator.share) {
      btnShare.classList.remove('hidden');
      btnShare.addEventListener('click', async () => {
        try {
          await navigator.share({ title: `Soy ${arq.nombre} — PRISMA`, text: shareText, url: shareUrl });
        } catch (e) { /* cancelled */ }
      });
    }
  }

  // Retry test
  const btnRetry = document.getElementById('btn-retry');
  if (btnRetry) {
    btnRetry.addEventListener('click', () => {
      localStorage.removeItem('prisma_resultado');
      localStorage.removeItem('prisma_scores');
      localStorage.removeItem('prisma_respuestas');
      window.location.href = 'index.html';
    });
  }
}
