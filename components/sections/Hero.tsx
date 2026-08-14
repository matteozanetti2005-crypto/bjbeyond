'use client';

import { useRef } from 'react';
import { Atmosphere } from '@/components/atmosphere/Atmosphere';
import { useIntro } from '@/components/chrome/Intro';
import { HERO, SITE } from '@/lib/content';
import { MEDIA } from '@/lib/media';
import { useDesktopGsap } from '@/lib/gsap';
import { GSAP_EASE } from '@/lib/motion';
import { ms } from '@/lib/reveal';

/* Entrance beats, in seconds, measured from the moment the curtain lifts. */
const BEAT = {
  image: 0,
  eyebrow: 0.45,
  title: 0.62,
  subtitle: 1.05,
  cue: 1.35,
  rail: 1.45,
} as const;

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const { ready } = useIntro();

  /* Parallax: the frame drifts at ~18% of scroll speed and dims as it goes.
     `scrub: 0.6` rather than `true` — a little lag reads as mass. */
  /*
    Desktop only, and the gate is now the hook itself: `useDesktopGsap` holds
    the media query and only then loads the library, where `gsap.matchMedia()`
    could not answer the question until GSAP was already on the device.

    The reason for the breakpoint is unchanged. On touch the scroll runs on the
    compositor while ScrollTrigger updates on the main thread, so a scrubbed
    parallax arrives a frame or two behind the finger: what should read as depth
    reads as the image sliding loose from the page.
  */
  useDesktopGsap(({ gsap }) => {
    const section = sectionRef.current;
    const layer = parallaxRef.current;
    if (!section || !layer) return;

    /*
      `fromTo` with both ends written out, never `to`. A plain `to` reads its
      start value from the live DOM on every trigger refresh — and ScrollSync
      refreshes just after the curtain lifts, mid-entrance. GSAP would capture
      whatever opacity was on screen at that instant as "the top of the page",
      and scrolling back up returned the image to near-black.
    */
    gsap.fromTo(
      layer,
      { yPercent: 0, opacity: 1 },
      {
        yPercent: 18,
        opacity: 0.45,
        ease: GSAP_EASE.none,
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
        },
      },
    );
  }, sectionRef);

  /* Off `ready`, never a fixed delay, so the sequence is identical whether or
     not the curtain played. The classes and the two custom properties are all
     the CSS in globals.css needs; `is-in` is the only thing that changes. */
  const enter = (delay: number, extra = '') => ({
    className: `u-hero-lift ${ready ? 'is-in' : ''} ${extra}`,
    style: { '--reveal-delay': ms(delay) } as React.CSSProperties,
  });

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
    >
      {/*
        Two nested layers, one owner each: Framer Motion drives the outer
        (entrance, opacity + scale), GSAP the inner (parallax, y + opacity).
        They cannot share an element — both write inline `transform` and
        `opacity`, so on one node the last writer wins at random and the hero
        stays black after scrolling back up.

        z-0 with content above it, not a negative z-index: negative layers paint
        before in-flow block backgrounds and any opaque ancestor hides them.
      */}
      <div
        className={`u-hero-plate absolute inset-0 z-0 ${ready ? 'is-in' : ''}`}
        style={
          {
            '--reveal-duration': ms(2.4),
            '--reveal-delay': ms(BEAT.image),
          } as React.CSSProperties
        }
      >
        <div ref={parallaxRef} className="h-full w-full">
          <Atmosphere
            media={MEDIA.hero}
            priority
            scrim="soft"
            sizes="100vw"
            className="h-full w-full"
          />
        </div>
      </div>

      <div className="u-gutter relative z-10 flex flex-1 flex-col justify-between pb-6 pt-28 sm:pt-32">
        <div {...enter(BEAT.eyebrow, 'max-w-xs')}>
          <p className="u-label text-paper">
            {HERO.eyebrow.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
          <div
            className={`u-hero-rule mt-4 h-px w-14 origin-left bg-amber-400 ${ready ? 'is-in' : ''}`}
            style={
              {
                '--reveal-duration': ms(1),
                '--reveal-delay': ms(BEAT.eyebrow + 0.2),
              } as React.CSSProperties
            }
          />
        </div>

        <div className="mt-auto max-w-5xl">
          <h1 className="text-display font-extralight text-paper">
            {HERO.title.map((line, i) => (
              /* Each line rises out of its own clipping box. */
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <span
                  className={`u-mask-line block ${ready ? 'is-in' : ''}`}
                  style={
                    {
                      '--reveal-duration': ms(1.3),
                      '--reveal-delay': ms(BEAT.title + i * 0.11),
                    } as React.CSSProperties
                  }
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p {...enter(BEAT.subtitle, 'mt-7 max-w-md text-mist-200')}>
            <span className="u-label leading-[1.9]">
              {HERO.subtitle.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </span>
          </p>
        </div>

        <div
          {...enter(
            BEAT.cue,
            'pointer-events-none absolute bottom-28 right-[var(--spacing-gutter)] hidden flex-col items-center gap-3 sm:flex',
          )}
        >
          <span className="relative block h-14 w-px overflow-hidden bg-rule-strong">
            <span className="absolute inset-x-0 top-0 block h-1/2 bg-amber-400 motion-safe:animate-[cue-travel_2.4s_var(--ease-expo)_infinite]" />
          </span>
          <span className="u-label text-mist-300">{HERO.scrollCue}</span>
        </div>
      </div>

      <div {...enter(BEAT.rail, 'relative z-10 u-rule-t')}>
        <div className="u-gutter flex items-center gap-6 py-4">
          <span className="u-label shrink-0 text-paper">
            {SITE.wordmark}
            <span className="align-super text-[0.6em] text-mist-400">™</span>
          </span>

          <span className="hidden h-px flex-1 bg-rule sm:block" />

          {/* Duplicated once and translated -50%: that is what makes the loop
              seamless. `motion-safe` leaves it a static list. */}
          <div className="u-hide-scrollbar relative flex-1 overflow-hidden sm:flex-none sm:w-[min(46vw,30rem)]">
            <div className="flex w-max motion-safe:animate-[ticker-scroll_26s_linear_infinite]">
              {[0, 1].map((copy) => (
                <ul
                  key={copy}
                  className="flex shrink-0 items-center"
                  aria-hidden={copy === 1 ? 'true' : undefined}
                >
                  {HERO.ticker.map((word) => (
                    <li key={word} className="flex items-center">
                      <span className="u-label whitespace-nowrap text-mist-300">
                        {word}
                      </span>
                      <span
                        aria-hidden="true"
                        className="mx-5 block h-1 w-1 rounded-full bg-amber-400/70"
                      />
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
