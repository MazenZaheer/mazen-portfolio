'use client';

import { motion, useSpring } from 'framer-motion';
import { useRef, type PointerEvent, type ReactNode } from 'react';
import { useFinePointer, useReducedMotion } from '@/hooks/useMedia';

type Props = { children: ReactNode; strength?: number; className?: string };

/** Pulls its child toward the pointer while hovered, then springs back. */
export default function Magnetic({ children, strength = 0.35, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const spring = { stiffness: 220, damping: 16, mass: 0.5 };
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);
  const enabled = fine && !reduced;

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!enabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y, display: 'inline-block' }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  );
}
