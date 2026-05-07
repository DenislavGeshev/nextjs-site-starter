/**
 * TypeScript types for environment variables.
 *
 * After adding a new env var, add it here so TypeScript autocompletes it
 * and catches typos. Then add the actual value to:
 *   - .env (read by `npm run dev`)
 *   - .dev.vars (read by `npm run preview`)
 *   - Cloudflare dashboard (production)
 */

declare namespace NodeJS {
  interface ProcessEnv {
    // ===== CMS =====
    // Sanity (used if CMS is Sanity)
    SANITY_PROJECT_ID?: string;
    SANITY_DATASET?: string;
    SANITY_API_VERSION?: string;
    SANITY_TOKEN?: string;

    // Payload (used if CMS is Payload)
    PAYLOAD_API_URL?: string;
    PAYLOAD_API_KEY?: string;

    // ===== R2 (optional, for media CDN) =====
    R2_PUBLIC_URL?: string;

    // ===== Analytics / Monitoring (optional) =====
    NEXT_PUBLIC_PLAUSIBLE_DOMAIN?: string;
    SENTRY_DSN?: string;
  }
}

export {};
