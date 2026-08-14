'use client';

import { useRef, useState } from 'react';
import { Atmosphere } from '@/components/atmosphere/Atmosphere';
import { Reveal } from '@/components/primitives/Reveal';
import { SectionHead } from '@/components/primitives/SectionHead';
import { ArrowLink } from '@/components/primitives/ArrowLink';
import { ButtonLink } from '@/components/primitives/ButtonLink';
import { METHOD } from '@/lib/content';
import { MEDIA } from '@/lib/media';
import { useDesktopGsap } from '@/lib/gsap';

/**
 * 02 — OUR METHOD / PHOENIX SOULFIRE
 *
 * The expansion is STEPPED, not scrubbed. Tying column width to scroll progress
 * is the obvious implementation and relayouts the whole grid on every frame.
 * Instead scroll advances a discrete active index and the widths move on one
 * CSS transition per step — a layout pass every ~900ms, not every frame.
 * Everything genuinely continuous is transform and opacity only.
 */
export function Method() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  const pillars = METHOD.pillars;

  /* The gate keeps the pin off mobile and off reduced-motion entirely, rather
     than a CSS class hiding an animation that still runs — and now keeps the
     library itself off those devices too. */
  useDesktopGsap(({ ScrollTrigger }) => {
    const section = sectionRef.current;
    if (!section) return;

    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      /* Pin length: 78% of a viewport of scroll per pillar. */
      end: () => `+=${pillars.length * 78}%`,
      pin: true,
      /* Never pinSpacing:false — the spacer is what stops the sections after
         this one sliding underneath during the pin. */
      onUpdate: (self) => {
        const index = Math.min(
          pillars.length - 1,
          Math.floor(self.progress * pillars.length),
        );
        setActive(index);
      },
    });
  }, sectionRef);

  return (
    <section
      ref={sectionRef}
      id="method"
      aria-labelledby="method-heading"
      className="relative bg-ink-950 py-[var(--spacing-section)] lg:flex lg:h-screen lg:items-center lg:py-0"
    >
      <div className="u-gutter w-full">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-8">
          <div className="lg:col-span-4 xl:col-span-3">
            <SectionHead index={METHOD.index} label={METHOD.label} />

            <Reveal delay={0.1}>
              <h2
                id="method-heading"
                className="mt-12 text-title font-light tracking-[0.02em] text-paper lg:mt-16"
              >
                {METHOD.title}
                {/* Inline superscript, so the mark never wraps to its own line
                    or inherits the headline tracking. */}
                <span className="align-super text-[0.45em] text-mist-400">
                  {METHOD.trademark}
                </span>
              </h2>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="mt-6 max-w-xs text-body text-mist-300">
                {METHOD.description}
              </p>
            </Reveal>

            {/* Primary first, then the secondary route — the same order
                Authentia uses. `items-start` so the amber field hugs its label
                instead of stretching to the column. */}
            <Reveal delay={0.3} className="mt-8 flex flex-col items-start gap-5">
              <ButtonLink href={METHOD.primary.href} external>
                {METHOD.primary.label}
              </ButtonLink>

              <ArrowLink href="#work">{METHOD.cta}</ArrowLink>
            </Reveal>

            {/* Progress through the five beats. */}
            <Reveal delay={0.35} className="mt-12 hidden lg:block">
              <div className="flex items-center gap-2">
                {pillars.map((pillar, index) => (
                  <span
                    key={pillar.number}
                    aria-hidden="true"
                    className={`h-px transition-all duration-700 ease-[var(--ease-expo)] ${
                      index === active ? 'w-8 bg-amber-400' : 'w-4 bg-rule-strong'
                    }`}
                  />
                ))}
              </div>
              <p className="u-label mt-4 text-mist-400">
                {METHOD.scrollCue.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-8 xl:col-span-9">
            {/* Desktop. `grid-template-columns` is the only layout property
                that moves, and only once per step. */}
            <ul
              className="hidden gap-1.5 lg:grid lg:h-[70vh]"
              style={{
                gridTemplateColumns: pillars
                  .map((_, index) => (index === active ? '2.6fr' : '1fr'))
                  .join(' '),
                transition: 'grid-template-columns 900ms var(--ease-expo)',
              }}
            >
              {pillars.map((pillar, index) => {
                const isActive = index === active;
                return (
                  <li
                    key={pillar.number}
                    className="relative overflow-hidden"
                    aria-current={isActive ? 'true' : undefined}
                  >
                    <div
                      className={`absolute inset-0 transition-opacity duration-[900ms] ease-[var(--ease-expo)] ${
                        isActive ? 'opacity-100' : 'opacity-45'
                      }`}
                    >
                      <Atmosphere
                        media={MEDIA.method[index]}
                        scrim={isActive ? 'soft' : 'strong'}
                        sizes="(max-width: 1024px) 100vw, 22vw"
                        className="h-full w-full"
                      />
                    </div>

                    {/* Amber edge marks the active column. */}
                    <div
                      aria-hidden="true"
                      className={`absolute inset-y-0 left-0 w-px origin-top bg-amber-400 transition-transform duration-[900ms] ease-[var(--ease-expo)] ${
                        isActive ? 'scale-y-100' : 'scale-y-0'
                      }`}
                    />

                    <div className="relative flex h-full flex-col justify-end p-5">
                      <span
                        className={`tabular block font-extralight leading-none transition-all duration-[900ms] ease-[var(--ease-expo)] ${
                          isActive
                            ? 'text-[3.25rem] text-amber-400'
                            : 'text-[2.25rem] text-paper/25'
                        }`}
                      >
                        {pillar.number}
                      </span>

                      <h3 className="u-label mt-4 text-paper">{pillar.title}</h3>

                      <ul className="mt-3 space-y-0.5">
                        {pillar.terms.map((term) => (
                          <li key={term} className="text-meta text-mist-300">
                            {term}
                          </li>
                        ))}
                      </ul>

                      {/* Reserved space at all times: only opacity and offset
                          change. Animating height would reflow the column on
                          every step. */}
                      <p
                        className={`mt-4 h-10 max-w-[22ch] text-meta text-mist-200 transition-all duration-[900ms] ease-[var(--ease-expo)] ${
                          isActive
                            ? 'translate-y-0 opacity-100'
                            : 'pointer-events-none translate-y-2 opacity-0'
                        }`}
                        aria-hidden={!isActive}
                      >
                        {pillar.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Mobile: the same five beats, vertically. */}
            <ul className="space-y-4 lg:hidden">
              {pillars.map((pillar, index) => (
                <Reveal as="li" key={pillar.number} delay={index * 0.04}>
                  <article className="relative h-52 overflow-hidden sm:h-64">
                    <Atmosphere
                      media={MEDIA.method[index]}
                      scrim="strong"
                      sizes="100vw"
                      className="h-full w-full"
                    />
                    <div className="relative flex h-full flex-col justify-end p-5">
                      <span className="tabular block text-[2.5rem] font-extralight leading-none text-amber-400">
                        {pillar.number}
                      </span>
                      <h3 className="u-label mt-3 text-paper">{pillar.title}</h3>
                      <p className="mt-2 text-meta text-mist-200">
                        {pillar.description}
                      </p>
                      <p className="mt-1 text-meta text-mist-400">
                        {pillar.terms.join(' · ')}
                      </p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
