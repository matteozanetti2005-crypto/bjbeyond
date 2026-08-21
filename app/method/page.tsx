import type { Metadata } from 'next';
import { PageShell } from '@/components/chrome/PageShell';
import { Reveal, RevealGroup, RevealItem } from '@/components/primitives/Reveal';
import { ButtonLink } from '@/components/primitives/ButtonLink';
import { ArrowLink } from '@/components/primitives/ArrowLink';
import { CONTACT, METHOD } from '@/lib/content';
import { MEDIA } from '@/lib/media';
import { metadataFor } from '@/lib/routes';

export const metadata: Metadata = metadataFor('/method/');

/**
 * The five pillars, at rest.
 *
 * The homepage shows the same five inside a pinned, scroll-driven expansion —
 * an entrance, and a good one. This page deliberately does not repeat it. A
 * visitor arriving here came from a search result or an ad for the framework
 * itself: they want to read the five pillars, and a layout that reveals one at
 * a time makes that slower than a list. Same content, opposite job.
 *
 * Nothing here is authored: every string is METHOD in lib/content.ts, which is
 * where the copy stays.
 */
export default function MethodPage() {
  return (
    <PageShell
      index={METHOD.index}
      eyebrow={METHOD.label.join(' ')}
      title={[METHOD.title]}
      trademark={METHOD.trademark}
      standfirst={METHOD.description}
      media={MEDIA.method[0]}
    >
      <section className="u-gutter pb-[var(--spacing-section)]">
        <RevealGroup>
          <ol className="border-t border-rule">
            {METHOD.pillars.map((pillar) => (
              <RevealItem
                as="li"
                key={pillar.number}
                className="border-b border-rule py-10 sm:py-12"
              >
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-6">
                  {/* Oversized and low-contrast — structure, not content. */}
                  <div className="lg:col-span-2">
                    <span
                      aria-hidden="true"
                      className="tabular block text-[clamp(2.5rem,6vw,4.5rem)] font-extralight leading-[0.85] text-paper/12"
                    >
                      {pillar.number}
                    </span>
                  </div>

                  <div className="lg:col-span-5">
                    <h2 className="text-headline font-extralight leading-none text-paper">
                      {pillar.title}
                    </h2>
                    <p className="mt-5 max-w-sm text-lede font-light text-mist-300">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="lg:col-span-4 lg:col-start-9">
                    <ul className="flex flex-wrap gap-x-6 gap-y-2 lg:flex-col lg:gap-y-3">
                      {pillar.terms.map((term) => (
                        <li key={term} className="u-label text-mist-400">
                          {term}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </RevealItem>
            ))}
          </ol>
        </RevealGroup>

        <Reveal delay={0.1} className="mt-14">
          <div className="flex flex-wrap items-center gap-x-10 gap-y-6">
            <ButtonLink href={METHOD.primary.href} external>
              {METHOD.primary.label}
            </ButtonLink>
            <ArrowLink href="/contact/">{CONTACT.label.join(' ')}</ArrowLink>
          </div>
        </Reveal>
      </section>
    </PageShell>
  );
}
