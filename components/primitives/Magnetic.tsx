'use client';

import { useRef, type ReactNode } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { GSAP_EASE, hasFinePointer, prefersReducedMotion } from '@/lib/motion';

/**
 * Magnetic hover. Applied to a few important targets only.
 *
 * `gsap.quickTo` reuses one tween per axis instead of allocating a new one on
 * every mousemove — on a pointer-driven effect that is the difference between
 * smooth and GC stutter. Handlers are `contextSafe` so nothing they create
 * survives unmount, and the whole effect is gated on a fine pointer: on touch
 * the transform would fight the tap.
 */

interface MagneticProps {
  children: ReactNode;
  /** How far the element may travel, in pixels. */
  strength?: number;
  className?: string;
}

export function Magnetic({ children, strength = 14, className = '' }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const el = ref.current;
      if (!el || !contextSafe) return;
      if (!hasFinePointer() || prefersReducedMotion()) return;

      const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: GSAP_EASE.soft });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: GSAP_EASE.soft });

      const onMove = contextSafe((event: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const relX = event.clientX - (rect.left + rect.width / 2);
        const relY = event.clientY - (rect.top + rect.height / 2);
        // Normalised against half-size: the pull is proportional to how far
        // across the element the cursor is, not to its absolute size.
        xTo((relX / (rect.width / 2)) * strength);
        yTo((relY / (rect.height / 2)) * strength);
      });

      const onLeave = contextSafe(() => {
        xTo(0);
        yTo(0);
      });

      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);

      return () => {
        el.removeEventListener('mousemove', onMove);
        el.removeEventListener('mouseleave', onLeave);
      };
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {children}
    </span>
  );
}
