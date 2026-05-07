'use client';

/**
 * Desktop navigation menu using Radix Navigation Menu.
 *
 * Why Radix: building an accessible nav with dropdowns is genuinely hard.
 * Radix handles keyboard navigation (arrow keys, Escape to close, Tab order),
 * proper ARIA attributes, focus management, and screen reader announcements
 * out of the box. Don't roll your own.
 *
 * Why a client component: Radix Navigation Menu uses internal React state
 * to track open/closed dropdowns, hover delays, and focus, all browser-side.
 *
 * Docs: https://www.radix-ui.com/primitives/docs/components/navigation-menu
 */

import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import Link from 'next/link';

interface NavItem {
  label: string;
  href: string;
  /** Optional dropdown items. If present, this becomes a dropdown trigger. */
  children?: { label: string; href: string; description?: string }[];
}

interface Props {
  items: NavItem[];
}

export default function NavMenu({ items }: Props) {
  return (
    <NavigationMenu.Root className="relative">
      <NavigationMenu.List className="flex gap-1 list-none m-0 p-0">

        {items.map((item) => (
          <NavigationMenu.Item key={item.href}>

            {item.children ? (
              // Dropdown menu (item with children)
              <>
                <NavigationMenu.Trigger
                  className="px-3 py-2 text-sm font-medium text-brand-dark hover:text-brand-primary transition-colors rounded-md focus-visible:outline-2 focus-visible:outline focus-visible:outline-brand-primary"
                >
                  {item.label}
                  <span aria-hidden className="ml-1 text-xs">▾</span>
                </NavigationMenu.Trigger>

                <NavigationMenu.Content className="absolute top-full left-0 mt-2 w-64 rounded-lg border border-brand-border bg-white p-2 shadow-lg">
                  <ul className="list-none m-0 p-0 space-y-1">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <NavigationMenu.Link asChild>
                          <Link
                            href={child.href}
                            className="block px-3 py-2 rounded-md text-sm text-brand-dark hover:bg-brand-light"
                          >
                            <div className="font-medium">{child.label}</div>
                            {child.description && (
                              <div className="text-xs text-brand-muted mt-0.5">
                                {child.description}
                              </div>
                            )}
                          </Link>
                        </NavigationMenu.Link>
                      </li>
                    ))}
                  </ul>
                </NavigationMenu.Content>
              </>
            ) : (
              // Plain link (item without children)
              <NavigationMenu.Link asChild>
                <Link
                  href={item.href}
                  className="block px-3 py-2 text-sm font-medium text-brand-dark hover:text-brand-primary transition-colors rounded-md focus-visible:outline-2 focus-visible:outline focus-visible:outline-brand-primary"
                >
                  {item.label}
                </Link>
              </NavigationMenu.Link>
            )}

          </NavigationMenu.Item>
        ))}

      </NavigationMenu.List>

      {/*
        The viewport is where dropdown content actually renders.
        Radix positions it automatically.
      */}
      <NavigationMenu.Viewport className="absolute top-full left-0" />
    </NavigationMenu.Root>
  );
}
