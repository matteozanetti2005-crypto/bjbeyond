'use client';

import { useEffect, useRef, type RefObject } from 'react';

/**
 * GSAP, loaded only where it is used.
 *
 * Everything the library still drives on this site — the hero and About
 * parallax, Method's pin, the custom cursor, the magnetic targets — is desktop
 * motion. Every one of those was already declared inside
 * `(min-width: 1024px) and (prefers-reduced-motion: no-preference)`, but as a
 * `gsap.matchMedia()` call *inside* the library, which meant the query could
 * only be evaluated after 158 KB had been downloaded, parsed and executed to
 * ask it. A phone paid the whole bill to be told none of it applied to a phone.
 *
 * So the gate moved out of GSAP and in front of it. `useDesktopGsap` owns the
 * media query, and the library arrives — after first paint, on a second
 * request — only once the query matches. Below the breakpoint, and for anyone
 * who has asked for reduced motion at any width, it is never requested at all.
 *
 * `matchMedia` rather than a width read, so the two directions still work: a
 * desktop window dragged narrow reverts the context exactly as
 * `gsap.matchMedia()` did, and dragged wide again loads and rebuilds it.
 */

type GsapRuntime = typeof import('./gsap-runtime');
type GsapContext = ReturnType<GsapRuntime['gsap']['context']>;

/** The site's one breakpoint. Mirrored in globals.css — change both. */
export const DESKTOP_MOTION =
  '(min-width: 1024px) and (prefers-reduced-motion: no-preference)';

/** The in-flight or settled import. Null until something first asks. */
let pending: Promise<GsapRuntime> | null = null;

/** Requests the library, once per session however many callers there are. */
export function loadGsap(): Promise<GsapRuntime> {
  pending ??= import('./gsap-runtime');
  return pending;
}

/**
 * The runtime if something has already asked for it, `null` if nothing has.
 *
 * For work that should follow GSAP without ever being the reason it loads —
 * ScrollSync's refreshes are the only case. Call it at the moment of use rather
 * than caching the result: on mount it will be null simply because the sections
 * further down the tree have not run their effects yet.
 */
export function whenGsapReady(): Promise<GsapRuntime | null> {
  return pending ?? Promise.resolve(null);
}

interface DesktopGsap {
  gsap: GsapRuntime['gsap'];
  ScrollTrigger: GsapRuntime['ScrollTrigger'];
  /**
   * Wraps a handler so that anything it creates later belongs to this context
   * and is reverted with it. Needed for animations built inside event handlers,
   * which run long after the setup function has returned — without it a tween
   * started on hover outlives unmount and leaves its inline styles behind.
   */
  contextSafe: <T extends (...args: never[]) => unknown>(fn: T) => T;
}

/**
 * Runs `setup` inside a `gsap.context`, on desktop, once the library has
 * loaded. The replacement for `useGSAP`, which cannot be used here for the
 * plain reason that a hook has to be imported statically and importing it
 * imports GSAP.
 *
 * The context is what makes teardown total: reverting it kills every animation
 * and ScrollTrigger created inside and restores the inline styles they wrote.
 * A function returned from `setup` is registered by GSAP as a revert handler,
 * so listeners can be cleaned up the same way they were before.
 */
export function useDesktopGsap(
  setup: (api: DesktopGsap) => void | (() => void),
  scope?: RefObject<Element | null>,
): void {
  /* The setup closure is a new function on every render. Holding it in a ref
     keeps the effect below dependency-free — with `setup` as a dependency every
     render would revert and rebuild every ScrollTrigger on the page. */
  const latest = useRef(setup);
  useEffect(() => {
    latest.current = setup;
  });

  useEffect(() => {
    const query = window.matchMedia(DESKTOP_MOTION);
    let context: GsapContext | null = null;
    let disposed = false;

    const enter = () => {
      if (context) return;

      loadGsap().then((runtime) => {
        /* Re-checked, not assumed: the import resolves a network round trip
           after it was requested, and in that window the component can have
           unmounted or the window been dragged back under the breakpoint. */
        if (disposed || context || !query.matches) return;

        context = runtime.gsap.context(
          (_self, contextSafe) =>
            latest.current({
              gsap: runtime.gsap,
              ScrollTrigger: runtime.ScrollTrigger,
              /* Two things the cast fixes, both artefacts of GSAP's own types.
                 `contextSafe` is optional there because one signature covers
                 `context.add(name, fn)`, which is not handed one — reached this
                 way it is always passed. And it is declared `(func: Function) =>
                 Function`, which erases the handler's signature: the result of
                 wrapping a `(event: MouseEvent) => void` has to stay one, or it
                 cannot be given back to `addEventListener`. */
              contextSafe: contextSafe as unknown as DesktopGsap['contextSafe'],
            }),
          scope?.current ?? undefined,
        );
      });
    };

    const exit = () => {
      context?.revert();
      context = null;
    };

    if (query.matches) enter();

    const onChange = () => (query.matches ? enter() : exit());
    query.addEventListener('change', onChange);

    return () => {
      disposed = true;
      query.removeEventListener('change', onChange);
      exit();
    };
  }, [scope]);
}
