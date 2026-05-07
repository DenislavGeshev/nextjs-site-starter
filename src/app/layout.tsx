/**
 * Root layout. Wraps every page in the App Router.
 *
 * Sets the default metadata for all pages (each page can override).
 * Wraps the site in SmoothScroll so Lenis works everywhere.
 *
 * This is a SERVER component. Children are server-rendered by default.
 */

import type { Metadata } from 'next';
import { SITE } from '@/lib/site';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import '@/styles/globals.css';

// ===========================================================================
// Default metadata for the entire site.
// Each page can override these via its own `metadata` export or `generateMetadata`.
// Docs: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
// ===========================================================================
export const metadata: Metadata = {
  // metadataBase is used to resolve relative URLs in og:image, etc.
  metadataBase: new URL(SITE.url),

  // Title template. Pages with a `title` override get "Page | Site Name".
  // The homepage uses `default` (no template applied).
  title: {
    default: SITE.name,
    template: `%s | ${SITE.name}`,
  },

  description: SITE.description,

  // Open Graph defaults (for Facebook, LinkedIn, Slack, Discord, etc.)
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    locale: SITE.locale,
    url: SITE.url,
    title: SITE.name,
    description: SITE.description,
    images: [{ url: SITE.defaultOgImage }],
  },

  // Twitter Card defaults
  twitter: {
    card: 'summary_large_image',
    title: SITE.name,
    description: SITE.description,
    images: [SITE.defaultOgImage],
    ...(SITE.twitterHandle && { creator: `@${SITE.twitterHandle}` }),
  },

  // Tell search engines they can index everything by default
  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={SITE.locale.split('_')[0]}>
      <body>
        {/*
          SmoothScroll wraps the whole site to enable Lenis smooth scrolling.
          It's a client component but it accepts server-rendered children, so
          everything inside still renders on the server by default.
        */}
        <SmoothScroll>
          <Header />

          <main id="main-content">{children}</main>

          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
