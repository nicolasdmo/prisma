/* ── Social Media Bot — Frontend ── */

const API = '';

// ── State ──────────────────────────────────────────────────
let allMedia = [];
let allPosts = [];
let pickerSelected = [];   // media IDs selected in modal
let formSelected = [];     // media IDs selected in post form
let currentEditId = null;

// ── Router ──────────────────────────────────────────────────
function showView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`view-${name}`)?.classList.add('active');
  document.querySelector(`[data-view="${name}"]`)?.classList.add('active');
}

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const view = btn.dataset.view;
    showView(view);
    if (view === 'dashboard') loadDashboard();
    if (view === 'media') loadMediaLibrary();
    if (view === 'config') loadConfig();
    if (view === 'create') openCreateForm();
  });
});

// ── Toast ───────────────────────────────────────────────────
function toast(msg, type = 'info') {
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span class="toast-icon">${icons[type]}</span><span>${msg}</span>`;
  document.getElementById('toast-container').appendChild(el);
  setTimeout(() => el.remove(), 4000);
}

// ── API helpers ─────────────────────────────────────────────
async function apiFetch(url, opts = {}) {
  const res = await fetch(API + url, {
    headers: { 'Content-Type': 'application/json', ...opts.headers },
    ...opts,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Error en el servidor');
  }
  return res.json();
}

// ── Utils ───────────────────────────────────────────────────
function fmtSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function fmtDate(str) {
  if (!str) return '—';
  const d = new Date(str.endsWith('Z') ? str : str + 'Z');
  return d.toLocaleString('es', { dateStyle: 'short', timeStyle: 'short' });
}

function platformLabel(p) {
  const map = {
    meta_facebook: 'Facebook',
    meta_instagram: 'Instagram',
    twitter: 'X / Twitter',
    tiktok: 'TikTok',
    youtube: 'YouTube',
  };
  return map[p] || p;
}

// ── DASHBOARD ───────────────────────────────────────────────
async function loadDashboard() {
  try {
    allPosts = await apiFetch('/api/posts');
    renderStats(allPosts);
    renderPostsList(allPosts);
  } catch (e) {
    toast(e.message, 'error');
  }
}

function renderStats(posts) {
  document.getElementById('stat-total').textContent = posts.length;
  document.getElementById('stat-published').textContent = posts.filter(p => p.status === 'published' || p.status === 'partial').length;
  document.getElementById('stat-scheduled').textContent = posts.filter(p => p.status === 'scheduled').length;
  document.getElementById('stat-failed').textContent = posts.filter(p => p.status === 'failed').length;
}

function renderPostsList(posts) {
  const el = document.getElementById('posts-list');
  if (!posts.length) {
    el.innerHTML = '<div class="empty-state">No hay posts todavía. <br>Crea tu primer post haciendo clic en "+ Nuevo Post".</div>';
    return;
  }
  el.innerHTML = posts.map(post => `
    <div class="post-card" data-id="${post.id}">
      <div>
        <div class="post-caption">${post.caption || '<em style="color:var(--text2)">Sin texto</em>'}</div>
        <div class="post-meta">
          <span class="status-badge status-${post.status}">${statusLabel(post.status)}</span>
          <div class="post-platforms">
            ${post.platforms.map(p => `<span class="platform-badge ${p}">${platformLabel(p)}</span>`).join('')}
          </div>
          ${post.scheduled_at ? `<span>📅 ${fmtDate(post.scheduled_at)}</span>` : ''}
          ${post.published_at ? `<span>✅ ${fmtDate(post.published_at)}</span>` : ''}
          <span>${fmtDate(post.created_at)}</span>
        </div>
        ${renderPostResults(post.results)}
      </div>
      <div class="post-actions">
        ${post.status !== 'published' ? `<button class="btn btn-ghost btn-sm" onclick="editPost('${post.id}')">Editar</button>` : ''}
        ${post.status !== 'published' ? `<button class="btn btn-primary btn-sm" onclick="publishNow('${post.id}')">Publicar</button>` : ''}
        <button class="btn btn-danger btn-sm" onclick="deletePost('${post.id}')">✕</button>
      </div>
    </div>
  `).join('');
}

function renderPostResults(results) {
  if (!results || !Object.keys(results).length) return '';
  const items = Object.entries(results).map(([p, r]) =>
    `<span style="color:${r.ok ? 'var(--green)' : 'var(--red)'};font-size:11px">
      ${r.ok ? '✓' : '✗'} ${platformLabel(p)}${r.error ? `: ${r.error}` : ''}
    </span>`
  ).join(' · ');
  return `<div style="margin-top:6px">${items}</div>`;
}

function statusLabel(s) {
  const map = { draft: 'Borrador', scheduled: 'Programado', publishing: 'Publicando…', published: 'Publicado', partial: 'Parcial', failed: 'Fallido' };
  return map[s] || s;
}

document.getElementById('filter-status').addEventListener('change', async function () {
  const status = this.value;
  const filtered = status ? allPosts.filter(p => p.status === status) : allPosts;
  renderPostsList(filtered);
});

async function publishNow(id) {
  if (!confirm('¿Publicar este post ahora en todas las plataformas seleccionadas?')) return;
  try {
    const btn = document.querySelector(`[data-id="${id}"] .btn-primary`);
    if (btn) btn.textContent = 'Publicando…';
    const res = await apiFetch(`/api/posts/${id}/publish`, { method: 'POST' });
    toast('Post publicado correctamente', 'success');
    loadDashboard();
  } catch (e) {
    toast(e.message, 'error');
    loadDashboard();
  }
}

async function deletePost(id) {
  if (!confirm('¿Eliminar este post?')) return;
  try {
    await apiFetch(`/api/posts/${id}`, { method: 'DELETE' });
    toast('Post eliminado', 'success');
    loadDashboard();
  } catch (e) {
    toast(e.message, 'error');
  }
}

async function editPost(id) {
  const post = allPosts.find(p => p.id === id) || await apiFetch(`/api/posts/${id}`);
  openCreateForm(post);
}

document.getElementById('btn-quick-create').addEventListener('click', () => { openCreateForm(); showView('create'); });

// ── POST FORM ────────────────────────────────────────────────
function openCreateForm(post = null) {
  currentEditId = post?.id || null;
  formSelected = post?.media_ids ? [...post.media_ids] : [];
  document.getElementById('edit-post-id').value = currentEditId || '';
  document.getElementById('form-title').textContent = post ? 'Editar Post' : 'Nuevo Post';
  document.getElementById('f-caption').value = post?.caption || '';
  updateCharCount(post?.caption || '');

  document.querySelectorAll('[name="platform"]').forEach(cb => {
    cb.checked = post?.platforms?.includes(cb.value) || false;
  });

  const schedRadios = document.querySelectorAll('[name="schedule"]');
  if (post?.scheduled_at) {
    schedRadios[1].checked = true;
    document.getElementById('f-scheduled-at').style.display = 'block';
    document.getElementById('f-scheduled-at').value = post.scheduled_at.slice(0, 16);
  } else {
    schedRadios[0].checked = true;
    document.getElementById('f-scheduled-at').style.display = 'none';
    document.getElementById('f-scheduled-at').value = '';
  }

  document.getElementById('btn-publish-text').textContent = post?.scheduled_at ? 'Guardar' : 'Publicar';
  renderFormSelected();
  showView('create');
}

document.getElementById('f-caption').addEventListener('input', function () { updateCharCount(this.value); });
function updateCharCount(text) {
  document.getElementById('char-count').textContent = `${text.length} caracteres`;
}

document.querySelectorAll('[name="schedule"]').forEach(r => {
  r.addEventListener('change', function () {
    const later = document.getElementById('f-scheduled-at');
    later.style.display = this.value === 'later' ? 'block' : 'none';
    document.getElementById('btn-publish-text').textContent = this.value === 'later' ? 'Programar' : 'Publicar';
  });
});

document.getElementById('btn-cancel-form').addEventListener('click', () => { showView('dashboard'); loadDashboard(); });

document.getElementById('btn-save-draft').addEventListener('click', () => submitForm('draft'));

document.getElementById('post-form').addEventListener('submit', async e => {
  e.preventDefault();
  const schedule = document.querySelector('[name="schedule"]:checked').value;
  if (schedule === 'later') {
    await submitForm('schedule');
  } else {
    await submitForm('publish');
  }
});

async function submitForm(action) {
  const caption = document.getElementById('f-caption').value.trim();
  const platforms = [...document.querySelectorAll('[name="platform"]:checked')].map(cb => cb.value);
  const scheduledAt = document.getElementById('f-scheduled-at').value || null;

  if (!caption && formSelected.length === 0) { toast('Agrega texto o al menos un archivo', 'error'); return; }
  if (platforms.length === 0) { toast('Selecciona al menos una plataforma', 'error'); return; }
  if (action === 'schedule' && !scheduledAt) { toast('Selecciona fecha y hora para programar', 'error'); return; }

  const payload = {
    caption,
    platforms,
    media_ids: formSelected,
    scheduled_at: action === 'schedule' ? scheduledAt : null,
  };

  try {
    let post;
    if (currentEditId) {
      post = await apiFetch(`/api/posts/${currentEditId}`, { method: 'PUT', body: JSON.stringify(payload) });
    } else {
      post = await apiFetch('/api/posts', { method: 'POST', body: JSON.stringify(payload) });
    }

    if (action === 'publish') {
      document.getElementById('btn-publish-text').textContent = 'Publicando…';
      const btn = document.getElementById('btn-publish');
      btn.disabled = true;
      try {
        await apiFetch(`/api/posts/${post.id}/publish`, { method: 'POST' });
        toast('¡Post publicado correctamente!', 'success');
      } catch (e) {
        toast(`Error al publicar: ${e.message}`, 'error');
      }
      btn.disabled = false;
      document.getElementById('btn-publish-text').textContent = 'Publicar';
    } else if (action === 'schedule') {
      toast('Post programado correctamente', 'success');
    } else {
      toast('Borrador guardado', 'success');
    }

    showView('dashboard');
    loadDashboard();
  } catch (e) {
    toast(e.message, 'error');
  }
}

// ── MEDIA PICKER (in form) ───────────────────────────────────
document.getElementById('btn-open-picker').addEventListener('click', openPickerModal);

function renderFormSelected() {
  const container = document.getElementById('media-picker-selected');
  const empty = document.getElementById('media-picker-empty');
  empty.style.display = formSelected.length ? 'none' : 'block';

  container.innerHTML = formSelected.map(id => {
    const m = allMedia.find(x => x.id === id);
    if (!m) return '';
    const isVideo = m.mimetype.startsWith('video/');
    const thumb = isVideo
      ? `<video class="picker-thumb" src="${m.url}" muted></video>`
      : `<img src="${m.url}" alt="${m.original}" />`;
    return `
      <div class="picker-thumb">
        ${thumb}
        <button class="picker-thumb-remove" onclick="removeFormMedia('${id}')">✕</button>
      </div>`;
  }).join('');
}

function removeFormMedia(id) {
  formSelected = formSelected.filter(x => x !== id);
  renderFormSelected();
}

// ── MEDIA LIBRARY ────────────────────────────────────────────
async function loadMediaLibrary() {
  try {
    allMedia = await apiFetch('/api/media');
    renderMediaGrid('all');
  } catch (e) {
    toast(e.message, 'error');
  }
}

function renderMediaGrid(filter = 'all') {
  const grid = document.getElementById('media-grid');
  let items = allMedia;
  if (filter === 'image') items = allMedia.filter(m => m.mimetype.startsWith('image/'));
  if (filter === 'video') items = allMedia.filter(m => m.mimetype.startsWith('video/'));

  if (!items.length) {
    grid.innerHTML = '<div class="empty-state">No hay archivos en la biblioteca.</div>';
    return;
  }

  grid.innerHTML = items.map(m => {
    const isVideo = m.mimetype.startsWith('video/');
    const thumb = isVideo
      ? `<video class="media-thumb" src="${m.url}" muted></video>`
      : `<img class="media-thumb" src="${m.url}" alt="${m.original}" loading="lazy" />`;
    return `
      <div class="media-item" data-id="${m.id}">
        ${thumb}
        <span class="media-type-badge">${isVideo ? 'VIDEO' : 'IMG'}</span>
        <button class="media-delete" onclick="deleteMedia(event,'${m.id}')">✕</button>
        <div class="media-info">
          <div class="media-name" title="${m.original}">${m.original}</div>
          <div class="media-size">${fmtSize(m.size)}</div>
        </div>
      </div>`;
  }).join('');
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    renderMediaGrid(this.dataset.filter);
  });
});

async function deleteMedia(e, id) {
  e.stopPropagation();
  if (!confirm('¿Eliminar este archivo?')) return;
  try {
    await apiFetch(`/api/media/${id}`, { method: 'DELETE' });
    allMedia = allMedia.filter(m => m.id !== id);
    formSelected = formSelected.filter(x => x !== id);
    renderMediaGrid(document.querySelector('.filter-btn.active')?.dataset.filter || 'all');
    toast('Archivo eliminado', 'success');
  } catch (e) {
    toast(e.message, 'error');
  }
}

// ── FILE UPLOAD ──────────────────────────────────────────────
const fileInput = document.getElementById('file-input');
const uploadZone = document.getElementById('upload-zone');

['btn-upload-trigger', 'btn-upload-trigger2'].forEach(id => {
  document.getElementById(id)?.addEventListener('click', () => fileInput.click());
});

fileInput.addEventListener('change', () => uploadFiles(fileInput.files));

uploadZone.addEventListener('click', () => fileInput.click());
uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
uploadZone.addEventListener('drop', e => {
  e.preventDefault();
  uploadZone.classList.remove('drag-over');
  uploadFiles(e.dataTransfer.files);
});

async function uploadFiles(files) {
  if (!files || !files.length) return;

  const progress = document.getElementById('upload-progress');
  const fill = document.getElementById('progress-fill');
  const text = document.getElementById('progress-text');
  progress.style.display = 'block';
  fill.style.width = '0%';
  text.textContent = 'Subiendo...';

  const form = new FormData();
  for (const file of files) form.append('files', file);

  try {
    const xhr = new XMLHttpRequest();
    await new Promise((resolve, reject) => {
      xhr.upload.addEventListener('progress', e => {
        if (e.lengthComputable) {
          const pct = Math.round((e.loaded / e.total) * 100);
          fill.style.width = pct + '%';
          text.textContent = `Subiendo... ${pct}%`;
        }
      });
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) resolve(JSON.parse(xhr.responseText));
        else reject(new Error(xhr.responseText));
      });
      xhr.addEventListener('error', () => reject(new Error('Error de red')));
      xhr.open('POST', '/api/media/upload');
      xhr.send(form);
    });

    fill.style.width = '100%';
    text.textContent = '¡Listo!';
    toast(`${files.length} archivo(s) subido(s)`, 'success');
    await loadMediaLibrary();
  } catch (e) {
    toast(`Error al subir: ${e.message}`, 'error');
  } finally {
    setTimeout(() => { progress.style.display = 'none'; }, 1500);
    fileInput.value = '';
  }
}

// ── MEDIA PICKER MODAL ───────────────────────────────────────
function openPickerModal() {
  pickerSelected = [...formSelected];
  renderModalGrid();
  document.getElementById('modal-picker').classList.remove('hidden');
}

function closePickerModal() {
  document.getElementById('modal-picker').classList.add('hidden');
}

document.getElementById('modal-picker-backdrop').addEventListener('click', closePickerModal);
document.getElementById('modal-picker-close').addEventListener('click', closePickerModal);

document.getElementById('btn-picker-confirm').addEventListener('click', () => {
  formSelected = [...pickerSelected];
  renderFormSelected();
  closePickerModal();
});

function renderModalGrid() {
  const grid = document.getElementById('modal-media-grid');
  document.getElementById('picker-count').textContent = `${pickerSelected.length} seleccionados`;

  if (!allMedia.length) {
    grid.innerHTML = '<div class="empty-state">No hay archivos. Sube algunos en la Biblioteca.</div>';
    return;
  }

  grid.innerHTML = allMedia.map(m => {
    const isVideo = m.mimetype.startsWith('video/');
    const selected = pickerSelected.includes(m.id);
    const thumb = isVideo
      ? `<video class="media-thumb" src="${m.url}" muted></video>`
      : `<img class="media-thumb" src="${m.url}" alt="${m.original}" loading="lazy" />`;
    return `
      <div class="media-item${selected ? ' selected' : ''}" data-id="${m.id}" onclick="togglePickerItem('${m.id}')">
        ${thumb}
        <span class="media-type-badge">${isVideo ? 'VIDEO' : 'IMG'}</span>
        <div class="media-info">
          <div class="media-name" title="${m.original}">${m.original}</div>
        </div>
      </div>`;
  }).join('');
}

function togglePickerItem(id) {
  const idx = pickerSelected.indexOf(id);
  if (idx >= 0) pickerSelected.splice(idx, 1);
  else pickerSelected.push(id);
  renderModalGrid();
}

// ── CONFIG ───────────────────────────────────────────────────
const PLATFORM_DEFS = [
  {
    key: 'meta_facebook',
    label: 'Facebook',
    icon: '🔵',
    docs: 'https://developers.facebook.com/docs/pages/access-tokens',
    fields: [
      { name: 'page_id', label: 'Page ID', hint: 'ID numérico de tu Facebook Page' },
      { name: 'page_access_token', label: 'Page Access Token', hint: 'Token de larga duración de tu página', type: 'password' },
    ],
  },
  {
    key: 'meta_instagram',
    label: 'Instagram',
    icon: '📸',
    docs: 'https://developers.facebook.com/docs/instagram-api',
    fields: [
      { name: 'ig_user_id', label: 'Instagram User ID', hint: 'ID de tu cuenta de negocio de Instagram' },
      { name: 'page_access_token', label: 'Page Access Token', hint: 'Mismo token de la página de Facebook asociada', type: 'password' },
    ],
  },
  {
    key: 'twitter',
    label: 'X / Twitter',
    icon: '🐦',
    docs: 'https://developer.twitter.com/en/portal/dashboard',
    fields: [
      { name: 'api_key', label: 'API Key', type: 'password' },
      { name: 'api_secret', label: 'API Secret', type: 'password' },
      { name: 'access_token', label: 'Access Token', type: 'password' },
      { name: 'access_secret', label: 'Access Token Secret', type: 'password' },
    ],
  },
  {
    key: 'tiktok',
    label: 'TikTok',
    icon: '🎵',
    docs: 'https://developers.tiktok.com/doc/overview',
    fields: [
      { name: 'client_key', label: 'Client Key', type: 'password' },
      { name: 'client_secret', label: 'Client Secret', type: 'password' },
      { name: 'access_token', label: 'Access Token', hint: 'Token OAuth del usuario de TikTok', type: 'password' },
    ],
  },
  {
    key: 'youtube',
    label: 'YouTube',
    icon: '▶️',
    docs: 'https://console.cloud.google.com',
    fields: [
      { name: 'client_id', label: 'Client ID', hint: 'De Google Cloud Console → Credenciales OAuth 2.0' },
      { name: 'client_secret', label: 'Client Secret', type: 'password' },
      { name: 'refresh_token', label: 'Refresh Token', hint: 'Obtenido tras el flujo OAuth inicial', type: 'password' },
    ],
  },
];

let platformConfigData = [];

async function loadConfig() {
  try {
    platformConfigData = await apiFetch('/api/config');
    renderConfigCards();
  } catch (e) {
    toast(e.message, 'error');
  }
}

function renderConfigCards() {
  const container = document.getElementById('platform-configs');
  container.innerHTML = PLATFORM_DEFS.map(def => {
    const data = platformConfigData.find(c => c.platform === def.key) || {};
    const isSet = data.credentials_set;
    const isEnabled = data.enabled;
    const masked = data.credentials_masked || {};

    const fields = def.fields.map(f => `
      <div class="config-field">
        <label>${f.label}</label>
        <input
          class="input"
          type="${f.type === 'password' ? 'password' : 'text'}"
          name="${f.name}"
          placeholder="${masked[f.name] || 'No configurado'}"
          value="${masked[f.name] ? masked[f.name] : ''}"
          autocomplete="off"
          data-platform="${def.key}"
        />
        ${f.hint ? `<div class="config-field-hint">${f.hint}</div>` : ''}
      </div>
    `).join('');

    return `
      <div class="platform-config-card" id="config-card-${def.key}">
        <div class="platform-config-header" onclick="toggleConfigCard('${def.key}')">
          <div class="platform-config-title">
            <span>${def.icon}</span>
            <span>${def.label}</span>
            <span class="config-status ${isSet ? 'ok' : 'not-set'}">${isSet ? '✓ Configurado' : 'Sin configurar'}</span>
          </div>
          <div style="display:flex;align-items:center;gap:12px">
            <label class="toggle-switch" onclick="event.stopPropagation()">
              <input type="checkbox" ${isEnabled ? 'checked' : ''} onchange="togglePlatform('${def.key}', this.checked)" />
              <span class="toggle-slider"></span>
            </label>
            <span class="config-chevron">▾</span>
          </div>
        </div>
        <div class="platform-config-body">
          <p style="color:var(--text2);font-size:12px;margin-bottom:8px">
            Obtén tus credenciales en:
            <a href="${def.docs}" target="_blank" style="color:var(--accent)">${def.docs}</a>
          </p>
          ${fields}
          <div class="config-actions">
            <button class="btn btn-primary btn-sm" onclick="saveConfig('${def.key}')">Guardar</button>
            <button class="btn btn-ghost btn-sm" onclick="testConfig('${def.key}')">Probar conexión</button>
            <span class="config-test-result" id="test-result-${def.key}"></span>
          </div>
        </div>
      </div>`;
  }).join('');
}

function toggleConfigCard(key) {
  document.getElementById(`config-card-${key}`).classList.toggle('open');
}

async function togglePlatform(key, enabled) {
  try {
    await apiFetch(`/api/config/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ enabled }),
    });
    toast(`${key} ${enabled ? 'habilitado' : 'deshabilitado'}`, 'success');
  } catch (e) {
    toast(e.message, 'error');
  }
}

