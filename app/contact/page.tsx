import type { Metadata } from 'next';
import { PageShell } from '@/components/chrome/PageShell';
import { Reveal } from '@/components/primitives/Reveal';
import { Magnetic } from '@/components/primitives/Magnetic';
import { EXTERNAL } from '@/components/primitives/External';
import { CONTACT, SOCIAL } from '@/lib/content';
import { MEDIA } from '@/lib/media';
import { metadataFor } from '@/lib/routes';

export const metadata: Metadata = metadataFor('/contact/');

/**
 * The addresses, on a URL an ad can point at.
 *
 * Still no form, for the reason given in the homepage section: a form on a
 * statically exported site needs a third-party endpoint — a dependency, a
 * privacy surface and a spam problem — for nothing the mail client does not
 * already provide.
 *
 * The social list is here and not only in the menu because this is the page a
 * cold visitor is sent to, and "where else can I find you" is the second thing
 * they ask after "how do I reach you".
 */
export default function ContactPage() {
  return (
    <PageShell
      index={CONTACT.index}
      eyebrow={CONTACT.label.join(' ')}
      title={CONTACT.title}
      standfirst={CONTACT.standfirst}
      media={MEDIA.contact}
    >
      <section className="u-gutter pb-[var(--spacing-section)]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-8">
            <Reveal>
              <p className="max-w-lg text-lede font-light text-mist-300">
                {CONTACT.description}
              </p>
            </Reveal>

            <ul className="mt-12 border-t border-rule">
              {CONTACT.emails.map((entry, index) => (
                <Reveal as="li" key={entry.address} delay={0.1 + index * 0.07}>
                  <a
                    href={`mailto:${entry.address}`}
                    className="group flex flex-col gap-2 border-b border-rule py-7 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
                  >
                    <span className="min-w-0">
                      <span className="block break-words text-title font-extralight text-paper transition-colors duration-300 group-hover:text-amber-400">
                        {entry.address}
                      </span>
                      <span className="u-label mt-2 block text-mist-400">
                        {entry.role}
                      </span>
                    </span>

                    <Magnetic strength={9}>
                      <span
                        aria-hidden="true"
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-rule-strong text-paper transition-colors duration-300 group-hover:border-amber-400 group-hover:text-amber-400"
                      >
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                          <path
                            d="M3 12 12 3M5 3h7v7"
                            stroke="currentColor"
                            strokeWidth="1.1"
                          />
                        </svg>
                      </span>
                    </Magnetic>
                  </a>
                </Reveal>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3 lg:col-start-10">
            <Reveal delay={0.2}>
              {/* The only word on this page not already in lib/content.ts.
                  The list needs a heading — an unlabelled column of platform
                  names is a screen-reader dead end — and the site's vocabulary
                  had no phrase for "the other places I am". Move it into
                  content.ts under the owner's own wording when there is one. */}
              <h2 className="u-label text-paper">ELSEWHERE</h2>
              <div className="mt-5 h-px w-10 bg-amber-400/60" />
              <ul className="mt-6">
                {SOCIAL.map((social) => (
                  <li key={social.label} className="u-rule-b">
                    <a
                      href={social.href}
                      {...EXTERNAL}
                      className="u-label flex min-h-11 items-center text-mist-300 transition-colors duration-200 hover:text-amber-400"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
