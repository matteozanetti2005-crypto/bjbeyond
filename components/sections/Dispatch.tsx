import { Rail } from '@/components/primitives/Rail';
import { Reveal, RevealGroup, RevealItem } from '@/components/primitives/Reveal';
import { SectionHead } from '@/components/primitives/SectionHead';
import { DISPATCH, DISPATCH_AUTHOR, postDate, postUrl } from '@/lib/content';
import {
  ArrowOutward,
  EXTERNAL,
  NewTabHint,
} from '@/components/primitives/External';

/**
 * 02 — DISPATCH
 *
 * Posts lifted by hand from the X profile, drawn in X's own card anatomy:
 * avatar, name over handle, the mark top right, the post verbatim, its date, and
 * the action row beneath a rule.
 *
 * REBUILT RATHER THAN EMBEDDED, and that is the whole design. X's official
 * widget would be the identical card for free, and would bring ~200KB of
 * third-party JavaScript back onto the critical path phase 4 cleared, an iframe
 * per post, cookies the cookie policy does not currently have to declare, a
 * theme that lands on #000 rather than this page's #050505, and a height that
 * settles after paint. Drawn here it costs nothing, matches the palette, and
 * still shows something if a post is deleted.
 *
 * WHERE IT DEPARTS FROM X, deliberately:
 *  - The action icons carry no counts. X shows them; inventing engagement
 *    numbers is fabricating a public metric, and real ones would need the API.
 *    Icons without figures is a state X itself renders, so the signature holds.
 *  - Accents are amber, not X's #1d9bf0. Blue against this palette would read as
 *    a pasted-in widget, which is the one thing rebuilding it was meant to avoid.
 *  - The display name is not bold. Only Inter 200/300/400 ship, and
 *    `font-synthesis-weight: none` means asking for 700 would silently render
 *    400 anyway. The name/handle hierarchy is carried by colour instead —
 *    paper over mist-400 — which is how the rest of the site separates them.
 *
 * A server component. It renders client components (Rail, Reveal), which has
 * never required becoming one.
 */
export function Dispatch() {
  return (
    <section
      id="dispatch"
      aria-labelledby="dispatch-heading"
      className="relative bg-ink-950 py-[var(--spacing-section)]"
    >
      <div className="u-gutter">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-4 xl:col-span-3">
            <SectionHead index={DISPATCH.index} label={DISPATCH.label} />
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={0.1}>
              <h2
                id="dispatch-heading"
                className="text-headline font-extralight text-paper"
              >
                {DISPATCH.title}
              </h2>
              <p className="mt-6 max-w-md text-lede font-light text-mist-300">
                {DISPATCH.description}
              </p>
            </Reveal>

            {/* Marked external the long way — glyph plus spoken hint — rather
                than through ArrowLink's `external`, which only sets the rel and
                would leave the destination unannounced. */}
            <Reveal delay={0.2} className="mt-8">
              <a
                href={DISPATCH.profile}
                {...EXTERNAL}
                className="group inline-flex min-h-11 items-center gap-3 text-mist-200 transition-colors duration-200 hover:text-paper"
              >
                <span className="u-label">{DISPATCH.cta}</span>
                <span className="u-label text-mist-400">{DISPATCH.handle}</span>
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

      {/* The group is observed, and hands each card its own delay on arrival —
          including the cards still off to the right, which is what keeps the
          sequence from restarting the moment the rail is scrolled. */}
      <RevealGroup delay={0.15} className="mt-14 lg:mt-20">
        <Rail label="Selected posts" hint={DISPATCH.hint} className="gap-4 sm:gap-5">
          {DISPATCH.posts.map((entry, index) => (
            <RevealItem
              as="article"
              key={entry.id || `sample-${index}`}
              className="w-[80vw] max-w-[21.5rem] shrink-0 snap-start sm:w-[21.5rem]"
            >
              {/*
                `transition-colors` is safe here and would not be on the parent:
                the utility rewrites `transition-property`, which on the
                RevealItem itself would cancel the entrance. Same correction the
                nav menu carries.

                Rounded, where the rest of the site is square. That is the X card
                and the reason this section reads as one.
              */}
              <a
                href={postUrl(entry)}
                {...EXTERNAL}
                className="group relative flex h-full min-h-[17rem] flex-col rounded-2xl border border-rule bg-ink-900 p-4 outline-offset-4 transition-colors duration-300 hover:border-rule-strong focus-visible:border-rule-strong sm:p-5"
              >
                <header className="flex items-start gap-3">
                  {/* Decorative: the author is named in text immediately to the
                      right, so announcing the mark again is noise. */}
                  <img
                    src={DISPATCH_AUTHOR.avatar}
                    alt=""
                    width={128}
                    height={128}
                    loading="lazy"
                    decoding="async"
                    className="h-10 w-10 shrink-0 rounded-full bg-ink-800 object-contain p-2"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1 truncate text-[0.9375rem] leading-tight text-paper">
                      {DISPATCH_AUTHOR.name}
                      {DISPATCH_AUTHOR.verified ? <VerifiedBadge /> : null}
                    </p>
                    <p className="truncate text-[0.9375rem] leading-tight text-mist-400">
                      @{DISPATCH_AUTHOR.username}
                    </p>
                  </div>

                  <XMark />
                </header>

                {/*
                  15px on a 1.35 rhythm — X's own body metric, and the only place
                  on this site that steps outside the type scale. A post set in
                  the site's 13px meta stops reading as a post.

                  `whitespace-pre-line` because the blank line between a post's
                  opening and its elaboration is how the writing is structured.

                  Clamped, exactly as X clamps a long post in its own timeline.
                  Without it one thirty-line post would set the height of all
                  five: the rail stretches every card to the tallest, so the
                  longest post is paid for by dead space under every other.
                */}
                <p
                  lang={entry.lang}
                  className="mt-4 line-clamp-[10] whitespace-pre-line text-[0.9375rem] leading-[1.35] text-paper"
                >
                  {renderPostText(entry.text)}
                </p>

                {/* Plain text, not a nested link: the whole card is already an
                    anchor, and an anchor inside an anchor is invalid markup. It
                    goes to the same place either way. */}
                {isClamped(entry.text) ? (
                  <p className="mt-1 text-[0.9375rem] leading-[1.35] text-amber-400">
                    {DISPATCH.readMore}
                  </p>
                ) : null}

                <footer className="mt-auto pt-5">
                  <p className="text-[0.8125rem] text-mist-400">
                    <time dateTime={entry.createdAt}>
                      {postDate(entry.createdAt)}
                    </time>
                  </p>

                  <div className="mt-3 flex items-center gap-5 border-t border-rule pt-3">
                    {/* No counts, and hidden from screen readers: they are the
                        card's signature, not information. */}
                    <ActionIcon d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    <ActionIcon d="M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3" />
                    <ActionIcon d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />

                    <span className="u-label ml-auto inline-flex items-center gap-2 text-amber-400">
                      {DISPATCH.action}
                      <ArrowOutward
                        size={12}
                        className="transition-transform duration-300 ease-[var(--ease-expo)] motion-safe:group-hover:translate-x-1 motion-safe:group-hover:-translate-y-1 motion-safe:group-focus-visible:translate-x-1 motion-safe:group-focus-visible:-translate-y-1"
                      />
                    </span>
                  </div>
                </footer>

                <NewTabHint />
              </a>
            </RevealItem>
          ))}
        </Rail>
      </RevealGroup>
    </section>
  );
}

