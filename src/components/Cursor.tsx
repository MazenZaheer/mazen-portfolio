'use client';

import { useEffect, useRef } from 'react';
import { useFinePointer, useReducedMotion } from '@/hooks/useMedia';
import s from './Cursor.module.css';

type Variant = 'default' | 'link' | 'view' | 'drag' | 'accent' | 'hidden';

/**
 * A single circle rendered with `mix-blend-mode: difference`, so it inverts
 * whatever it passes over: black on paper, white on ink, negative on photos.
 *
 * Elements opt into states with attributes:
 *   data-cursor="view" | "drag" | "accent" | "hidden"
 *   data-cursor-label="Open"          text shown inside the grown circle
 * Links and buttons get the "link" state automatically.
 */
export default function Cursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const outer = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = outer.current;
    if (!fine || !el) return;
    const html = document.documentElement;
    html.classList.add('has-cursor');

    const pos = { x: -100, y: -100, tx: -100, ty: -100 };
    let visible = false;
    let raf = 0;

    const setVariant = (variant: Variant, text = '') => {
      el.dataset.variant = variant;
      if (label.current) label.current.textContent = text;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      pos.tx = e.clientX;
      pos.ty = e.clientY;
      if (!visible) {
        visible = true;
        pos.x = pos.tx;
        pos.y = pos.ty;
        el.dataset.visible = 'true';
      }
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const tagged = target?.closest<HTMLElement>('[data-cursor]');
      if (tagged) {
        const variant = tagged.dataset.cursor as Variant;
        const fallback = variant === 'view' ? 'View' : variant === 'drag' ? 'Drag' : '';
        setVariant(variant, tagged.dataset.cursorLabel ?? fallback);
        return;
      }
      if (target?.closest('a, button, [role="tab"], label, summary')) setVariant('link');
      else setVariant('default');
    };

    const onLeave = () => {
      visible = false;
      el.dataset.visible = 'false';
    };
    const onDown = () => (el.dataset.pressed = 'true');
    const onUp = () => (el.dataset.pressed = 'false');

    const ease = reduced ? 1 : 0.2;
    const loop = () => {
      pos.x += (pos.tx - pos.x) * ease;
      pos.y += (pos.ty - pos.y) * ease;
      el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);

    return () => {
      cancelAnimationFrame(raf);
      html.classList.remove('has-cursor');
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
    };
  }, [fine, reduced]);

  if (!fine) return null;

  return (
    <div ref={outer} className={s.cursor} data-variant="default" data-visible="false" aria-hidden>
      <div className={s.circle}>
        <span ref={label} className={s.label} />
      </div>
    </div>
  );
}
