'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import { useIntro } from './Intro';
import { SITE, SOCIAL } from '@/lib/content';
import { NAV_ROUTES, withSlash } from '@/lib/routes';
import { DUR } from '@/lib/motion';
import { ms } from '@/lib/reveal';
import { EXTERNAL } from '@/components/primitives/External';

export function Navigation() {
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  /*
    Which entry is current, read off the URL instead of off the scroll position.

    `usePathname` is not consistent about the trailing slash that
    `trailingSlash: true` puts on every served URL, so both sides are normalised
    before they are compared rather than trusting either one.
  */
  const pathname = usePathname();
  const here = withSlash(pathname);

  /* Arrives with the hero, not on a delay of its own — see Intro.tsx. */
  const { ready } = useIntro();

  /*
    Scroll progress, without a motion library.

    This was `useScroll` feeding a `useSpring`, which kept a spring integrating
    on every frame for the whole session. One passive listener, coalesced into a
    single rAF, writes `scaleX` straight onto the bar — React never re-renders
    for it, because a progress bar is not state the tree needs to know about.
    The easing that the spring provided is now a short CSS transition on the
    bar itself, which the compositor runs on its own.

    `scrollHeight` is read inside the frame rather than cached: the pinned
    Method section changes the document height after ScrollTrigger initialises,
    and a stale maximum would peg the bar at 100% halfway down the page.
  */
  useEffect(() => {
    let queued = false;

    const update = () => {
      queued = false;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const value = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;

      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${value})`;
      }
      /* Identical values bail out inside React, so this costs a comparison. */
      setCompact(value > 0.035);
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  /*
    The menu outlives `open` in both directions: mounted a frame before it
    fades in, unmounted only once it has faded out. That is the whole of what
    `AnimatePresence` was doing here.
  */
  const [menuMounted, setMenuMounted] = useState(false);
  const [menuIn, setMenuIn] = useState(false);

  useEffect(() => {
    if (open) {
      setMenuMounted(true);
      const raf = requestAnimationFrame(() => setMenuIn(true));
      return () => cancelAnimationFrame(raf);
    }

    setMenuIn(false);
    const timer = window.setTimeout(
      () => setMenuMounted(false),
      DUR.exit * 1000,
    );
    return () => window.clearTimeout(timer);
  }, [open]);

  /*
    The menu closes itself when the URL changes.

    Clicking an entry already closes it, but that is not the only way the URL
    moves: the browser's back button, and any link inside the menu that another
    component adds later, both change the route without passing through that
    handler. Keying the close to the destination rather than to the click covers
    every route change with one rule.

    There used to be an IntersectionObserver here, watching the homepage's
    sections to decide which entry was current. It has no work left: the entries
    are separate documents now, so "which one am I on" is a question the URL
    answers exactly, without observing anything.
  */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  /* Restores the previous value rather than hardcoding it back, so this
     composes with anything else that locks scrolling. */
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  /* Every dismissible surface needs a keyboard exit. */
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <header
        className={`u-nav-enter fixed inset-x-0 top-0 z-[var(--z-nav)] ${ready ? 'is-in' : ''}`}
        style={
          {
            '--reveal-duration': ms(DUR.base),
            '--reveal-delay': ms(0.35),
          } as React.CSSProperties
        }
      >
        <div className="relative">
          {/*
            The frosted plate, on a layer of its own.

            It used to be one element whose `backdrop-filter` was animated from
            `blur(0px)` to `blur(14px)`. A blur radius is not a compositable
            value: every frame of that 450ms transition re-sampled everything
            behind a full-width fixed bar and re-rasterised the filter at a new
            radius. Here the radius is constant and only this layer's opacity
            moves, which the compositor can do on its own.

            A backdrop filter still costs while it is visible — it re-samples
            the page beneath it as that page scrolls — but at the top, where the
            hero has to read edge-to-edge anyway, this layer is transparent.
          */}
          <div
            aria-hidden="true"
            className={`absolute inset-0 bg-ink-950/72 backdrop-blur-[14px] transition-opacity duration-[450ms] ease-[var(--ease-soft)] ${
              compact ? 'opacity-100' : 'opacity-0'
            }`}
          />

          <div
            /* Padding on a CSS transition rather than a per-frame JS write.
               This is a `position: fixed` box, so resizing it reflows its own
               fifteen nodes and nothing else, and only when the compact state
               actually flips — which is why it is a transition here and not a
               transform contortion. */
            className={`u-gutter relative flex items-center justify-between transition-[padding] duration-[450ms] ease-[var(--ease-soft)] ${
              compact ? 'py-3.5' : 'py-[26px]'
            }`}
          >
            <a
              href="/"
              aria-label={`${SITE.name} — home`}
              /* inline-flex + min-h-11 for the 44px target: the mark is ~21px
                 tall at the smallest breakpoint, and a bare inline anchor is
                 measured as its line box. */
              className="relative z-[var(--z-menu-control)] inline-flex min-h-11 items-center text-paper transition-opacity duration-200 hover:opacity-70"
            >
              {/* Scale, not width. Same picture — the mark is a bitmap either
                  way — but a transform never asks the layout engine anything.
                  Origin left, so it shrinks toward the gutter rather than
                  drifting inward. */}
              <span
                className={`block w-[38px] origin-left transition-transform duration-[450ms] ease-[var(--ease-soft)] ${
                  compact ? 'scale-[0.789]' : 'scale-100'
                }`}
              >
                <Logo className="w-full" title={null} />
              </span>
            </a>

            {/* `gap-9` fitted six entries. The list is longer now, so the gap
                opens up only once there is room for it. */}
            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-6 xl:gap-9">
                {NAV_ROUTES.map((item) => {
                  const isActive = here === item.path;
                  return (
                    <li key={item.path}>
                      <a
                        href={item.path}
                        /* `page`, not `true`. `aria-current="page"` is the
                           value that names WHY this entry is current, and it is
                           the one screen readers announce as "current page" —
                           which is now literally what it is. */
                        aria-current={isActive ? 'page' : undefined}
                        className={`u-label group relative block py-1.5 transition-colors duration-200 ${
                          isActive ? 'text-paper' : 'text-mist-300 hover:text-paper'
                        }`}
                      >
                        {item.label}
                        {/* Scale, never width. */}
                        <span
                          aria-hidden="true"
                          className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-amber-400 transition-transform duration-300 ease-[var(--ease-expo)] ${
                            isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                          }`}
                        />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              /* `h-11 w-11` is the 44px target; the padding insets the two
                 rules so they stay small and precise inside it. */
              className="relative z-[var(--z-menu-control)] -mr-2 flex h-11 w-11 items-center justify-end p-2 text-paper"
            >
              {/* Both rules are full width and the shorter one is scaled, not
                  narrowed: `scaleX` composes with the rotation into a single
                  transform, where animating `width` would have been a second
                  property doing the same job more expensively. */}
              <span className="relative block h-3 w-7">
                <span
                  className={`absolute right-0 block h-px w-7 origin-right bg-current transition-transform duration-400 ease-[var(--ease-expo)] ${
                    open ? 'translate-y-[6px] rotate-45' : 'translate-y-0 rotate-0'
                  }`}
                />
                <span
                  className={`absolute right-0 block h-px w-7 origin-right bg-current transition-transform duration-400 ease-[var(--ease-expo)] ${
                    open
                      ? 'translate-y-[6px] -rotate-45 scale-x-100'
                      : 'translate-y-[12px] rotate-0 scale-x-[0.643]'
                  }`}
                />
              </span>
            </button>
          </div>

          <div
            ref={progressRef}
            /* The transition is what the spring used to be: written straight
               from the scroll handler, eased by the compositor. */
            className="absolute inset-x-0 bottom-0 h-px origin-left bg-amber-400 transition-transform duration-150 ease-linear"
            style={{ transform: 'scaleX(0)' }}
            aria-hidden="true"
          />
          <div
            className={`absolute inset-x-0 bottom-0 h-px bg-rule transition-opacity duration-400 ${
              compact ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden="true"
          />
        </div>
      </header>

      <>
        {menuMounted && (
          <div
            id="site-menu"
            className={`u-menu fixed inset-0 z-[var(--z-menu)] flex flex-col justify-center overflow-y-auto overscroll-contain bg-ink-950 py-24 ${
              menuIn ? 'is-in' : ''
            }`}
            style={{ '--duration-exit': ms(DUR.exit) } as React.CSSProperties}
          >
            <div
              className="u-grain pointer-events-none absolute inset-0"
              aria-hidden="true"
              style={{
                background:
                  'radial-gradient(70% 50% at 70% 30%, rgb(232 197 71 / 0.07) 0%, transparent 70%)',
              }}
            />

            <nav aria-label="Menu" className="u-gutter relative">
              <ul>
                {NAV_ROUTES.map((item, index) => (
                  <li key={item.path} className="u-rule-b overflow-hidden">
                    <a
                      href={item.path}
                      onClick={() => setOpen(false)}
                      aria-current={here === item.path ? 'page' : undefined}
                      /* Rises out of the row's clipping box, same primitive the
                         headlines use — the delay is its position in the list. */
                      /* No `transition-colors` on this element: that utility
                         rewrites `transition-property` and would cancel the
                         mask-line transition. The colour fade lives on the
                         label below, which inherits it. */
                      className={`u-mask-line group flex items-baseline gap-6 py-5 text-mist-200 hover:text-paper sm:gap-10 sm:py-7 ${
                        menuIn ? 'is-in' : ''
                      }`}
                      style={
                        {
                          '--reveal-duration': ms(0.75),
                          '--reveal-delay': ms(0.1 + index * 0.055),
                        } as React.CSSProperties
                      }
                    >
                      <span className="u-label tabular text-amber-400/70">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span
                        className={`text-[clamp(2rem,8vw,4.25rem)] font-extralight leading-none tracking-[-0.02em] transition-colors duration-200 ${
                          here === item.path ? 'text-paper' : ''
                        }`}
                      >
                        {item.label}
                      </span>
                      <span
                        aria-hidden="true"
                        className="ml-auto self-center text-mist-500 transition-transform duration-300 ease-[var(--ease-expo)] motion-safe:group-hover:translate-x-2"
                      >
                        <svg width="26" height="9" viewBox="0 0 26 9" fill="none">
                          <path
                            d="M0 4.5h24M21 1l3.5 3.5L21 8"
                            stroke="currentColor"
                            strokeWidth="1"
                          />
                        </svg>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>

              <div
                className="u-menu-row mt-12 flex flex-wrap items-center gap-x-7 gap-y-3"
                style={{ '--reveal-delay': ms(0.45) } as React.CSSProperties}
              >
                {SOCIAL.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    {...EXTERNAL}
                    className="u-label inline-flex min-h-11 items-center text-mist-400 transition-colors duration-200 hover:text-amber-400"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </nav>
          </div>
        )}
      </>
    </>
  );
}
