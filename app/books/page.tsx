import type { Metadata } from 'next';
import { PageShell } from '@/components/chrome/PageShell';
import { Atmosphere } from '@/components/atmosphere/Atmosphere';
import { Reveal, RevealGroup, RevealItem } from '@/components/primitives/Reveal';
import { ArrowLink } from '@/components/primitives/ArrowLink';
import { BOOKS, CONTACT } from '@/lib/content';
import { MEDIA } from '@/lib/media';
import { metadataFor } from '@/lib/routes';

export const metadata: Metadata = metadataFor('/books/');

/**
 * BOOKS.
 *
 * Every entry rendered here is a placeholder — see the note on BOOKS in
 * lib/content.ts, which also lists the three things that lift together when
 * real titles arrive. The page itself is finished; only its contents are not.
 *
 * `disclaimer` is printed rather than left as a code comment, because the
 * people most likely to mistake these for real books are the ones looking at
 * the page rather than at the source. Same convention as the Art Market Pulse
 * chart, which says on screen that its data is illustrative.
 */
export default function BooksPage() {
  return (
    <PageShell
      eyebrow={BOOKS.label.join(' ')}
      title={BOOKS.title}
      standfirst={BOOKS.standfirst}
      media={MEDIA.method[1]}
    >
      <section className="u-gutter pb-[var(--spacing-section)]">
        {BOOKS.disclaimer ? (
          <Reveal>
            <p className="mb-14 border-l border-rule-amber py-1 pl-5 text-meta font-light text-mist-300">
              {BOOKS.disclaimer}
            </p>
          </Reveal>
        ) : null}

        <RevealGroup>
          <ul className="grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
            {BOOKS.items.map((book) => {
              const media = MEDIA.books[book.mediaKey as keyof typeof MEDIA.books];
              const heading = (
                <>
                  {book.title.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </>
              );

              return (
                <RevealItem as="li" key={book.number}>
                  {/* 2:3, the trade paperback proportion, so a real jacket
                      replaces the plate without the grid moving. */}
                  <span className="relative block aspect-[2/3] overflow-hidden">
                    <Atmosphere
                      media={media}
                      scrim="soft"
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                      className="h-full w-full"
                    />
                  </span>

                  <p className="u-label tabular mt-6 text-amber-400">
                    {book.number} — {book.year}
                  </p>

                  <h2 className="mt-4 text-title font-extralight leading-[1.05] text-paper">
                    {heading}
                  </h2>

                  <p className="mt-4 text-body font-light text-mist-300">
                    {book.description}
                  </p>

                  <p className="u-label mt-5 text-mist-400">{book.format}</p>

                  {/*
                    Rendered only when there is somewhere to go. `href` is null
                    on every entry today, because inventing a purchase link
                    would send a reader to a 404 in the owner's name — which is
                    a worse failure than a card that simply does not offer one.
                  */}
                  {book.href ? (
                    <div className="mt-6">
                      <ArrowLink href={book.href} external magnetic={false}>
                        GET THE BOOK
                      </ArrowLink>
                    </div>
                  ) : null}
                </RevealItem>
              );
            })}
          </ul>
        </RevealGroup>

        <Reveal delay={0.1} className="mt-16">
          <ArrowLink href="/contact/">{CONTACT.label.join(' ')}</ArrowLink>
        </Reveal>
      </section>
    </PageShell>
  );
}
