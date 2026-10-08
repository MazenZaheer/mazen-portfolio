'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

/** One easing for every scroll/intro animation, so motion reads as one system. */
export const EASE = 'power3.out';
export const EASE_IN_OUT = 'power3.inOut';

/** CSS twin of power3.out, for transitions and Framer Motion. */
export const EASE_CSS: [number, number, number, number] = [0.33, 1, 0.68, 1];

gsap.defaults({ ease: EASE, duration: 1 });

export { gsap, ScrollTrigger, SplitText, useGSAP };
