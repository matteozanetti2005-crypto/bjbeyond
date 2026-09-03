import { Reveal, RevealGroup, RevealItem } from '@/components/primitives/Reveal';
import { WRITING, postDate } from '@/lib/content';
import {
  ArrowOutward,
  EXTERNAL,
  NewTabHint,
} from '@/components/primitives/External';

/**
 * THE LONG READ — pieces published elsewhere, under the owner's own byline.
 *
 * Companion to DISPATCH directly above it, and drawn as its opposite. That
 * section is a rail of small rounded cards because it is reproducing X's card;
 * this is full-width rules and a single column of type, because a three
 * thousand word essay is not a post and should not be dressed as one. The two
 * share only the gesture that leaves the page — label, outward glyph, spoken
 * hint — which is what marks them as the same voice on two platforms.
 *
 * No section index: it sits outside the 01–07 numbering, for the reason given
 * on WRITING in lib/content.ts.
 *
 * LINKED, NEVER REPRINTED. The card carries the headline, the publication's own
 * TLDR and the story's closing line — enough to decide on — and then sends the
 * reader to the publisher. Reproducing the piece here would take the traffic
 * that is the whole point of publishing there, and would fork the text the day
 * an editor fixes a typo.
 *
 * THE WHOLE ROW IS THE ANCHOR, which is why the topics below are plain spans
 * and the action is a span too: an anchor inside an anchor is invalid markup
 * that browsers resolve by silently closing the outer one. Same rule the
 * Dispatch cards follow.
 *
 * A server component: nothing holds state or touches the browser.
 */
