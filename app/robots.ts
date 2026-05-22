import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // API routes and the post-payment funnel (incl. token-gated reports)
      disallow: ['/api/', '/reporte/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
