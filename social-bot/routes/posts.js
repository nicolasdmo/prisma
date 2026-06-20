const express = require('express');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const db = require('../db/database');
const { publishPost } = require('../scheduler');

const router = express.Router();

// GET /api/posts - listar posts
router.get('/', (req, res) => {
  const { status } = req.query;
  let query = 'SELECT * FROM posts ORDER BY created_at DESC';
  const params = [];

  if (status) {
    query = 'SELECT * FROM posts WHERE status = ? ORDER BY created_at DESC';
    params.push(status);
  }

  const posts = db.prepare(query).all(...params).map(deserializePost);
  res.json(posts);
});

// GET /api/posts/:id
router.get('/:id', (req, res) => {
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post no encontrado' });
  res.json(deserializePost(post));
});

// POST /api/posts - crear post
router.post('/', (req, res) => {
  const { caption, platforms, media_ids, scheduled_at } = req.body;

  if (!caption && (!media_ids || media_ids.length === 0)) {
    return res.status(400).json({ error: 'Se requiere caption o al menos un archivo media' });
  }
  if (!platforms || platforms.length === 0) {
    return res.status(400).json({ error: 'Selecciona al menos una plataforma' });
  }

  const id = uuidv4();
  const status = scheduled_at ? 'scheduled' : 'draft';

  db.prepare(`
    INSERT INTO posts (id, caption, platforms, media_ids, status, scheduled_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    id,
    caption || '',
    JSON.stringify(platforms),
    JSON.stringify(media_ids || []),
    status,
    scheduled_at || null
  );

  const post = deserializePost(db.prepare('SELECT * FROM posts WHERE id = ?').get(id));
  res.status(201).json(post);
});

// PUT /api/posts/:id - actualizar post
router.put('/:id', (req, res) => {
  const { caption, platforms, media_ids, scheduled_at } = req.body;
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);

  if (!post) return res.status(404).json({ error: 'Post no encontrado' });
  if (post.status === 'published') return res.status(400).json({ error: 'No se puede editar un post publicado' });

  db.prepare(`
    UPDATE posts SET
      caption = ?,
      platforms = ?,
      media_ids = ?,
      scheduled_at = ?,
      status = ?,
      updated_at = datetime('now')
    WHERE id = ?
  `).run(
    caption ?? post.caption,
    JSON.stringify(platforms ?? JSON.parse(post.platforms)),
    JSON.stringify(media_ids ?? JSON.parse(post.media_ids)),
    scheduled_at !== undefined ? scheduled_at : post.scheduled_at,
    scheduled_at ? 'scheduled' : 'draft',
    req.params.id
  );

  res.json(deserializePost(db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id)));
});

// DELETE /api/posts/:id
router.delete('/:id', (req, res) => {
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post no encontrado' });

  db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id);
  res.json({ deleted: true });
});

// POST /api/posts/:id/publish - publicar ahora
router.post('/:id/publish', async (req, res) => {
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post no encontrado' });
  if (post.status === 'published') return res.status(400).json({ error: 'Ya está publicado' });

  try {
    const results = await publishPost(req.params.id);
    res.json({ published: true, results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function deserializePost(post) {
  return {
    ...post,
    platforms: JSON.parse(post.platforms || '[]'),
    media_ids: JSON.parse(post.media_ids || '[]'),
    results: JSON.parse(post.results || '{}'),
  };
}

module.exports = router;
