'use client';

import { useRef, useState } from 'react';
import { useDesktopGsap } from '@/lib/gsap';
import { GSAP_EASE, hasFinePointer } from '@/lib/motion';

/**
 * Custom cursor — desktop only.
 *
 * `gsap.quickTo` reuses four tweens for the whole session rather than creating
 * new ones on every mousemove. The native cursor is only hidden once this
 * component has confirmed it is running, so a failure here can never leave a
 * user with no pointer at all.
 *
 * The width and reduced-motion tests now live in `useDesktopGsap`, which is
 * also the only correct place for them: the markup below is already
 * `lg:block`-only, so under the breakpoint this used to run four tweens a frame
 * against two elements nobody could see.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useDesktopGsap(({ gsap, contextSafe }) => {
    if (!hasFinePointer()) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    setEnabled(true);

    /* The dot is near-instant; the ring lags by ~0.5s — that is the effect. */
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: GSAP_EASE.soft });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: GSAP_EASE.soft });
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.5, ease: GSAP_EASE.soft });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.5, ease: GSAP_EASE.soft });

    const onMove = contextSafe((event: MouseEvent) => {
      dotX(event.clientX);
      dotY(event.clientY);
      ringX(event.clientX);
      ringY(event.clientY);
    });

    /* Over anything interactive the pointer itself becomes the hover state. */
    const onOver = contextSafe((event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest(
        'a, button, [role="button"], input, select, textarea',
      );
      gsap.to(ring, {
        scale: target ? 1.9 : 1,
        borderColor: target ? 'rgba(232,197,71,0.85)' : 'rgba(244,243,240,0.35)',
        duration: 0.35,
        ease: GSAP_EASE.soft,
      });
      gsap.to(dot, { scale: target ? 0.4 : 1, duration: 0.35, ease: GSAP_EASE.soft });
    });

    /* So the cursor never sits frozen at the window edge. */
    const onLeave = contextSafe(() => {
      gsap.to([dot, ring], { opacity: 0, duration: 0.25 });
    });
    const onEnter = contextSafe(() => {
      gsap.to([dot, ring], { opacity: 1, duration: 0.25 });
    });

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  });

  return (
    <>
      {/* Only hides the system cursor once the custom one is confirmed live —
          and only where the replacement is actually painted. The width was
          missing here while the two elements below are `lg:block`, so a desktop
          window under the breakpoint hid the native pointer and displayed
          nothing in its place. Dragging a wide window narrow still reaches that
          state, because `enabled` does not fall back to false; the query is what
          makes it harmless. */}
      {enabled && (
        <style>{`
          @media (min-width: 1024px) and (hover: hover) and (pointer: fine) {
            body, a, button, [role="button"] { cursor: none; }
          }
        `}</style>
      )}

      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[var(--z-cursor)] hidden h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-paper/35 lg:block"
        style={{ opacity: enabled ? 1 : 0, marginLeft: -16, marginTop: -16 }}
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[var(--z-cursor)] hidden h-1.5 w-1.5 rounded-full bg-amber-400 lg:block"
        style={{ opacity: enabled ? 1 : 0, marginLeft: -3, marginTop: -3 }}
      />
    </>
  );
}
