'use client';

import { motion, motionValue, type MotionValue, type PanInfo } from 'framer-motion';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useFinePointer, useReducedMotion } from '@/hooks/useMedia';
import s from './TagBlock.module.css';

type Group = { name: string; tags: string[] };

type Body = {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  dragging: boolean;
};

const GRAVITY = 2600;
const RESTITUTION = 0.3;
const FLOOR_FRICTION = 0.88;
const STEP = 1 / 120;
const SOLVER_PASSES = 4;
const MAX_THROW = 2200;

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Skill pills as physical blocks. They drop into a box when it scrolls into
 * view, stack under gravity, and can be picked up and thrown.
 *
 * Framer Motion owns the drag gesture; a tiny AABB solver owns everything
 * else. While a pill is held it acts as an immovable body that shoves its
 * neighbours; on release it inherits the gesture's velocity.
 *
 * Touch and reduced motion get a static, wrapped layout instead.
 */
export default function TagBlock({ groups }: { groups: Group[] }) {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const physics = fine && !reduced;

  const tags = useMemo(() => groups.flatMap((g, gi) => g.tags.map((label) => ({ label, group: gi }))), [groups]);
  const xs = useMemo(() => tags.map(() => motionValue(0)), [tags]);
  const ys = useMemo(() => tags.map(() => motionValue(-9999)), [tags]);

  const box = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLDivElement | null)[]>([]);
  const bodies = useRef<Body[]>([]);
  const size = useRef({ w: 0, h: 0 });
  const wake = useRef<() => void>(() => {});
  const [armed, setArmed] = useState(false);

  // Measure pills and park them above the box, ready to fall.
  useIsoLayoutEffect(() => {
    if (!physics || !box.current) return;
    const W = box.current.clientWidth;
    const H = box.current.clientHeight;
    size.current = { w: W, h: H };
    bodies.current = tags.map((_, i) => {
      const el = els.current[i];
      const w = el?.offsetWidth ?? 100;
      const h = el?.offsetHeight ?? 44;
      // Deterministic scatter so SSR/CSR and reloads look the same.
      const r = (Math.sin(i * 12.9898) * 43758.5453) % 1;
      const x = Math.abs(r) * Math.max(0, W - w);
      const y = -h - 60 - i * 38;
      xs[i].set(x);
      ys[i].set(y);
      return { x, y, w, h, vx: 0, vy: 0, dragging: false };
    });
    setArmed(true);
  }, [physics, tags, xs, ys]);

  // The simulation loop. Runs while visible and until everything sleeps.
  useEffect(() => {
    if (!physics || !armed || !box.current) return;
    const el = box.current;
    let raf = 0;
    let last = 0;
    let acc = 0;
    let running = false;
    let calm = 0;
    let visible = false;

    const step = (dt: number) => {
      const { w: W, h: H } = size.current;
      const list = bodies.current;

      list.forEach((b, i) => {
        if (b.dragging) {
          const nx = xs[i].get();
          const ny = ys[i].get();
          b.vx = (nx - b.x) / dt;
          b.vy = (ny - b.y) / dt;
          b.x = nx;
          b.y = ny;
          return;
        }
        b.vy += GRAVITY * dt;
        b.x += b.vx * dt;
        b.y += b.vy * dt;
      });

      for (let pass = 0; pass < SOLVER_PASSES; pass++) {
        for (let i = 0; i < list.length; i++) {
          for (let j = i + 1; j < list.length; j++) {
            const a = list[i];
            const b = list[j];
            const ia = a.dragging ? 0 : 1;
            const ib = b.dragging ? 0 : 1;
            if (ia + ib === 0) continue;
            const dx = b.x + b.w / 2 - (a.x + a.w / 2);
            const dy = b.y + b.h / 2 - (a.y + a.h / 2);
            const ox = (a.w + b.w) / 2 - Math.abs(dx);
            const oy = (a.h + b.h) / 2 - Math.abs(dy);
            if (ox <= 0 || oy <= 0) continue;

            if (ox < oy) {
              const n = Math.sign(dx) || 1;
              const corr = ox / (ia + ib);
              a.x -= n * corr * ia;
              b.x += n * corr * ib;
              const rv = (b.vx - a.vx) * n;
              if (rv < 0) {
                const imp = (-(1 + RESTITUTION) * rv) / (ia + ib);
                a.vx -= imp * ia * n;
                b.vx += imp * ib * n;
              }
            } else {
              const n = Math.sign(dy) || 1;
              const corr = oy / (ia + ib);
              a.y -= n * corr * ia;
              b.y += n * corr * ib;
              const rv = (b.vy - a.vy) * n;
              if (rv < 0) {
                const imp = (-(1 + RESTITUTION) * rv) / (ia + ib);
                a.vy -= imp * ia * n;
                b.vy += imp * ib * n;
              }
              // Resting on each other: friction bleeds off sideways slide.
              a.vx *= 0.96;
              b.vx *= 0.96;
            }
          }
        }
      }

      list.forEach((b) => {
        if (b.dragging) return;
        if (b.y + b.h > H) {
          b.y = H - b.h;
          b.vy = b.vy > 0 ? -b.vy * RESTITUTION : b.vy;
          if (Math.abs(b.vy) < 60) b.vy = 0;
          b.vx *= FLOOR_FRICTION;
        }
        if (b.x < 0) {
          b.x = 0;
          b.vx = Math.abs(b.vx) * RESTITUTION;
        } else if (b.x + b.w > W) {
          b.x = W - b.w;
          b.vx = -Math.abs(b.vx) * RESTITUTION;
        }
        if (Math.abs(b.vx) < 2) b.vx = 0;
      });
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, last ? (now - last) / 1000 : STEP);
      last = now;
      acc += dt;
      while (acc >= STEP) {
        step(STEP);
        acc -= STEP;
      }
      let energy = 0;
      bodies.current.forEach((b, i) => {
        if (!b.dragging) {
          xs[i].set(b.x);
          ys[i].set(b.y);
        }
        energy += Math.abs(b.vx) + Math.abs(b.vy) + (b.dragging ? 999 : 0);
      });
      calm = energy < 8 ? calm + 1 : 0;
      if (calm > 45 || !visible) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || !visible) return;
      running = true;
      calm = 0;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    wake.current = start;

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
      },
      { threshold: 0.35 },
    );
    io.observe(el);

    const ro = new ResizeObserver(() => {
      size.current = { w: el.clientWidth, h: el.clientHeight };
      bodies.current.forEach((b) => {
        b.x = Math.min(b.x, Math.max(0, size.current.w - b.w));
      });
      start();
    });
    ro.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      wake.current = () => {};
    };
  }, [physics, armed, xs, ys]);

  const onDragStart = (i: number) => {
    const b = bodies.current[i];
    if (!b) return;
    b.dragging = true;
    wake.current();
  };

  const onDragEnd = (i: number, info: PanInfo) => {
    const b = bodies.current[i];
    if (!b) return;
    b.dragging = false;
    b.vx = Math.max(-MAX_THROW, Math.min(MAX_THROW, info.velocity.x));
    b.vy = Math.max(-MAX_THROW, Math.min(MAX_THROW, info.velocity.y));
    wake.current();
  };

  return (
    <div className={s.root}>
      <div
        ref={box}
        className={s.box}
        data-mode={physics ? 'physics' : 'static'}
        data-armed={armed}
        role="list"
        aria-label="Skills"
      >
        {tags.map((tag, i) => (
          <Pill
            key={tag.label}
            label={tag.label}
            group={tag.group}
            index={i}
            physics={physics}
            x={xs[i]}
            y={ys[i]}
            box={box}
            setEl={(el) => (els.current[i] = el)}
            onDragStart={() => onDragStart(i)}
            onDragEnd={(info) => onDragEnd(i, info)}
          />
        ))}
      </div>
      <ul className={s.legend}>
        {groups.map((g, gi) => (
          <li key={g.name}>
            <span className={s.swatch} data-group={gi} />
            {g.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

type PillProps = {
  label: string;
  group: number;
  index: number;
  physics: boolean;
  x: MotionValue<number>;
  y: MotionValue<number>;
  box: React.RefObject<HTMLDivElement | null>;
  setEl: (el: HTMLDivElement | null) => void;
  onDragStart: () => void;
  onDragEnd: (info: PanInfo) => void;
};

function Pill({ label, group, index, physics, x, y, box, setEl, onDragStart, onDragEnd }: PillProps) {
  if (!physics) {
    const tilt = ((index * 37) % 7) - 3;
    return (
      <div role="listitem" className={s.pill} data-group={group} style={{ rotate: `${tilt}deg` }}>
        {label}
      </div>
    );
  }
  return (
    <motion.div
      ref={setEl}
      role="listitem"
      className={s.pill}
      data-group={group}
      data-cursor="drag"
      style={{ x, y }}
      drag
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={box}
      onDragStart={onDragStart}
      onDragEnd={(_, info) => onDragEnd(info)}
      whileDrag={{ scale: 1.08, zIndex: 5 }}
    >
      {label}
    </motion.div>
  );
}
