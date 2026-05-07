/**
 * Site-wide metadata.
 *
 * This is the single source of truth for your brand info. Any time the site
 * name, URL, description, or social links need to be referenced, import from
 * here. Editing this file updates the SEO meta tags everywhere automatically.
 */

export const SITE = {
  /** Your site's display name */
  name: 'Marketing Site Starter',

  /** Short tagline shown in some meta tags */
  tagline: 'A production-ready starter for marketing sites',

  /** One-sentence description used as fallback meta description */
  description:
    'A high-performance, accessible marketing site starter built with Next.js, React, Tailwind, Radix UI, Motion, and Cloudflare Workers via OpenNext.',

  /**
   * Production URL. NO trailing slash.
   * Used for canonical URLs, og:url, sitemap, and robots.txt.
   * Update this to your real domain before going live.
   */
  url: 'https://example.com',

  /** Default Open Graph image. Place file in public/. Use absolute path. */
  defaultOgImage: '/og-default.png',

  /** Locale for og:locale and HTML lang attribute */
  locale: 'en_US',

  /** Author / organization name (used in JSON-LD) */
  author: 'Your Company',

  /**
   * Social profile URLs.
   * Used in the Footer and in JSON-LD Organization markup.
   * Leave any of these as undefined to hide them.
   */
  social: {
    twitter: undefined as string | undefined, // e.g. 'https://twitter.com/yourhandle'
    github: undefined as string | undefined,
    linkedin: undefined as string | undefined,
    instagram: undefined as string | undefined,
    youtube: undefined as string | undefined,
  },

  /**
   * Twitter handle (without the @) for Twitter Card meta tags.
   * Optional. Leave undefined if you don't have one.
   */
  twitterHandle: undefined as string | undefined,
};

/**
 * Build a full absolute URL from a path.
 * Use for og:url, canonical, sitemap entries, etc.
 *
 * @example
 *   absoluteUrl('/about')        // => 'https://example.com/about'
 *   absoluteUrl('/about/')       // => 'https://example.com/about'
 *   absoluteUrl('/og-image.png') // => 'https://example.com/og-image.png'
 */
export function absoluteUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const trimmedPath = cleanPath.endsWith('/') && cleanPath !== '/'
    ? cleanPath.slice(0, -1)
    : cleanPath;
  return `${SITE.url}${trimmedPath === '/' ? '' : trimmedPath}`;
}