async function saveConfig(key) {
  const inputs = document.querySelectorAll(`[data-platform="${key}"]`);
  const credentials = {};
  inputs.forEach(inp => {
    if (inp.value && !inp.value.includes('****')) {
      credentials[inp.name] = inp.value;
    }
  });

  try {
    await apiFetch(`/api/config/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ credentials, enabled: true }),
    });
    toast('Credenciales guardadas correctamente', 'success');
    await loadConfig();
  } catch (e) {
    toast(e.message, 'error');
  }
}

async function testConfig(key) {
  const el = document.getElementById(`test-result-${key}`);
  el.textContent = 'Probando…';
  el.className = 'config-test-result';
  try {
    const res = await apiFetch(`/api/config/${key}/test`, { method: 'POST' });
    if (res.ok) {
      el.textContent = `✓ Conectado: ${JSON.stringify(res.result)}`;
      el.className = 'config-test-result ok';
    } else {
      el.textContent = `✗ ${res.error}`;
      el.className = 'config-test-result error';
    }
  } catch (e) {
    el.textContent = `✗ ${e.message}`;
    el.className = 'config-test-result error';
  }
}

// ── INIT ─────────────────────────────────────────────────────
(async function init() {
  await loadMediaLibrary();
  await loadDashboard();
  showView('dashboard');
})();
