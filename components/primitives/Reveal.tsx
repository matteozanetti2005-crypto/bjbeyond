'use client';

import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';
import { DUR, EASE, STAGGER } from '@/lib/motion';

/**
 * The standard entrance, used for every "content arrives as you reach it"
 * moment. Transform and opacity only. `once: true` settles each element
 * permanently — re-triggering reads as a glitch on the way back up.
 *
 * Under `prefers-reduced-motion`, Framer Motion's `MotionConfig` is not enough
 * on its own; the global CSS rule collapses the duration instead.
 */

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
  as = 'div',
}: RevealProps) {
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: DUR.base, ease: EASE.expo, delay }}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Reveals children in sequence. Wrap `RevealItem`s in this; the step comes from
 * STAGGER in lib/motion.ts, which documents why the range is bounded.
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
  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
    >
      {children}
    </motion.div>
  );
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.base, ease: EASE.expo },
  },
};

export function RevealItem({
  children,
  className = '',
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  /** Must be set to `li` inside a list — a wrapper div there is invalid HTML
   *  and breaks how screen readers announce the list. */
  as?: 'div' | 'li' | 'article' | 'span';
}) {
  const MotionTag = motion[as];

  return (
    <MotionTag className={className} variants={itemVariants}>
      {children}
    </MotionTag>
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
    <Tag className={className} id={id}>
      {lines.map((line, i) => (
        // `pb` stops the clipping box shaving descenders off.
        <span key={i} className="block overflow-hidden pb-[0.12em]">
          <motion.span
            className={`block ${lineClassName}`}
            initial={{ y: '105%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{
              duration,
              ease: EASE.expo,
              delay: delay + i * stagger,
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
