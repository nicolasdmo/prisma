const cron = require('node-cron');
const path = require('path');
const db = require('./db/database');
const { postToFacebook, postToInstagram } = require('./services/meta');
const { postToTwitter } = require('./services/twitter');
const { postToTiktok } = require('./services/tiktok');
const { postToYoutube } = require('./services/youtube');

const UPLOADS_DIR = path.join(__dirname, 'uploads');

function getMediaFiles(mediaIds) {
  const fs = require('fs');
  const files = [];
  for (const id of mediaIds) {
    const media = db.prepare('SELECT * FROM media WHERE id = ?').get(id);
    if (!media) continue;
    const filePath = path.join(UPLOADS_DIR, media.filename);
    if (fs.existsSync(filePath)) {
      files.push({
        path: filePath,
        mimetype: media.mimetype,
        filename: media.filename,
        publicUrl: null, // set if hosting behind public URL
      });
    }
  }
  return files;
}

function getConfig(platform) {
  const row = db.prepare('SELECT * FROM platform_config WHERE platform = ?').get(platform);
  return row ? JSON.parse(row.credentials || '{}') : {};
}

async function publishPost(postId) {
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(postId);
  if (!post) throw new Error('Post no encontrado');

  const platforms = JSON.parse(post.platforms || '[]');
  const mediaIds = JSON.parse(post.media_ids || '[]');
  const mediaFiles = getMediaFiles(mediaIds);
  const results = {};

  db.prepare("UPDATE posts SET status = 'publishing', updated_at = datetime('now') WHERE id = ?").run(postId);

  const fbCreds = getConfig('meta_facebook');
  const igCreds = getConfig('meta_instagram');

  for (const platform of platforms) {
    try {
      let result;
      switch (platform) {
        case 'meta_facebook':
          result = await postToFacebook(post.caption, mediaFiles, { fb: fbCreds, ig: igCreds });
          break;
        case 'meta_instagram':
          result = await postToInstagram(post.caption, mediaFiles, { fb: fbCreds, ig: igCreds });
          break;
        case 'twitter':
          result = await postToTwitter(post.caption, mediaFiles, getConfig('twitter'));
          break;
        case 'tiktok':
          result = await postToTiktok(post.caption, mediaFiles, getConfig('tiktok'));
          break;
        case 'youtube':
          result = await postToYoutube(post.caption, mediaFiles, getConfig('youtube'));
          break;
        default:
          result = { error: 'Plataforma desconocida' };
      }
      results[platform] = { ok: true, ...result };
    } catch (err) {
      results[platform] = { ok: false, error: err.message };
    }
  }

  const allOk = Object.values(results).every(r => r.ok);
  const anyOk = Object.values(results).some(r => r.ok);
  const finalStatus = allOk ? 'published' : anyOk ? 'partial' : 'failed';

  db.prepare(`
    UPDATE posts
    SET status = ?, results = ?, published_at = datetime('now'), updated_at = datetime('now')
    WHERE id = ?
  `).run(finalStatus, JSON.stringify(results), postId);

  return results;
}

// Ejecutar cada minuto — revisa posts programados
function startScheduler() {
  cron.schedule('* * * * *', async () => {
    const now = new Date().toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM
    const due = db.prepare(`
      SELECT * FROM posts
      WHERE status = 'scheduled'
      AND scheduled_at <= ?
    `).all(now + ':59');

    for (const post of due) {
      console.log(`[Scheduler] Publicando post programado: ${post.id}`);
      try {
        await publishPost(post.id);
      } catch (err) {
        console.error(`[Scheduler] Error en post ${post.id}:`, err.message);
      }
    }
  });

  console.log('[Scheduler] Iniciado — revisando cada minuto');
}

module.exports = { publishPost, startScheduler };
