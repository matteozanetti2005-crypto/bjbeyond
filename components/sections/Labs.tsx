'use client';

import { Atmosphere } from '@/components/atmosphere/Atmosphere';
import { Reveal } from '@/components/primitives/Reveal';
import { SectionHead } from '@/components/primitives/SectionHead';
import { ArrowLink } from '@/components/primitives/ArrowLink';
import { LABS } from '@/lib/content';
import { MEDIA } from '@/lib/media';

/**
 * 03 — THE LABS
 *
 * Hover scales the plate inside a fixed frame rather than widening the frame,
 * so nothing around it reflows. The whole row is the hit target, which matches
 * the visual affordance and clears any touch-target minimum.
 */
export function Labs() {
  return (
    <section
      id="labs"
      aria-labelledby="labs-heading"
      className="relative bg-ink-950 py-[var(--spacing-section)]"
    >
      <div className="u-gutter">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-3">
            <div className="lg:sticky lg:top-32">
              <SectionHead index={LABS.index} label={LABS.label} as="h2" id="labs-heading" />

              <Reveal delay={0.1}>
                <p className="mt-14 text-title font-extralight leading-[1.15] text-paper">
                  {LABS.intro.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
                <p className="mt-6 max-w-xs text-body text-mist-300">
                  {LABS.description}
                </p>
              </Reveal>

              <Reveal delay={0.2} className="mt-10">
                <ArrowLink href="#contact">{LABS.cta}</ArrowLink>
              </Reveal>
            </div>
          </div>

          <div className="lg:col-span-9">
            <ul className="border-t border-rule">
              {LABS.projects.map((project, index) => {
                const media = MEDIA.labs[project.mediaKey as keyof typeof MEDIA.labs];

                return (
                  <Reveal as="li" key={project.number} delay={index * 0.06}>
                    <a
                      href={project.href}
                      className="group relative block border-b border-rule py-7 outline-offset-4 sm:py-8"
                      aria-label={`${project.title.join(' ')} — ${project.action}`}
                    >
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-amber-400 transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
                      />

                      <div className="flex items-center gap-5 sm:gap-8">
                        <span
                          aria-hidden="true"
                          className="tabular hidden shrink-0 self-start pt-1 text-meta text-mist-400 transition-colors duration-300 group-hover:text-amber-400 sm:block"
                        >
                          {project.number}
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="transition-transform duration-500 ease-[var(--ease-expo)] motion-safe:group-hover:translate-x-2 motion-safe:group-focus-visible:translate-x-2">
                            <h3 className="text-title font-extralight leading-[1.08] text-paper">
                              {project.title.map((line) => (
                                <span key={line} className="block">
                                  {line}
                                </span>
                              ))}
                            </h3>

                            <p className="mt-3 max-w-sm text-meta text-mist-300">
                              {project.description}
                            </p>

                            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
                              {project.points.map((point) => (
                                <li
                                  key={point}
                                  className="flex items-center gap-2 text-meta text-mist-400"
                                >
                                  <span
                                    aria-hidden="true"
                                    className="block h-px w-3 bg-amber-400/70"
                                  />
                                  {point}
                                </li>
                              ))}
                            </ul>

                            {/* Reserved space, so revealing it never reflows. */}
                            <span className="u-label mt-4 flex h-4 items-center gap-2 text-amber-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                              {project.action}
                              <svg
                                width="18"
                                height="7"
                                viewBox="0 0 18 7"
                                fill="none"
                                aria-hidden="true"
                              >
                                <path
                                  d="M0 3.5h16M13 1l3 2.5L13 6"
                                  stroke="currentColor"
                                  strokeWidth="1"
                                />
                              </svg>
                            </span>
                          </div>
                        </div>

                        {/* Fixed frame, scaling contents. */}
                        <div className="relative hidden h-24 w-44 shrink-0 overflow-hidden sm:block lg:h-28 lg:w-64">
                          <div className="absolute inset-0 transition-transform duration-700 ease-[var(--ease-expo)] motion-safe:group-hover:scale-[1.08] motion-safe:group-focus-visible:scale-[1.08]">
                            <Atmosphere
                              media={media}
                              scrim="none"
                              sizes="(max-width: 640px) 0px, (max-width: 1024px) 176px, 256px"
                              className="h-full w-full"
                            />
                          </div>
                          <div
                            aria-hidden="true"
                            className="absolute inset-0 bg-ink-950/45 transition-opacity duration-500 group-hover:opacity-0 group-focus-visible:opacity-0"
                          />
                        </div>
                      </div>
                    </a>
                  </Reveal>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
