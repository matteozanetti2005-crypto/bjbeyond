import { Logo } from '@/components/chrome/Logo';
import { ArrowOutward, EXTERNAL, NewTabHint } from '@/components/primitives/External';
import { AUTHENTIA_LOGO, largest, srcSet } from '@/lib/media';
import { FOOTER, SITE, SOCIAL } from '@/lib/content';

/** A server component: nothing here moves, so nothing here needs JavaScript. */
export function Footer() {
  return (
    <footer className="relative border-t border-rule bg-ink-950">
      <div className="u-gutter py-14">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <Logo className="w-9 text-paper" title={SITE.name} />
            <p className="u-label mt-6 text-paper">
              {SITE.wordmark}
              <span className="align-super text-[0.6em] text-mist-400">™</span>
            </p>
            <p className="u-label mt-3 max-w-[24ch] text-mist-400">
              {FOOTER.statement}
            </p>
          </div>

          <nav aria-label="Social" className="lg:pt-1">
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {SOCIAL.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    {...EXTERNAL}
                    className="u-label inline-flex min-h-11 items-center text-mist-300 transition-colors duration-200 hover:text-amber-400"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal" className="lg:pt-1">
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {FOOTER.legal.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="u-label inline-flex min-h-11 items-center text-mist-300 transition-colors duration-200 hover:text-amber-400"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-rule pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="u-label text-mist-400">{FOOTER.copyright}</p>
          <p className="u-label text-mist-400">{SITE.domain}</p>
        </div>

        {/* Build credit. The wordmark is used unmodified — no recolouring, no
            filter; the gold is theirs, not the site's amber. */}
        <div className="mt-8 flex items-center justify-center border-t border-rule pt-8">
          <a
            href={FOOTER.credit.href}
            {...EXTERNAL}
            className="group inline-flex min-h-11 flex-wrap items-center justify-center gap-x-4 gap-y-2 text-mist-400 transition-colors duration-200 hover:text-mist-200"
          >
            <span className="u-label">{FOOTER.credit.prefix}</span>

            <img
              src={largest(AUTHENTIA_LOGO.src, AUTHENTIA_LOGO.widths)}
              srcSet={srcSet(AUTHENTIA_LOGO.src, AUTHENTIA_LOGO.widths)}
              sizes="132px"
              width={AUTHENTIA_LOGO.width}
              height={AUTHENTIA_LOGO.height}
              alt={AUTHENTIA_LOGO.alt}
              loading="lazy"
              decoding="async"
              className="h-auto w-[132px] opacity-90 transition-opacity duration-200 group-hover:opacity-100"
            />

            <ArrowOutward
              size={12}
              className="transition-transform duration-300 ease-[var(--ease-expo)] motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
            />
            <NewTabHint />
          </a>
        </div>
      </div>
    </footer>
  );
}
