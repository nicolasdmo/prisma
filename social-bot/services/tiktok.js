const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

const BASE = 'https://open.tiktokapis.com/v2';

async function postToTiktok(caption, mediaFiles, creds) {
  const token = creds.access_token;
  if (!token) throw new Error('Faltan credenciales de TikTok');

  const videos = mediaFiles ? mediaFiles.filter(f => f.mimetype.startsWith('video/')) : [];
  const images = mediaFiles ? mediaFiles.filter(f => f.mimetype.startsWith('image/')) : [];

  if (videos.length === 0 && images.length === 0) {
    throw new Error('TikTok requiere al menos un video o imagen');
  }

  // Inicializar subida
  const mediaType = videos.length > 0 ? 'VIDEO' : 'PHOTO';
  const initPayload = {
    post_info: {
      title: caption,
      privacy_level: 'PUBLIC_TO_EVERYONE',
      disable_duet: false,
      disable_comment: false,
      disable_stitch: false,
    },
    source_info: { source: 'FILE_UPLOAD', video_size: 0 },
  };

  if (mediaType === 'VIDEO') {
    const videoFile = videos[0];
    const stat = fs.statSync(videoFile.path);
    initPayload.source_info.video_size = stat.size;
    initPayload.source_info.chunk_size = stat.size;
    initPayload.source_info.total_chunk_count = 1;
  } else {
    initPayload.post_mode = 'DIRECT_POST';
    initPayload.media_type = 'PHOTO';
    initPayload.source_info = { source: 'FILE_UPLOAD', photo_count: images.length };
  }

  const initRes = await axios.post(
    `${BASE}/post/publish/${mediaType === 'VIDEO' ? 'video' : 'images'}/init/`,
    initPayload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
    }
  );

  const { publish_id, upload_url } = initRes.data.data;

  if (mediaType === 'VIDEO') {
    const videoFile = videos[0];
    const stat = fs.statSync(videoFile.path);
    const buffer = fs.readFileSync(videoFile.path);

    await axios.put(upload_url, buffer, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Range': `bytes 0-${stat.size - 1}/${stat.size}`,
        'Content-Length': stat.size,
      },
    });
  } else {
    for (let i = 0; i < images.length; i++) {
      const imgBuffer = fs.readFileSync(images[i].path);
      await axios.put(upload_url[i], imgBuffer, {
        headers: { 'Content-Type': images[i].mimetype },
      });
    }
  }

  // Verificar estado
  let attempts = 0;
  while (attempts < 20) {
    await new Promise(r => setTimeout(r, 3000));
    const statusRes = await axios.post(
      `${BASE}/post/publish/status/fetch/`,
      { publish_id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json; charset=UTF-8',
        },
      }
    );
    const status = statusRes.data.data?.status;
    if (status === 'PUBLISH_COMPLETE') {
      return { id: publish_id, type: mediaType.toLowerCase() };
    }
    if (status === 'FAILED') throw new Error('TikTok: publicación fallida');
    attempts++;
  }

  throw new Error('TikTok: timeout esperando publicación');
}

module.exports = { postToTiktok };
