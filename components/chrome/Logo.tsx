import { LOGO, largest, srcSet } from '@/lib/media';

/**
 * The BJ monogram. `<img>`, not inline SVG: the supplied master is a bitmap
 * with an alpha channel, and tracing it would change the geometry. Always white
 * on a dark surface, so it does not inherit `currentColor` and must not be
 * recoloured.
 */

interface LogoProps {
  className?: string;
  /** Accessible name. Pass null when nearby text already names it. */
  title?: string | null;
}

export function Logo({ className = '', title = LOGO.alt }: LogoProps) {
  return (
    <img
      src={largest(LOGO.src, LOGO.widths)}
      srcSet={srcSet(LOGO.src, LOGO.widths)}
      sizes="(max-width: 640px) 96px, 128px"
      width={LOGO.width}
      height={LOGO.height}
      alt={title ?? ''}
      /* Decorative when unnamed, or a screen reader announces the mark twice
         next to the wordmark already beside it. */
      aria-hidden={title ? undefined : true}
      decoding="async"
      className={`h-auto ${className}`}
    />
  );
}
