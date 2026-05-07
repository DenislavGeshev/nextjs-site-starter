/**
 * Homepage.
 *
 * Demonstrates the main pieces of the starter:
 * - Default SEO metadata from the root layout (homepage uses defaults)
 * - Hero section with Motion-animated text (client component)
 * - Latest posts pulled from the CMS (server component, fetched on the server)
 * - Accessible FAQ accordion (Radix, client component)
 * - JSON-LD structured data for SEO
 *
 * This is a SERVER component. Data fetching happens on the server. Client
 * components (Hero, FAQ) are imported and rendered as part of the server
 * output, hydrated in the browser only as needed.
 */

import Hero from '@/components/Hero';
import FAQ from '@/components/FAQ';
import AnimatedSection from '@/components/AnimatedSection';
import { getAllPosts } from '@/lib/cms';
import { organizationSchema, websiteSchema, faqSchema } from '@/lib/jsonld';

// FAQ items, edit or replace with your own
const faqItems = [
  {
    question: 'Do I need to know how to code to use this starter?',
    answer:
      'No. The starter is designed to be customized through Claude Code in plain English. The README has suggested prompts to get you going.',
  },
  {
    question: 'Why Next.js with Cloudflare instead of Vercel?',
    answer:
      "Vercel is easier to set up but their free tier prohibits commercial use. Cloudflare Workers' free tier handles 100,000 visits per day with no commercial restrictions, unlimited bandwidth, free SSL, and free custom domains.",
  },
  {
    question: 'Is hosting really free?',
    answer:
      'Cloudflare Workers free tier covers 100,000 visits per day. Most marketing sites stay within this for free indefinitely.',
  },
];

export default async function HomePage() {
  // Fetch the 3 most recent posts at request time (or build time if static).
  // Once you connect a real CMS, this will use Next.js fetch caching.
  const recentPosts = await getAllPosts(3);

  // Combine multiple JSON-LD schemas into a graph for the homepage
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [organizationSchema(), websiteSchema(), faqSchema(faqItems)],
  };

  return (
    <>
      {/* Render JSON-LD for SEO. Search engines parse it; browsers ignore it. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero section */}
      <Hero />

      {/* Recent posts section. Only renders if there are posts. */}
      {recentPosts.length > 0 && (
        <section id="features" className="container-page py-20">
          <AnimatedSection as="h2" className="text-3xl md:text-4xl font-bold text-center text-brand-dark mb-4">
            Latest writing
          </AnimatedSection>

          <AnimatedSection
            as="p"
            className="text-center text-brand-muted mb-12 max-w-xl mx-auto"
            delay={0.1}
          >
            Examples pulled from your CMS. Edit src/lib/cms.ts to wire up a real one.
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentPosts.map((post, index) => (
              <AnimatedSection key={post.slug} delay={0.1 * index}>
                <article className="rounded-lg border border-brand-border bg-white p-6 hover:shadow-md transition-shadow h-full">
                  <time
                    dateTime={post.publishedAt}
                    className="text-xs text-brand-muted uppercase tracking-wide"
                  >
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </time>
                  <h3 className="mt-2 text-xl font-semibold text-brand-dark">
                    <a
                      href={`/blog/${post.slug}`}
                      className="hover:text-brand-primary transition-colors"
                    >
                      {post.title}
                    </a>
                  </h3>
                  <p className="mt-3 text-brand-muted">{post.excerpt}</p>
                </article>
              </AnimatedSection>
            ))}
          </div>
        </section>
      )}

      {/* FAQ section */}
      <FAQ items={faqItems} />
    </>
  );
}
