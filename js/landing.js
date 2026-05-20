/* ============================================================
   PRISMA — Landing Page JS
   ============================================================ */

/* ---- CONFIG: Pegá tu URL de Google Apps Script acá ---- */
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwNchgeM586c40r4c1Qulz_ROAYoZBE_2VVCa0DqooMFV1OpmqgjpSr3cviSSR7eNk1/exec';

document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  renderArquetipasPreview();
  initForm();
  initScrollReveal();
});

/* ---- Particles ---- */
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const colors = ['#7c6aff', '#f64f59', '#fbb040', '#10b981', '#3b82f6', '#a855f7'];

  for (let i = 0; i < 60; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 1;
    const color = colors[Math.floor(Math.random() * colors.length)];
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      animation-delay: ${Math.random() * 8}s;
      animation-duration: ${Math.random() * 6 + 6}s;
      opacity: ${Math.random() * 0.4 + 0.1};
    `;
    container.appendChild(p);
  }
}

/* ---- Archetypes preview grid ---- */
function renderArquetipasPreview() {
  const grid = document.getElementById('arquetipos-grid');
  if (!grid) return;

  const list = [
    { nombre: 'El Arquitecto', emoji: '🏛️', color: '#3b82f6', codigo: 'I-A-R-P', tagline: 'Construyo sistemas que duran' },
    { nombre: 'El Detective',  emoji: '🔍', color: '#94a3b8', codigo: 'I-A-R-F', tagline: 'Todos miran. Yo veo.' },
    { nombre: 'El Guardián',   emoji: '🛡️', color: '#22c55e', codigo: 'I-A-M-P', tagline: 'Sostengo todo cuando nadie mira' },
    { nombre: 'El Sanador',    emoji: '🌿', color: '#2dd4bf', codigo: 'I-A-M-F', tagline: 'Acompañar es más difícil que arreglar' },
    { nombre: 'El Estratega',  emoji: '♟️', color: '#60a5fa', codigo: 'I-N-R-P', tagline: 'Pienso en el partido siguiente' },
    { nombre: 'El Alquimista', emoji: '⚗️', color: '#c084fc', codigo: 'I-N-R-F', tagline: 'Convierto lo imposible en algo nuevo' },
    { nombre: 'El Filósofo',   emoji: '🦉', color: '#818cf8', codigo: 'I-N-M-P', tagline: 'Necesito saber por qué importa' },
    { nombre: 'El Soñador',    emoji: '🌙', color: '#38bdf8', codigo: 'I-N-M-F', tagline: 'Vivo en dos mundos' },
    { nombre: 'El Comandante', emoji: '⚡', color: '#f87171', codigo: 'E-A-R-P', tagline: 'El ambiente cambia cuando entro' },
    { nombre: 'El Explorador', emoji: '🧭', color: '#fb923c', codigo: 'E-A-R-F', tagline: 'Cada fracaso es un dato' },
    { nombre: 'El Diplomático',emoji: '🌐', color: '#fbbf24', codigo: 'E-A-M-P', tagline: 'Construyo puentes que duran' },
    { nombre: 'El Conector',   emoji: '🕸️', color: '#facc15', codigo: 'E-A-M-F', tagline: 'La gente se siente vista conmigo' },
    { nombre: 'El Visionario', emoji: '🔮', color: '#e879f9', codigo: 'E-N-R-P', tagline: 'Veo el futuro con claridad' },
    { nombre: 'El Emprendedor',emoji: '🔥', color: '#f97316', codigo: 'E-N-R-F', tagline: 'El status quo me aburre' },
    { nombre: 'El Mentor',     emoji: '🌱', color: '#4ade80', codigo: 'E-N-M-P', tagline: 'Veo en vos lo que vos no ves' },
    { nombre: 'El Catalizador',emoji: '✨', color: '#f472b6', codigo: 'E-N-M-F', tagline: 'Donde llego, las cosas cambian' }
  ];

  list.forEach(a => {
    const card = document.createElement('div');
    card.className = 'arquetipo-card-preview';
    card.style.setProperty('--card-color', a.color);
    card.innerHTML = `
      <div class="card-emoji">${a.emoji}</div>
      <div class="card-nombre">${a.nombre}</div>
      <div class="card-tagline">"${a.tagline}"</div>
      <span class="card-codigo" style="color:${a.color}">${a.codigo}</span>
    `;
    // Color accent on the bottom bar
    card.style.cssText += `border-bottom: 2px solid ${a.color}40;`;
    card.addEventListener('mouseenter', () => {
      card.style.borderBottomColor = a.color;
      card.style.boxShadow = `0 8px 32px ${a.color}20`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.borderBottomColor = `${a.color}40`;
      card.style.boxShadow = '';
    });
    grid.appendChild(card);
  });
}

/* ---- Form ---- */
function initForm() {
  const form    = document.getElementById('form-inicio');
  const btnText = document.querySelector('.btn-text');
  const btnLoad = document.querySelector('.btn-loading');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const email  = document.getElementById('email').value.trim();

    if (!nombre || !email) return;

    // UI feedback
    if (btnText) btnText.classList.add('hidden');
    if (btnLoad) btnLoad.classList.remove('hidden');

    // Send to Google Sheets (fire and forget)
    try {
      if (GOOGLE_SCRIPT_URL !== 'TU_URL_DE_APPS_SCRIPT_AQUI') {
        fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre,
            email,
            fecha: new Date().toISOString(),
            fuente: document.referrer || 'directo'
          })
        });
      }
    } catch (err) {
      // Silent fail — don't block user
      console.warn('Error guardando email:', err);
    }

    // Store locally too
    localStorage.setItem('prisma_nombre', nombre);
    localStorage.setItem('prisma_email', email);

    // Small delay for UX then redirect
    setTimeout(() => {
      window.location.href = `test.html?nombre=${encodeURIComponent(nombre)}`;
    }, 600);
  });
}

/* ---- Scroll reveal ---- */
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  // Observe animatable elements
  document.querySelectorAll('.step, .arquetipo-card-preview, .form-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

/* ---- Smooth scroll for CTA ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});
