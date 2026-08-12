'use client';

import { Reveal } from './Reveal';

/**
 * Renders pre-split copy (see lib/content.ts) one line per block, so a
 * tracked-out label breaks where the writer chose rather than wherever the
 * container happens to end.
 */
export function StackedLabel({ lines }: { lines: string | readonly string[] }) {
  if (typeof lines === 'string') return <>{lines}</>;

  return (
    <>
      {lines.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </>
  );
}

interface SectionHeadProps {
  /** The section's index, e.g. "01". Omit for sections outside the sequence. */
  index?: string;
  label: string | readonly string[];
  /**
   * `h2` when this label IS the section's heading; `p` when the section has a
   * separate display heading further down and this is only its rail marker.
   * Getting this wrong either duplicates a heading or leaves a gap in the
   * document outline.
   */
  as?: 'h2' | 'p';
  /** Required when `as` is `h2` and the section uses `aria-labelledby`. */
  id?: string;
}

/**
 * The rail marker that opens each of the six numbered sections: index, stacked
 * label, short rule.
 * The entrance is part of the pattern, so `Reveal` lives inside rather than
 * being re-wrapped at each call site.
 */
export function SectionHead({ index, label, as = 'p', id }: SectionHeadProps) {
  const Label = as;

  return (
    <Reveal>
      {index ? <p className="u-label tabular text-amber-400">{index}</p> : null}
      <Label id={id} className={`u-label text-paper${index ? ' mt-3' : ''}`}>
        <StackedLabel lines={label} />
      </Label>
      <div className="mt-5 h-px w-10 bg-amber-400/60" />
    </Reveal>
  );
}
