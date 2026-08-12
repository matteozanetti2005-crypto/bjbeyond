'use client';

import type { ReactNode } from 'react';
import { Magnetic } from './Magnetic';
import { EXTERNAL } from './External';

/**
 * The site's one link treatment.
 *
 * The hairline and arrow are decorative — the label always carries the meaning,
 * so the affordance is never colour- or motion-dependent. `group-focus-visible`
 * mirrors every hover state, so keyboard users get identical feedback.
 */

interface ArrowLinkProps {
  href: string;
  children: ReactNode;
  /**
   * Adds `target="_blank"` + `rel="noopener noreferrer"`. It does NOT swap in
   * the outbound glyph or the new-tab hint — for a fully marked external link
   * use ArrowOutward + NewTabHint from primitives/External, as Authentia and
   * Footer do. No call site currently passes this.
   */
  external?: boolean;
  className?: string;
  /** Disables the magnetic pull for links inside dense lists. */
  magnetic?: boolean;
  onClick?: () => void;
}

export function ArrowLink({
  href,
  children,
  external = false,
  className = '',
  magnetic = true,
  onClick,
}: ArrowLinkProps) {
  const inner = (
    /* `min-h-11` is the 44px touch floor. The extra height comes from the flex
       box centring the label, so the target grows without the design changing. */
    <span
      className={`group inline-flex min-h-11 items-center text-mist-200 transition-colors duration-200 hover:text-paper focus-visible:text-paper ${className}`}
    >
      {/* Hugs the content, so the hairline sits against the label rather than
          at the bottom of the enlarged hit area. */}
      <span className="relative inline-flex items-center gap-3">
        <span className="u-label">{children}</span>

        <svg
          width="22"
          height="8"
          viewBox="0 0 22 8"
          fill="none"
          aria-hidden="true"
          className="translate-x-0 transition-transform duration-300 ease-[var(--ease-expo)] motion-safe:group-hover:translate-x-1.5 motion-safe:group-focus-visible:translate-x-1.5"
        >
          <path d="M0 4h20M17 1l3.5 3L17 7" stroke="currentColor" strokeWidth="1" />
        </svg>

        {/* Scales from the left rather than animating width. */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 -bottom-2 h-px origin-left scale-x-0 bg-amber-400 transition-transform duration-400 ease-[var(--ease-expo)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
        />
      </span>
    </span>
  );

  const wrapped = magnetic ? <Magnetic strength={8}>{inner}</Magnetic> : inner;

  /* inline-flex, never the default inline: an inline anchor is measured as a
     line box and reports ~20px tall however large the span inside it is, so the
     hit area looks compliant in the markup and still fails in the hand. */
  const anchorClass = 'inline-flex';

  if (external) {
    return (
      <a
        href={href}
        {...EXTERNAL}
        onClick={onClick}
        className={anchorClass}
      >
        {wrapped}
      </a>
    );
  }

  /*
    A plain anchor, deliberately. The only router route is `/`; the destinations
    that look internal — /phoenix, /frequency, /pages/*.html — are standalone
    documents served from `public/`. `next/link` would resolve them against a
    route manifest that has never heard of them and prefetch a payload that does
    not exist. Same-page anchors stay native so CSS smooth scrolling handles
    them rather than a router push.
  */
  return (
    <a href={href} onClick={onClick} className={anchorClass}>
      {wrapped}
    </a>
  );
}
