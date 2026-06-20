const express = require('express');
const db = require('../db/database');

const router = express.Router();

// GET /api/config - obtener config de todas las plataformas (sin secretos completos)
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT platform, enabled, updated_at FROM platform_config').all();
  const full = db.prepare('SELECT * FROM platform_config').all();

  const result = full.map(row => {
    const creds = JSON.parse(row.credentials || '{}');
    const masked = {};
    for (const [k, v] of Object.entries(creds)) {
      masked[k] = v ? (v.length > 8 ? `${v.slice(0, 4)}${'*'.repeat(v.length - 8)}${v.slice(-4)}` : '****') : '';
    }
    return {
      platform: row.platform,
      enabled: !!row.enabled,
      credentials_set: Object.keys(creds).length > 0,
      credentials_masked: masked,
      updated_at: row.updated_at,
    };
  });

  res.json(result);
});

// PUT /api/config/:platform - guardar credenciales
router.put('/:platform', (req, res) => {
  const { platform } = req.params;
  const { credentials, enabled } = req.body;

  const existing = db.prepare('SELECT * FROM platform_config WHERE platform = ?').get(platform);
  if (!existing) return res.status(404).json({ error: 'Plataforma no encontrada' });

  const current = JSON.parse(existing.credentials || '{}');
  const updated = { ...current };

  // Solo actualizar campos que no estén enmascarados (no contienen ****)
  if (credentials) {
    for (const [k, v] of Object.entries(credentials)) {
      if (v && !v.includes('****')) updated[k] = v;
      if (v === '') delete updated[k];
    }
  }

  db.prepare(`
    UPDATE platform_config
    SET credentials = ?, enabled = ?, updated_at = datetime('now')
    WHERE platform = ?
  `).run(JSON.stringify(updated), enabled ? 1 : 0, platform);

  res.json({ saved: true, platform });
});

// POST /api/config/:platform/test - verificar conexión
router.post('/:platform/test', async (req, res) => {
  const { platform } = req.params;
  const row = db.prepare('SELECT * FROM platform_config WHERE platform = ?').get(platform);
  if (!row) return res.status(404).json({ error: 'Plataforma no encontrada' });

  const creds = JSON.parse(row.credentials || '{}');

  try {
    let result;
    if (platform === 'meta_facebook' || platform === 'meta_instagram') {
      const axios = require('axios');
      const token = creds.page_access_token;
      if (!token) throw new Error('Token no configurado');
      const r = await axios.get(`https://graph.facebook.com/v19.0/me?access_token=${token}`);
      result = { name: r.data.name, id: r.data.id };
    } else if (platform === 'twitter') {
      const { TwitterApi } = require('twitter-api-v2');
      const client = new TwitterApi({
        appKey: creds.api_key,
        appSecret: creds.api_secret,
        accessToken: creds.access_token,
        accessSecret: creds.access_secret,
      });
      const user = await client.v2.me();
      result = { username: user.data.username, id: user.data.id };
    } else if (platform === 'youtube') {
      const axios = require('axios');
      const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
        client_id: creds.client_id,
        client_secret: creds.client_secret,
        refresh_token: creds.refresh_token,
        grant_type: 'refresh_token',
      });
      const channelRes = await axios.get('https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true', {
        headers: { Authorization: `Bearer ${tokenRes.data.access_token}` },
      });
      const ch = channelRes.data.items?.[0]?.snippet;
      result = { title: ch?.title };
    } else if (platform === 'tiktok') {
      const axios = require('axios');
      const r = await axios.get('https://open.tiktokapis.com/v2/user/info/?fields=open_id,display_name', {
        headers: { Authorization: `Bearer ${creds.access_token}` },
      });
      result = { display_name: r.data.data?.user?.display_name };
    }
    res.json({ ok: true, result });
  } catch (err) {
    res.json({ ok: false, error: err.message });
  }
});

module.exports = router;
