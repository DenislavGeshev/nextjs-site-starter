'use client';

/**
 * Hero section.
 *
 * Example of a hero section with staggered Motion animations on entry.
 * Heading, subheading, and CTAs animate in sequence when the component mounts.
 *
 * This is a CLIENT component because Motion needs the browser. If your hero
 * doesn't need animations, you can rewrite it as a server component without
 * the Motion imports.
 */

import Link from 'next/link';
import { motion, type Variants } from 'motion/react';

interface Props {
  heading?: string;
  subheading?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

// Variants are reusable named animation states.
// The parent uses staggerChildren to delay each child by 0.15s.
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export default function Hero({
  heading = 'Build a fast, beautiful marketing site',
  subheading = 'A production-ready starter with everything you need: Next.js, React, Tailwind, Radix UI, Motion, and Cloudflare Workers. Edit this with Claude Code in plain English.',
  primaryCta = { label: 'Read the docs', href: '/about' },
  secondaryCta = { label: 'See features', href: '#features' },
}: Props) {
  return (
    <section className="relative overflow-hidden">

      {/* Subtle background gradient. Adjust or remove as you like. */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse at top, oklch(0.95 0.04 264) 0%, oklch(0.98 0.005 264) 70%)',
        }}
        aria-hidden="true"
      />

      <div className="container-page py-24 md:py-32">

        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-brand-dark"
          >
            {heading}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-6 text-lg md:text-xl text-brand-muted max-w-2xl mx-auto"
          >
            {subheading}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col sm:flex-row gap-3 justify-center items-center"
          >
            <Link
              href={primaryCta.href}
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-brand-primary text-white font-medium transition-colors hover:bg-brand-primary-hover focus-visible:outline-2 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            >
              {primaryCta.label}
            </Link>
            <Link
              href={secondaryCta.href}
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-brand-border text-brand-dark font-medium transition-colors hover:bg-brand-border/30 focus-visible:outline-2 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            >
              {secondaryCta.label}
            </Link>
          </motion.div>

        </motion.div>

      </div>

    </section>
  );
}
