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
 *   1 day for individual posts). Follow the Cloudflare guardrails in
 *   CLAUDE.md — real env fallbacks, no short-circuit guards."
 *
 * ============================================================================
 * ⚠️  CLOUDFLARE GUARDRAILS — READ BEFORE WIRING UP SANITY
 * ============================================================================
 *
 * Two production failures (Cloudflare 1102 / 1101) trace back to the same
 * three patterns. When you (or Claude) replace this file with real code,
 * the wiring MUST follow these rules. See CLAUDE.md "guardrails" for the
 * full reasoning.
 *
 * 1. REAL FALLBACKS, NEVER 'placeholder'.
 *
 *    // ✅ CORRECT (e.g. in src/lib/sanity.ts):
 *    export const client = createClient({
 *      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'YOUR_REAL_PROJECT_ID',
 *      dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET   ?? 'production',
 *      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2025-01-01',
 *      useCdn: true,
 *    });
 *
 *    // ❌ WRONG — a missing Build env var silently produces an empty site:
 *    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'placeholder',
 *
 *    NEXT_PUBLIC_* vars are inlined into the client bundle at build time.
 *    They are public — projectId, dataset, apiVersion are NOT secrets. A
 *    placeholder fallback turns a missing CI Build var into a silent
 *    SSG → Dynamic regression that surfaces as Cloudflare 1102 under
 *    traffic, not as a build error.
 *
 * 2. NO SHORT-CIRCUIT GUARDS in fetch helpers.
 *
 *    // ❌ WRONG — hides build-time data when env is missing:
 *    export async function sanityFetch<T>(query: string): Promise<T[]> {
 *      if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [] as T[];
 *      return client.fetch(query);
 *    }
 *
 *    With real fallbacks in rule 1, this guard is a footgun. If you genuinely
 *    can't reach the CMS, let the fetch throw so the build fails loudly.
 *
 * 3. ROOT LAYOUT FETCHES RUN ON EVERY RENDER.
 *
 *    If header/footer/nav data comes from the CMS in src/app/layout.tsx,
 *    cache aggressively (`{ next: { revalidate: 3600 } }` minimum) and
 *    prefer a single combined query over many small ones. Without R2
 *    incremental cache, OpenNext's cache is per-isolate — every cold
 *    start re-fetches.
 *
 * 4. AFTER WIRING UP, RUN `npm run build` AND CHECK THE ROUTE TABLE.
 *
 *    Dynamic routes (/blog/[slug], etc.) should show as `●` (SSG) — NOT
 *    `ƒ` (Dynamic). A flip from ● to ƒ between builds is the leading
 *    indicator of broken Build env vars or generateStaticParams returning
 *    [].
 * ============================================================================
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
  // TODO: Replace with real CMS fetch. Follow the guardrails in the file
  // header — no 'placeholder' fallbacks, no short-circuit guards.
  //
  // Example for Sanity (using next-sanity):
  //   import { client } from '@/lib/sanity';
  //   return client.fetch(
  //     `*[_type == "post"] | order(publishedAt desc) [0...$limit] { ... }`,
  //     { limit: limit ?? 100 },
  //     { next: { revalidate: 3600 } } // revalidate hourly
  //   );
  //   // NOTE: do NOT guard this with `if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];`
  //   // The createClient fallback should already point at the real project.
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
