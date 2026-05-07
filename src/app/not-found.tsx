/**
 * Custom 404 page.
 * Next.js automatically uses this for any route that doesn't exist.
 * Docs: https://nextjs.org/docs/app/api-reference/file-conventions/not-found
 */

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page not found',
  description: "The page you're looking for doesn't exist.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <section className="container-page py-32 text-center">

      <p className="text-7xl font-bold text-brand-primary">404</p>

      <h1 className="mt-4 text-3xl md:text-4xl font-bold text-brand-dark">
        Page not found
      </h1>

      <p className="mt-4 text-brand-muted max-w-md mx-auto">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center px-6 py-3 rounded-lg bg-brand-primary text-white font-medium transition-colors hover:bg-brand-primary-hover focus-visible:outline-2 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
      >
        Back to homepage
      </Link>

    </section>
  );
}
