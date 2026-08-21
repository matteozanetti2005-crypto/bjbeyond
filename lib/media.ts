/**
 * Media manifest. Every image is declared once here; components never reference
 * a file path.
 *
 * Source art lives in `media-src/` as bitmaps wrapped in SVG envelopes.
 * `node scripts/build-media.mjs` extracts, crops and re-encodes them into the
 * responsive WebP variants referenced below. The background source is a
 * four-panel contact sheet, so the scenes here are crops of one frame.
 *
 * A slot with `src: null` renders a procedural composition instead, generated
 * deterministically from its id. To give one a real photograph, add the
 * variants to `public/media/` and set `src` + `widths`. Nothing else changes.
 */

/** Which procedural composition stands in when `src` is null. */
export type AtmospherePreset =
  /** Deep valley, layered ridges receding into fog, warm light low in frame. */
  | 'valley'
  /** Closer, harder ridge line. Higher contrast, less fog. */
  | 'ridge'
  /** Horizontal banding with a reflective lower half. */
  | 'water'
  /** Vertical, tight, single soft light. */
  | 'portrait'
  /** Near-abstract surface: grain, slow drift, minimal structure. */
  | 'texture'
  /** Fine horizontal signal lines over darkness. */
  | 'signal';

export interface MediaSlot {
  /** Seeds the procedural composition. */
  id: string;
  /**
   * Base path under `public/`, WITHOUT the width suffix or extension — files
   * are `${src}-${width}.webp`. `null` uses the procedural atmosphere.
   */
  src: string | null;
  /** Widths available on disk, ascending. Drives the `srcset`. */
  widths: number[];
  /** Always required — describes the slot's role even before a photo lands. */
  alt: string;
  /** CSS `object-position`. */
  focal: string;
  /** Intrinsic size of the largest variant, for aspect-ratio and CLS. */
  width: number;
  height: number;
  atmosphere: AtmospherePreset;
  /** Amber light intensity, 0-1. Tunes the warm source in the grade. */
  warmth: number;
  /**
   * Meaningful transparency: must not be scrimmed or cropped like a full-bleed
   * plate. Currently only the cut-out portrait.
   */
  cutout?: boolean;
}

const slot = (s: MediaSlot): MediaSlot => s;

/* Panel crops share these dimensions: 3808 wide, minus the label strip. */
const SCENE = { width: 3808, height: 1934 };

