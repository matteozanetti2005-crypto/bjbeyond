'use client';

import type { ReactNode } from 'react';
import { Magnetic } from './Magnetic';
import { ArrowOutward, EXTERNAL, NewTabHint } from './External';

/**
 * The site's primary call to action: a solid amber field carrying ink-950 type.
 *
 * Deliberately the loudest object in a design otherwise built from hairlines
 * and small caps, which is why there is at most one per screen — a second would
 * stop either reading as primary. Authentia has one, Method has one.
 *
 * The fill is safe as a text surface rather than merely dark-on-light by luck:
 * amber-400 against ink-950 measures 12.14:1, and contrast is symmetric, so
 * ink-950 on amber clears AAA the same way round. See the palette note in
 * globals.css.
 *
 * Extracted from Authentia when Method needed the same treatment. A second
 * hand-rolled copy would have put one design decision under two owners, which
 * is how the two sides drift apart.
 */

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  /**
   * Off-site destination. Brings `rel="noopener noreferrer"`, the outward
   * glyph and the spoken new-tab hint in together — primitives/External exists
   * because those three have to travel as a set. Both call sites pass it; the
   * unmarked form is here so an internal CTA does not have to fake one.
   */
  external?: boolean;
  /** Layout only. Applied to the magnetic wrapper, not the field itself. */
  className?: string;
}

export function ButtonLink({
  href,
  children,
  external = false,
  className = '',
}: ButtonLinkProps) {
  return (
    <Magnetic strength={7} className={className}>
      <a
        href={href}
        {...(external ? EXTERNAL : {})}
        /* `min-h-11` is the 44px touch floor; the padding alone would leave it
           a couple of pixels short at this type size. */
        className="group inline-flex min-h-11 items-center gap-3 bg-amber-400 px-6 py-3.5 text-ink-950 transition-colors duration-200 hover:bg-amber-300"
      >
        <span className="u-label">{children}</span>

        {external && (
          <>
            <ArrowOutward className="transition-transform duration-300 ease-[var(--ease-expo)] motion-safe:group-hover:translate-x-1 motion-safe:group-hover:-translate-y-1" />
            <NewTabHint />
          </>
        )}
      </a>
    </Magnetic>
  );
}
