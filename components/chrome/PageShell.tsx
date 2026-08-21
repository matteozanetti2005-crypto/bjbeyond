import type { ReactNode } from 'react';
import { IntroProvider } from './Intro';
import { Navigation } from './Navigation';
import { Cursor } from './Cursor';
import { Footer } from '@/components/sections/Footer';
import { Atmosphere } from '@/components/atmosphere/Atmosphere';
import { Reveal } from '@/components/primitives/Reveal';
import type { MediaSlot } from '@/lib/media';

/**
 * The shell every inner page wears: navigation, a masthead, the footer.
 *
 * WHY IT IS NOT `LegalPage`. That shell answers a different question. A privacy
 * policy is a detour — someone went there to check one thing and wants the way
 * back, so it deliberately offers a single "BACK TO SITE" link and no menu.
 * These pages are the opposite: they are destinations, most of their traffic
 * arrives cold from a search result or an ad, and for that visitor this page IS
 * the site. It has to carry the real navigation, or the first thing a paid
 * click meets is a document with no way into anything else.
 *
 * THE MASTHEAD IS THE `h1`. One per document, and on an inner page it is the
 * page's own name rather than the brand's — which is what a search result
 * quotes and what a screen reader announces first.
 *
 * A server component. It renders client components, which is not the same thing
 * as being one.
 */

interface PageShellProps {
  /** The section's number where it has one. Omit outside the sequence. */
  index?: string;
  eyebrow: string;
  /** Pre-split, one line per entry — the writer chooses where it breaks. */
  title: readonly string[];
  /**
   * Superscripted onto the last line of the title. Same treatment as the
   * homepage section, and for the same reason: inline, so the mark never wraps
   * onto a line of its own or inherits the headline's tracking.
   */
  trademark?: string;
  /** One sentence under the rule. The page's promise, in the page's words. */
  standfirst?: string;
  /** The plate behind the masthead. */
  media: MediaSlot;
  children: ReactNode;
}

export function PageShell({
  index,
  eyebrow,
  title,
  trademark,
  standfirst,
  media,
  children,
}: PageShellProps) {
  return (
    /* No curtain: see the note on IntroProvider. The provider is still here,
       because it is what tells the navigation it may appear. */
    <IntroProvider curtain={false}>
      <Cursor />
      <Navigation />

      <main id="main" className="relative">
        <header className="relative overflow-hidden pb-16 pt-36 sm:pb-20 sm:pt-44">
          <div className="absolute inset-0 z-0">
            <Atmosphere
              media={media}
              scrim="strong"
              sizes="100vw"
              className="h-full w-full"
            />
            {/* Flat overlay rather than opacity on the wrapper — see Contact
                and Authentia for why the two are not equivalent. */}
            <div aria-hidden="true" className="absolute inset-0 bg-ink-950/45" />
          </div>

          <div className="u-gutter relative z-10">
            <Reveal>
              <p className="u-label tabular text-amber-400">
                {index ? `${index} — ${eyebrow}` : eyebrow}
              </p>
              <h1 className="mt-5 text-display font-extralight text-paper">
                {title.map((line, i) => (
                  <span key={line} className="block">
                    {line}
                    {trademark && i === title.length - 1 ? (
                      <span className="align-super text-[0.35em] text-mist-400">
                        {trademark}
                      </span>
                    ) : null}
                  </span>
                ))}
              </h1>
              <div className="mt-8 h-px w-10 bg-amber-400/60" />
              {standfirst ? (
                <p className="mt-8 max-w-xl text-lede font-light text-mist-200">
                  {standfirst}
                </p>
              ) : null}
            </Reveal>
          </div>
        </header>

        {children}
      </main>

      <Footer />
    </IntroProvider>
  );
}
