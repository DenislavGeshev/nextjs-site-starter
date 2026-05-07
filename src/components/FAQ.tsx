'use client';

/**
 * FAQ section using Radix Accordion.
 *
 * Why Radix Accordion: handles keyboard navigation (arrow keys, Home, End,
 * Enter/Space to toggle), proper ARIA attributes (aria-expanded, aria-controls),
 * and screen reader announcements.
 *
 * Why a client component: Radix Accordion uses internal React state to track
 * which items are open.
 *
 * For SEO, also generate FAQ JSON-LD (see src/lib/jsonld.ts:faqSchema) and
 * render it on the page that uses this component. Can produce rich FAQ
 * accordion results in Google search.
 *
 * Docs: https://www.radix-ui.com/primitives/docs/components/accordion
 */

import * as Accordion from '@radix-ui/react-accordion';

interface FAQItem {
  question: string;
  answer: string;
}

interface Props {
  items: FAQItem[];
  /** Optional heading shown above the FAQ */
  heading?: string;
}

export default function FAQ({ items, heading = 'Frequently asked questions' }: Props) {
  return (
    <section className="container-page py-20">

      <h2 className="text-3xl md:text-4xl font-bold text-center text-brand-dark mb-12">
        {heading}
      </h2>

      <div className="mx-auto max-w-2xl">

        <Accordion.Root
          type="single"
          collapsible
          className="space-y-3"
          // 'single' = only one item open at a time; 'multiple' = several can be open
          // collapsible = clicking an open item closes it
        >
          {items.map((item, index) => (
            <Accordion.Item
              key={index}
              value={`item-${index}`}
              className="rounded-lg border border-brand-border bg-white overflow-hidden"
            >
              <Accordion.Header asChild>
                <h3 className="m-0">
                  <Accordion.Trigger
                    className="flex items-center justify-between w-full px-6 py-4 text-left font-medium text-brand-dark hover:bg-brand-light transition-colors focus-visible:outline-2 focus-visible:outline focus-visible:outline-brand-primary [&[data-state=open]>svg]:rotate-180"
                  >
                    <span>{item.question}</span>

                    {/* Chevron icon, rotates 180deg when expanded */}
                    <svg
                      className="w-5 h-5 text-brand-muted transition-transform duration-200"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden
                    >
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Accordion.Trigger>
                </h3>
              </Accordion.Header>

              <Accordion.Content>
                <div className="px-6 pb-4 text-brand-muted">
                  {item.answer}
                </div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>

      </div>

    </section>
  );
}
