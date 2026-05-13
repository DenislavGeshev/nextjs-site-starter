# Claude Code Project Context

This file is read automatically by Claude Code at the start of every session. It tells Claude the rules of this project. Keep it accurate.

---

## Project type

A marketing website built with Next.js 15 App Router. Optimized for performance, SEO, and accessibility. Content is fetched from a CMS (Sanity or Payload, depending on setup). Deployed to Cloudflare Workers via OpenNext.

## Tech stack

- **Next.js 15** with the App Router (file-based routing in `src/app/`)
- **React 19** with **TypeScript strict mode**
- **Tailwind CSS 4** for all styling
- **Radix UI** for all interactive UI primitives (dropdowns, modals, accordions, tabs, navigation menus, tooltips)
- **Motion** (the new package, NOT `framer-motion`) for animations. Imports look like `import { motion } from 'motion/react'`
- **Lenis** for smooth scrolling
- **@opennextjs/cloudflare** adapter for deploying to **Cloudflare Workers**
- **Wrangler** for Cloudflare CLI operations
- CMS is either **Sanity** (via `next-sanity`) or **Payload** (REST API). Check `src/lib/cms.ts` to see which.

---

## CRITICAL: Use the Context7 MCP server

The Context7 MCP server is configured in this environment. **ALWAYS** consult it before generating Next.js-specific code. Next.js APIs evolve quickly and your training data may be out of date. Context7 gives you real-time access to current documentation.

When the user asks you to do something Next.js-related, your first action is to query Context7 to verify the current best practice. Examples of when to use it:

- Anything in the App Router (layouts, pages, route handlers, middleware)
- Server vs client components and the `'use client'` directive
- The Metadata API (page-level `metadata` exports, `generateMetadata`)
- Data fetching patterns (caching, revalidation, `fetch` config)
- Image optimization with `next/image`
- The sitemap.ts and robots.ts conventions
- Server actions
- Anything in `next.config.ts`

If you're unsure whether an API has changed, check the docs first. It costs almost nothing and prevents bad code.

---

## CRITICAL: Cloudflare Workers compatibility

This site deploys to Cloudflare Workers via OpenNext, NOT to Vercel. There are specific things that DO NOT WORK on Cloudflare and must never be added to the codebase:

- **NEVER use `export const runtime = 'edge'`** anywhere. OpenNext requires the Node.js runtime. The Edge runtime is not supported.
- **NEVER use Vercel-specific APIs** (`@vercel/*` packages, Vercel KV/Postgres/Blob).
- **Be careful with Node.js APIs.** Most work via the `nodejs_compat` flag, but some don't. If you need a specific Node API, check OpenNext's compatibility matrix.
- **Environment variables come from `.dev.vars`** when running `npm run preview` (Cloudflare runtime), and from `.env` when running `npm run dev` (Next.js dev server). Keep both in sync.
- **Use `getCloudflareContext()` from `@opennextjs/cloudflare`** to access Cloudflare bindings (KV, R2, D1, etc.) in server code.

---

## CRITICAL: Cloudflare + Next.js guardrails (post-mortem rules)

These rules exist because of two production failures we already paid for. Treat them as hard constraints unless the user explicitly opts out.

### 1. Never use `'placeholder'` (or any fake value) as a Sanity fallback

`NEXT_PUBLIC_*` env vars are inlined into the JS bundle at build time. They are public by definition (projectId, dataset, apiVersion). When wiring up `lib/sanity.ts` or any CMS client, the fallback in `createClient({ projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '...' })` MUST be the real projectId, not a placeholder string.

**Why:** A `'placeholder'` fallback turns a missing CI Build variable into a silent SSG → Dynamic regression. `generateStaticParams()` queries fail (caught by try/catch → return `[]`), dynamic routes ship as `ƒ Dynamic` instead of `● SSG`, every request hits the Worker, and the site melts under traffic with Cloudflare 1102 errors. A real fallback projectId means a missing Build var produces a working site, not a silent regression.

**How to apply:** Whenever wiring up `createClient` for Sanity or a similar CMS, hardcode the actual public values as fallbacks. Yes, even though they may feel like "secrets" — they are not secrets, they end up in the client bundle.

### 2. Never short-circuit fetch helpers on missing env vars

Do NOT add patterns like `if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return []` inside `sanityFetch` or equivalents. With a real fallback projectId in `createClient` (rule 1), this guard silently hides build-time data and produces an empty site instead of an error.

**Why:** Same root cause as rule 1 — silent build-time failures are worse than loud ones. If you genuinely cannot reach the CMS, let it throw so the build fails visibly.

**How to apply:** If you see this pattern, delete it. If a user asks you to add it, explain rules 1 and 2.

### 3. Don't enable `next/image` optimization unless Cloudflare Images is paid for on this account

`next/image` routes through `/_next/image` which OpenNext implements via the `env.IMAGES` binding — a paid Cloudflare Images product. If the binding isn't backed by the paid service, every `<Image>` of a remote PNG/JPEG/WebP/AVIF throws Cloudflare 1101 at runtime.

