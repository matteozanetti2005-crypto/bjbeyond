'use client';

import { useRef } from 'react';
import { Atmosphere } from '@/components/atmosphere/Atmosphere';
import { Reveal, RevealGroup, RevealItem, MaskLines } from '@/components/primitives/Reveal';
import { SectionHead } from '@/components/primitives/SectionHead';
import { BEYOND } from '@/lib/content';
import { MEDIA } from '@/lib/media';
import { useDesktopGsap } from '@/lib/gsap';
import { GSAP_EASE } from '@/lib/motion';

/**
 * 01 — WHO IS BJ BEYOND
 *
 * The portrait is held by CSS `position: sticky`, not a ScrollTrigger pin:
 * sticky runs on the compositor, needs no pin spacer, and cannot desynchronise
 * from the scroll position on mobile.
 */
export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  /* Desktop only, for the reason set out in Hero: a scrubbed parallax on touch
     trails the finger by a frame or two and reads as tearing. The hook is the
     gate — it is also what keeps the library off the phone entirely. */
  useDesktopGsap(({ gsap }) => {
    const section = sectionRef.current;
    const backdrop = backdropRef.current;
    if (!section || !backdrop) return;

    /* The only thing moving, and on `yPercent` so it stays on the compositor.
       The overscan is declared in the tween, not as a `scale-110` class: with
       the class GSAP absorbs the scale into the transform it writes, leaving one
       value owned in two places — the split that broke the hero. */
    gsap.fromTo(
      backdrop,
      { yPercent: -8, scale: 1.1 },
      {
        yPercent: 8,
        scale: 1.1,
        ease: GSAP_EASE.none,
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8,
        },
      },
    );
  }, sectionRef);

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-labelledby="about-heading"
      /* Section rhythm belongs here, at every breakpoint. On the grid columns
         behind an `lg:` prefix it left no top padding on phones, colliding with
         the hero's bottom rail. */
      className="relative overflow-hidden bg-ink-950 pt-[var(--spacing-section)]"
    >
      <div ref={backdropRef} className="absolute inset-0 z-0">
        <Atmosphere
          media={MEDIA.backdrop}
          scrim="strong"
          sizes="100vw"
          className="h-full w-full"
        />
      </div>

      <div className="u-gutter relative z-10">
        <div className="grid grid-cols-1 gap-x-8 lg:grid-cols-12 lg:gap-x-6">
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-32">
              <SectionHead index={BEYOND.index} label={BEYOND.label} as="h2" id="about-heading" />

              <Reveal delay={0.3} className="mt-16 hidden lg:block">
                <p className="u-label text-mist-400">
                  {BEYOND.scrollCue.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
                <svg
                  width="34"
                  height="8"
                  viewBox="0 0 34 8"
                  fill="none"
                  aria-hidden="true"
                  className="mt-3 text-mist-500"
                >
                  <path d="M0 4h32M29 1l3.5 3L29 7" stroke="currentColor" strokeWidth="1" />
                </svg>
              </Reveal>
            </div>
          </div>

          <div className="mt-12 lg:col-span-5 lg:mt-0">
            <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-end">
              <Reveal distance={34} className="w-full">
                {/* 9:16 matches the cut-out source, so `object-contain`
                    letterboxes with transparency instead of cropping.

                    72% rather than full width on phones: at 100vw a 9:16 block
                    is most of the screen's height, which made a supporting
                    portrait read as the subject of the section. The desktop
                    composition, where the column already constrains it, is
                    unchanged.

                    The `38vh` is the second half of that rule, and it only
                    bites between phone and desktop. 72% of a 700px-wide column
                    is a 9:16 box over 900px tall — taller than the window it
                    sits in. Since height is width x 16/9, capping the width at
                    38vh caps the height at ~68vh, so the portrait can never
                    outgrow the screen at any width. */}
                <div className="relative mx-auto aspect-9/16 w-[min(72%,38vh)] lg:mx-0 lg:aspect-auto lg:h-[88vh] lg:w-full">
                  <Atmosphere
                    media={MEDIA.portrait}
                    scrim="none"
                    informative
                    /* 66vw, not 72vw: the 72% is of the gutter-inset column,
                       not the viewport. Measured at 375px the slot is 241px —
                       64.3vw — and the gutter's clamp keeps it near 66vw up to
                       the breakpoint. Declaring 72 made the browser budget for
                       270px and step up to the 810w variant to cover it. */
                    sizes="(max-width: 1024px) 66vw, 42vw"
                    className="h-full w-full"
                  />

                  {/* Grounds the figure so it does not appear to float. */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-1/4"
                    style={{
                      background:
                        'linear-gradient(to top, rgb(5 5 5 / 0.85) 0%, transparent 100%)',
                    }}
                  />
                </div>
              </Reveal>
            </div>
          </div>

          <div className="mt-12 lg:col-span-3 lg:mt-0 lg:pt-[18vh]">
            <Reveal delay={0.1}>
              <p className="u-label text-amber-400">{BEYOND.role}</p>
            </Reveal>

            <MaskLines
              lines={[BEYOND.name]}
              as="p"
              className="mt-4 text-headline font-extralight text-paper"
              delay={0.15}
            />

            <Reveal delay={0.25} className="mt-7">
              <p className="border-l border-rule-amber pl-5 text-lede font-light text-paper">
                {BEYOND.lede}
              </p>
              {BEYOND.body.map((paragraph) => (
                <p key={paragraph} className="mt-5 text-body font-light text-mist-300">
                  {paragraph}
                </p>
              ))}
            </Reveal>
          </div>

          <div className="mt-12 lg:col-span-2 lg:mt-0 lg:pt-[18vh]">
            <RevealGroup delay={0.2}>
              <ul className="space-y-7">
                {BEYOND.capabilities.map((capability) => (
                  <RevealItem as="li" key={capability.join(' ')} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-[0.45em] block h-1 w-1 shrink-0 rounded-full bg-amber-400"
                    />
                    <span className="u-label text-mist-200">
                      {capability.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </span>
                  </RevealItem>
                ))}
              </ul>
            </RevealGroup>
          </div>
        </div>

        <RevealGroup className="mt-20 border-t border-rule pb-[var(--spacing-section)] lg:mt-24">
          <dl className="grid grid-cols-2 lg:grid-cols-4">
            {BEYOND.stats.map((stat) => (
              <RevealItem
                as="div"
                key={stat.label}
                /* `flex-col-reverse` puts the number above the label visually
                   while keeping dt-then-dd in the DOM. The obvious shortcut —
                   an sr-only label repeated visibly — makes a screen reader
                   announce every figure's name twice. */
                className="flex flex-col-reverse border-b border-rule py-7 pr-6 lg:border-b-0 lg:border-r lg:last:border-r-0 lg:pl-6 lg:first:pl-0"
              >
                <dt className="u-label mt-3 text-mist-300">{stat.label}</dt>
                <dd className="tabular text-[clamp(2rem,4vw,3rem)] font-extralight leading-none text-amber-400">
                  {stat.value}
                </dd>
              </RevealItem>
            ))}
          </dl>
        </RevealGroup>
      </div>
    </section>
  );
}
