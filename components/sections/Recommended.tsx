import { Reveal, RevealGroup, RevealItem } from '@/components/primitives/Reveal';
import { RECOMMENDED } from '@/lib/content';
import { MEDIA, largest, srcSet } from '@/lib/media';

/**
 * RECOMMENDED — an artist and a show, above Authentia on the Art page.
 *
 * Outside the 01–07 sequence, like Authentia and In Motion: those numbers are
 * BJ Beyond's own chapters, and this is a recommendation of someone else's
 * exhibition.
 *
 * THE POSTER IS DRAWN WHOLE, and that is the one decision here worth stating.
 * Every other plate on this site goes through `Atmosphere`, which covers its
 * frame and crops whatever does not fit — correct for a photograph sitting
 * behind type, wrong for this. The poster is a finished piece of someone else's
 * design work: the title, the dates, the curator's name and eleven
 * institutional marks all sit hard against an edge, so covering a fixed frame
 * with it would cut the very information it exists to carry. A plain <img> at
 * the poster's own ratio, on the pattern the Authentia lockup already uses.
 *
 * A server component: nothing holds state or touches the browser.
 */
export function Recommended() {
  return (
    <section
      id="recommended"
      aria-labelledby="recommended-heading"
      className="relative bg-ink-950 py-[var(--spacing-section)]"
    >
      <div className="u-gutter">
        <Reveal>
          <p className="u-label flex items-center gap-3 text-amber-400">
            <span
              aria-hidden="true"
              className="block h-1 w-1 rounded-full bg-amber-400"
            />
            {RECOMMENDED.eyebrow}
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <h2
            id="recommended-heading"
            className="mt-7 text-title font-extralight leading-[1.08] text-paper"
          >
            {RECOMMENDED.title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="mt-6 max-w-md text-body text-mist-300">
            {RECOMMENDED.standfirst}
          </p>
        </Reveal>

        <ul className="mt-14">
          {RECOMMENDED.events.map((event) => {
            const poster = MEDIA.events[event.mediaKey as keyof typeof MEDIA.events];

            return (
              <li key={event.id} className="border-t border-rule pt-10">
                <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
                  {/* The poster, whole. `max-w` rather than a fixed width so it
                      never outgrows a narrow column, and the intrinsic size is
                      declared so the row does not jump as it decodes. */}
                  <Reveal className="lg:col-span-4">
                    <img
                      src={largest(poster.src!, poster.widths)}
                      srcSet={srcSet(poster.src!, poster.widths)}
                      sizes="(max-width: 640px) min(100vw - 3rem, 20rem), (max-width: 1024px) 20rem, 17rem"
                      width={poster.width}
                      height={poster.height}
                      alt={poster.alt}
                      loading="lazy"
                      decoding="async"
                      className="h-auto w-full max-w-[20rem] border border-rule-strong lg:max-w-[17rem]"
                    />
                  </Reveal>

                  <div className="lg:col-span-8">
                    <Reveal delay={0.1}>
                      <p className="u-label tabular text-mist-400">
                        {event.kind}
                      </p>
                      <p className="u-label mt-4 text-amber-400">{event.artist}</p>

                      <h3 className="mt-5 text-title font-extralight leading-[1.08] text-paper">
                        {event.title.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                      </h3>
                    </Reveal>

                    {/*
                      A real <blockquote>, not styled type. The words are the
                      artist's and the markup should say so — `cite` names who
                      is speaking to anything reading the document rather than
                      looking at it. `lang="it"` because the sentence is Italian
                      on an English page: without it a screen reader pronounces
                      it with English phonetics, which is how "racconterà"
                      stops being a word.
                    */}
                    <Reveal delay={0.18}>
                      <figure className="mt-8 max-w-xl border-l border-amber-400/60 pl-6">
                        <blockquote lang="it">
                          <p className="text-lede font-light italic leading-[1.45] text-paper">
                            {event.quote}
                          </p>
                        </blockquote>
                        <figcaption className="u-label mt-4 text-mist-400">
                          {event.attribution}
                        </figcaption>
                      </figure>
                    </Reveal>

                    <RevealGroup delay={0.26}>
                      <dl className="mt-10 grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                        {event.details.map((detail) => (
                          <RevealItem
                            key={detail.label}
                            className="border-b border-rule py-3.5"
                          >
                            <dt className="u-label text-mist-400">
                              {detail.label}
                            </dt>
                            <dd className="mt-1.5 text-meta text-mist-200">
                              {detail.value}
                            </dd>
                          </RevealItem>
                        ))}
                      </dl>
                    </RevealGroup>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
