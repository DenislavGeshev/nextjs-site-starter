'use client';

/**
 * AnimatedSection
 *
 * A reusable wrapper that fades in and slides up when scrolled into view.
 * Built with Motion (formerly Framer Motion). The simplest way to add
 * elegant scroll-triggered animations to any element.
 *
 * Why a client component: Motion runs in the browser. The 'use client'
 * directive tells Next.js to send this to the browser.
 *
 * Usage in a page or component:
 *   <AnimatedSection delay={0.2}>
 *     <h2 className="text-4xl font-bold">My heading</h2>
 *   </AnimatedSection>
 *
 * Or with a different element type:
 *   <AnimatedSection as="header" className="text-center">
 *     ...
 *   </AnimatedSection>
 */

import { motion, type Variants } from 'motion/react';
import type { ReactNode, ElementType } from 'react';

interface Props {
  /** Content to animate */
  children: ReactNode;
  /** HTML element to render. Defaults to a div. */
  as?: ElementType;
  /** Tailwind / CSS classes */
  className?: string;
  /** Delay before animation starts (in seconds). Useful for staggering. */
  delay?: number;
  /** Animation duration in seconds. Default 0.6. */
  duration?: number;
  /** How far the element slides up from (in pixels). Default 30. */
  distance?: number;
  /** Trigger once or every time it scrolls into view. Default once. */
  once?: boolean;
}

export default function AnimatedSection({
  children,
  as: Tag = 'div',
  className = '',
  delay = 0,
  duration = 0.6,
  distance = 30,
  once = true,
}: Props) {
  // Cast Tag to a Motion component so we get all the animation props.
  // motion.create() takes any component or HTML tag and makes it animatable.
  const MotionTag = motion.create(Tag);

  // Define the animation variants. Variants are reusable named animation states.
  const variants: Variants = {
    hidden: { opacity: 0, y: distance },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      // viewport.once = play only the first time. Keeps things subtle.
      viewport={{ once, amount: 0.2 }} // amount: 0.2 means 20% of element visible triggers
      variants={variants}
      transition={{
        duration,
        delay,
        ease: 'easeOut',
      }}
    >
      {children}
    </MotionTag>
  );
}
