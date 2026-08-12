/**
 * Three things travel together on every outbound link:
 *
 *  - `target="_blank"` with `rel="noopener noreferrer"` — without `noopener`
 *    the opened page gets `window.opener` and can navigate this one.
 *  - A visible outward glyph.
 *  - A spoken hint, since a screen-reader user gets nothing from the icon.
 */

/** Spread onto any anchor whose destination is off-site. */
export const EXTERNAL = {
  target: '_blank',
  rel: 'noopener noreferrer',
} as const;

/** Decorative — the link's own text carries the meaning. */
export function ArrowOutward({
  size = 15,
  className = '',
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 15 15"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path d="M3 12 12 3M5 3h7v7" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

/** The spoken half of the affordance. Pair with `ArrowOutward`. */
export function NewTabHint() {
  return <span className="sr-only">(opens in a new tab)</span>;
}
