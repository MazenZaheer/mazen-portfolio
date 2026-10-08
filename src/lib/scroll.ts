'use client';

import type Lenis from 'lenis';

let lenis: Lenis | null = null;

export const setLenis = (instance: Lenis | null) => {
  lenis = instance;
};

export const getLenis = () => lenis;

/** Scroll to an element, selector or y-position via Lenis when it's running. */
export function scrollToTarget(target: string | number | HTMLElement, immediate = false) {
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (el === null) return;
  if (lenis) {
    lenis.scrollTo(el, { immediate, force: true, duration: 1.4 });
    return;
  }
  const behavior: ScrollBehavior = immediate ? 'auto' : 'smooth';
  if (typeof el === 'number') window.scrollTo({ top: el, behavior });
  else el.scrollIntoView({ behavior });
}

export function lockScroll(locked: boolean) {
  document.documentElement.classList.toggle('scroll-locked', locked);
  if (locked) lenis?.stop();
  else lenis?.start();
}
