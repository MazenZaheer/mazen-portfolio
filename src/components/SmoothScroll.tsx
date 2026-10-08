'use client';

import Lenis from 'lenis';
import { useEffect } from 'react';
import { FINE_POINTER, REDUCED_MOTION } from '@/hooks/useMedia';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { scrollToTarget, setLenis } from '@/lib/scroll';

/** Lenis momentum scrolling on desktop, synced to GSAP's ticker. Native scroll elsewhere. */
export default function SmoothScroll() {
  useEffect(() => {
    if (!window.matchMedia(FINE_POINTER).matches || window.matchMedia(REDUCED_MOTION).matches) return;

    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
    setLenis(lenis);
    if (document.documentElement.classList.contains('scroll-locked')) lenis.stop();

    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  // In-page anchors (#section) go through the same smooth scroll.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]');
      const id = a?.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      scrollToTarget(target as HTMLElement);
      history.replaceState(null, '', id);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  return null;
}
