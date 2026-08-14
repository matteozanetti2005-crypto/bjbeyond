'use client';

import { useCallback } from 'react';

/**
 * The entire scroll-reveal machinery: one observer, one class.
 *
 * Framer Motion's `whileInView` created an observer per element — seventy of
 * them on the home page, each with its own callback closure and its own
 * subscription to the library's animation loop. The visual result was a
 * transition between two states, which is what CSS transitions are for. So the
 * curves and durations live in globals.css and this file does the only thing
 * CSS cannot: notice that an element has come into view.
 *
 * Elements are unobserved the moment they fire. Reveals are one-way by design —
 * re-triggering on the way back up reads as a glitch — so an element that has
 * arrived costs nothing further.
 */

/** Anything with a layout box and a `dataset`. SVG is included because the
 *  market chart is observed on its own `<svg>` — see the drawing rules in
 *  globals.css. */
type RevealTarget = HTMLElement | SVGElement;

let observer: IntersectionObserver | null = null;

/**
 * `-12%` of the viewport, matching the margin the Framer Motion version used:
 * an element starts its entrance slightly before its top edge is reached, so
 * the motion is already underway when it enters the reader's attention.
 */
const ROOT_MARGIN = '0px 0px -12% 0px';

function getObserver(): IntersectionObserver | null {
  if (typeof window === 'undefined') return null;
  if (observer) return observer;

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        show(entry.target as RevealTarget);
        observer?.unobserve(entry.target);
      }
    },
    { rootMargin: ROOT_MARGIN },
  );

  return observer;
}

/**
 * Reveals an element, and any staggered children beneath it.
 *
 * The stagger is applied here rather than by cloning React children: a group
 * declares its step in `data-stagger` and marks its items with
 * `data-reveal-item`, and the delay is written as an inline transition-delay at
 * the moment the group arrives. Nothing has to know the index at render time.
 */
function show(el: RevealTarget) {
  el.classList.add('is-in');

  const step = Number(el.dataset.stagger ?? 0);
  if (!step) return;

  const items = el.querySelectorAll<HTMLElement>('[data-reveal-item]');
  const base = Number(el.dataset.staggerDelay ?? 0);

  items.forEach((item, i) => {
    item.style.transitionDelay = `${base + i * step}ms`;
    item.classList.add('is-in');
  });
}

/**
 * Ref callback that observes the node while it is mounted and stops when it
 * unmounts. React 19 calls the cleanup returned from a ref callback, so there
 * is no effect and no dependency array here.
 */
export function useRevealRef() {
  return useCallback((node: RevealTarget | null) => {
    if (!node) return;

    const io = getObserver();
    if (!io) {
      /* No IntersectionObserver — show it rather than hide it forever. */
      node.classList.add('is-in');
      return;
    }

    io.observe(node);
    return () => io.unobserve(node);
  }, []);
}

/** Milliseconds from the seconds the call sites are written in. */
export function ms(seconds: number): string {
  return `${Math.round(seconds * 1000)}ms`;
}
