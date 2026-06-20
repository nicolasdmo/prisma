const axios = require('axios');
const fs = require('fs');
const path = require('path');

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const UPLOAD_URL = 'https://www.googleapis.com/upload/youtube/v3/videos';

async function getAccessToken(creds) {
  if (!creds.client_id || !creds.client_secret || !creds.refresh_token) {
    throw new Error('Faltan credenciales de YouTube');
  }
  const res = await axios.post(TOKEN_URL, {
    client_id: creds.client_id,
    client_secret: creds.client_secret,
    refresh_token: creds.refresh_token,
    grant_type: 'refresh_token',
  });
  return res.data.access_token;
}

async function postToYoutube(caption, mediaFiles, creds) {
  const videos = mediaFiles ? mediaFiles.filter(f => f.mimetype.startsWith('video/')) : [];

  if (videos.length === 0) throw new Error('YouTube requiere un archivo de video');

  const accessToken = await getAccessToken(creds);
  const videoFile = videos[0];
  const stat = fs.statSync(videoFile.path);

  // Iniciar subida resumible
  const initRes = await axios.post(
    `${UPLOAD_URL}?uploadType=resumable&part=snippet,status`,
    {
      snippet: {
        title: caption.slice(0, 100),
        description: caption,
        tags: [],
        categoryId: '22', // People & Blogs
      },
      status: {
        privacyStatus: 'public',
        selfDeclaredMadeForKids: false,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Upload-Content-Length': stat.size,
        'X-Upload-Content-Type': videoFile.mimetype,
      },
    }
  );

  const uploadUri = initRes.headers.location;
  const buffer = fs.readFileSync(videoFile.path);

  const uploadRes = await axios.put(uploadUri, buffer, {
    headers: {
      'Content-Type': videoFile.mimetype,
      'Content-Length': stat.size,
    },
    maxBodyLength: Infinity,
  });

  return { id: uploadRes.data.id, type: 'video' };
}

module.exports = { postToYoutube };
