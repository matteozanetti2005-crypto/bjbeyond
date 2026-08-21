import type { Metadata } from 'next';
import { PageShell } from '@/components/chrome/PageShell';
import { Reveal, RevealGroup, RevealItem } from '@/components/primitives/Reveal';
import { ArrowLink } from '@/components/primitives/ArrowLink';
import { CONTACT, WORK } from '@/lib/content';
import { MEDIA } from '@/lib/media';
import { metadataFor } from '@/lib/routes';

export const metadata: Metadata = metadataFor('/services/');

/**
 * The three offerings, side by side.
 *
 * The homepage stacks these as sticky panels, one occluding the next — which
 * reads beautifully in sequence and hides two thirds of the answer at any
 * moment. This is the page someone lands on to compare, so all three are
 * visible at once and the numbering carries the order instead of the scroll.
 *
 * Copy is WORK in lib/content.ts, unchanged.
 */
export default function ServicesPage() {
  return (
    <PageShell
      index={WORK.index}
      eyebrow={WORK.label.join(' ')}
      title={[WORK.title]}
      standfirst={WORK.description}
      media={MEDIA.method[3]}
    >
      <section className="u-gutter pb-[var(--spacing-section)]">
        <RevealGroup>
          <ul className="grid grid-cols-1 gap-px border-t border-rule bg-rule lg:grid-cols-3">
            {WORK.services.map((service) => (
              <RevealItem
                as="li"
                key={service.number}
                /* The grid gap IS the rule: a 1px gap over a rule-coloured
                   background draws the dividers without a border on each cell
                   doubling up where two cells meet. */
                className="flex flex-col bg-ink-950 px-0 py-10 lg:px-8 lg:py-12"
              >
                <span
                  aria-hidden="true"
                  className="tabular block text-[clamp(2.5rem,6vw,4rem)] font-extralight leading-[0.85] text-paper/12"
                >
                  {service.number}
                </span>

                <h2 className="mt-8 text-title font-extralight leading-[1.05] text-paper">
                  {service.title.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </h2>

                <p className="mt-5 text-body font-light text-mist-300">
                  {service.description}
                </p>

                <ul className="mt-8 border-t border-rule">
                  {service.points.map((point) => (
                    <li
                      key={point}
                      className="u-rule-b py-3.5 text-meta text-mist-200"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </RevealItem>
            ))}
          </ul>
        </RevealGroup>

        <Reveal delay={0.1} className="mt-14">
          <ArrowLink href="/contact/">{CONTACT.label.join(' ')}</ArrowLink>
        </Reveal>
      </section>
    </PageShell>
  );
}
