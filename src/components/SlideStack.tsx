'use client';

import { useRef } from 'react';
import type { Panel } from '@/content/site';
import { EASE, gsap, useGSAP } from '@/lib/gsap';
import { useIntro } from './IntroProvider';
import s from './SlideStack.module.css';

const STACK_MEDIA = '(min-width: 900px) and (min-height: 680px) and (prefers-reduced-motion: no-preference)';

/**
 * Full-screen "slides". Each panel sticks to the top; the next one rides up
 * over it while the one underneath shrinks back and dims. Panel content
 * staggers in on arrival. Small screens and reduced motion get normal flow.
 */
export default function SlideStack({ panels, startIndex = 1 }: { panels: Panel[]; startIndex?: number }) {
  const root = useRef<HTMLDivElement>(null);
  const { ready } = useIntro();

  useGSAP(
    () => {
      if (!ready) return;
      const mm = gsap.matchMedia();
      mm.add(STACK_MEDIA, () => {
        const els = gsap.utils.toArray<HTMLElement>('[data-panel]');
        els.forEach((panel, i) => {
          const next = els[i + 1];
          if (next) {
            gsap
              .timeline({ scrollTrigger: { trigger: next, start: 'top bottom', end: 'top top', scrub: true } })
              .to(panel.querySelector('[data-panel-card]'), { scale: 0.92, yPercent: -3, ease: 'none' }, 0)
              .to(panel.querySelector('[data-panel-shade]'), { opacity: 0.55, ease: 'none' }, 0);
          }
          gsap.from(panel.querySelectorAll('[data-panel-item]'), {
            y: 48,
            autoAlpha: 0,
            duration: 1,
            stagger: 0.06,
            ease: EASE,
            scrollTrigger: { trigger: panel, start: 'top 55%', toggleActions: 'play none none reverse' },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [ready], revertOnUpdate: true },
  );

  return (
    <div ref={root} className={s.stack}>
      {panels.map((p, i) => (
        <div key={p.id} className={s.slot}>
          {/* Anchor sits in normal flow: sticky panels report misleading offsets. */}
          <span id={p.id} className={s.anchor} aria-hidden />
          <section className={s.panel} data-panel aria-labelledby={`${p.id}-title`}>
            <div className={s.card} data-panel-card data-theme={p.theme}>
              <div className={s.inner}>
                <div className={s.left}>
                  <p className={s.eyebrow} data-panel-item>
                    <span>({String(startIndex + i).padStart(2, '0')})</span> {p.eyebrow}
                  </p>
                  <h2 id={`${p.id}-title`} className={s.title} data-panel-item>
                    {p.title}
                  </h2>
                  <p className={s.subtitle} data-panel-item>
                    {p.subtitle}
                  </p>
                  <div className={s.highlight} data-panel-item>
                    <span className={s.highlightValue}>{p.highlight.value}</span>
                    <span className={s.highlightLabel}>{p.highlight.label}</span>
                  </div>
                </div>
                <ul className={s.items} data-columns={p.items.length > 6 ? 2 : 1}>
                  {p.items.map((item, j) => (
                    <li key={item} data-panel-item>
                      <span className={s.itemIndex}>{String(j + 1).padStart(2, '0')}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={s.shade} data-panel-shade aria-hidden />
            </div>
          </section>
        </div>
      ))}
    </div>
  );
}
