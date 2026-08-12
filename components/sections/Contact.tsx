'use client';

import { Atmosphere } from '@/components/atmosphere/Atmosphere';
import { Reveal, MaskLines } from '@/components/primitives/Reveal';
import { SectionHead } from '@/components/primitives/SectionHead';
import { Magnetic } from '@/components/primitives/Magnetic';
import { CONTACT } from '@/lib/content';
import { MEDIA } from '@/lib/media';

/**
 * No form, by decision. A form on a statically exported site needs a
 * third-party endpoint — a dependency, a privacy surface and a spam problem —
 * for nothing the mail client does not already provide. The addresses are the
 * interface, and the whole row is the target.
 */
export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative overflow-hidden bg-ink-950 py-[var(--spacing-section)]"
    >
      <div className="absolute inset-0 z-0 opacity-80">
        <Atmosphere
          media={MEDIA.contact}
          scrim="strong"
          sizes="100vw"
          className="h-full w-full"
        />
      </div>

      <div className="u-gutter relative z-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-3">
            <SectionHead index={CONTACT.index} label={CONTACT.label} />
          </div>

          <div className="lg:col-span-9">
            <MaskLines
              lines={CONTACT.title}
              as="h2"
              id="contact-heading"
              className="text-headline font-extralight text-paper"
            />

            <Reveal delay={0.2}>
              <p className="mt-8 max-w-lg text-lede font-light text-paper">
                {CONTACT.standfirst}
              </p>
              <p className="mt-4 max-w-lg text-body font-light text-mist-300">
                {CONTACT.description}
              </p>
            </Reveal>

            <ul className="mt-16 border-t border-rule">
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
        </div>
      </div>

    </section>
  );
}
