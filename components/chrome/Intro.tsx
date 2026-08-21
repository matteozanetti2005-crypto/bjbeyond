'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Logo } from './Logo';
import { prefersReducedMotion } from '@/lib/motion';
import { ms } from '@/lib/reveal';

/**
 * The opening sequence, and the signal that tells the hero when to enter.
 *
 * One unit rather than two: hardcoding a matching delay into every hero element
 * breaks the moment the curtain does not play, leaving a returning or
 * reduced-motion visitor staring at an empty screen. The provider owns a single
 * `ready` flag and the hero animates off that, so both paths are correct.
 *
 * Time-based, not load-based: tying the curtain to real asset loading would
 * stretch the entrance out on a slow connection, which is exactly when the
 * visitor can least afford to wait.
 *
 * No animation library. `AnimatePresence` existed here to hold the curtain in
 * the tree long enough to animate out; two timers and a class do the same, and
 * the curves live in globals.css with every other one.
 */

type Phase = 'pending' | 'playing' | 'done';

interface IntroValue {
  /** True once the hero is allowed to animate in. */
  ready: boolean;
  phase: Phase;
}

const IntroContext = createContext<IntroValue>({ ready: false, phase: 'pending' });

export function useIntro() {
  return useContext(IntroContext);
}

const SESSION_KEY = 'bj:intro-played';
const SEQUENCE_MS = 2150;
/** The lift itself: 1000ms of travel behind a 50ms beat. Must match the
 *  `.u-curtain` transition in globals.css — the curtain is unmounted on this. */
const LIFT_MS = 1050;

/**
 * `curtain` is the front door, and a site has one of those, not eight.
 *
 * The homepage plays it. The inner pages do not, and that is a decision about
 * paid traffic rather than about taste: a visitor arriving on `/books/` from an
 * ad has already chosen: they clicked something specific and landed on the
 * thing they clicked. Making them watch a 3.2-second entrance first is the
 * cheapest way to lose someone who was already interested.
 *
 * They still mount this provider, because `ready` is what tells the navigation
 * it may appear. With the curtain off, `ready` is simply true from the start.
 */
export function IntroProvider({
  children,
  curtain = true,
}: {
  children: ReactNode;
  curtain?: boolean;
}) {
  /* 'pending' so the server render commits to neither path; the client
     resolves it on the first effect. */
  const [phase, setPhase] = useState<Phase>('pending');
  /* Kept apart from `phase`: the hero starts the moment the curtain begins to
     lift, and the curtain has to outlive that by the length of the lift. */
  const [curtainMounted, setCurtainMounted] = useState(false);
  const [contentsIn, setContentsIn] = useState(false);

  useEffect(() => {
    const alreadyPlayed = sessionStorage.getItem(SESSION_KEY) === '1';

    /* Once per session, so returning from /phoenix or /frequency does not
       replay it. */
    if (!curtain || alreadyPlayed || prefersReducedMotion()) {
      setPhase('done');
      return;
    }

    sessionStorage.setItem(SESSION_KEY, '1');
    setPhase('playing');
    setCurtainMounted(true);

    /* A frame after mount, so the browser has painted the hidden state and has
       something to transition from. Setting both in one commit would give it
       only the final state and no transition at all. */
    const raf = requestAnimationFrame(() => setContentsIn(true));

    const lift = window.setTimeout(() => setPhase('done'), SEQUENCE_MS);
    const unmount = window.setTimeout(
      () => setCurtainMounted(false),
      SEQUENCE_MS + LIFT_MS,
    );

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(lift);
      window.clearTimeout(unmount);
    };
  }, [curtain]);

  /* The page behind the curtain is inert. */
  useEffect(() => {
    if (phase !== 'playing') return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [phase]);

  const value = useMemo<IntroValue>(
    () => ({ ready: phase === 'done', phase }),
    [phase],
  );

  return (
    <IntroContext.Provider value={value}>
      {curtainMounted && (
        <div
          className={`u-curtain fixed inset-0 z-[var(--z-preloader)] flex items-center justify-center bg-ink-950 ${
            phase === 'done' ? 'is-lifting' : ''
          }`}
          aria-hidden="true"
        >
          <div className="relative flex flex-col items-center">
            <div
              className={`u-curtain-mark text-paper ${contentsIn ? 'is-in' : ''}`}
              style={{ '--reveal-duration': ms(1.8) } as React.CSSProperties}
            >
              <Logo className="w-16 sm:w-20" title={null} />
            </div>

            <div
              className={`u-curtain-rule mt-7 h-px w-32 origin-center bg-amber-400/60 ${
                contentsIn ? 'is-in' : ''
              }`}
              style={
                {
                  '--reveal-duration': ms(1.15),
                  '--reveal-delay': ms(0.5),
                } as React.CSSProperties
              }
            />

            <p
              className={`u-curtain-mark u-label mt-6 text-mist-400 ${
                contentsIn ? 'is-in' : ''
              }`}
              style={
                {
                  '--reveal-duration': ms(0.8),
                  '--reveal-delay': ms(0.95),
                } as React.CSSProperties
              }
            >
              ONE STEP BEYOND AI
            </p>
          </div>
        </div>
      )}

      {children}
    </IntroContext.Provider>
  );
}
