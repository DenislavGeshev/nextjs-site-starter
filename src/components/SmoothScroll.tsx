'use client';

/**
 * SmoothScroll
 *
 * Wraps the entire site to enable Lenis smooth scrolling. Lenis takes over
 * native scroll and provides the buttery-smooth feel you see on award-winning
 * agency sites.
 *
 * Lenis automatically respects `prefers-reduced-motion`. Users who have that
 * setting enabled will get native scroll instead.
 *
 * Why a client component: Lenis runs in the browser only. It needs `window`,
 * so it can't render on the server. The 'use client' directive tells Next.js
 * this file should only be sent to the browser.
 *
 * Docs: https://github.com/darkroomengineering/lenis
 */

import { useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';

interface Props {
  children: ReactNode;
}

export default function SmoothScroll({ children }: Props) {
  useEffect(() => {
    // Respect users who prefer reduced motion (skip Lenis entirely)
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    // Initialize Lenis with sensible defaults for a marketing site
    const lenis = new Lenis({
      // Duration controls how "slidy" the scroll feels. 1.0 to 1.5 is good.
      duration: 1.2,
      // Easing function. The Lenis default and feels great.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // Drive Lenis's animation loop
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Cleanup on unmount
    return () => {
      lenis.destroy();
    };
  }, []);

  // Render the children (the rest of the site) directly. Lenis attaches
  // to <html> automatically, so no wrapper element is needed.
  return <>{children}</>;
}
