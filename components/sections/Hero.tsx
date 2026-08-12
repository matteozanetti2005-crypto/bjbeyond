'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Atmosphere } from '@/components/atmosphere/Atmosphere';
import { useIntro } from '@/components/chrome/Intro';
import { HERO, SITE } from '@/lib/content';
import { MEDIA } from '@/lib/media';
import { gsap, useGSAP } from '@/lib/gsap';
import { EASE, GSAP_EASE, prefersReducedMotion } from '@/lib/motion';

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
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
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
    },
    { scope: sectionRef },
  );

  /* Off `ready`, never a fixed delay, so the sequence is identical whether or
     not the curtain played. */
  const enter = (delay: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
    transition: { duration: 0.9, ease: EASE.expo, delay },
  });

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative flex min-h-[100dvh] flex-col overflow-hidden"
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
      <motion.div
        className="js-reveal absolute inset-0 z-0"
        initial={{ opacity: 0, scale: 1.09 }}
        animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.09 }}
        transition={{ duration: 2.4, ease: EASE.expo, delay: BEAT.image }}
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
      </motion.div>

      <div className="u-gutter relative z-10 flex flex-1 flex-col justify-between pb-6 pt-28 sm:pt-32">
        <motion.div className="js-reveal max-w-xs" {...enter(BEAT.eyebrow)}>
          <p className="u-label text-paper">
            {HERO.eyebrow.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
          <motion.div
            className="mt-4 h-px w-14 origin-left bg-amber-400"
            initial={{ scaleX: 0 }}
            animate={ready ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1, ease: EASE.expo, delay: BEAT.eyebrow + 0.2 }}
          />
        </motion.div>

        <div className="mt-auto max-w-5xl">
          <h1 className="text-display font-extralight text-paper">
            {HERO.title.map((line, i) => (
              /* Each line rises out of its own clipping box. */
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className="js-reveal block"
                  initial={{ y: '108%' }}
                  animate={ready ? { y: '0%' } : { y: '108%' }}
                  transition={{
                    duration: 1.3,
                    ease: EASE.expo,
                    delay: BEAT.title + i * 0.11,
                  }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className="js-reveal mt-7 max-w-md text-mist-200"
            {...enter(BEAT.subtitle)}
          >
            <span className="u-label leading-[1.9]">
              {HERO.subtitle.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </span>
          </motion.p>
        </div>

        <motion.div
          className="js-reveal pointer-events-none absolute bottom-28 right-[var(--spacing-gutter)] hidden flex-col items-center gap-3 sm:flex"
          {...enter(BEAT.cue)}
        >
          <span className="relative block h-14 w-px overflow-hidden bg-rule-strong">
            <span className="absolute inset-x-0 top-0 block h-1/2 bg-amber-400 motion-safe:animate-[cue-travel_2.4s_var(--ease-expo)_infinite]" />
          </span>
          <span className="u-label text-mist-300">{HERO.scrollCue}</span>
        </motion.div>
      </div>

      <motion.div className="js-reveal relative z-10 u-rule-t" {...enter(BEAT.rail)}>
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
      </motion.div>
    </section>
  );
}
