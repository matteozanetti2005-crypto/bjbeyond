'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * The library itself, alone in a module so there is something for `import()` to
 * split on. **Nothing imports this directly** — a single static import anywhere
 * would fold 158 KB back into the first-load bundle and undo the whole point.
 * Reach it through `loadGsap()` in lib/gsap.ts.
 *
 * The `typeof window` guard the registration used to carry is gone with the
 * static imports that made it necessary: this module is only ever evaluated by
 * a dynamic import inside an effect, and effects do not run during the static
 * export.
 */
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger };
