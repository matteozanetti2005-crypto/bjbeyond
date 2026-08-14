import { Reveal, RevealGroup, RevealItem } from '@/components/primitives/Reveal';
import { SectionHead } from '@/components/primitives/SectionHead';
import { WORK } from '@/lib/content';

/**
 * WORK — Services
 *
 * Each panel sticks to the top while the next rises over it. The stack is pure
 * CSS — `position: sticky`, an ascending z-index and an opaque panel
 * background. No scroll listener and no pinning, so it cannot desynchronise and
 * it survives reduced-motion untouched.
 *
 * A server component. It renders `Reveal`, which is a client component, but
 * that has never made this one client too — the earlier `'use client'` here
 * only shipped this file to the browser for no return.
 */
export function Work() {
  return (
    <section id="work" aria-labelledby="work-heading" className="relative bg-ink-950">
      {/* Scrolls away normally, before the stack begins. */}
      <div className="u-gutter pt-[var(--spacing-section)]">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4 xl:col-span-3">
            <SectionHead index={WORK.index} label={WORK.label} />
          </div>
          <div className="lg:col-span-8">
            <Reveal delay={0.1}>
              <h2
                id="work-heading"
                className="text-headline font-extralight text-paper"
              >
                {WORK.title}
              </h2>
              <p className="mt-6 max-w-md text-lede font-light text-mist-300">
                {WORK.description}
              </p>
            </Reveal>
          </div>
        </div>
      </div>

      <div className="mt-16 lg:mt-24">
        {WORK.services.map((service, index) => (
          <article
            key={service.number}
            /* The opaque background is load-bearing: each panel has to fully
               occlude the one beneath it. */
            className="sticky top-0 border-t border-rule bg-ink-950"
            style={{ zIndex: index + 1 }}
          >
            <div className="u-gutter flex min-h-[78vh] flex-col justify-center py-16 lg:min-h-screen lg:py-0">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-6">
                {/* Oversized and low-contrast — structure, not content. */}
                <div className="lg:col-span-4 xl:col-span-3">
                  <Reveal>
                    <span
                      aria-hidden="true"
                      className="tabular block text-[clamp(3.5rem,9vw,7rem)] font-extralight leading-[0.85] text-paper/12"
                    >
                      {service.number}
                    </span>
                  </Reveal>
                </div>

                <div className="lg:col-span-5">
                  <Reveal delay={0.06}>
                    <h3 className="text-headline font-extralight leading-[1.02] text-paper">
                      {service.title.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </h3>
                    <p className="mt-7 max-w-sm text-lede font-light text-mist-300">
                      {service.description}
                    </p>
                  </Reveal>
                </div>

                <div className="lg:col-span-3">
                  <RevealGroup delay={0.12}>
                    <ul>
                      {service.points.map((point) => (
                        <RevealItem
                          as="li"
                          key={point}
                          className="u-rule-b py-3.5 text-meta text-mist-200 first:border-t first:border-rule"
                        >
                          {point}
                        </RevealItem>
                      ))}
                    </ul>
                  </RevealGroup>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
