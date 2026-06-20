const { TwitterApi } = require('twitter-api-v2');
const fs = require('fs');

function getClient(creds) {
  if (!creds.api_key || !creds.api_secret || !creds.access_token || !creds.access_secret) {
    throw new Error('Faltan credenciales de X/Twitter');
  }
  return new TwitterApi({
    appKey: creds.api_key,
    appSecret: creds.api_secret,
    accessToken: creds.access_token,
    accessSecret: creds.access_secret,
  });
}

async function postToTwitter(caption, mediaFiles, creds) {
  const client = getClient(creds);
  const rwClient = client.readWrite;

  const mediaIds = [];

  if (mediaFiles && mediaFiles.length > 0) {
    for (const file of mediaFiles.slice(0, 4)) {
      const buffer = fs.readFileSync(file.path);
      const mediaId = await rwClient.v1.uploadMedia(buffer, { mimeType: file.mimetype });
      mediaIds.push(mediaId);
    }
  }

  const payload = { text: caption };
  if (mediaIds.length > 0) payload.media = { media_ids: mediaIds };

  const res = await rwClient.v2.tweet(payload);
  return { id: res.data.id, type: mediaIds.length > 0 ? 'media' : 'text' };
}

module.exports = { postToTwitter };
