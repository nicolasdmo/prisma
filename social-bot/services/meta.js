const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

const BASE = 'https://graph.facebook.com/v19.0';

function getCreds(config) {
  const fb = JSON.parse(config.find(c => c.platform === 'meta_facebook')?.credentials || '{}');
  const ig = JSON.parse(config.find(c => c.platform === 'meta_instagram')?.credentials || '{}');
  return { fb, ig };
}

async function postToFacebook(caption, mediaFiles, creds) {
  const token = creds.fb.page_access_token;
  const pageId = creds.fb.page_id;

  if (!token || !pageId) throw new Error('Faltan credenciales de Facebook');

  if (!mediaFiles || mediaFiles.length === 0) {
    const res = await axios.post(`${BASE}/${pageId}/feed`, {
      message: caption,
      access_token: token,
    });
    return { id: res.data.id, type: 'text' };
  }

  const images = mediaFiles.filter(f => f.mimetype.startsWith('image/'));
  const videos = mediaFiles.filter(f => f.mimetype.startsWith('video/'));

  if (videos.length > 0) {
    const filePath = videos[0].path;
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath), path.basename(filePath));
    form.append('description', caption);
    form.append('access_token', token);

    const res = await axios.post(`${BASE}/${pageId}/videos`, form, {
      headers: form.getHeaders(),
      maxBodyLength: Infinity,
    });
    return { id: res.data.id, type: 'video' };
  }

  if (images.length === 1) {
    const form = new FormData();
    form.append('source', fs.createReadStream(images[0].path));
    form.append('message', caption);
    form.append('access_token', token);

    const res = await axios.post(`${BASE}/${pageId}/photos`, form, {
      headers: form.getHeaders(),
    });
    return { id: res.data.id, type: 'photo' };
  }

  // Multi-imagen
  const attachedIds = [];
  for (const img of images) {
    const form = new FormData();
    form.append('source', fs.createReadStream(img.path));
    form.append('published', 'false');
    form.append('access_token', token);

    const r = await axios.post(`${BASE}/${pageId}/photos`, form, {
      headers: form.getHeaders(),
    });
    attachedIds.push({ media_fbid: r.data.id });
  }

  const res = await axios.post(`${BASE}/${pageId}/feed`, {
    message: caption,
    attached_media: attachedIds,
    access_token: token,
  });
  return { id: res.data.id, type: 'multi-photo' };
}

async function postToInstagram(caption, mediaFiles, creds) {
  const token = creds.ig.page_access_token || creds.fb.page_access_token;
  const igUserId = creds.ig.ig_user_id;

  if (!token || !igUserId) throw new Error('Faltan credenciales de Instagram');

  if (!mediaFiles || mediaFiles.length === 0) {
    throw new Error('Instagram requiere al menos una imagen o video');
  }

  const images = mediaFiles.filter(f => f.mimetype.startsWith('image/'));
  const videos = mediaFiles.filter(f => f.mimetype.startsWith('video/'));

  if (videos.length > 0) {
    // Requiere URL pública — se usa con Reels
    if (!videos[0].publicUrl) throw new Error('Se necesita URL pública para videos en Instagram');

    const containerRes = await axios.post(`${BASE}/${igUserId}/media`, {
      video_url: videos[0].publicUrl,
      caption,
      media_type: 'REELS',
      access_token: token,
    });
    const containerId = containerRes.data.id;

    // Esperar procesamiento
    await waitForContainer(containerId, token);

    const publishRes = await axios.post(`${BASE}/${igUserId}/media_publish`, {
      creation_id: containerId,
      access_token: token,
    });
    return { id: publishRes.data.id, type: 'reel' };
  }

  if (images.length === 1) {
    if (!images[0].publicUrl) throw new Error('Se necesita URL pública para imágenes en Instagram');

    const containerRes = await axios.post(`${BASE}/${igUserId}/media`, {
      image_url: images[0].publicUrl,
      caption,
      access_token: token,
    });

    await waitForContainer(containerRes.data.id, token);

    const publishRes = await axios.post(`${BASE}/${igUserId}/media_publish`, {
      creation_id: containerRes.data.id,
      access_token: token,
    });
    return { id: publishRes.data.id, type: 'photo' };
  }

  // Carrusel
  const itemIds = [];
  for (const img of images) {
    if (!img.publicUrl) throw new Error('Se necesita URL pública para carrusel de Instagram');
    const r = await axios.post(`${BASE}/${igUserId}/media`, {
      image_url: img.publicUrl,
      is_carousel_item: true,
      access_token: token,
    });
    itemIds.push(r.data.id);
  }

  const carouselRes = await axios.post(`${BASE}/${igUserId}/media`, {
    media_type: 'CAROUSEL',
    children: itemIds.join(','),
    caption,
    access_token: token,
  });

  await waitForContainer(carouselRes.data.id, token);

  const publishRes = await axios.post(`${BASE}/${igUserId}/media_publish`, {
    creation_id: carouselRes.data.id,
    access_token: token,
  });
  return { id: publishRes.data.id, type: 'carousel' };
}

async function waitForContainer(containerId, token, maxWait = 60000) {
  const start = Date.now();
  while (Date.now() - start < maxWait) {
    const res = await axios.get(`${BASE}/${containerId}`, {
      params: { fields: 'status_code', access_token: token },
    });
    if (res.data.status_code === 'FINISHED') return;
    if (res.data.status_code === 'ERROR') throw new Error('Error procesando media en Instagram');
    await new Promise(r => setTimeout(r, 3000));
  }
  throw new Error('Timeout esperando procesamiento de Instagram');
}

module.exports = { postToFacebook, postToInstagram };
