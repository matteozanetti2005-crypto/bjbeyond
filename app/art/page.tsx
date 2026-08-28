import type { Metadata } from 'next';
import { PageShell } from '@/components/chrome/PageShell';
import { Authentia } from '@/components/sections/Authentia';
import { Recommended } from '@/components/sections/Recommended';
import { InMotion } from '@/components/sections/InMotion';
import { Reveal, RevealGroup, RevealItem } from '@/components/primitives/Reveal';
import { ArrowLink } from '@/components/primitives/ArrowLink';
import { ART, CONTACT } from '@/lib/content';
import { MEDIA } from '@/lib/media';
import { metadataFor } from '@/lib/routes';

export const metadata: Metadata = metadataFor('/art/');

/**
 * ART — the page about art rather than about the practice.
 *
 * Recommended is this page's own: an artist and a show the owner is pointing
 * readers at, which has no place on the homepage. It sits FIRST because it is
 * the timely one — an exhibition has dates and stops being useful after them,
 * while Authentia and In Motion are standing entries.
 *
 * The two sections after it are the homepage components, rendered unchanged. That
 * is the whole implementation and it is deliberate: Authentia and In Motion are
 * already the site's art content, they are already built, and a second copy
 * styled slightly differently would be two owners for one design. They keep
 * their own `h2`s, which sit correctly under this page's `h1` — they are its
 * subjects, not repetitions of it.
 *
 * The articles list renders only when there are articles. See the note on
 * ART.articles for why the per-article template is not being guessed at now.
 */
export default function ArtPage() {
  return (
    <PageShell
      eyebrow={ART.label.join(' ')}
      title={ART.title}
      standfirst={ART.standfirst}
      media={MEDIA.method[2]}
    >
      {ART.articles.length > 0 ? (
        <section className="u-gutter pb-[var(--spacing-section)]">
          <RevealGroup>
            <ul className="border-t border-rule">
              {ART.articles.map((article) => (
                <RevealItem as="li" key={article.slug}>
                  <article className="border-b border-rule py-8">
                    <p className="u-label tabular text-amber-400">
                      {article.published}
                    </p>
                    <h2 className="mt-4 text-title font-extralight text-paper">
                      {article.title}
                    </h2>
                    <p className="mt-4 max-w-xl text-lede font-light text-mist-300">
                      {article.standfirst}
                    </p>
                  </article>
                </RevealItem>
              ))}
            </ul>
          </RevealGroup>
        </section>
      ) : null}

      <Recommended />
      <Authentia />
      <InMotion />

      <section className="u-gutter pb-[var(--spacing-section)]">
        <Reveal>
          <ArrowLink href="/contact/">{CONTACT.label.join(' ')}</ArrowLink>
        </Reveal>
      </section>
    </PageShell>
  );
}
