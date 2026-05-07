/**
 * CMS client placeholder.
 *
 * This file is the single point of contact between your site and your CMS.
 * Replace the body of these functions with real fetches once you've connected
 * Sanity or Payload (see Part 5 and Part 10 of the build guide).
 *
 * The interface (function signatures) should stay the same regardless of CMS
 * choice. That way, swapping CMSs later only requires changes to this file.
 *
 * To get Claude Code to wire this up:
 *   "Please update src/lib/cms.ts to fetch from [Sanity / Payload]. Use the
 *   credentials in .env. Keep the function signatures the same. Use Next.js
 *   fetch caching with appropriate revalidation periods (1 hour for lists,
 *   1 day for individual posts)."
 */

// ============================================================================
// TYPES, what your content looks like
// ============================================================================

/** A blog post. Keep this shape in sync with your CMS schema. */
export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  authorName: string;
  publishedAt: string; // ISO 8601 date
  body: string; // raw or HTML
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
  };
}

/** A standalone page (about, pricing, etc.) */
export interface Page {
  slug: string;
  title: string;
  hero?: {
    heading: string;
    subheading?: string;
    image?: string;
  };
  sections?: unknown[]; // shape depends on your block types
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
  };
}

/** A content author */
export interface Author {
  slug: string;
  name: string;
  bio?: string;
  photo?: string;
}

// ============================================================================
// PLACEHOLDER DATA, used when no CMS is connected yet
// ============================================================================

const PLACEHOLDER_POSTS: Post[] = [
  {
    slug: 'welcome',
    title: 'Welcome to your new site',
    excerpt:
      'This is placeholder content. Replace it by connecting your CMS and updating src/lib/cms.ts.',
    coverImage: '/og-default.png',
    authorName: 'You',
    publishedAt: '2024-01-15',
    body: 'Replace this with real content from your CMS.',
  },
  {
    slug: 'second-post',
    title: 'A second example post',
    excerpt: 'More placeholder content. Three posts in total to show how the layout looks.',
    coverImage: '/og-default.png',
    authorName: 'You',
    publishedAt: '2024-01-20',
    body: 'Replace this with real content from your CMS.',
  },
  {
    slug: 'third-post',
    title: 'A third example post',
    excerpt: 'You can have as many posts as you like once your CMS is connected.',
    coverImage: '/og-default.png',
    authorName: 'You',
    publishedAt: '2024-01-25',
    body: 'Replace this with real content from your CMS.',
  },
];

// ============================================================================
// FETCH FUNCTIONS, use these from your pages
// ============================================================================

/**
 * Get all blog posts, sorted by date (newest first).
 *
 * @param limit Optional maximum number to return
 */
export async function getAllPosts(limit?: number): Promise<Post[]> {
  // TODO: Replace with real CMS fetch.
  //
  // Example for Sanity (using next-sanity):
  //   import { client } from '@/sanity/client';
  //   return client.fetch(
  //     `*[_type == "post"] | order(publishedAt desc) [0...$limit] { ... }`,
  //     { limit: limit ?? 100 },
  //     { next: { revalidate: 3600 } } // revalidate hourly
  //   );
  //
  // Example for Payload:
  //   const res = await fetch(
  //     `${process.env.PAYLOAD_API_URL}/api/posts?limit=${limit ?? 100}&sort=-publishedAt`,
  //     { next: { revalidate: 3600 } }
  //   );
  //   const data = await res.json();
  //   return data.docs;

  const sorted = [...PLACEHOLDER_POSTS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  return limit ? sorted.slice(0, limit) : sorted;
}

/**
 * Get a single post by its slug.
 * Returns null if not found.
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  // TODO: Replace with real CMS fetch.
  return PLACEHOLDER_POSTS.find((p) => p.slug === slug) ?? null;
}

/**
 * Get a page by its slug.
 * Returns null if not found.
 */
export async function getPageBySlug(slug: string): Promise<Page | null> {
  // TODO: Replace with real CMS fetch.
  return null;
}

/**
 * Get all authors.
 */
export async function getAllAuthors(): Promise<Author[]> {
  // TODO: Replace with real CMS fetch.
  return [];
}

/**
 * Get all post slugs. Used by sitemap.ts and generateStaticParams.
 */
export async function getAllPostSlugs(): Promise<string[]> {
  const posts = await getAllPosts();
  return posts.map((p) => p.slug);
}
