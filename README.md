# Marketing Site Starter (Next.js Edition)

A production-ready boilerplate for high-performance, accessible marketing sites built with Next.js. Designed for non-developers using Claude Code.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Radix UI · Motion · Lenis · Cloudflare Workers (via OpenNext)

**Designed for:** Marketing sites, landing pages, blogs, portfolios, and content-driven sites that need to be fast, accessible, and easy to update.

---

## Why this stack?

- **Next.js App Router.** The most popular React framework in the world. Server components by default for performance, with client components only where needed for interactivity.
- **Accessible by default.** Radix UI handles all the tricky accessibility logic (keyboard navigation, screen readers, focus management) for components like dropdowns, modals, accordions, and tabs.
- **Beautiful animations.** Motion (formerly Framer Motion) gives you the kind of smooth, declarative animations that feel native to React. Lenis adds buttery-smooth scrolling.
- **Cheap to run.** Cloudflare Workers' free tier handles 100,000 visits per day with unlimited bandwidth, free SSL, and free custom domains. No commercial restrictions like Vercel's Hobby plan.
- **AI-friendly.** Includes a `CLAUDE.md` file with full project context and live access to Next.js documentation via the Context7 MCP server, so Claude Code generates correct, current code every time.

---

## Quick start (3 commands)

You'll need [Node.js 22+](https://nodejs.org) installed.

```bash
# 1. Clone the repo
git clone https://github.com/YOUR-USERNAME/marketing-site-starter-nextjs.git my-site
cd my-site

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You should see the starter homepage. The page auto-updates as you (or Claude Code) make changes.

---

## What's included

```
my-site/
├── CLAUDE.md                  ← Project context for Claude Code (read first!)
├── README.md                  ← This file
├── next.config.ts             ← Next.js + OpenNext dev config
├── wrangler.jsonc             ← Cloudflare Workers deploy config
├── open-next.config.ts        ← OpenNext adapter config
├── tsconfig.json              ← TypeScript settings (strict mode)
├── package.json               ← Dependencies and scripts
├── postcss.config.mjs         ← PostCSS config (for Tailwind)
├── .env.example               ← Template for your CMS credentials
├── .dev.vars.example          ← Template for Cloudflare runtime env vars
├── public/                    ← Static files served as-is
│   └── favicon.svg
└── src/
    ├── app/
    │   ├── layout.tsx         ← Root layout, default SEO metadata
    │   ├── page.tsx           ← Homepage
    │   ├── about/page.tsx     ← Example second page
    │   ├── not-found.tsx      ← Custom 404 page
    │   ├── sitemap.ts         ← Generates sitemap.xml automatically
    │   └── robots.ts          ← Generates robots.txt automatically
    ├── components/
    │   ├── Header.tsx         ← Top nav (uses Radix Navigation Menu)
    │   ├── MobileNav.tsx      ← Mobile drawer (Radix Dialog)
    │   ├── Footer.tsx         ← Bottom of every page
    │   ├── Hero.tsx           ← Example hero with Motion animation
    │   ├── FAQ.tsx            ← Example accessible FAQ (Radix Accordion)
    │   ├── AnimatedSection.tsx← Reusable Motion scroll-triggered reveal
    │   └── SmoothScroll.tsx   ← Lenis smooth scroll wrapper
    ├── lib/
    │   ├── cms.ts             ← Placeholder for Sanity/Payload client
    │   ├── jsonld.ts          ← Structured data helpers (SEO)
    │   └── site.ts            ← Site metadata (name, URL, social links)
    ├── styles/
    │   └── globals.css        ← Tailwind imports and base styles
    └── types/
        └── env.d.ts           ← TypeScript types for env vars
