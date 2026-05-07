/**
 * OpenNext Cloudflare adapter configuration.
 * Docs: https://opennext.js.org/cloudflare/get-started
 *
 * This file controls how OpenNext transforms your Next.js build output
 * for Cloudflare Workers. The defaults are sensible for marketing sites.
 *
 * When you need advanced caching (incremental static regeneration with R2,
 * tag-based revalidation with Durable Objects, etc.), this is where you
 * configure it. Examples in the comments below.
 *
 * IMPORTANT: When asked to add R2 caching or advanced features, Claude
 * should consult the OpenNext docs at https://opennext.js.org/cloudflare
 * via Context7 first.
 */

import { defineCloudflareConfig } from '@opennextjs/cloudflare';

export default defineCloudflareConfig({
  // ==========================================================================
  // OPTIONAL: R2 incremental cache
  // ==========================================================================
  // Uncomment if you want Next.js's incremental static regeneration to use
  // an R2 bucket as the cache backend. Required for ISR to work properly
  // across multiple Cloudflare datacenters.
  //
  // Setup:
  //   1. Create an R2 bucket named `next-cache` (or your choice).
  //   2. Add to wrangler.jsonc:
  //      "r2_buckets": [{ "binding": "NEXT_INC_CACHE_R2_BUCKET", "bucket_name": "next-cache" }]
  //   3. Uncomment the import and config below.
  //
  // import r2IncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache';
  // incrementalCache: r2IncrementalCache,
});
