'use client';

/**
 * Mobile navigation drawer using Radix Dialog.
 *
 * Why Radix Dialog: handles focus trapping (Tab can't escape the modal),
 * Escape-to-close, scroll-locking the page underneath, ARIA attributes,
 * and screen reader announcements. All required for an accessible modal.
 *
 * Why a client component: Dialog needs internal React state to track
 * open/closed and to manage focus trapping.
 *
 * Docs: https://www.radix-ui.com/primitives/docs/components/dialog
 */

import * as Dialog from '@radix-ui/react-dialog';
import Link from 'next/link';

interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

interface Props {
  items: NavItem[];
  siteName: string;
}

export default function MobileNav({ items, siteName }: Props) {
  return (
    <Dialog.Root>

      {/* Hamburger button that opens the drawer */}
      <Dialog.Trigger
        aria-label="Open navigation menu"
        className="flex items-center justify-center w-10 h-10 rounded-md text-brand-dark hover:bg-brand-border/50 transition-colors focus-visible:outline-2 focus-visible:outline focus-visible:outline-brand-primary"
      >
        {/* Hamburger icon (3 horizontal lines) */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </Dialog.Trigger>

      <Dialog.Portal>
        {/* Background overlay that dims the page */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />

        {/* The actual drawer panel */}
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-brand-light p-6 shadow-xl">

          {/* Header row with site name and close button */}
          <div className="flex items-center justify-between mb-8">
            <Dialog.Title className="font-bold text-brand-dark">
              {siteName}
            </Dialog.Title>
            <Dialog.Close
              aria-label="Close navigation menu"
              className="flex items-center justify-center w-10 h-10 rounded-md text-brand-dark hover:bg-brand-border/50 transition-colors focus-visible:outline-2 focus-visible:outline focus-visible:outline-brand-primary"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </Dialog.Close>
          </div>

          {/* Description for screen readers (required by Radix Dialog) */}
          <Dialog.Description className="sr-only">
            Site navigation menu
          </Dialog.Description>

          {/* Nav links */}
          <nav>
            <ul className="list-none m-0 p-0 space-y-1">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block px-4 py-3 rounded-md text-lg font-medium text-brand-dark hover:bg-brand-border/30 transition-colors focus-visible:outline-2 focus-visible:outline focus-visible:outline-brand-primary"
                  >
                    {item.label}
                  </Link>
                  {/* Render child items indented if they exist */}
                  {item.children && (
                    <ul className="list-none m-0 pl-6 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="block px-4 py-2 rounded-md text-sm text-brand-muted hover:text-brand-dark hover:bg-brand-border/30 transition-colors"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
