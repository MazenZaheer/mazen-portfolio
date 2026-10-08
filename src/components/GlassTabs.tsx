'use client';

import { motion } from 'framer-motion';
import { useId, useRef, useState, type KeyboardEvent } from 'react';
import type { Service } from '@/content/site';
import { useReducedMotion } from '@/hooks/useMedia';
import s from './GlassTabs.module.css';

type Props = { items: Service[]; email: string };

/**
 * Frosted panels stacked like a deck. The selected one comes forward; the
 * rest step back (smaller, higher, fainter) and stay clickable by their
 * peeking edge.
 */
export default function GlassTabs({ items, email }: Props) {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const id = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const n = items.length;

  const select = (i: number, focus = false) => {
    const next = (i + n) % n;
    setActive(next);
    if (focus) tabs.current[next]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const map: Record<string, number> = { ArrowRight: active + 1, ArrowDown: active + 1, ArrowLeft: active - 1, ArrowUp: active - 1, Home: 0, End: n - 1 };
    if (!(e.key in map)) return;
    e.preventDefault();
    select(map[e.key], true);
  };

  return (
    <div className={s.root}>
      <div className={s.backdrop} aria-hidden>
        <span className={`${s.blob} ${s.blobA}`} />
        <span className={`${s.blob} ${s.blobB}`} />
        <span className={`${s.blob} ${s.blobC}`} />
      </div>

      <div role="tablist" aria-label="Services" className={s.tabs} onKeyDown={onKeyDown}>
        {items.map((item, i) => (
          <button
            key={item.title}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            role="tab"
            type="button"
            id={`${id}-tab-${i}`}
            aria-selected={active === i}
            aria-controls={`${id}-panel-${i}`}
            tabIndex={active === i ? 0 : -1}
            className={s.tab}
            onClick={() => select(i)}
          >
            {active === i && (
              <motion.span
                layoutId={`${id}-pill`}
                className={s.pill}
                transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 34 }}
              />
            )}
            <span className={s.tabLabel}>
              <span className={s.tabIndex}>0{i + 1}</span> {item.title}
            </span>
          </button>
        ))}
      </div>

      <div className={s.stage} style={{ ['--depth' as string]: n - 1 }}>
        {items.map((item, i) => {
          const depth = (i - active + n) % n;
          const front = depth === 0;
          return (
            <motion.article
              key={item.title}
              id={`${id}-panel-${i}`}
              role="tabpanel"
              aria-labelledby={`${id}-tab-${i}`}
              aria-hidden={!front}
              className={s.panel}
              data-front={front}
              style={{ zIndex: n - depth }}
              initial={false}
              animate={{
                y: depth * -30,
                scale: 1 - depth * 0.045,
                opacity: front ? 1 : Math.max(0.3, 0.8 - depth * 0.18),
              }}
              transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 210, damping: 28, mass: 0.9 }}
              onClick={front ? undefined : () => select(i)}
              data-cursor={front ? undefined : 'accent'}
              data-cursor-label={front ? undefined : 'Open'}
            >
              <header className={s.panelHead}>
                <span className={s.panelIndex}>
                  0{i + 1} / 0{n} · {item.title}
                </span>
                <span className={s.panelTag}>Service</span>
              </header>
              <div className={s.panelBody}>
                <div>
                  <h3 className={s.panelTitle}>{item.title}</h3>
                  <p className={s.short}>{item.short}</p>
                  <p className={s.description}>{item.description}</p>
                </div>
                <div className={s.side}>
                  <p className={s.sideLabel}>Includes</p>
                  <ul className={s.includes}>
                    {item.includes.map((inc) => (
                      <li key={inc}>{inc}</li>
                    ))}
                  </ul>
                  <p className={s.proof}>{item.proof}</p>
                  <a
                    className={s.cta}
                    href={`mailto:${email}?subject=${encodeURIComponent(item.title)}`}
                    tabIndex={front ? 0 : -1}
                  >
                    Enquire <span aria-hidden>→</span>
                  </a>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
