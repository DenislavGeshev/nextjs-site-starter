/**
 * Site header. Renders the logo and main navigation.
 *
 * This is a SERVER component. It renders to HTML on the server. The interactive
 * nav menus (NavMenu and MobileNav) are client components imported below.
 *
 * Single source of truth for nav links is the navItems array. Edit there to
 * update both desktop and mobile nav.
 */

import Link from 'next/link';
import Image from 'next/image';
import { SITE } from '@/lib/site';
import NavMenu from './NavMenu';
import MobileNav from './MobileNav';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  // Add more here as you create pages:
  // { label: 'Pricing', href: '/pricing' },
  // { label: 'Blog', href: '/blog' },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-border bg-brand-light/80 backdrop-blur-sm">
      <div className="container-page flex h-16 items-center justify-between">

        {/* Logo / site name. Replace SVG with your real logo. */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-brand-dark transition-opacity hover:opacity-80"
          aria-label={`${SITE.name} home`}
        >
          <Image src="/favicon.svg" alt="" width={28} height={28} priority />
          <span>{SITE.name}</span>
        </Link>

        {/* Desktop nav, hidden on mobile */}
        <div className="hidden md:block">
          <NavMenu items={navItems} />
        </div>

        {/* Mobile nav trigger, hidden on desktop */}
        <div className="md:hidden">
          <MobileNav items={navItems} siteName={SITE.name} />
        </div>

      </div>
    </header>
  );
}
