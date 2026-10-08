'use client';

import { useEffect, useRef, useState } from 'react';
import { site } from '@/content/site';
import { EASE, EASE_IN_OUT, gsap, ScrollTrigger } from '@/lib/gsap';
import { lockScroll } from '@/lib/scroll';
import { useIntro } from './IntroProvider';
import s from './LoadingScreen.module.css';

const MIN_DURATION = 2400;
const SEEN_KEY = 'mz-crt';

/**
 * Homepage-only CRT boot. The boot script in layout.tsx adds `intro-pending`
 * to <html> on the first visit of a session; without it this renders nothing.
 *
 * Sequence: counter 000→100 on a curved, scanlined screen → the set fades →
 * a white line draws across the centre → the page itself expands vertically
 * out of that line (like a tube warming up) while the flash fades.
 */
export default function LoadingScreen() {
  const { setReady } = useIntro();
  const [active, setActive] = useState(true);
  const root = useRef<HTMLDivElement>(null);
  const tv = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const meter = useRef<HTMLSpanElement>(null);
  const beam = useRef<HTMLDivElement>(null);
  const screenText = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains('intro-pending')) {
      setActive(false);
      return;
    }

    history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    lockScroll(true);

    let loaded = false;
    const pageLoad = new Promise<void>((resolve) => {
      if (document.readyState === 'complete') resolve();
      else window.addEventListener('load', () => resolve(), { once: true });
    });
    Promise.all([pageLoad, document.fonts?.ready]).then(() => (loaded = true));
    const safety = window.setTimeout(() => (loaded = true), 7000);

    const start = performance.now();
    let shown = 0;
    let raf = 0;
    let tl: gsap.core.Timeline | null = null;

    const render = (value: number) => {
      if (counter.current) counter.current.textContent = String(Math.floor(value)).padStart(3, '0');
      if (meter.current) meter.current.style.transform = `scaleX(${value / 100})`;
    };

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / MIN_DURATION);
      const timeTarget = (1 - Math.pow(1 - t, 2)) * 100;
      // Time drives the count, but it parks at 92 until the page has really loaded.
      const target = Math.min(timeTarget, loaded ? 100 : 92);
      shown += (target - shown) * 0.14;
      if (loaded && t >= 1 && shown > 99.5) {
        render(100);
        powerOn();
        return;
      }
      render(shown);
      raf = requestAnimationFrame(tick);
    };

    const powerOn = () => {
      const shell = document.getElementById('shell');
      const midY = window.innerHeight / 2;

      tl = gsap.timeline({
        onComplete: () => {
          if (shell) gsap.set(shell, { clearProps: 'transform,transformOrigin,visibility' });
          html.classList.remove('intro-pending');
          try {
            sessionStorage.setItem(SEEN_KEY, '1');
          } catch {}
          lockScroll(false);
          ScrollTrigger.refresh();
          setActive(false);
        },
      });

      tl.to(screenText.current, { autoAlpha: 0, duration: 0.08, repeat: 3, yoyo: true, ease: 'steps(1)' })
        .to(tv.current, { scale: 1.06, autoAlpha: 0, duration: 0.5, ease: 'power3.in' }, '+=0.05')
        .set(beam.current, { autoAlpha: 1, scaleX: 0, scaleY: 0.004 })
        .to(beam.current, { scaleX: 1, duration: 0.45, ease: EASE_IN_OUT })
        .addLabel('open')
        .set(shell, { visibility: 'visible', transformOrigin: `50% ${midY}px`, scaleY: 0.004 }, 'open')
        .set(root.current, { backgroundColor: 'transparent' }, 'open')
        .to([beam.current, shell], { scaleY: 1, duration: 0.9, ease: 'expo.inOut' }, 'open')
        .to(beam.current, { autoAlpha: 0, duration: 0.7, ease: EASE }, 'open+=0.35')
        // Hero entrance starts while the picture is still settling, so the hand-off reads as one move.
        .add(() => setReady(true), 'open+=0.45');
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(safety);
      tl?.kill();
    };
  }, [setReady]);

  if (!active) return null;

  return (
    <div ref={root} className={s.root} role="status" aria-live="polite" aria-label="Loading portfolio">
      <div ref={tv} className={s.tv}>
        <div className={s.screen}>
          <div ref={screenText} className={s.content}>
            <span className={s.label}>CH-01 · {site.name.toUpperCase()}</span>
            <div className={s.counter}>
              <span ref={counter}>000</span>
              <span className={s.pct}>%</span>
            </div>
            <span className={s.meter}>
              <span ref={meter} className={s.meterFill} />
            </span>
            <span className={s.label}>TUNING SIGNAL</span>
          </div>
          <div className={s.scanlines} aria-hidden />
          <div className={s.roll} aria-hidden />
          <div className={s.noise} aria-hidden />
          <div className={s.vignette} aria-hidden />
          <div className={s.glare} aria-hidden />
        </div>
        <div className={s.bezel} aria-hidden>
          <span>{site.initials}·26</span>
          <span className={s.led} />
        </div>
      </div>
      <div ref={beam} className={s.beam} aria-hidden />
    </div>
  );
}
