'use client';

import { useEffect, useState, type RefObject } from 'react';

export const FINE_POINTER = '(hover: hover) and (pointer: fine)';
export const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

/** SSR-safe media query. Returns `false` on the server and first client render. */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [query]);
  return matches;
}

/** True for mouse/trackpad devices: gates cursor, drag physics and hover previews. */
export const useFinePointer = () => useMediaQuery(FINE_POINTER);

export const useReducedMotion = () => useMediaQuery(REDUCED_MOTION);

/**
 * Touch devices have no hover, so grayscale media turns to colour while it
 * crosses the middle band of the viewport (or of a horizontal scroller).
 */
export function useTouchColor(ref: RefObject<HTMLElement | null>, root?: RefObject<HTMLElement | null>) {
  const fine = useFinePointer();
  useEffect(() => {
    const el = ref.current;
    if (!el || fine) return;
    const horizontal = Boolean(root?.current);
    const io = new IntersectionObserver(
      ([entry]) => el.classList.toggle('is-color', entry.isIntersecting),
      {
        root: root?.current ?? null,
        rootMargin: horizontal ? '0px -30% 0px -30%' : '-35% 0px -35% 0px',
      },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [fine, ref, root]);
}
