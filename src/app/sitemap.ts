/**
 * Sitemap generator. Next.js automatically serves this at /sitemap.xml.
 * Docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 *
 * Add a new entry here whenever you add a new static page. For dynamic routes
 * (like blog posts), fetch slugs from the CMS and generate entries.
 */

import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';
import { getAllPosts } from '@/lib/cms';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE.url,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE.url}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Add more static routes here as you create pages, e.g.:
    // { url: `${SITE.url}/pricing`, ... },
    // { url: `${SITE.url}/contact`, ... },
  ];

  // Dynamic routes (blog posts from CMS)
  const posts = await getAllPosts();
  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE.url}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes];
}
