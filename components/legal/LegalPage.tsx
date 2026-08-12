import Link from 'next/link';
import { Logo } from '@/components/chrome/Logo';
import { Footer } from '@/components/sections/Footer';
import { Atmosphere } from '@/components/atmosphere/Atmosphere';
import { MEDIA } from '@/lib/media';
import { CONTACT_LINKS, type LegalBlock, type LegalDocument } from '@/lib/legal';
import { EXTERNAL } from '@/components/primitives/External';

/**
 * Shared shell for the legal documents. A server component with zero
 * JavaScript: no pinning, no parallax, no cursor.
 *
 * The content is Italian inside an English document, so the prose column
 * carries `lang="it"` — without it a screen reader applies English
 * pronunciation rules.
 */

function Block({ block }: { block: LegalBlock }) {
  switch (block.kind) {
    case 'text':
      return <p className="text-lede font-light text-mist-200">{block.value}</p>;

    case 'callout':
      return (
        <p className="border-l border-rule-amber py-1 pl-5 text-lede font-light text-paper">
          {block.value}
        </p>
      );

    case 'list':
      return (
        <ul className="space-y-3">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3 text-lede font-light text-mist-200">
              <span
                aria-hidden="true"
                className="mt-[0.62em] block h-1 w-1 shrink-0 rounded-full bg-amber-400"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );

    case 'ordered':
      return (
        <ol className="space-y-3">
          {block.items.map((item, i) => (
            <li key={item} className="flex gap-4 text-lede font-light text-mist-200">
              <span className="u-label tabular mt-[0.42em] shrink-0 text-amber-400">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      );

    case 'pairs':
      return (
        <dl className="border-t border-rule">
          {block.items.map((item) => (
            <div
              key={item.term}
              className="grid gap-1 border-b border-rule py-4 sm:grid-cols-[minmax(0,12rem)_1fr] sm:gap-6"
            >
              <dt className="u-label pt-[0.3em] text-paper">{item.term}</dt>
              <dd className="text-body font-light text-mist-200">{item.detail}</dd>
            </div>
          ))}
        </dl>
      );

    case 'table':
      return (
        /* Scrolls inside its own box rather than widening the page: four
           columns cannot fit 375px. */
        <div className="u-hide-scrollbar -mx-[var(--spacing-gutter)] overflow-x-auto px-[var(--spacing-gutter)] sm:mx-0 sm:px-0">
          <table className="w-full min-w-[38rem] border-collapse text-left">
            <thead>
              <tr className="border-y border-rule-strong">
                {block.head.map((cell) => (
                  <th key={cell} scope="col" className="u-label py-3 pr-6 text-paper">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row[0]} className="border-b border-rule align-top">
                  <th
                    scope="row"
                    className="py-4 pr-6 text-body font-normal text-paper"
                  >
                    {row[0]}
                  </th>
                  {row.slice(1).map((cell, i) => (
                    <td key={i} className="py-4 pr-6 text-meta font-light text-mist-200">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

export function LegalPage({ doc }: { doc: LegalDocument }) {
  return (
    <>
      {/* Slim bar, not the site navigation: the only thing worth offering on a
          detour is the way back. */}
      <header className="fixed inset-x-0 top-0 z-[var(--z-nav)] border-b border-rule bg-ink-950/80 backdrop-blur-md">
        <div className="u-gutter flex items-center justify-between py-4">
          <Link
            href="/"
            aria-label="BJ Beyond — home"
            className="inline-flex min-h-11 items-center text-paper transition-opacity duration-200 hover:opacity-70"
          >
            <Logo className="w-8" title={null} />
          </Link>

          <Link
            href="/"
            className="group inline-flex min-h-11 items-center gap-3 text-mist-300 transition-colors duration-200 hover:text-paper"
          >
            <svg
              width="22"
              height="8"
              viewBox="0 0 22 8"
              fill="none"
              aria-hidden="true"
              className="rotate-180 transition-transform duration-300 ease-[var(--ease-expo)] motion-safe:group-hover:-translate-x-1.5"
            >
              <path d="M0 4h20M17 1l3.5 3L17 7" stroke="currentColor" strokeWidth="1" />
            </svg>
            <span className="u-label">BACK TO SITE</span>
          </Link>
        </div>
      </header>

      <main id="main" className="relative">
        <section className="relative overflow-hidden pb-16 pt-36 sm:pt-44">
          <div className="absolute inset-0 z-0 opacity-55">
            <Atmosphere
              media={MEDIA.contact}
              scrim="strong"
              sizes="100vw"
              className="h-full w-full"
            />
          </div>

          <div className="u-gutter relative z-10">
            <p className="u-label tabular text-amber-400">
              {doc.index} — {doc.eyebrow}
            </p>
            <h1 className="mt-5 text-display font-extralight leading-[0.95] text-paper">
              {doc.title.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p className="u-label mt-8 text-mist-300">
              ULTIMO AGGIORNAMENTO — {doc.updated.toUpperCase()}
            </p>
          </div>
        </section>

        <div className="u-gutter pb-[var(--spacing-section)]" lang="it">
          <div className="grid gap-12 border-t border-rule pt-12 lg:grid-cols-12 lg:gap-8">
            {/* Sticky on desktop, so a long document stays navigable. */}
            <nav aria-label="Indice" className="lg:col-span-3">
              <div className="lg:sticky lg:top-28">
                <p className="u-label text-mist-400" lang="en">
                  CONTENTS
                </p>
                <ul className="mt-5 space-y-3">
                  {doc.sections.map((section, i) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        /* min-h-11 for the 44px touch minimum; these rows are
                           28px of type on their own. */
                        className="group flex min-h-11 items-center gap-3 py-1 text-meta text-mist-300 transition-colors duration-200 hover:text-paper"
                      >
                        <span className="u-label tabular shrink-0 text-mist-500 transition-colors duration-200 group-hover:text-amber-400">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span>{section.heading}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>

            {/*
              `min-w-0` is load-bearing, not cosmetic: a grid item defaults to
              `min-width: auto` and refuses to shrink below its content, so the
              608px cookie table widened this column past the viewport and gave
              the page 273px of horizontal overflow instead of scrolling inside
              its own box.
            */}
            <div className="min-w-0 lg:col-span-8 lg:col-start-5">
              <p className="max-w-2xl text-lede font-light text-mist-200">{doc.intro}</p>

              {doc.sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  /* Clears the fixed bar when jumped to from the index. */
                  className="mt-14 max-w-2xl scroll-mt-28"
                >
                  <h2 className="text-title font-light text-paper">{section.heading}</h2>
                  <div className="mt-6 space-y-6">
                    {section.blocks.map((block, i) => (
                      <Block key={i} block={block} />
                    ))}
                  </div>
                </section>
              ))}

              <div className="mt-16 max-w-2xl border-t border-rule pt-8">
                <p className="text-lede font-light text-mist-300">{doc.closing}</p>
                <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2">
                  <a
                    href={`mailto:${CONTACT_LINKS.email}`}
                    className="u-label inline-flex min-h-11 items-center text-amber-400 transition-opacity duration-200 hover:opacity-75"
                  >
                    {CONTACT_LINKS.email}
                  </a>
                  <a
                    href={CONTACT_LINKS.xUrl}
                    {...EXTERNAL}
                    className="u-label inline-flex min-h-11 items-center text-amber-400 transition-opacity duration-200 hover:opacity-75"
                  >
                    {CONTACT_LINKS.xHandle}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
