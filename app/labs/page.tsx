import type { Metadata } from 'next';
import { PageShell } from '@/components/chrome/PageShell';
import { Atmosphere } from '@/components/atmosphere/Atmosphere';
import { Reveal, RevealGroup, RevealItem } from '@/components/primitives/Reveal';
import { ArrowLink } from '@/components/primitives/ArrowLink';
import { CONTACT, LABS } from '@/lib/content';
import { MEDIA } from '@/lib/media';
import { metadataFor } from '@/lib/routes';

export const metadata: Metadata = metadataFor('/labs/');

/**
 * The two tools, each given a plate.
 *
 * `/phoenix/` and `/frequency/` are directories in `public/` holding their own
 * `index.html`, not routes — so these are plain anchors and must stay that way.
 * See README. They have always been reachable; what they have never had is a
 * page that names them, which is why neither turns up in a search for what it
 * does.
 */
export default function LabsPage() {
  return (
    <PageShell
      index={LABS.index}
      eyebrow={LABS.label.join(' ')}
      title={LABS.intro}
      standfirst={LABS.description}
      media={MEDIA.backdrop}
    >
      <section className="u-gutter pb-[var(--spacing-section)]">
        <RevealGroup>
          <ul className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-6">
            {LABS.projects.map((project) => {
              const media = MEDIA.labs[project.mediaKey as keyof typeof MEDIA.labs];

              return (
                <RevealItem as="li" key={project.number}>
                  <a
                    href={project.href}
                    className="group block outline-offset-4"
                    aria-label={`${project.title.join(' ')} — ${project.action}`}
                  >
                    {/* The plate scales inside a fixed frame rather than the
                        frame growing, so nothing around it reflows. */}
                    <span className="relative block aspect-[3/2] overflow-hidden">
                      <Atmosphere
                        media={media}
                        scrim="soft"
                        sizes="(min-width: 640px) 45vw, 100vw"
                        className="h-full w-full transition-transform duration-700 ease-[var(--ease-expo)] motion-safe:group-hover:scale-[1.04]"
                      />
                    </span>

                    <span className="mt-6 flex items-baseline gap-4">
                      <span className="u-label tabular text-amber-400">
                        {project.number}
                      </span>
                      <span className="text-title font-extralight leading-[1.05] text-paper">
                        {project.title.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                      </span>
                    </span>

                    <span className="mt-4 block max-w-sm text-body font-light text-mist-300">
                      {project.description}
                    </span>

                    <span className="mt-5 block border-t border-rule">
                      {project.points.map((point) => (
                        <span
                          key={point}
                          className="u-rule-b block py-3 text-meta text-mist-200"
                        >
                          {point}
                        </span>
                      ))}
                    </span>

                    <span className="u-label mt-6 inline-flex items-center gap-3 text-mist-200 transition-colors duration-200 group-hover:text-paper">
                      {project.action}
                      <svg
                        width="22"
                        height="8"
                        viewBox="0 0 22 8"
                        fill="none"
                        aria-hidden="true"
                        className="transition-transform duration-300 ease-[var(--ease-expo)] motion-safe:group-hover:translate-x-1.5"
                      >
                        <path
                          d="M0 4h20M17 1l3.5 3L17 7"
                          stroke="currentColor"
                          strokeWidth="1"
                        />
                      </svg>
                    </span>
                  </a>
                </RevealItem>
              );
            })}
          </ul>
        </RevealGroup>

        <Reveal delay={0.1} className="mt-14">
          <ArrowLink href="/contact/">{CONTACT.label.join(' ')}</ArrowLink>
        </Reveal>
      </section>
    </PageShell>
  );
}
