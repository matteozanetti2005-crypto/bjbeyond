'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Logo } from './Logo';
import { DUR, EASE, prefersReducedMotion } from '@/lib/motion';

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

export function IntroProvider({ children }: { children: ReactNode }) {
  /* 'pending' so the server render commits to neither path; the client
     resolves it on the first effect. */
  const [phase, setPhase] = useState<Phase>('pending');

  useEffect(() => {
    const alreadyPlayed = sessionStorage.getItem(SESSION_KEY) === '1';

    /* Once per session, so returning from /phoenix or /frequency does not
       replay it. */
    if (alreadyPlayed || prefersReducedMotion()) {
      setPhase('done');
      return;
    }

    sessionStorage.setItem(SESSION_KEY, '1');
    setPhase('playing');

    const timer = window.setTimeout(() => setPhase('done'), SEQUENCE_MS);
    return () => window.clearTimeout(timer);
  }, []);

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
      <AnimatePresence>
        {phase === 'playing' && (
          <motion.div
            className="fixed inset-0 z-[var(--z-preloader)] flex items-center justify-center bg-ink-950"
            /* Lifts rather than fades: a fade would reveal a hero that had
               already finished arriving. */
            exit={{
              y: '-100%',
              transition: { duration: 1, ease: EASE.expoInOut, delay: 0.05 },
            }}
            aria-hidden="true"
          >
            <div className="relative flex flex-col items-center">
              <motion.div
                className="text-paper"
                initial={{ opacity: 0, scale: 0.94, filter: 'blur(6px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: DUR.cinematic, ease: EASE.expo }}
              >
                <Logo className="w-16 sm:w-20" title={null} />
              </motion.div>

              <motion.div
                className="mt-7 h-px w-32 origin-center bg-amber-400/60"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.15, ease: EASE.expo, delay: 0.5 }}
              />

              <motion.p
                className="u-label mt-6 text-mist-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, ease: EASE.expo, delay: 0.95 }}
              >
                ONE STEP BEYOND AI
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </IntroContext.Provider>
  );
}
