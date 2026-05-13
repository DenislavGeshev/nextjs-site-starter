/**
 * Next.js configuration.
 * Docs: https://nextjs.org/docs/app/api-reference/next-config-js
 *
 * IMPORTANT: When asked to change anything here, Claude should consult the
 * Context7 MCP server first to verify the current Next.js API. The config
 * surface evolves between versions.
 *
 * This config also wires up OpenNext for local Cloudflare runtime preview.
 */

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable React strict mode (highly recommended).
  reactStrictMode: true,

  // Image optimization config.
  //
  // IMPORTANT: `unoptimized: true` is DELIBERATE. Do not flip it without
  // reading CLAUDE.md guardrail 3.
  //
  // On Cloudflare Workers via OpenNext, `next/image` routes through
  // `/_next/image`, which calls `env.IMAGES.input(...).transform(...)`. That
  // `IMAGES` binding is backed by Cloudflare Images, a PAID product. If
  // it's not enabled on the account, every <Image> of a remote PNG/JPEG/
  // WebP/AVIF throws Cloudflare 1101 at runtime.
  //
  // Sanity and Payload CDNs already optimize via URL params
  // (`?w=640&h=480&auto=format`), so the Next optimizer is double-work
  // even when it works. Pass size params directly to the CMS image URL.
  //
  // To re-enable Next image optimization:
  //   1. Subscribe to Cloudflare Images on your account
  //   2. Add `"images": { "binding": "IMAGES" }` to wrangler.jsonc
  //   3. Remove `unoptimized: true` below
  //   4. Re-deploy and test a remote image URL before going live
  images: {
    unoptimized: true,
    remotePatterns: [
      // Sanity CDN (uncomment if you connect Sanity)
      // { protocol: 'https', hostname: 'cdn.sanity.io' },
      // Example: your custom R2 domain
      // { protocol: 'https', hostname: 'media.yourdomain.com' },
    ],
  },

  // Compress responses (Cloudflare also does this, but harmless to keep on).
  compress: true,
};

// ===========================================================================
// OpenNext + Cloudflare local development integration
// ===========================================================================
// In development, this lets `next dev` access Cloudflare bindings (KV, R2,
// D1, etc.) defined in wrangler.jsonc. Without this, you can only test
// bindings in the `npm run preview` step (which uses the actual workerd
// runtime).
//
// We only initialize this in development so production `next build` stays
// fast and CI doesn't spin up Miniflare unnecessarily.
if (process.env.NODE_ENV === 'development') {
  // Dynamic import so this code is tree-shaken from production bundles.
  import('@opennextjs/cloudflare')
    .then(({ initOpenNextCloudflareForDev }) => {
      initOpenNextCloudflareForDev();
    })
    .catch((err) => {
      console.warn('OpenNext Cloudflare dev integration failed to load:', err);
    });
}

export default nextConfig;