**How to apply:**
- Keep `images.unoptimized: true` in `next.config.ts`.
- Do NOT add `"images": { "binding": "IMAGES" }` to `wrangler.jsonc`.
- Sanity / Payload CDNs already optimize via URL params (`?w=&h=&auto=format`); routing through `/_next/image` is double-work even when it works.
- To re-enable optimization, the user must subscribe to Cloudflare Images first, then explicitly ask for the three-step re-enable (binding + remove `unoptimized` + verify).

### 4. Root layout fetches are CPU-expensive on every render

If nav/header/footer data comes from the CMS in `src/app/layout.tsx`, it runs on every page render. Cache aggressively (`revalidate: 3600+`) and prefer a single combined query over many small ones. Without R2 incremental cache, OpenNext's cache is per-isolate in-memory — every cold start re-fetches and a traffic spike multiplies CMS load.

**How to apply:** When adding CMS data to the root layout, use long revalidation windows. If the project grows to handle real traffic, suggest adding an R2 incremental cache bucket (`NEXT_INC_CACHE_R2_BUCKET` in `wrangler.jsonc` + `r2IncrementalCache` in `open-next.config.ts`).

### 5. SSG → Dynamic regressions are a leading indicator of broken Build env

When `next build` summary shows routes flipping from `●` (SSG) to `ƒ` (Dynamic) between builds, STOP and find out why. The CI build summary table is the single best signal that Build-time env vars are missing or that `generateStaticParams` is returning `[]`. Compare against the local `next build` output.

**How to apply:** After any change that touches data fetching, env vars, or `generateStaticParams`, run `npm run build` and inspect the route table. SSG routes silently turning Dynamic is the failure mode that causes Cloudflare 1102 under traffic.

### 6. Build vs Runtime env vars are separate stores in Cloudflare

Cloudflare Workers Builds has two independent env stores:
- **Build variables and secrets** — available during `npx opennextjs-cloudflare build`
- **Runtime variables and secrets** — available to the deployed Worker

`NEXT_PUBLIC_*` vars are inlined at build time and MUST be in the Build store (and usually also Runtime for consistency). Server-only secrets (`SANITY_API_TOKEN`, `SANITY_WEBHOOK_SECRET`) belong in Runtime only.

**How to apply:** When walking the user through Cloudflare dashboard setup, always specify which store each variable goes in. See the README "Cloudflare deployment — required environment setup" section for the canonical table.

---

## Project conventions

### Server vs client components

Default to **server components**. Only mark a file with `'use client'` at the top when the component truly needs browser-only APIs:

- React hooks (`useState`, `useEffect`, `useRef`, etc.)
- Event handlers (`onClick`, `onChange`, etc.)
- Browser APIs (`window`, `document`, `localStorage`)
- Animation libraries that hook into the DOM (Motion, Lenis)

Server components are faster, ship less JS, and are SEO-friendly. Don't reach for `'use client'` reflexively.

### Component patterns

- **Atomic, single-purpose files.** A component file should contain one component.
- **Co-locate related styles, types, and helpers** with the component when not reused.
- **Move shared logic to `src/lib/`** when used in 2+ places.
- **Move shared types to `src/types/`** when used in 2+ files.
- **Use PascalCase for component filenames** (`Hero.tsx`, `AnimatedSection.tsx`).
- **Match the export name to the filename.**

### Styling

