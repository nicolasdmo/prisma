import type { MetadataRoute } from 'next';
import { ARCHETYPE_CODES } from '@/data/archetypes';
import { SITE_URL } from '@/lib/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const home: MetadataRoute.Sitemap = [
    { url: SITE_URL,            lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}/test`,  lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
  ];

  const archetypes: MetadataRoute.Sitemap = ARCHETYPE_CODES.map((code) => ({
    url: `${SITE_URL}/r/${code}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...home, ...archetypes];
}
