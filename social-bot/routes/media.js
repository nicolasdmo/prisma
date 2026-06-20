const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const db = require('../db/database');

const router = express.Router();

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/quicktime', 'video/webm'];
    if (allowed.includes(file.mimetype)) return cb(null, true);
    cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}`));
  },
});

// GET /api/media - listar todos los archivos
router.get('/', (req, res) => {
  const media = db.prepare('SELECT * FROM media ORDER BY created_at DESC').all();
  res.json(media);
});

// POST /api/media/upload - subir archivo(s)
router.post('/upload', upload.array('files', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No se recibieron archivos' });
  }

  const inserted = [];
  const insert = db.prepare(
    'INSERT INTO media (id, filename, original, mimetype, size, url) VALUES (?, ?, ?, ?, ?, ?)'
  );

  for (const file of req.files) {
    const id = path.basename(file.filename, path.extname(file.filename));
    const url = `/uploads/${file.filename}`;
    insert.run(id, file.filename, file.originalname, file.mimetype, file.size, url);
    inserted.push({ id, filename: file.filename, original: file.originalname, mimetype: file.mimetype, size: file.size, url });
  }

  res.json({ uploaded: inserted });
});

// DELETE /api/media/:id - eliminar archivo
router.delete('/:id', (req, res) => {
  const media = db.prepare('SELECT * FROM media WHERE id = ?').get(req.params.id);
  if (!media) return res.status(404).json({ error: 'No encontrado' });

  const filePath = path.join(UPLOADS_DIR, media.filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  db.prepare('DELETE FROM media WHERE id = ?').run(req.params.id);
  res.json({ deleted: true });
});

module.exports = router;
