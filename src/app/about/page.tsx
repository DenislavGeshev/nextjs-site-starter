/**
 * About page.
 *
 * Example of a second page demonstrating:
 * - Per-page metadata override via the Metadata API
 * - BreadcrumbList JSON-LD for SEO breadcrumb display in Google
 * - AnimatedSection for scroll-triggered reveals
 *
 * This is a SERVER component.
 */

import type { Metadata } from 'next';
import AnimatedSection from '@/components/AnimatedSection';
import { SITE, absoluteUrl } from '@/lib/site';
import { breadcrumbSchema } from '@/lib/jsonld';

// Page-specific metadata. The title template from layout.tsx will turn this
// into "About | Site Name" automatically.
export const metadata: Metadata = {
  title: 'About',
  description: `About ${SITE.name}. ${SITE.tagline}`,
  alternates: {
    canonical: absoluteUrl('/about'),
  },
  openGraph: {
    title: 'About',
    description: `About ${SITE.name}. ${SITE.tagline}`,
    url: absoluteUrl('/about'),
  },
};

export default function AboutPage() {
  const breadcrumbs = breadcrumbSchema([
    { name: 'Home', url: SITE.url },
    { name: 'About', url: absoluteUrl('/about') },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <section className="container-page py-20 md:py-28">

        <div className="mx-auto max-w-2xl">

          <AnimatedSection as="h1" className="text-4xl md:text-5xl font-bold text-brand-dark">
            About this starter
          </AnimatedSection>

          <AnimatedSection
            as="p"
            className="mt-6 text-lg text-brand-muted leading-relaxed"
            delay={0.1}
          >
            This is an example second page. Replace this content with your real
            about page. The structure is here for you: a centered prose layout
            with animated text and proper SEO already set up.
          </AnimatedSection>

          <AnimatedSection
            as="p"
            className="mt-4 text-lg text-brand-muted leading-relaxed"
            delay={0.2}
          >
            Try asking Claude Code to update this page. For example:
            "Please rewrite the About page to introduce my company [name]. We do
            [what we do] for [who we serve]. Include a short story about why we
            started, our values, and a call-to-action to contact us."
          </AnimatedSection>

        </div>

      </section>
    </>
  );
}
