'use client';

import type { CSSProperties, ReactNode } from 'react';
import { DUR, STAGGER } from '@/lib/motion';
import { ms, useRevealRef } from '@/lib/reveal';

/**
 * The standard entrance, used for every "content arrives as you reach it"
 * moment. Transform and opacity only, one way only — re-triggering on the way
 * back up reads as a glitch.
 *
 * No animation library. The curves and durations are in globals.css, driven by
 * the three custom properties below; lib/reveal.ts adds `is-in` when the
 * element comes into view. Under `prefers-reduced-motion` the global rule
 * collapses the transition, so the element still arrives — instantly, and
 * legible.
 */

/** The three knobs the CSS reads. Kept in one place so every variant agrees. */
function vars(delay: number, duration?: number, distance?: number): CSSProperties {
  return {
    '--reveal-delay': ms(delay),
    ...(duration ? { '--reveal-duration': ms(duration) } : null),
    ...(distance !== undefined ? { '--reveal-distance': `${distance}px` } : null),
  } as CSSProperties;
}

interface RevealProps {
  children: ReactNode;
  /** Seconds of delay before this element starts. */
  delay?: number;
  /** Travel distance in pixels. Larger masses should move less, not more. */
  distance?: number;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'li' | 'span';
}

export function Reveal({
  children,
  delay = 0,
  distance = 26,
  className = '',
  as: Tag = 'div',
}: RevealProps) {
  return (
    <Tag ref={useRevealRef()} className={`u-reveal ${className}`} style={vars(delay, DUR.base, distance)}>
      {children}
    </Tag>
  );
}

/**
 * Reveals children in sequence. Wrap `RevealItem`s in this; the step comes from
 * STAGGER in lib/motion.ts, which documents why the range is bounded.
 *
 * The group is what gets observed — the items are revealed together with it,
 * each offset by its position. That is deliberate: observing every item
 * separately made the last one in a row wait for its own intersection and the
 * sequence read as ragged rather than staggered.
 */
export function RevealGroup({
  children,
  className = '',
  stagger = STAGGER.base,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}) {
  return (
    <div
      ref={useRevealRef()}
      className={className}
      data-stagger={Math.round(stagger * 1000)}
      data-stagger-delay={Math.round(delay * 1000)}
    >
      {children}
    </div>
  );
}

export function RevealItem({
  children,
  className = '',
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  /** Must be set to `li` inside a list — a wrapper div there is invalid HTML
   *  and breaks how screen readers announce the list. */
  as?: 'div' | 'li' | 'article' | 'span';
}) {
  /* No ref: the group observes, and hands each item its delay on arrival. */
  return (
    <Tag className={`u-reveal ${className}`} data-reveal-item style={vars(0, DUR.base, 22)}>
      {children}
    </Tag>
  );
}

/**
 * Line-by-line mask reveal, for headlines. Each line rises out of its own
 * clipping box.
 *
 * Copy arrives pre-split as an array (see lib/content.ts) rather than being
 * broken up at runtime, which keeps every line a real text node for screen
 * readers and avoids a layout pass on mount.
 */
export function MaskLines({
  lines,
  className = '',
  lineClassName = '',
  delay = 0,
  stagger = 0.09,
  duration = DUR.slow,
  as: Tag = 'div',
  id,
}: {
  lines: readonly string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  as?: 'div' | 'h1' | 'h2' | 'h3' | 'p';
  /** Lets a section point `aria-labelledby` at the real heading, rather than
   *  duplicating it in a visually hidden one. */
  id?: string;
}) {
  return (
    <Tag ref={useRevealRef()} className={className} id={id} data-stagger={Math.round(stagger * 1000)} data-stagger-delay={Math.round(delay * 1000)}>
      {lines.map((line) => (
        // `pb` stops the clipping box shaving descenders off.
        <span key={line} className="block overflow-hidden pb-[0.12em]">
          <span
            className={`u-mask-line block ${lineClassName}`}
            data-reveal-item
            style={vars(0, duration)}
          >
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
