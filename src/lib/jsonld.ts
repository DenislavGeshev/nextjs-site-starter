/**
 * JSON-LD structured data helpers.
 *
 * Structured data tells search engines what your content IS (not just what
 * it says). Search engines use it to show rich results: star ratings, FAQs,
 * breadcrumbs in search, etc.
 *
 * Each helper returns a properly typed object that you render in a page
 * via:
 *   <script
 *     type="application/ld+json"
 *     dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
 *   />
 *
 * Docs: https://schema.org/ and https://github.com/google/schema-dts
 */

import type {
  Article,
  BreadcrumbList,
  FAQPage,
  Organization,
  WebSite,
  WithContext,
} from 'schema-dts';

import { SITE, absoluteUrl } from './site';

/**
 * Organization schema. Use on the homepage.
 * Tells search engines about your organization.
 */
export function organizationSchema(): WithContext<Organization> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.author,
    url: SITE.url,
    logo: absoluteUrl('/logo.png'),
    description: SITE.description,
    sameAs: Object.values(SITE.social).filter(Boolean) as string[],
  };
}

/**
 * Website schema with sitelinks search box. Use on the homepage.
 * Enables the search box that sometimes appears below your site in Google results.
 */
export function websiteSchema(): WithContext<WebSite> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE.url}/search?q={search_term_string}`,
      },
      // Required by spec; leave as-is
      'query-input': 'required name=search_term_string',
    } as WithContext<WebSite>['potentialAction'],
  };
}

/**
 * Article schema for blog posts.
 * Helps Google show your post in news / discover / top stories.
 */
export function articleSchema(args: {
  title: string;
  description: string;
  image: string; // absolute URL
  datePublished: string; // ISO 8601, e.g. '2024-01-15'
  dateModified?: string;
  authorName: string;
  url: string; // absolute URL of the article
}): WithContext<Article> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: args.title,
    description: args.description,
    image: args.image,
    datePublished: args.datePublished,
    dateModified: args.dateModified ?? args.datePublished,
    author: {
      '@type': 'Person',
      name: args.authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE.author,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/logo.png'),
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': args.url,
    },
  };
}

/**
 * Breadcrumb schema. Use on every non-home page.
 * Shows the breadcrumb trail in Google search results.
 *
 * @example
 *   breadcrumbSchema([
 *     { name: 'Home', url: SITE.url },
 *     { name: 'Blog', url: absoluteUrl('/blog') },
 *     { name: post.title, url: absoluteUrl(`/blog/${post.slug}`) },
 *   ]);
 */
export function breadcrumbSchema(
  items: { name: string; url: string }[]
): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * FAQ schema. Use on pages with question/answer content.
 * Can produce rich FAQ accordion results in Google search.
 */
export function faqSchema(
  items: { question: string; answer: string }[]
): WithContext<FAQPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
