'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { site } from '@/content/site';
import { REDUCED_MOTION } from '@/hooks/useMedia';
import { EASE, EASE_IN_OUT, gsap, ScrollTrigger } from '@/lib/gsap';
import { lockScroll, scrollToTarget } from '@/lib/scroll';
import { useIntro } from './IntroProvider';
import s from './PageLoader.module.css';

/**
 * The fast, branded loader: a curtain with the monogram and a progress bar.
 * Used for every route change and for direct loads of any page except the
 * homepage's first visit (that one gets the CRT boot).
 */
export default function PageLoader() {
  const { setReady, registerNavigator } = useIntro();
  const router = useRouter();
  const pathname = usePathname();
  const root = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const letters = useRef<HTMLSpanElement>(null);
  const pathLabel = useRef<HTMLSpanElement>(null);
  const pendingPath = useRef<string | null>(null);
  const busy = useRef(false);

  const reduced = () => window.matchMedia(REDUCED_MOTION).matches;

  const reveal = () => {
    const shell = document.getElementById('shell');
    const html = document.documentElement;
    const hash = window.location.hash;
    scrollToTarget(hash && document.querySelector(hash) ? hash : 0, true);
    if (!hash) window.scrollTo(0, 0);

    gsap.set(root.current, { visibility: 'visible', clipPath: 'inset(0% 0% 0% 0%)', autoAlpha: 1 });
    html.classList.remove('page-pending');

    const done = () => {
      gsap.set(root.current, { visibility: 'hidden' });
      if (shell) gsap.set(shell, { clearProps: 'transform' });
      lockScroll(false);
      busy.current = false;
      ScrollTrigger.refresh();
    };

    if (reduced()) {
      setReady(true);
      gsap.to(root.current, { autoAlpha: 0, duration: 0.3, ease: 'none', onComplete: done });
      return;
    }

    gsap
      .timeline({ onComplete: done })
      .to(bar.current, { scaleX: 1, duration: 0.35, ease: EASE })
      .to(letters.current, { yPercent: -110, duration: 0.5, ease: 'power3.in' }, '+=0.05')
      .addLabel('lift')
      .to(root.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.85, ease: EASE_IN_OUT }, 'lift')
      .fromTo(shell, { y: 120 }, { y: 0, duration: 1.1, ease: EASE }, 'lift+=0.15')
      .add(() => setReady(true), 'lift+=0.2');
  };

  // Direct load of a page while `page-pending` is on <html>: fill, then lift.
  useEffect(() => {
    if (!document.documentElement.classList.contains('page-pending')) return;
    busy.current = true;
    lockScroll(true);
    if (pathLabel.current) pathLabel.current.textContent = window.location.pathname;
    const loaded = new Promise<void>((resolve) => {
      if (document.readyState === 'complete') resolve();
      else window.addEventListener('load', () => resolve(), { once: true });
    });
    const minTime = new Promise<void>((resolve) => setTimeout(resolve, reduced() ? 0 : 700));
    const fill = reduced() ? null : gsap.fromTo(bar.current, { scaleX: 0 }, { scaleX: 0.85, duration: 0.9, ease: EASE });
    let cancelled = false;
    Promise.race([Promise.all([loaded, minTime]), new Promise((r) => setTimeout(r, 5000))]).then(() => {
      if (!cancelled) reveal();
    });
    return () => {
      cancelled = true;
      fill?.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Link clicks: drop the curtain, then navigate.
  useEffect(
    () =>
      registerNavigator((href) => {
        if (busy.current) return;
        busy.current = true;
        lockScroll(true);
        const target = new URL(href, window.location.href);
        if (pathLabel.current) pathLabel.current.textContent = target.pathname;

        const go = () => {
          setReady(false);
          pendingPath.current = target.pathname;
          router.push(href, { scroll: false });
        };

        if (reduced()) {
          gsap.set(root.current, { visibility: 'visible', clipPath: 'inset(0% 0% 0% 0%)' });
          gsap.fromTo(root.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, ease: 'none', onComplete: go });
          return;
        }

        gsap
          .timeline({ onComplete: go })
          .set(root.current, { visibility: 'visible', autoAlpha: 1, clipPath: 'inset(100% 0% 0% 0%)' })
          .set(bar.current, { scaleX: 0 })
          .set(letters.current, { yPercent: 110 })
          .to(root.current, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: EASE_IN_OUT })
          .to(letters.current, { yPercent: 0, duration: 0.6, ease: EASE }, '-=0.25')
          .to(bar.current, { scaleX: 0.7, duration: 0.6, ease: EASE }, '<');
      }),
    [registerNavigator, router, setReady],
  );

  // New route rendered: finish the bar and lift the curtain.
  useEffect(() => {
    if (pendingPath.current && pendingPath.current === pathname) {
      pendingPath.current = null;
      requestAnimationFrame(reveal);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div ref={root} className={s.root} aria-hidden>
      <div className={s.center}>
        <span className={s.mask}>
          <span ref={letters} className={s.mark}>
            {site.initials}
            <span className={s.dot}>.</span>
          </span>
        </span>
      </div>
      <div className={s.foot}>
        <span ref={pathLabel} className={s.path}>
          /
        </span>
        <span className={s.name}>{site.name}</span>
      </div>
      <span className={s.track}>
        <span ref={bar} className={s.bar} />
      </span>
    </div>
  );
}