```

Every file has detailed comments explaining what it does and why.

---

## Next steps

### 1. Customize the basics

Edit `src/lib/site.ts` to set your site name, description, URL, and social links. These propagate to SEO meta tags everywhere.

### 2. Set up Claude Code

If you haven't already:

```bash
npm install -g @anthropic-ai/claude-code
claude
```

Log in. Then connect Claude to live Next.js documentation via the Context7 MCP server (this is critical, it gives Claude up-to-date Next.js knowledge):

```bash
claude mcp add --transport http context7 https://mcp.context7.com/mcp
```

Now you can start prompting. The first prompts to try are listed below.

### 3. Suggested first prompts

Open Claude Code from inside this folder (`claude`) and try these prompts in order. Each one is self-contained and safe to try.

#### Prompt 1: Tour the project

> Please read the CLAUDE.md file first, then give me a brief tour of this project. Tell me what's in each folder, what the main files do, and what I should customize first.

#### Prompt 2: Update the brand basics

> Please update src/lib/site.ts with these details:
> - Site name: [YOUR SITE NAME]
> - Tagline: [YOUR TAGLINE]
> - Description: [ONE SENTENCE DESCRIPTION]
> - URL: [YOUR DOMAIN, e.g. https://example.com]
>
> Also update the favicon at public/favicon.svg if you can suggest a simple replacement based on the brand.

#### Prompt 3: Customize the homepage hero

> Please update the Hero section on the homepage with:
> - Heading: [YOUR HEADLINE]
> - Subheading: [YOUR SUPPORTING TEXT]
> - Primary CTA: "[BUTTON TEXT]" linking to [URL]
> - Secondary CTA: "[BUTTON TEXT]" linking to [URL]
>
> Keep the existing Motion animation but feel free to refine the layout if it would look better.

#### Prompt 4: Add a features section

> Please add a "features" section to the homepage between the Hero and the FAQ. It should have 3 feature cards in a responsive grid. Each card has an icon, a heading, and a 1-2 sentence description. Animate the cards with Motion using whileInView so they fade in and slide up, staggered by 0.15s, when they enter the viewport. Use viewport={{ once: true }} so it only plays once. Use Tailwind for styling and match the visual language of the existing components.

#### Prompt 5: Connect a CMS

> I want to connect [Sanity / Payload] as the CMS. Please walk me through what I need to install, what credentials I need to add to .env (and .dev.vars for Cloudflare), and update src/lib/cms.ts to fetch real content. Then update the homepage to fetch and display 3 latest blog posts from the CMS using server components with appropriate revalidation.

#### Prompt 6: Build from a Figma design

> Please look at this Figma frame and build it as a section on the homepage: [FIGMA-LINK]
>
> Use Tailwind for styling. If any interactive component is needed (dropdown, modal, accordion, tabs, navigation menu, tooltip), use the matching Radix UI primitive for accessibility. Mark with 'use client' only if browser-only APIs are needed. Match the design closely.

#### Prompt 7: Add a Motion scroll animation

> Please add a pin-and-reveal section to the homepage similar to apple.com product pages. As the user scrolls, three steps reveal one by one. Use Motion's useScroll and useTransform hooks to drive the animation from scroll position. Mark the component with 'use client'. Use placeholder content for the three steps that I can edit later.

#### Prompt 8: Audit accessibility

> Please audit the site for accessibility. Check that every interactive element is keyboard-accessible, every image has appropriate alt text, color contrast meets WCAG AA, all forms have labels, semantic HTML is used, and any custom interactive components use Radix UI primitives. Fix what you can; list what needs my decision.

#### Prompt 9: Optimize for performance

> Please run npm run build and audit the output. Check that images use the Next.js <Image> component with proper width/height. Verify client components are only marked 'use client' when they actually need browser APIs (look for components with 'use client' that don't use any hooks or event handlers). Look for large dependencies that could be replaced. Report on bundle size and what could improve.

#### Prompt 10: Test the Cloudflare runtime locally

> I want to make sure the site works in Cloudflare's actual runtime before deploying. Please run npm run preview and tell me if there are any issues. If the build fails or there are errors, fix them. The site should work the same in preview as in dev.

#### Prompt 11: Prepare for launch

> Please prepare this site for launch. Verify that: (1) every page has unique title, description, and Open Graph tags via the Metadata API; (2) sitemap.ts and robots.ts point to the correct production URL from src/lib/site.ts; (3) all environment variables are documented in .env.example and .dev.vars.example; (4) no debug code, console.logs, or placeholder content remains; (5) no 'export const runtime = "edge"' anywhere (incompatible with OpenNext). List anything I need to do manually before going live.

---

## Daily workflow

Once your site is live:

```bash
# Pull any updates from GitHub
git pull