export function Writing() {
  return (
    <section
      id="writing"
      aria-labelledby="writing-heading"
      className="relative bg-ink-950 py-[var(--spacing-section)]"
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
                {WRITING.eyebrow}
              </p>
            </Reveal>

            <Reveal delay={0.05}>
              <h2
                id="writing-heading"
                className="mt-7 text-headline font-extralight leading-[1.02] text-paper"
              >
                {WRITING.title.map((line) => (
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
                {WRITING.standfirst}
              </p>
            </Reveal>

            {/* The same treatment DISPATCH and IN MOTION give their profile
                links: label, outward glyph, spoken hint. */}
            <Reveal delay={0.2} className="mt-8">
              <a
                href={WRITING.profile}
                {...EXTERNAL}
                className="group inline-flex min-h-11 items-center gap-3 text-mist-200 transition-colors duration-200 hover:text-paper"
              >
                <span className="u-label">{WRITING.cta}</span>
                <ArrowOutward
                  size={13}
                  className="transition-transform duration-300 ease-[var(--ease-expo)] motion-safe:group-hover:translate-x-1 motion-safe:group-hover:-translate-y-1"
                />
                <NewTabHint />
              </a>
            </Reveal>
          </div>
        </div>

        <RevealGroup delay={0.15} className="mt-14 lg:mt-20">
          <ul className="border-t border-rule">
            {WRITING.articles.map((article) => (
              <RevealItem as="li" key={article.slug}>
                <a
                  href={article.href}
                  {...EXTERNAL}
                  className="group block border-b border-rule py-10 outline-offset-4 lg:py-12"
                >
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-6">
                    <div className="lg:col-span-3">
                      {/* `tabular` so a column of dates lines up once there is
                          more than one story here. */}
                      <p className="u-label tabular text-amber-400">
                        <time dateTime={article.published}>
                          {postDate(article.published)}
                        </time>
                      </p>
                      <HackerNoonMark />
                    </div>

                    <div className="lg:col-span-8">
                      <h3 className="text-title font-extralight leading-[1.1] text-paper transition-colors duration-300 group-hover:text-amber-400 group-focus-visible:text-amber-400">
                        {article.title}
                      </h3>

                      <p className="mt-5 max-w-xl text-lede font-light text-mist-300">
                        {article.standfirst}
                      </p>

                      {/* `cite` names the document the line is taken from, for
                          anything reading the markup rather than looking at it.
                          The visible attribution is the headline above. */}
                      <figure className="mt-7 max-w-xl border-l border-amber-400/60 pl-6">
                        <blockquote cite={article.href}>
                          <p className="text-lede font-light italic leading-[1.45] text-paper">
                            {article.pull}
                          </p>
                        </blockquote>
                      </figure>

                      <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
                        <p className="u-label flex flex-wrap gap-x-5 gap-y-2 text-mist-500">
                          {article.topics.map((topic) => (
                            <span key={topic}>{topic}</span>
                          ))}
                        </p>

                        {/* Pushed to the end of the row only once there is a
                            row to push it along. On a phone the topics take
                            both lines and the action wraps beneath them, where
                            right-aligning it would leave it stranded away from
                            everything else on the card. */}
                        <span className="u-label inline-flex items-center gap-2 text-amber-400 sm:ml-auto">
                          {WRITING.action}
                          <ArrowOutward
                            size={12}
                            className="transition-transform duration-300 ease-[var(--ease-expo)] motion-safe:group-hover:translate-x-1 motion-safe:group-hover:-translate-y-1 motion-safe:group-focus-visible:translate-x-1 motion-safe:group-focus-visible:-translate-y-1"
                          />
                        </span>
                      </div>
                    </div>
                  </div>

                  <NewTabHint />
                </a>
              </RevealItem>
            ))}
          </ul>
        </RevealGroup>
      </div>
    </section>
  );
}

/**
 * HackerNoon's own lockup — the pixel mark and the wordmark — drawn where a
 * masthead belongs, the way DISPATCH draws X's mark on its cards.
 *
 * COPIED FROM THE PUBLISHER, path for path, at their own viewBox. The geometry
 * is the thing that identifies a mark, so it is not redrawn, re-spaced or
 * traced by eye.
 *
 * `currentColor` rather than their green, on two counts. HackerNoon themes its
 * own logo — the fill is swapped per reader theme, and the one served with this
 * story is #1C6854, a dark green that on this page's #050505 would be a smudge.
 * And the site has exactly one accent; a green wordmark would be the only green
 * on it. Form is preserved, colour follows the page, which is the same bargain
 * the X mark strikes. The Authentia lockup keeps its gold because that is a
 * partner's supplied artwork used as artwork; this is a masthead used as a
 * citation.
 *
 * Decorative: the action row beneath already reads READ ON HACKERNOON, so
 * announcing the publisher twice is noise.
 */
function HackerNoonMark() {
  return (
    <svg
      width="150"
      height="18"
      viewBox="0 0 2150 260"
      fill="currentColor"
      aria-hidden="true"
      className="mt-4 h-auto w-[150px] text-mist-300 transition-colors duration-300 group-hover:text-amber-400 group-focus-visible:text-amber-400"
    >
      <path d="M269.997 20.0005V0H130V20.0005V40.0011V60.0016H150H169.995V40.0011H189.995H229.996V60.0016H249.997H269.997V40.0011V20.0005Z" />
      <path d="M130.006 80.003V60.0024H110.006V80.003V100.004H130.006V80.003Z" />
      <path d="M110 119.998V100.003H90V119.998V139.998V159.999H110V139.998V119.998Z" />
      <path d="M270 100.004H290V80.003V60.0024H270V80.003V100.004Z" />
      <path d="M310 119.997V100.002H290V119.997V139.998V159.998H310V139.998H330.001V119.997H310Z" />
      <path d="M130 159.998H110V179.998V199.999H130V179.998V159.998Z" />
      <path d="M270 179.998V199.999H290V179.998V159.998H270V179.998Z" />
      <path d="M130 260V240V219.999V199.999H150H169.995V219.999H189.995H209.996H229.996V199.999H249.997H269.997V219.999V240V260H130Z" />
      <path d="M210.415 39.74V59.7405V79.7411V99.7416V119.736V139.737H190.415V119.736V99.7416V79.7411V59.7405V39.74H210.415Z" />
      <path d="M390 200V60H417.801V116.676H501.206V60H530V200H501.206V144.517H417.801V200H390Z" />
      <path d="M672.199 116.676V88.8352H588.794V116.676H672.199ZM560 200V60H700V200H672.199V144.517H588.794V200H560Z" />
      <path d="M730 200V60H870V88.8352H758.794V172.159H870V200H730Z" />
      <path d="M900 200V60H928.794V116.276H984.397V143.724H928.794V200H900ZM1012.2 171.368H984.397V143.724H1012.2V171.368ZM1012.2 171.368H1040V199.013H1012.2V171.368ZM1012.2 88.6319V116.276H984.397V88.6319H1012.2ZM1012.2 88.6319V60H1040V88.6319H1012.2Z" />
      <path d="M1070 200V60H1210V88.8352H1098.79V116.676H1154.4V144.517H1098.79V172.159H1210V200H1070Z" />
      <path d="M1351.24 116.519V88.7589H1267.76V116.519H1351.24ZM1240 200V60H1380V144.479H1351.24V172.24H1380V200H1351.24V172.24H1323.48V144.479H1267.76V200H1240Z" />
      <path d="M1410 200V60H1550V200H1522.24V88.7589H1438.76V200H1410Z" />
      <path d="M1692.24 172.24V88.7589H1608.76V172.24H1692.24ZM1580 200V60H1720V200H1580Z" />
      <path d="M1862.04 172.24V88.7589H1778.97V172.24H1862.04ZM1750 200V60H1890V200H1750Z" />
      <path d="M1920 200V60H2060V200H2032.24V88.7589H1948.76V200H1920Z" />
    </svg>
  );
}
