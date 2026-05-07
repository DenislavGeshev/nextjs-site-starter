/**
 * Robots.txt generator. Next.js automatically serves this at /robots.txt.
 * Docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */

import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Add disallow patterns here if you have pages to hide from search:
      // disallow: ['/admin/', '/api/'],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
