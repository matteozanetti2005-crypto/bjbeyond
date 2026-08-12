'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

/**
 * Single registration point for GSAP.
 *
 * Guarded on `window`: client components still execute their module scope
 * during static export, and ScrollTrigger measures the document as soon as it
 * is active. Animations are only ever created inside `useGSAP`, which reverts
 * on unmount — that is what stops stale ScrollTriggers accumulating.
 */
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger, useGSAP };
