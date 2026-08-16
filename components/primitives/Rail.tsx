'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';

/**
 * A horizontal, snapping shelf.
 *
 * Native scrolling, not a carousel: no transform track, no index state, no
 * autoplay, nothing to desynchronise. The browser already does momentum,
 * snapping, trackpad gestures and — the part a JavaScript carousel always gets
 * wrong — scrolling a focused card into view when it is reached by Tab. All
 * this file adds is the pair of desktop buttons, because a mouse without a
 * horizontal wheel has no other way to reach the far end.
 *
 * The buttons are the only reason it is a client component. Everything else,
 * including every card passed as `children`, stays server-rendered.
 */

interface RailProps {
  children: ReactNode;
  /** Names the shelf for assistive technology, e.g. 'Selected posts'. */
  label: string;
  /** Shown beneath the rail on touch, where there are no buttons to press. */
  hint?: string;
  /** Extra classes on the scrolling track — gap and item sizing. */
  className?: string;
}

/** 1px of slack. Sub-pixel layout leaves `scrollWidth` a fraction above
 *  `clientWidth` at non-integer zoom, which would read as permanent overflow. */
const SLACK = 1;

export function Rail({ children, label, hint, className = '' }: RailProps) {
  const trackId = useId();
  const track = useRef<HTMLDivElement>(null);

  const [overflows, setOverflows] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  /* Same shape as the progress bar in Navigation: one passive listener,
     coalesced into a single frame. The three values only gate the buttons, so
     they are cheap state — identical values bail out inside React. */
  useEffect(() => {
    const el = track.current;
    if (!el) return;

    let queued = false;

    const measure = () => {
      queued = false;
      const max = el.scrollWidth - el.clientWidth;
      setOverflows(max > SLACK);
      setAtStart(el.scrollLeft <= SLACK);
      setAtEnd(el.scrollLeft >= max - SLACK);
    };

    const schedule = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(measure);
    };

    measure();
    el.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });

    return () => {
      el.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  const page = useCallback((direction: 1 | -1) => {
    const el = track.current;
    if (!el) return;

    /* 82% of the visible width rather than 100%: a card stays on screen across
       the jump, so the reader keeps their place. Snapping settles the landing on
       a card edge, which is why this never has to know how wide a card is. */
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({
      left: direction * el.clientWidth * 0.82,
      behavior: reduce ? 'auto' : 'smooth',
    });
  }, []);

  return (
    <div>
      <div
        id={trackId}
        ref={track}
        role="group"
        aria-label={label}
        className={`u-rail u-gutter flex snap-x snap-mandatory overflow-x-auto pb-5 ${className}`}
      >
        {children}
      </div>

      {/*
        Always rendered, at a fixed height, even when it holds nothing.

        `overflows` is false on the server and only becomes true after the first
        measurement, so anything conditional here would appear at hydration and
        push every following section down the page. Reserving the row costs 44px
        of empty space in the one case where the cards already fit.
      */}
      <div className="u-gutter mt-6 flex min-h-11 items-center justify-between gap-6">
        {overflows && hint ? (
          <p className="u-label text-mist-400 lg:hidden">{hint}</p>
        ) : null}

        {overflows ? (
          <div className="ml-auto hidden items-center gap-2 lg:flex">
            <RailButton
              direction={-1}
              controls={trackId}
              disabled={atStart}
              onPress={() => page(-1)}
            />
            <RailButton
              direction={1}
              controls={trackId}
              disabled={atEnd}
              onPress={() => page(1)}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

/**
 * `h-11 w-11` is the 44px touch floor even though these are desktop-only — a
 * desktop-width touchscreen is not a rare device.
 *
 * The disabled state drops to mist-500, which the palette marks as non-text.
 * That is correct here twice over: it is a glyph rather than type, and WCAG
 * exempts inactive controls from contrast minimums.
 */
function RailButton({
  direction,
  controls,
  disabled,
  onPress,
}: {
  direction: 1 | -1;
  controls: string;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onPress}
      disabled={disabled}
      aria-controls={controls}
      aria-label={direction === -1 ? 'Scroll back' : 'Scroll forward'}
      className="flex h-11 w-11 items-center justify-center border border-rule-strong text-paper transition-colors duration-200 hover:border-amber-400 hover:text-amber-400 disabled:pointer-events-none disabled:border-rule disabled:text-mist-500"
    >
      <svg
        width="18"
        height="8"
        viewBox="0 0 18 8"
        fill="none"
        aria-hidden="true"
        className={direction === -1 ? 'rotate-180' : ''}
      >
        <path d="M0 4h16M13 1l3 3-3 3" stroke="currentColor" strokeWidth="1" />
      </svg>
    </button>
  );
}
