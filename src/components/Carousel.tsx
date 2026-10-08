'use client';

import { AnimatePresence, motion, type MotionValue } from 'framer-motion';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import type { Chapter } from '@/content/site';
import { useReducedMotion } from '@/hooks/useMedia';
import { EASE_CSS, gsap } from '@/lib/gsap';
import { useIntro } from './IntroProvider';
import s from './Carousel.module.css';

type Props = {
  items: Chapter[];
  /** Ring rotation in degrees, shared with the hero background for parallax. */
  spin?: MotionValue<number>;
};

const MIN_RING = 12; // repeat items until the ring looks full
const DEG_PER_PX = 0.16;
const AUTOPLAY_MS = 4200;
const IDLE_AFTER_INTERACTION_MS = 6000;
const TILT = 0.38; // cards turn only partly with the ring, so side cards stay readable

/** Wrap an angle into (-180, 180]. */
const wrap = (deg: number) => {
  const d = ((deg % 360) + 360) % 360;
  return d > 180 ? d - 360 : d;
};

/**
 * 3D media ring (after Bureau Nine). Thumbnails orbit a large featured card;
 * whichever thumbnail passes the front becomes the featured one.
 *
 * Drag (mouse or touch) to spin with inertia; it settles on the nearest card.
 * Arrow keys, the ← → buttons and clicking a thumbnail also rotate it, and it
 * advances on its own while idle. One rAF loop writes transforms directly, so
 * React only re-renders when the featured card changes.
 */