# Start the dev server
npm run dev

# In another terminal, open Claude Code
claude

# Make changes by talking to Claude. Watch your browser update live.

# When happy, save and push
git add .
git commit -m "Describe what changed"
git push

# Cloudflare auto-deploys in about a minute (if connected to GitHub)
# Or run `npm run deploy` to deploy from your terminal
```

---

## Available scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Starts local Next.js dev server at http://localhost:3000 |
| `npm run build` | Builds the production site (Next.js output) |
| `npm run start` | Runs the built Next.js app locally (Node, not Cloudflare) |
| `npm run preview` | Builds with OpenNext and serves it via Wrangler in the actual Cloudflare runtime |
| `npm run deploy` | Builds with OpenNext and deploys directly to Cloudflare Workers |
| `npm run cf-typegen` | Regenerates Cloudflare binding types after editing wrangler.jsonc |
| `npm run lint` | Runs ESLint |

---

## Deploying to Cloudflare Workers

The recommended approach is to connect your GitHub repo in the Cloudflare dashboard for auto-deploy on every push. See **Part 11** of the build guide for step-by-step instructions.

If you'd prefer to deploy from your terminal:

```bash
# One-time: log in
npx wrangler login

# Deploy
npm run deploy
```

---

## Environment variables

There are two env files because of how Next.js and Cloudflare Workers handle them differently:

- **`.env`** is read by the Next.js dev server (`npm run dev`).
- **`.dev.vars`** is read by Wrangler when previewing in the Cloudflare runtime (`npm run preview`).

Keep them in sync. For production, set the same variables in the Cloudflare dashboard under your Worker's Settings then Variables and Secrets.

```bash
cp .env.example .env
cp .dev.vars.example .dev.vars
```

Then edit both files with your real values.

---

## Tech stack details

- **Next.js 15** (App Router) - React-based website framework with server components by default
- **React 19** - The UI library Next.js is built on
- **TypeScript (strict)** - Catches bugs before they ship
- **Tailwind CSS 4** - Utility-first styling
- **Radix UI** - Unstyled, accessible component primitives
- **Motion** - The leading React animation library (formerly Framer Motion)
- **Lenis** - Smooth scroll library
- **@opennextjs/cloudflare** - Adapter that lets Next.js run on Cloudflare Workers
- **schema-dts** - TypeScript types for JSON-LD structured data

---

## Common gotchas

**"motion is not defined" errors:** You're probably importing from the wrong package. The current package is `motion`, NOT `framer-motion`. Imports look like `import { motion } from 'motion/react'`.

**"export const runtime = 'edge'" errors during deploy:** OpenNext requires the Node.js runtime. Search your code and remove any edge runtime exports.

**Env vars work locally but not in Cloudflare preview:** Cloudflare uses `.dev.vars`, not `.env`. Copy your values to both files.

**Build succeeds but deploy fails:** Check `wrangler.jsonc` has `compatibility_date` set to `2025-04-15` or later. Older dates have known runtime issues with OpenNext.

---

## Need help?

1. **Read CLAUDE.md** - it has the full project context
2. **Ask Claude Code** - paste error messages directly, it's great at debugging
3. **Check the build guide** - the companion document walks through everything
4. **Next.js docs** - [nextjs.org/docs](https://nextjs.org/docs) (Claude Code can read these live via the Context7 MCP server)
5. **OpenNext docs** - [opennext.js.org/cloudflare](https://opennext.js.org/cloudflare)

---

## License

MIT. Use it however you like.
