import { Atmosphere } from '@/components/atmosphere/Atmosphere';
import { Reveal, RevealGroup, RevealItem } from '@/components/primitives/Reveal';
import { IN_MOTION } from '@/lib/content';
import { MEDIA } from '@/lib/media';
import {
  ArrowOutward,
  EXTERNAL,
  NewTabHint,
} from '@/components/primitives/External';

/**
 * IN MOTION — reels from the Authentia Arte channel.
 *
 * Companion to the Authentia section above and, like it, outside the 01–07
 * numbering: the numbers are BJ Beyond's own chapters. It carries no section
 * index and no rail marker for that reason, and opens on the same eyebrow
 * treatment Authentia does, so the two read as one movement.
 *
 * The phones are drawn in CSS — a rounded shell, a clipped screen, an island
 * and four side keys. No mockup image, so the lineup costs nothing to download
 * and stays sharp at any density. Covers are ordinary media slots: procedural
 * until real stills are dropped into `media-src/reels/` (see MEDIA.reels).
 *
 * No video is loaded, embedded or autoplayed. Pressing a frame opens the reel
 * on Instagram, which is both the cheap option and the honest one — the videos
 * are not hosted here.
 *
 * The rail needs no JavaScript: at three to five frames it fits on a desktop
 * row and only scrolls on narrow screens, where a swipe is the native gesture.
 * `w-max` with auto margins is what centres the lineup when it fits and still
 * lets it scroll from its true start when it does not — `justify-center` would
 * make the first frame unreachable behind the scroll origin.
 */
