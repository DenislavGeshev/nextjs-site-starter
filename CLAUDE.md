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
