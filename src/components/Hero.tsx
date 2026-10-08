'use client';

import { motion, useMotionValue, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import { chapters, site } from '@/content/site';
import { useReducedMotion } from '@/hooks/useMedia';
import { EASE, gsap, useGSAP } from '@/lib/gsap';
import Carousel from './Carousel';
import { useIntro } from './IntroProvider';
import s from './Hero.module.css';

/**
 * Full-bleed, slowly panning photograph with a draggable carousel on top.
 * Three depths: background (slowest), headline, cards (fastest).
 */
export default function Hero() {
  const { ready } = useIntro();
  const reduced = useReducedMotion();
  const root = useRef<HTMLElement>(null);
  const spin = useMotionValue(0);

  const { scrollYProgress } = useScroll({ target: root, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '22%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '-18%']);
  // Spinning the ring drifts the backdrop a little the other way: depth.
  const bgX = useTransform(spin, (deg) => (reduced ? 0 : Math.sin((deg * Math.PI) / 180) * -36));

  useGSAP(
    () => {
      const parts = '[data-hero-word], [data-hero-fade], [data-hero-ring], [data-hero-feature]';
      if (!ready) {
        gsap.set(parts, { autoAlpha: 0 });
        return;
      }
      if (reduced) {
        gsap.set(parts, { autoAlpha: 1 });
        return;
      }
      gsap
        .timeline({ defaults: { ease: EASE } })
        .fromTo('[data-hero-word]', { yPercent: 115, autoAlpha: 1 }, { yPercent: 0, duration: 1.4, stagger: 0.1 })
        .fromTo('[data-hero-fade]', { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, stagger: 0.08 }, 0.35)
        .fromTo('[data-hero-ring]', { scale: 0.8, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1.8 }, 0.1)
        .fromTo(
          '[data-hero-feature]',
          { y: 80, autoAlpha: 0, clipPath: 'inset(100% 0% 0% 0%)' },
          { y: 0, autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, clearProps: 'clipPath,transform' },
          0.25,
        );
    },
    { scope: root, dependencies: [ready, reduced] },
  );

  // The full stop is drawn in the accent colour, so drop any trailing one from the name.
  const [first, ...rest] = site.name.replace(/\.$/, '').split(' ');

  return (
    <section ref={root} className={s.hero} id="top" data-theme="dark">
      <motion.div className={s.bg} style={{ y: bgY, x: bgX }} aria-hidden>
        <div className={s.pan}>
          <Image src={site.heroImage} alt="" fill priority sizes="100vw" className={s.bgImage} />
        </div>
        <div className={s.scrim} />
      </motion.div>

      <motion.div className={s.inner} style={{ y: textY }}>
        <div className={s.topRow}>
          <span data-hero-fade>Portfolio ©2026</span>
          <span data-hero-fade>{site.role}</span>
          <span data-hero-fade className={s.hideSm}>
            {site.location}
          </span>
        </div>

        <div className={s.headline}>
          <h1 className={s.title} aria-label={site.name}>
            <span className={s.word}>
              <span data-hero-word>{first}</span>
            </span>{' '}
            <span className={s.word}>
              <span data-hero-word>
                {rest.join(' ')}
                <span className={s.dot}>.</span>
              </span>
            </span>
          </h1>

          <p className={s.lede} data-hero-fade>
            {site.headline}
          </p>
        </div>
      </motion.div>

      <div className={s.rail}>
        <Carousel items={chapters} spin={spin} />
      </div>
    </section>
  );
}
