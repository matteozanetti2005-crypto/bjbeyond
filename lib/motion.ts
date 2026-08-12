/**
 * Motion tokens. Every animation, GSAP or Framer Motion, pulls its easing and
 * duration from here. Mirrored in app/globals.css — change both.
 */

/** Cubic-bezier control points, for Framer Motion (`ease` accepts an array). */
export const EASE = {
  /** House curve. Entrances, reveals, most things. */
  expo: [0.16, 1, 0.3, 1],
  /** Symmetric. Cross-fades and state swaps that should feel weightless. */
  expoInOut: [0.87, 0, 0.13, 1],
  /** Gentler arrival. Large slow-moving masses (images, panels). */
  soft: [0.25, 1, 0.5, 1],
  /** Exits. Leaves quickly so the UI never feels like it is waiting. */
  exit: [0.4, 0, 1, 1],
} as const;

/** The same curves as GSAP easing strings. */
export const GSAP_EASE = {
  expo: 'expo.out',
  expoInOut: 'expo.inOut',
  soft: 'power3.out',
  exit: 'power2.in',
  none: 'none',
} as const;

/**
 * Durations in seconds. An exit runs at roughly 60% of its matching entrance —
 * leaving at the same speed it arrives reads as sluggish.
 */
export const DUR = {
  /** Hover states, button feedback, small toggles. */
  micro: 0.24,
  /** Standard element reveal. */
  base: 0.72,
  /** Large masses: full-bleed images, pinned panels. */
  slow: 1.2,
  /** Hero / preloader beats only. */
  cinematic: 1.8,
  /** Matching exit for `base`. */
  exit: 0.42,
} as const;

/** Stagger steps. Below `tight` the eye reads the sequence as simultaneous;
 *  past `loose` it reads as the interface being slow. */
export const STAGGER = {
  tight: 0.04,
  base: 0.07,
  loose: 0.12,
} as const;

/**
 * Guarded for SSR — this runs during static export, where `window` is
 * undefined. Every animated component checks it and degrades to an instant,
 * legible state rather than animating faster.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** True only for devices that can actually hover with a precise pointer. */
export function hasFinePointer(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}