export const MEDIA = {
  /** Top-left panel of the contact sheet. */
  hero: slot({
    id: 'hero',
    src: '/media/hero',
    widths: [768, 1280, 1920, 2560],
    alt: 'Contemporary architecture at dusk above still water, mountains receding into fog',
    focal: '50% 55%',
    width: 3808,
    height: 2144,
    atmosphere: 'valley',
    warmth: 0.85,
  }),

  /**
   * Transparent background — composites over the backdrop.
   *
   * Widths stop at 1080 because that is where the source stops: the envelope
   * carries ~1003x1784 real pixels behind the figure. Declaring a 1440 variant
   * told the browser there was detail there and made it fetch the heaviest file
   * to render an upsample — see the note in scripts/build-media.mjs.
   */
  portrait: slot({
    id: 'portrait',
    src: '/media/portrait',
    widths: [540, 810, 1080],
    alt: 'BJ Beyond',
    focal: '50% 20%',
    width: 1080,
    height: 1920,
    atmosphere: 'portrait',
    warmth: 0.5,
    cutout: true,
  }),

  /** Top-right panel. */
  backdrop: slot({
    id: 'backdrop',
    src: '/media/backdrop',
    widths: [768, 1280, 1920],
    alt: '',
    focal: '60% 50%',
    ...SCENE,
    atmosphere: 'ridge',
    warmth: 0.65,
  }),

  /** Five crops of the same location — one place seen five ways. */
  method: [
    slot({
      id: 'method-soul',
      src: '/media/terrace',
      widths: [640, 1024, 1600],
      alt: 'Mist over still water from a cantilevered terrace',
      focal: '50% 50%',
      ...SCENE,
      atmosphere: 'valley',
      warmth: 0.4,
    }),
    slot({
      id: 'method-edge',
      src: '/media/backdrop',
      widths: [768, 1280, 1920],
      alt: 'Raking light across a rough stone wall',
      focal: '65% 55%',
      ...SCENE,
      atmosphere: 'ridge',
      warmth: 0.3,
    }),
    slot({
      id: 'method-clarity',
      src: '/media/nocturne',
      widths: [640, 1024, 1600],
      alt: 'Still water at night beneath the building',
      focal: '50% 60%',
      ...SCENE,
      atmosphere: 'water',
      warmth: 0.45,
    }),
    slot({
      id: 'method-impact',
      src: '/media/hero',
      widths: [768, 1280, 1920],
      alt: 'Warm interior light spilling from the architecture',
      focal: '38% 45%',
      width: 3808,
      height: 2144,
      atmosphere: 'texture',
      warmth: 0.9,
    }),
    slot({
      id: 'method-legacy',
      src: '/media/terrace',
      widths: [640, 1024, 1600],
      alt: 'The building reflected in the lake',
      focal: '30% 70%',
      ...SCENE,
      atmosphere: 'water',
      warmth: 1,
    }),
  ],

  /**
   * Procedural on purpose: the subjects are simulation, sound and
   * authentication, which the architecture photography does not depict.
   * Replace if purpose-shot art becomes available.
   */
  labs: {
    phoenix: slot({
      id: 'lab-phoenix',
      src: null,
      widths: [],
      alt: 'Field of illuminated particles forming a wave',
      focal: '50% 50%',
      width: 1200,
      height: 800,
      atmosphere: 'signal',
      warmth: 0.7,
    }),
    frequency: slot({
      id: 'lab-frequency',
      src: null,
      widths: [],
      alt: 'Audio waveform against darkness',
      focal: '50% 50%',
      width: 1200,
      height: 800,
      atmosphere: 'signal',
      warmth: 0.2,
    }),
    authentia: slot({
      id: 'lab-authentia',
      src: null,
      widths: [],
      alt: 'Raking light across a painted surface',
      focal: '50% 50%',
      width: 1200,
      height: 800,
      atmosphere: 'texture',
      warmth: 0.8,
    }),
  },

  /**
   * Reel covers for IN MOTION — the plates that fill the drawn phone screens.
   * Keys match `IN_MOTION.reels[].mediaKey` in lib/content.ts.
   *
   * 9:19.5, matching the phone frame rather than a video's 9:16, so the
   * component never crops these a second time. The sources arrive at three
   * different ratios and `scripts/build-media.mjs` pads rather than crops them
   * to that frame — see the note there for why cropping a designed cover is not
   * an option.
   *
   * To add a fourth: drop the still into `media-src/reels/` named after its key
   * (`reel-04.png`), run `npm run media`, and copy one of these entries.
   * `src: null` is still valid and falls back to a procedural plate, so a reel
   * can go live before its cover exists.
   */
  reels: {
    'reel-01': slot({
      id: 'reel-01',
      src: '/media/reels/reel-01',
      widths: [540, 810],
      alt: 'Bruno Donzelli before a large painted canvas — “la mia Pittura Ironica”',
      focal: '50% 50%',
      width: 1080,
      height: 2340,
      atmosphere: 'portrait',
      warmth: 0.75,
    }),
    'reel-02': slot({
      id: 'reel-02',
      src: '/media/reels/reel-02',
      widths: [540, 810],
      alt: 'Fabio Campagna at his studio bench — “il mio processo creativo”',
      focal: '50% 50%',
      width: 1080,
      height: 2340,
      atmosphere: 'texture',
      warmth: 0.85,
    }),
    'reel-03': slot({
      id: 'reel-03',
      src: '/media/reels/reel-03',
      widths: [540, 810],
      alt: 'Federico Ciacci in his studio — “il labirinto”',
      focal: '50% 50%',
      width: 1080,
      height: 2340,
      atmosphere: 'portrait',
      warmth: 0.5,
    }),
  },

  /**
   * Book covers.
   *
   * Procedural, and for a stronger reason than the Labs plates: there is no
   * photograph missing here, because there is no book. The three entries in
   * `BOOKS` are placeholders the owner asked for to see the page working, so a
   * plate that is visibly a generated texture is the honest picture — a stock
   * photograph dressed as a jacket would make invented titles look published.
   *
   * 2:3, the ordinary trade paperback proportion, so real jackets drop in
   * without the grid moving. To give one a real cover: add the variants to
   * `public/media/`, set `src` + `widths` here, and change nothing else.
   */
  books: {
    'book-01': slot({
      id: 'book-01',
      src: null,
      widths: [],
      alt: '',
      focal: '50% 50%',
      width: 800,
      height: 1200,
      atmosphere: 'texture',
      warmth: 0.8,
    }),
    'book-02': slot({
      id: 'book-02',
      src: null,
      widths: [],
      alt: '',
      focal: '50% 50%',
      width: 800,
      height: 1200,
      atmosphere: 'ridge',
      warmth: 0.35,
    }),
    'book-03': slot({
      id: 'book-03',
      src: null,
      widths: [],
      alt: '',
      focal: '50% 50%',
      width: 800,
      height: 1200,
      atmosphere: 'signal',
      warmth: 0.6,
    }),
  },

  /** Bottom-right panel. */
  contact: slot({
    id: 'contact',
    src: '/media/nocturne',
    widths: [640, 1024, 1600],
    alt: '',
    focal: '50% 50%',
    ...SCENE,
    atmosphere: 'texture',
    warmth: 0.8,
  }),
} as const;

/** The BJ monogram: white, with alpha. Intrinsic size 2445 x 1754. */
export const LOGO = {
  src: '/media/logo',
  widths: [128, 256, 512],
  fallback: '/media/logo.png',
  width: 2445,
  height: 1754,
  alt: 'BJ Beyond',
} as const;

/**
 * Authentia Arte has two marks and they are NOT interchangeable.
 *
 * Wordmark: "Authentia" on one line, aspect 5.26. Small use only — the footer
 * credit, where a two-line lockup would be illegible at 25px tall.
 */
export const AUTHENTIA_LOGO = {
  src: '/media/authentia',
  widths: [256, 512],
  width: 2553,
  height: 485,
  alt: 'Authentia Arte',
} as const;

/**
 * Lockup: "Authentia" with "Arte ©" beneath, aspect 3.43. Large use — the
 * featured section's heading, where the full brand name has to be present.
 *
 * Both are supplied artwork, used unmodified: no recolouring, no filters.
 */
export const AUTHENTIA_LOCKUP = {
  src: '/media/authentia-lockup',
  widths: [320, 640, 960],
  width: 1226,
  height: 357,
  alt: 'Authentia Arte',
} as const;

/** Builds a `srcset` string from a slot's available widths. */
export function srcSet(base: string, widths: readonly number[]): string {
  return widths.map((w) => `${base}-${w}.webp ${w}w`).join(', ');
}

/** The largest variant — used as the `src` fallback for older parsers. */
export function largest(base: string, widths: readonly number[]): string {
  return `${base}-${widths[widths.length - 1]}.webp`;
}
