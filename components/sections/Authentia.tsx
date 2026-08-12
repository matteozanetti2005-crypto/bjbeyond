'use client';

import { Atmosphere } from '@/components/atmosphere/Atmosphere';
import { Reveal, RevealGroup, RevealItem } from '@/components/primitives/Reveal';
import { Magnetic } from '@/components/primitives/Magnetic';
import { AUTHENTIA } from '@/lib/content';
import { AUTHENTIA_LOCKUP, MEDIA, largest, srcSet } from '@/lib/media';
import {
  ArrowOutward,
  EXTERNAL,
  NewTabHint,
} from '@/components/primitives/External';

/**
 * Featured project — Authentia Arte. Deliberately outside the 01–06 sequence:
 * those numbers belong to BJ Beyond's own work, and this recommends someone
 * else's platform.
 *
 * Both links leave the site, so both carry `rel="noopener noreferrer"` and an
 * explicit external marker rather than relying on the arrow alone.
 */
export function Authentia() {
  return (
    <section
      id="authentia"
      aria-labelledby="authentia-heading"
      className="relative bg-ink-950 py-[var(--spacing-section)]"
    >
      <div className="u-gutter">
        <div className="relative overflow-hidden border border-rule-strong">
          <div className="absolute inset-0 z-0 opacity-60">
            <Atmosphere
              media={MEDIA.labs.authentia}
              scrim="strong"
              sizes="100vw"
              className="h-full w-full"
            />
          </div>

          <div className="relative z-10 grid gap-10 p-7 sm:p-10 lg:grid-cols-12 lg:gap-8 lg:p-14">
            <div className="lg:col-span-7">
              <Reveal>
                <p className="u-label flex items-center gap-3 text-amber-400">
                  <span
                    aria-hidden="true"
                    className="block h-1 w-1 rounded-full bg-amber-400"
                  />
                  {AUTHENTIA.eyebrow}
                </p>
              </Reveal>

              {/* The heading is the brand's own lockup. The <img> sits inside
                  the <h2> with the brand name as its alt, so the heading still
                  carries real text for screen readers and the document outline
                  — an image used as a heading only works if it is named. */}
              <Reveal delay={0.05}>
                <h2 id="authentia-heading" className="mt-7">
                  <img
                    src={largest(AUTHENTIA_LOCKUP.src, AUTHENTIA_LOCKUP.widths)}
                    srcSet={srcSet(AUTHENTIA_LOCKUP.src, AUTHENTIA_LOCKUP.widths)}
                    sizes="(max-width: 640px) 15rem, (max-width: 1024px) 22rem, 26rem"
                    width={AUTHENTIA_LOCKUP.width}
                    height={AUTHENTIA_LOCKUP.height}
                    alt={AUTHENTIA_LOCKUP.alt}
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-[clamp(15rem,32vw,26rem)]"
                  />
                </h2>
              </Reveal>

              <Reveal delay={0.15}>
                <p className="mt-7 max-w-lg text-lede font-light text-paper">
                  {AUTHENTIA.standfirst}
                </p>
                <p className="mt-4 max-w-lg text-body font-light text-mist-300">
                  {AUTHENTIA.description}
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-4 lg:col-start-9">
              <RevealGroup delay={0.2}>
                <ul className="border-t border-rule">
                  {AUTHENTIA.points.map((point) => (
                    <RevealItem
                      as="li"
                      key={point}
                      className="border-b border-rule py-3.5 text-meta text-mist-200"
                    >
                      {point}
                    </RevealItem>
                  ))}
                </ul>
              </RevealGroup>

              <Reveal delay={0.3} className="mt-9 flex flex-col gap-4">
                <Magnetic strength={7}>
                  <a
                    href={AUTHENTIA.primary.href}
                    {...EXTERNAL}
                    className="group inline-flex min-h-11 items-center gap-3 bg-amber-400 px-6 py-3.5 text-ink-950 transition-colors duration-200 hover:bg-amber-300"
                  >
                    <span className="u-label">{AUTHENTIA.primary.label}</span>
                    <ArrowOutward className="transition-transform duration-300 ease-[var(--ease-expo)] motion-safe:group-hover:translate-x-1 motion-safe:group-hover:-translate-y-1" />
                    <NewTabHint />
                  </a>
                </Magnetic>

                <a
                  href={AUTHENTIA.secondary.href}
                  {...EXTERNAL}
                  className="group inline-flex min-h-11 items-center gap-3 text-mist-300 transition-colors duration-200 hover:text-paper"
                >
                  <span className="u-label">{AUTHENTIA.secondary.label}</span>
                  <ArrowOutward
                    size={13}
                    className="transition-transform duration-300 ease-[var(--ease-expo)] motion-safe:group-hover:translate-x-1 motion-safe:group-hover:-translate-y-1"
                  />
                  <NewTabHint />
                </a>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
