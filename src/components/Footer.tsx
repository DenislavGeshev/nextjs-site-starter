/**
 * Site footer. Renders site name, optional social links, and a copyright line.
 *
 * This is a SERVER component. No client JavaScript needed.
 *
 * Social links come from src/lib/site.ts. Edit there to add or remove.
 */

import { SITE } from '@/lib/site';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Build a list of present social links to render
  const socialLinks = [
    { name: 'Twitter', url: SITE.social.twitter },
    { name: 'GitHub', url: SITE.social.github },
    { name: 'LinkedIn', url: SITE.social.linkedin },
    { name: 'Instagram', url: SITE.social.instagram },
    { name: 'YouTube', url: SITE.social.youtube },
  ].filter((link): link is { name: string; url: string } => Boolean(link.url));

  return (
    <footer className="border-t border-brand-border bg-brand-light mt-20">
      <div className="container-page py-12">

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Site identity */}
          <div className="text-center md:text-left">
            <p className="font-bold text-brand-dark">{SITE.name}</p>
            <p className="text-sm text-brand-muted mt-1">{SITE.tagline}</p>
          </div>

          {/* Social links, only renders if any are configured */}
          {socialLinks.length > 0 && (
            <nav aria-label="Social media links">
              <ul className="flex gap-4 list-none m-0 p-0">
                {socialLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.url}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="text-sm text-brand-muted hover:text-brand-primary transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-brand-border text-center text-xs text-brand-muted">
          © {currentYear} {SITE.author}. All rights reserved.
        </div>

      </div>
    </footer>
  );
}