export default function Carousel({ items, spin }: Props) {
  const reduced = useReducedMotion();
  const { ready, navigate } = useIntro();

  const ring = useMemo(() => {
    const reps = Math.max(1, Math.ceil(MIN_RING / items.length));
    return Array.from({ length: items.length * reps }, (_, k) => items[k % items.length]);
  }, [items]);
  const N = ring.length;
  const step = 360 / N;

  const root = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const motion$ = useRef({
    rot: 0,
    target: 0,
    vel: 0,
    dragging: false,
    tweening: false,
    hover: false,
    visible: true,
    startX: 0,
    lastX: 0,
    lastT: 0,
    moved: 0,
    lastInteract: 0,
  });
  const dims = useRef({ R: 480, Ry: 40 });

  /** Rotate so ring item `k` (or the closest copy of it) sits at the front. */
  const goTo = useCallback(
    (k: number) => {
      const m = motion$.current;
      m.vel = 0;
      m.target = m.rot + wrap(-k * step - m.rot);
      m.lastInteract = performance.now();
    },
    [step],
  );

  const nudge = useCallback(
    (dir: 1 | -1) => {
      const m = motion$.current;
      m.vel = 0;
      m.target = Math.round(m.target / step) * step - dir * step;
      m.lastInteract = performance.now();
    },
    [step],
  );

  // Ring radius follows the stage size.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      // Wider relative radius on phones so cards clear the featured one.
      const R = Math.min(w * (w < 640 ? 0.52 : 0.4), 600);
      dims.current = { R, Ry: R * 0.1 };
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => (motion$.current.visible = e.isIntersecting));
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  // The animation loop.
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    motion$.current.lastInteract = last;

    const render = () => {
      const m = motion$.current;
      const { R, Ry } = dims.current;
      for (let k = 0; k < N; k++) {
        const el = els.current[k];
        if (!el) continue;
        const theta = wrap(k * step + m.rot);
        const rad = (theta * Math.PI) / 180;
        const c = Math.cos(rad);
        const x = R * Math.sin(rad);
        const y = -Ry * (1 - c); // far side rides higher, as if seen from above
        const scale = 0.32 + 0.68 * Math.pow((c + 1) / 2, 1.4);
        // The front slot is covered by the featured card, so fade out as cards reach it.
        const a = Math.abs(theta);
        const front = Math.min(1, Math.max(0, (a - step * 0.35) / (step * 0.5)));
        const opacity = front * (0.5 + 0.5 * ((c + 1) / 2));
        el.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotateY(${(theta * TILT).toFixed(2)}deg) scale(${scale.toFixed(3)})`;
        el.style.opacity = opacity.toFixed(3);
        el.style.zIndex = String(Math.round((c + 1) * 500));
        el.style.pointerEvents = opacity < 0.35 ? 'none' : 'auto';
      }
      const front = (((Math.round(-m.rot / step) % N) + N) % N) % items.length;
      if (front !== activeRef.current) {
        activeRef.current = front;
        setActive(front);
      }
      spin?.set(m.rot);
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const m = motion$.current;

      if (!m.dragging && !m.tweening) {
        if (!reduced && Math.abs(m.vel) > 6) {
          // Inertia after a throw…
          m.rot += m.vel * dt;
          m.vel *= Math.exp(-dt * 3.2);
          if (Math.abs(m.vel) <= 6) m.target = Math.round(m.rot / step) * step;
        } else {
          // …then ease into the nearest slot.
          m.vel = 0;
          m.rot += (m.target - m.rot) * (reduced ? 1 : 1 - Math.exp(-dt * 7));
        }

        const idle = now - m.lastInteract > IDLE_AFTER_INTERACTION_MS;
        const settled = Math.abs(m.target - m.rot) < 0.3;
        if (!reduced && !m.hover && m.visible && idle && settled && document.visibilityState === 'visible') {
          m.target -= step;
          m.lastInteract = now - (IDLE_AFTER_INTERACTION_MS - AUTOPLAY_MS);
        }
      }

      render();
      raf = requestAnimationFrame(loop);
    };

    render();
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [N, step, items.length, reduced, spin]);

  // Intro: the ring spins into place as the hero appears.
  useEffect(() => {
    if (!ready || reduced) return;
    const m = motion$.current;
    m.tweening = true;
    const tween = gsap.fromTo(
      m,
      { rot: m.target + 160 },
      {
        rot: m.target,
        duration: 2.2,
        ease: 'power3.out',
        onComplete: () => {
          m.tweening = false;
          m.lastInteract = performance.now();
        },
      },
    );
    return () => {
      tween.kill();
      m.tweening = false;
    };
  }, [ready, reduced]);

  // ---- Pointer: drag to spin, release to throw -----------------------

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const m = motion$.current;
    m.dragging = true;
    m.tweening = false;
    m.vel = 0;
    m.startX = m.lastX = e.clientX;
    m.lastT = performance.now();
    m.moved = 0;
    m.lastInteract = m.lastT;
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const m = motion$.current;
    if (!m.dragging) return;
    const now = performance.now();
    const dx = e.clientX - m.lastX;
    m.moved = Math.max(m.moved, Math.abs(e.clientX - m.startX));
    if (m.moved > 4 && !root.current?.hasPointerCapture(e.pointerId)) root.current?.setPointerCapture(e.pointerId);
    m.rot += dx * DEG_PER_PX;
    const dt = Math.max(1, now - m.lastT) / 1000;
    m.vel = m.vel * 0.6 + ((dx * DEG_PER_PX) / dt) * 0.4;
    m.lastX = e.clientX;
    m.lastT = now;
    m.lastInteract = now;
  };

  const endDrag = () => {
    const m = motion$.current;
    if (!m.dragging) return;
    m.dragging = false;
    // A drag that stalled before release shouldn't fling.
    if (performance.now() - m.lastT > 80) m.vel = 0;
    m.vel = Math.max(-900, Math.min(900, m.vel));
    m.target = Math.round(m.rot / step) * step;
    m.lastInteract = performance.now();
  };

  // Swallow the click that ends a drag.
  const onClickCapture = (e: React.MouseEvent) => {
    if (motion$.current.moved > 6) {
      e.preventDefault();
      e.stopPropagation();
      motion$.current.moved = 0;
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') nudge(1);
    else if (e.key === 'ArrowLeft') nudge(-1);
    else return;
    e.preventDefault();
  };

  const current = items[active];

  return (
    <div className={s.root}>
      <div
        ref={root}
        className={s.stage}
        role="region"
        aria-roledescription="carousel"
        aria-label="Chapters"
        tabIndex={0}
        data-cursor="drag"
        data-cursor-label="Drag"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerEnter={() => (motion$.current.hover = true)}
        onPointerLeave={() => {
          motion$.current.hover = false;
          endDrag();
        }}
        onClickCapture={onClickCapture}
        onKeyDown={onKeyDown}
      >
        <div className={s.ring} data-hero-ring>
          {ring.map((item, k) => (
            <button
              key={k}
              ref={(el) => {
                els.current[k] = el;
              }}
              type="button"
              className={`${s.item} gs`}
              aria-label={`Show ${item.title}`}
              tabIndex={-1}
              onClick={() => goTo(k)}
              data-cursor="view"
              data-cursor-label="Spin"
            >
              <Image src={item.image} alt="" fill sizes="140px" draggable={false} />
            </button>
          ))}
        </div>

        <a
          href={`/${current.id}`}
          className={s.feature}
          data-hero-feature
          data-cursor="view"
          data-cursor-label="Open"
          draggable={false}
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey) return; // let new-tab clicks through
            e.preventDefault();
            navigate(`/${current.id}`);
          }}
        >
          <span className={s.bar}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={current.id}
                className={s.barTitle}
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                exit={{ y: '-100%', opacity: 0 }}
                transition={{ duration: reduced ? 0 : 0.35, ease: EASE_CSS }}
              >
                {current.title}
              </motion.span>
            </AnimatePresence>
            <span className={s.barCta}>View</span>
          </span>
          <span className={s.featureMedia}>
            {items.map((item, i) => (
              <span key={item.id} className={s.featureImage} data-active={i === active}>
                <Image
                  src={item.image}
                  alt={i === active ? `${item.title}: ${item.note}` : ''}
                  fill
                  sizes="(max-width: 768px) 60vw, 380px"
                  priority={i === 0}
                  draggable={false}
                />
              </span>
            ))}
          </span>
        </a>
      </div>

      <div className={s.controls}>
        <span className={s.note} aria-live="polite">
          {current.note}
        </span>
        <span className={s.count}>
          {String(active + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
        </span>
        <span className={s.arrows}>
          <button type="button" className={s.arrow} onClick={() => nudge(-1)} aria-label="Previous chapter">
            ←
          </button>
          <button type="button" className={s.arrow} onClick={() => nudge(1)} aria-label="Next chapter">
            →
          </button>
        </span>
      </div>
    </div>
  );
}
