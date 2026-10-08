'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useId, useRef, useState } from 'react';
import type { Role } from '@/content/site';
import { useFinePointer, useReducedMotion } from '@/hooks/useMedia';
import { EASE_CSS } from '@/lib/gsap';
import s from './ProjectList.module.css';

/**
 * Index-style list. On desktop a small photo trails the cursor (lerped, with
 * a lean in the direction of travel) and crossfades as you move between rows.
 * Rows expand on click for the detail; on touch the photo shows inline instead.
 */
export default function ProjectList({ items }: { items: Role[] }) {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const preview = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const baseId = useId();

  useEffect(() => {
    if (!fine || active === null) return;
    const el = preview.current;
    if (!el) return;
    const pos = { ...target.current };
    let raf = 0;
    const loop = () => {
      const k = reduced ? 1 : 0.12;
      const dx = target.current.x - pos.x;
      pos.x += dx * k;
      pos.y += (target.current.y - pos.y) * k;
      const lean = reduced ? 0 : Math.max(-10, Math.min(10, dx * 0.05));
      el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${lean}deg)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [fine, reduced, active === null]); // eslint-disable-line react-hooks/exhaustive-deps

  const onMove = (e: React.PointerEvent) => {
    target.current = { x: e.clientX, y: e.clientY };
  };

  return (
    <div className={s.root} onPointerMove={fine ? onMove : undefined} onPointerLeave={() => setActive(null)}>
      <ul className={s.list} data-hovering={active !== null}>
        {items.map((item, i) => {
          const isOpen = open === i;
          const panelId = `${baseId}-panel-${i}`;
          return (
            <li
              key={item.org}
              className={s.row}
              data-active={active === i}
              onPointerEnter={(e) => {
                if (!fine) return;
                if (active === null) target.current = { x: e.clientX, y: e.clientY };
                setActive(i);
              }}
              data-reveal="up"
            >
              <button
                type="button"
                className={s.head}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span className={s.index}>{String(i + 1).padStart(2, '0')}</span>
                <span className={s.org}>{item.org}</span>
                <span className={s.role}>{item.role}</span>
                <span className={s.period}>{item.period}</span>
                <span className={s.toggle} data-open={isOpen} aria-hidden />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={panelId}
                    className={s.panel}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: reduced ? 0 : 0.55, ease: EASE_CSS }}
                  >
                    <div className={s.panelInner}>
                      {!fine && (
                        <div className={`${s.thumb} gs is-color`}>
                          <Image src={item.image} alt="" fill sizes="40vw" />
                        </div>
                      )}
                      <div>
                        <p className={s.place}>{item.place}</p>
                        <ul className={s.points}>
                          {item.points.map((p) => (
                            <li key={p}>{p}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>

      {fine && (
        <div ref={preview} className={s.preview} aria-hidden>
          <motion.div
            className={s.previewInner}
            initial={false}
            animate={{ scale: active === null ? 0.4 : 1, opacity: active === null ? 0 : 1 }}
            transition={{ duration: reduced ? 0 : 0.4, ease: EASE_CSS }}
          >
            {items.map((item, i) => (
              <motion.div
                key={item.org}
                className={s.previewImage}
                initial={false}
                animate={{ opacity: active === i ? 1 : 0, scale: active === i ? 1 : 1.12 }}
                transition={{ duration: reduced ? 0 : 0.3, ease: EASE_CSS }}
              >
                <Image src={item.image} alt="" fill sizes="280px" loading="eager" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
}
