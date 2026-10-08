'use client';

import { usePathname } from 'next/navigation';
import { useRef, type ReactNode } from 'react';
import { EASE, gsap, ScrollTrigger, SplitText, useGSAP } from '@/lib/gsap';
import { useIntro } from './IntroProvider';

const START = 'top 86%';

/**
 * Declarative scroll reveals. Mark up elements with:
 *   data-reveal="up"            fade + rise
 *   data-reveal="stagger"       fade + rise each child in turn
 *   data-reveal="lines"         split into masked lines that slide up
 *   data-reveal="image-left"    wipe + slide in from the left (or -right)
 *   data-parallax="0.15"        drift upward at 15% of scroll speed
 *   data-count="3500"           count up (data-decimals, data-prefix, data-suffix)
 * Everything shares power3.out. Nothing runs under prefers-reduced-motion,
 * and nothing is hidden before JS, so content is always readable.
 */
export default function RevealScope({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const { ready } = useIntro();
  const pathname = usePathname();

  useGSAP(
    () => {
      if (!ready) return;
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        q('[data-reveal="up"]').forEach((el) => {
          gsap.from(el, { y: 56, autoAlpha: 0, duration: 1.1, ease: EASE, scrollTrigger: { trigger: el, start: START, once: true } });
        });

        q('[data-reveal="stagger"]').forEach((el) => {
          gsap.from(el.children, {
            y: 40,
            autoAlpha: 0,
            duration: 1,
            stagger: 0.08,
            ease: EASE,
            scrollTrigger: { trigger: el, start: START, once: true },
          });
        });

        q('[data-reveal="lines"]').forEach((el) => {
          SplitText.create(el, {
            type: 'lines',
            mask: 'lines',
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 110,
                duration: 1.1,
                stagger: 0.08,
                ease: EASE,
                scrollTrigger: { trigger: el, start: START, once: true },
              }),
          });
        });

        q('[data-reveal^="image-"]').forEach((el) => {
          const fromLeft = el.dataset.reveal === 'image-left';
          const img = el.querySelector('img');
          const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: START, once: true } });
          tl.fromTo(
            el,
            { clipPath: fromLeft ? 'inset(0% 100% 0% 0%)' : 'inset(0% 0% 0% 100%)', x: fromLeft ? -80 : 80 },
            { clipPath: 'inset(0% 0% 0% 0%)', x: 0, duration: 1.3, ease: EASE, clearProps: 'clipPath,transform' },
          );
          // Hand the image's transform back to CSS afterwards, for the hover zoom.
          if (img) tl.from(img, { scale: 1.3, duration: 1.6, ease: EASE, clearProps: 'transform' }, 0);
        });

        q('[data-parallax]').forEach((el) => {
          const amount = parseFloat(el.dataset.parallax ?? '0.1');
          gsap.to(el, {
            yPercent: -amount * 100,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
          });
        });

        q('[data-count]').forEach((el) => {
          const end = parseFloat(el.dataset.count ?? '0');
          const decimals = parseInt(el.dataset.decimals ?? '0', 10);
          const prefix = el.dataset.prefix ?? '';
          const suffix = el.dataset.suffix ?? '';
          const useGrouping = el.dataset.group !== 'false'; // e.g. SAT 1560, not 1,560
          const fmt = (v: number) =>
            prefix +
            v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping }) +
            suffix;
          const state = { v: 0 };
          gsap.to(state, {
            v: end,
            duration: 1.8,
            ease: EASE,
            scrollTrigger: { trigger: el, start: START, once: true },
            onStart: () => {
              el.textContent = fmt(0);
            },
            onUpdate: () => {
              el.textContent = fmt(state.v);
            },
          });
        });
      });

      ScrollTrigger.refresh();
      return () => mm.revert();
    },
    { scope: root, dependencies: [ready, pathname], revertOnUpdate: true },
  );

  return <div ref={root}>{children}</div>;
}
