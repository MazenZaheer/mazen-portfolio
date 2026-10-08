'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { useIntro } from './IntroProvider';
import s from './ColorRevealImage.module.css';

/** Full-width image whose colour is scrubbed in by scroll position. */
export default function ColorRevealImage({ src, alt }: { src: string; alt: string }) {
  const root = useRef<HTMLDivElement>(null);
  const { ready } = useIntro();

  useGSAP(
    () => {
      if (!ready) return;
      const img = root.current?.querySelector('img');
      if (!img) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          img,
          { filter: 'grayscale(100%)', scale: 1.12 },
          {
            filter: 'grayscale(0%)',
            scale: 1,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top 80%', end: 'center 40%', scrub: true },
          },
        );
      });
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(img, { filter: 'grayscale(0%)' });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [ready], revertOnUpdate: true },
  );

  return (
    <div ref={root} className={s.frame}>
      <Image src={src} alt={alt} fill priority sizes="100vw" className={s.image} />
    </div>
  );
}