export function InMotion() {
  return (
    <section
      id="in-motion"
      aria-labelledby="in-motion-heading"
      className="relative bg-ink-950 pb-[var(--spacing-section)]"
    >
      <div className="u-gutter">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="u-label flex items-center gap-3 text-amber-400">
                <span
                  aria-hidden="true"
                  className="block h-1 w-1 rounded-full bg-amber-400"
                />
                {IN_MOTION.eyebrow}
              </p>
            </Reveal>

            <Reveal delay={0.05}>
              <h2
                id="in-motion-heading"
                className="mt-7 text-headline font-extralight leading-[1.02] text-paper"
              >
                {IN_MOTION.title.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h2>
            </Reveal>
          </div>

          <div className="lg:col-span-6 lg:col-start-7 lg:self-end">
            <Reveal delay={0.12}>
              <p className="max-w-md text-lede font-light text-paper">
                {IN_MOTION.standfirst}
              </p>
              <p className="mt-4 max-w-md text-body font-light text-mist-300">
                {IN_MOTION.description}
              </p>
            </Reveal>

            <Reveal delay={0.2} className="mt-8">
              {/* Same treatment as DISPATCH's profile link — label, handle,
                  outward glyph, spoken hint. The two sections make the same
                  gesture on two platforms, so they make it the same way. */}
              <a
                href={IN_MOTION.profile}
                {...EXTERNAL}
                className="group inline-flex min-h-11 items-center gap-3 text-mist-200 transition-colors duration-200 hover:text-paper"
              >
                <span className="u-label">{IN_MOTION.cta}</span>
                <span className="u-label text-mist-400">{IN_MOTION.handle}</span>
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

      <RevealGroup delay={0.1} stagger={0.08} className="mt-14 lg:mt-20">
        <div className="u-rail u-gutter snap-x snap-mandatory overflow-x-auto pb-4">
          {/* A real list: three to five items of the same kind, which is what a
              screen reader should be told before it starts reading them. */}
          <ul className="mx-auto flex w-max gap-4 sm:gap-6">
            {IN_MOTION.reels.map((reel) => {
              const cover = MEDIA.reels[reel.mediaKey as keyof typeof MEDIA.reels];

              return (
                <RevealItem
                  as="li"
                  key={reel.id}
                  className="shrink-0 snap-center"
                >
                  <a
                    href={reel.href}
                    {...EXTERNAL}
                    /* One label for the whole frame. The cover is decorative —
                       a procedural plate has nothing to describe, and a real
                       still would only repeat the title beneath it. */
                    aria-label={`${reel.title} — “${reel.quote}” — ${IN_MOTION.action}`}
                    /* The width lives here rather than on the shell, so the
                       caption underneath is bounded by the phone and cannot
                       stretch the frame to fit a long line. */
                    className="group block w-[min(46vw,10.5rem)] outline-offset-8 lg:w-[11.5rem]"
                  >
                    <div className="relative w-full">
                      {/* The shell. `p-[3px]` is the bezel; the border is its
                          highlight. Both are drawn, so nothing is fetched. */}
                      <div className="relative aspect-[9/19.5] rounded-[2.1rem] border border-rule-strong bg-ink-900 p-[3px] transition-colors duration-300 group-hover:border-amber-400/50 group-focus-visible:border-amber-400/50">
                        <div className="relative h-full w-full overflow-hidden rounded-[1.95rem] bg-ink-950">
                          {/* Fixed frame, scaling contents — the same rule the
                              Labs plates follow, so nothing around it reflows
                              on hover. */}
                          <div className="absolute inset-0 transition-transform duration-700 ease-[var(--ease-expo)] motion-safe:group-hover:scale-[1.06] motion-safe:group-focus-visible:scale-[1.06]">
                            <Atmosphere
                              media={cover}
                              scrim="soft"
                              sizes="(max-width: 640px) 46vw, 184px"
                              className="h-full w-full"
                            />
                          </div>

                          <div
                            aria-hidden="true"
                            className="absolute inset-0 bg-ink-950/35 transition-opacity duration-500 group-hover:opacity-0 group-focus-visible:opacity-0"
                          />

                          {/* Dynamic island. Above the cover, so the plate
                              runs under it exactly as a reel does. */}
                          <div
                            aria-hidden="true"
                            className="absolute left-1/2 top-[0.5rem] h-[1rem] w-[36%] -translate-x-1/2 rounded-full bg-ink-950"
                          />

                          {/* A flat fill rather than a backdrop blur: a blurred
                              layer re-samples everything beneath it for as long
                              as it is on screen, and there are up to five here. */}
                          <span
                            aria-hidden="true"
                            className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-paper/40 bg-ink-950/55 text-paper transition-colors duration-300 group-hover:border-amber-400 group-hover:bg-amber-400 group-hover:text-ink-950 group-focus-visible:border-amber-400 group-focus-visible:bg-amber-400 group-focus-visible:text-ink-950"
                          >
                            <svg
                              width="12"
                              height="14"
                              viewBox="0 0 12 14"
                              aria-hidden="true"
                              className="ml-0.5"
                            >
                              <path d="M0 0l12 7-12 7z" fill="currentColor" />
                            </svg>
                          </span>
                        </div>

                        {/* Side keys: mute switch, the two volume keys, and
                            power opposite. Hairline-weight, like every other
                            rule on the page. */}
                        <span
                          aria-hidden="true"
                          className="absolute -left-[3px] top-[15%] h-[4%] w-[3px] rounded-l-full bg-rule-strong"
                        />
                        <span
                          aria-hidden="true"
                          className="absolute -left-[3px] top-[22%] h-[8%] w-[3px] rounded-l-full bg-rule-strong"
                        />
                        <span
                          aria-hidden="true"
                          className="absolute -left-[3px] top-[32%] h-[8%] w-[3px] rounded-l-full bg-rule-strong"
                        />
                        <span
                          aria-hidden="true"
                          className="absolute -right-[3px] top-[26%] h-[12%] w-[3px] rounded-r-full bg-rule-strong"
                        />
                      </div>
                    </div>

                    {/* The cover carries the same two lines, but at 184px wide
                        they are decoration — this is the pair anyone can
                        actually read. `lang` because the quote is Italian on an
                        English page, and a screen reader would otherwise sound
                        it out with English phonemes. */}
                    <div className="mt-4 text-center">
                      <p className="u-label text-mist-400 transition-colors duration-200 group-hover:text-amber-400 group-focus-visible:text-amber-400">
                        {reel.title}
                      </p>
                      <p
                        lang="it"
                        className="mt-2 text-meta font-light leading-snug text-mist-200 transition-colors duration-200 group-hover:text-paper group-focus-visible:text-paper"
                      >
                        {`“${reel.quote}”`}
                      </p>
                    </div>
                  </a>
                </RevealItem>
              );
            })}
          </ul>
        </div>
      </RevealGroup>
    </section>
  );
}