- Use **Tailwind utility classes** for everything. No custom CSS files unless absolutely necessary.
- Brand tokens (colors, spacing, fonts) live in `src/styles/globals.css` as CSS custom properties inside `@theme`. Use the named tokens (`bg-brand-primary`, `text-brand-muted`) rather than raw hex codes.
- For dynamic class names built from variables, use the full string (Tailwind can't see partial classes).
- Mobile-first: write base classes for mobile, then add `sm:`, `md:`, `lg:` for larger screens.

### Accessibility (non-negotiable)

- Use **semantic HTML** (`<nav>`, `<main>`, `<section>`, `<article>`, `<button>`, `<a>` correctly).
- **Every interactive UI primitive** that has a Radix equivalent MUST use Radix. This includes: Dialog, Dropdown Menu, Navigation Menu, Accordion, Tabs, Tooltip, Popover, Hover Card, Select, Switch, Checkbox, Radio Group, Slider, Toast, Toggle, Toolbar.
- **Never write your own accessibility logic** for these patterns. Radix is battle-tested.
- Every meaningful image has descriptive alt text. Decorative images use `alt=""`.
- Every form input has a properly associated `<label>`.
- Color contrast meets WCAG AA (4.5:1 for body text, 3:1 for large text).
- Focus indicators are always visible. Don't remove the focus outline without replacing it with something equally visible.

### SEO

- Use the **Next.js Metadata API**. Every page exports a `metadata` object (or `generateMetadata` function for dynamic routes) with at minimum: `title`, `description`, `openGraph`, and `alternates.canonical`.
- The root layout (`src/app/layout.tsx`) sets defaults; pages override.
- `src/app/sitemap.ts` and `src/app/robots.ts` are Next.js conventions that auto-generate `/sitemap.xml` and `/robots.txt`. Keep these updated when adding new routes.
- Add JSON-LD structured data where appropriate (Organization, Article, BreadcrumbList, FAQPage). Helpers are in `src/lib/jsonld.ts`. Render via `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />`.
- Use absolute URLs for `og:image` and canonical URLs (use `SITE.url` from `src/lib/site.ts`).

### Images

- ALWAYS use Next.js's `<Image>` from `next/image` for project images. Never use raw `<img>` tags.
- Specify `width` and `height` (Next.js requires these to prevent layout shift) OR use `fill` with a sized parent.
- Use `priority` only on above-the-fold critical images (LCP candidates). Default lazy loading is correct for everything else.
- Provide descriptive `alt` text for every image.
- For images from a CMS (remote URLs), add the domain to `next.config.ts` `images.remotePatterns`.
- **This project ships with `images.unoptimized: true` by design** (see guardrail 3 above). Don't change that unless Cloudflare Images is paid for. For Sanity / Payload images, pass `?w=&h=&auto=format` URL params to get optimized variants from the CMS CDN.

### Animations with Motion

- Use **Motion** (imports from `motion/react`). Never install `framer-motion` (it's the legacy name).
- For scroll-triggered animations, use `whileInView` with `viewport={{ once: true }}` to play once.
- For staggered animations, use a parent with variants and `transition: { staggerChildren: 0.1 }`.
- For scroll-driven animations (parallax, scrubbed timelines), use `useScroll` and `useTransform` hooks.
- For gestures, use `whileHover`, `whileTap`, and `drag` props.
- For layout changes, use the `layout` prop.
- Animation components MUST be client components (`'use client'`).
- **Only animate `transform` (x, y, scale, rotate) and `opacity`** for performance. Avoid animating `width`, `height`, `top`, `left`, `margin` - they trigger expensive layout recalculation.

### CMS data fetching

- Fetch data in server components (the default). Don't fetch in client components if you can help it.
- Use Next.js's `fetch` with `next.revalidate` for time-based revalidation. Examples:
  - Lists: `{ next: { revalidate: 3600 } }` (1 hour)
  - Individual posts: `{ next: { revalidate: 86400 } }` (1 day)
  - Use `{ cache: 'no-store' }` only for genuinely real-time data.
- Type all CMS responses. Add types to `src/types/` if used across files.
- For dynamic routes, use `generateStaticParams` to pre-render at build time when possible.

---

## What NOT to do

- ❌ Don't use `export const runtime = 'edge'` (OpenNext requires Node.js runtime)
- ❌ Don't install `framer-motion` (use the new `motion` package instead)
- ❌ Don't use `'use client'` on components that don't need browser APIs
- ❌ Don't write custom dropdown/modal/tab logic when Radix UI exists
- ❌ Don't use raw `<img>` tags (use `next/image`)
- ❌ Don't animate `width`, `height`, `top`, `left`, `margin` (use `transform`)
- ❌ Don't add `console.log` statements in committed code
- ❌ Don't skip `alt` text on images
- ❌ Don't remove focus indicators without replacement
- ❌ Don't add custom CSS files when Tailwind utilities would work
- ❌ Don't fetch data inside client components when a server component could do it
- ❌ Don't commit `.env` or `.dev.vars` files (both are in `.gitignore`)
- ❌ Don't use deprecated Next.js APIs (always check Context7 first)
- ❌ Don't use Vercel-specific packages or APIs
- ❌ Don't use `'placeholder'` (or any fake value) as a Sanity/CMS env fallback — see guardrail 1
- ❌ Don't add `if (!process.env.X) return []` guards to CMS fetch helpers — see guardrail 2
- ❌ Don't set `images.unoptimized: false` or add `"images": { "binding": "IMAGES" }` to `wrangler.jsonc` unless Cloudflare Images is paid for — see guardrail 3
- ❌ Don't add CMS fetches to `src/app/layout.tsx` without long revalidation — see guardrail 4

---

## Commit conventions

When the user asks you to make commits, use clear, descriptive messages in the imperative mood:

- ✅ "Add features section to homepage"
- ✅ "Fix mobile nav z-index issue"
- ✅ "Update CMS schema to include author bio"
- ❌ "Updates"
- ❌ "Fixed stuff"
- ❌ "WIP"

---

## When you're unsure

Ask the user. Don't guess. Especially when:

- A design choice could go multiple ways
- A new dependency might be needed
- The change affects pricing or external services
- The change touches the deployment pipeline or environment

For technical questions about Next.js itself, use the Context7 MCP server before asking the user.

---

## How the user works

The user is non-technical. They will:

- Describe what they want in plain English
- Reference URLs and Figma designs as inspiration
- Sometimes paste error messages without context

You should:

- Explain what you're about to do before doing it (in 1-2 sentences)
- Use plain language in any explanations (no jargon without defining it)
- Run commands yourself when safe (don't make them copy-paste unless necessary)
- Test your work by running `npm run dev` or `npm run build` when relevant
- For Cloudflare-specific changes, also test with `npm run preview`
- Report back briefly when done, with a summary of what changed