/**
 * Splits a post into plain runs and the entities X sets in its accent colour —
 * hashtags, mentions, links.
 *
 * They are spans, never anchors. The whole card is already one anchor, and an
 * anchor inside an anchor is invalid markup that browsers resolve by silently
 * closing the outer one. So they carry the emphasis without claiming to be
 * separately pressable: any of them opens the post, where they are live.
 *
 * `\p{L}\p{N}` rather than `\w`, so a hashtag with an accent or a non-Latin
 * script is matched whole instead of being cut at the first character outside
 * ASCII. The test pattern is a separate, NON-global regex on purpose: `.test()`
 * on a `/g` regex advances `lastIndex` between calls and would skip matches.
 */
const ENTITY_SPLIT = /(https?:\/\/\S+|[#@][\p{L}\p{N}_]+)/gu;
const ENTITY_TEST = /^(?:https?:\/\/|[#@])/u;

function renderPostText(text: string) {
  return text.split(ENTITY_SPLIT).map((part, index) =>
    ENTITY_TEST.test(part) ? (
      <span key={index} className="text-amber-400">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

/**
 * Whether a post will hit the ten-line clamp, and therefore whether to draw the
 * "Show more" cut.
 *
 * An estimate, because the real answer is a layout question and there is no
 * layout at build time — and this stays a server component precisely so that
 * measuring it in the browser is not on the table. So: count the lines each
 * paragraph wraps to at roughly the card's character width, plus the blank line
 * between paragraphs, which `whitespace-pre-line` renders as a real line.
 *
 * 42 characters sits between the two card widths in play — about 45 on desktop
 * at 21.5rem, about 40 on a phone at 80vw — so the estimate leans slightly
 * toward showing the cut. That is the right way to be wrong: a "Show more" on a
 * post that happened to fit still opens the post, whereas a missing one leaves
 * text severed with nothing explaining why.
 */
const CLAMP_LINES = 10;
const CHARS_PER_LINE = 42;

function isClamped(text: string): boolean {
  const lines = text.split('\n').reduce((total, paragraph) => {
    /* An empty string is still one rendered line, not zero. */
    return total + Math.max(1, Math.ceil(paragraph.length / CHARS_PER_LINE));
  }, 0);

  return lines > CLAMP_LINES;
}

/** X's mark, used to attribute the card to the platform it came from. */
function XMark() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 1200 1227"
      fill="currentColor"
      aria-hidden="true"
      className="mt-0.5 shrink-0 text-paper transition-colors duration-300 group-hover:text-amber-400 group-focus-visible:text-amber-400"
    >
      <path d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z" />
    </svg>
  );
}

/**
 * Rendered only when `DISPATCH_AUTHOR.verified` is true, which it is not.
 * Drawing a badge the account has not been granted would assert someone else's
 * credential — see the note in lib/content.ts.
 */
function VerifiedBadge() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 22 22"
      fill="currentColor"
      aria-label="Verified account"
      role="img"
      className="shrink-0 text-amber-400"
    >
      <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.816.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
    </svg>
  );
}

/** One of the three glyphs under the rule. Decorative — the row is signature. */
function ActionIcon({ d }: { d: string }) {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0 text-mist-500 transition-colors duration-300 group-hover:text-mist-300 group-focus-visible:text-mist-300"
    >
      <path d={d} />
    </svg>
  );
}
