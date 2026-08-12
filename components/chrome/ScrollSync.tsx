'use client';

import { useEffect } from 'react';
import { ScrollTrigger } from '@/lib/gsap';
import { useIntro } from './Intro';

/**
 * Recalculates every ScrollTrigger once the page has settled.
 *
 * Triggers are created on mount, which happens while the opening curtain still
 * holds `body { overflow: hidden }` — so the document reports zero scrollable
 * height and every trigger computes its range against a page that cannot
 * scroll. The symptom is misleading: Method's pin-spacer gets the correct
 * padding and the layout looks right, but the section never pins.
 *
 * Two refreshes, for the two things that move the layout: the curtain lifting,
 * and webfonts swapping in. Resize is deliberately not handled here —
 * ScrollTrigger already debounces that itself.
 */
export function ScrollSync() {
  const { ready } = useIntro();

  useEffect(() => {
    if (!ready) return;

    /* A frame, so the curtain's exit has released the scroll lock and the
       browser has committed the resulting layout. */
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => cancelAnimationFrame(raf);
  }, [ready]);

  useEffect(() => {
    /* `document.fonts` is absent in older browsers; the refresh above still
       covers the common case. */
    if (!('fonts' in document)) return;

    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
