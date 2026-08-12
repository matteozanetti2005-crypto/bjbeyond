'use client';

import { useEffect, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from 'framer-motion';
import { Logo } from './Logo';
import { useIntro } from './Intro';
import { NAV, SITE, SOCIAL } from '@/lib/content';
import { DUR, EASE } from '@/lib/motion';
import { EXTERNAL } from '@/components/primitives/External';

export function Navigation() {
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>('');

  /* Arrives with the hero, not on a delay of its own — see Intro.tsx. */
  const { ready } = useIntro();

  const { scrollYProgress } = useScroll();

  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  /* Off the existing scroll motion value, not a second listener, so there is
     only ever one scroll subscriber. */
  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    setCompact(value > 0.035);
  });

  /* IntersectionObserver rather than scroll math: the browser does the work off
     the main thread and it costs nothing during scroll. */
  useEffect(() => {
    const ids = NAV.map((item) => item.href.replace('#', ''));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      // A band across the middle: a section is "current" when it occupies the
      // reading position, not when it first appears.
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

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
      <motion.header
        className="js-reveal fixed inset-x-0 top-0 z-[var(--z-nav)]"
        initial={{ y: -24, opacity: 0 }}
        animate={ready ? { y: 0, opacity: 1 } : { y: -24, opacity: 0 }}
        transition={{ duration: DUR.base, ease: EASE.expo, delay: 0.35 }}
      >
        {/* Background only fades in once compact, so the hero reads
            edge-to-edge on load. */}
        <motion.div
          className="relative"
          animate={{
            backgroundColor: compact ? 'rgba(5,5,5,0.72)' : 'rgba(5,5,5,0)',
            backdropFilter: compact ? 'blur(14px)' : 'blur(0px)',
          }}
          transition={{ duration: 0.45, ease: EASE.soft }}
        >
          <motion.div
            className="u-gutter flex items-center justify-between"
            animate={{ paddingTop: compact ? 14 : 26, paddingBottom: compact ? 14 : 26 }}
            transition={{ duration: 0.45, ease: EASE.soft }}
          >
            <a
              href="#top"
              aria-label={`${SITE.name} — back to top`}
              /* inline-flex + min-h-11 for the 44px target: the mark is ~21px
                 tall at the smallest breakpoint, and a bare inline anchor is
                 measured as its line box. */
              className="relative z-[var(--z-menu-control)] inline-flex min-h-11 items-center text-paper transition-opacity duration-200 hover:opacity-70"
            >
              <motion.span
                className="block"
                animate={{ width: compact ? 30 : 38 }}
                transition={{ duration: 0.45, ease: EASE.soft }}
              >
                <Logo className="w-full" title={null} />
              </motion.span>
            </a>

            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-9">
                {NAV.map((item) => {
                  const isActive = active === item.href;
                  return (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        aria-current={isActive ? 'true' : undefined}
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
              <span className="relative block h-3 w-7">
                <motion.span
                  className="absolute right-0 block h-px bg-current"
                  animate={
                    open
                      ? { width: 28, y: 6, rotate: 45 }
                      : { width: 28, y: 0, rotate: 0 }
                  }
                  transition={{ duration: 0.4, ease: EASE.expo }}
                />
                <motion.span
                  className="absolute right-0 block h-px bg-current"
                  animate={
                    open
                      ? { width: 28, y: 6, rotate: -45 }
                      : { width: 18, y: 12, rotate: 0 }
                  }
                  transition={{ duration: 0.4, ease: EASE.expo }}
                />
              </span>
            </button>
          </motion.div>

          <motion.div
            className="absolute inset-x-0 bottom-0 h-px origin-left bg-amber-400"
            style={{ scaleX: progress }}
            aria-hidden="true"
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-px bg-rule"
            animate={{ opacity: compact ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            aria-hidden="true"
          />
        </motion.div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            className="fixed inset-0 z-[var(--z-menu)] flex flex-col justify-center bg-ink-950"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: DUR.exit, ease: EASE.exit } }}
            transition={{ duration: 0.5, ease: EASE.expo }}
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
                {NAV.map((item, index) => (
                  <li key={item.href} className="u-rule-b overflow-hidden">
                    <motion.a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="group flex items-baseline gap-6 py-5 text-mist-200 transition-colors duration-200 hover:text-paper sm:gap-10 sm:py-7"
                      initial={{ y: '110%' }}
                      animate={{ y: '0%' }}
                      exit={{ y: '110%' }}
                      transition={{
                        duration: 0.75,
                        ease: EASE.expo,
                        delay: 0.1 + index * 0.055,
                      }}
                    >
                      <span className="u-label tabular text-amber-400/70">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[clamp(2rem,8vw,4.25rem)] font-extralight leading-none tracking-[-0.02em]">
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
                    </motion.a>
                  </li>
                ))}
              </ul>

              <motion.div
                className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.45 }}
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
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
