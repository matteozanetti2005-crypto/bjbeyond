import { ridgeStack, type RidgeLayer } from './ridge';
import { largest, srcSet, type AtmospherePreset, type MediaSlot } from '@/lib/media';

/**
 * Renders the photograph for a media slot when one exists and a procedural
 * composition when one does not. The grade sits on top of either, so adding a
 * photograph never changes the surrounding design.
 *
 * No `'use client'`, no hooks, no state, no handlers: every layer moves on CSS
 * keyframes, transform and opacity only, so this adds no runtime behaviour of
 * its own. It still ships inside whichever bundle imports it — most call sites
 * are client components — so the win is the absence of work, not of bytes.
 *
 * A plain `<img>`, not `next/image`. Static export forces `images.unoptimized`,
 * which disables the Image Optimization API — `next/image` would emit a
 * single-source `<img>` with no `srcset`, all of its value gone and its cost
 * kept. The variants come from `scripts/build-media.mjs` instead.
 */

interface AtmosphereProps {
  media: MediaSlot;
  /** Extra classes on the clipping container. */
  className?: string;
  /** Eager + high fetch priority. The hero only — it is the LCP element. */
  priority?: boolean;
  /** Darkens the layer so foreground type always clears contrast. */
  scrim?: 'none' | 'soft' | 'strong';
  /** Responsive sizing hint. Must reflect the real rendered width. */
  sizes?: string;
}

const VIEWBOX = { w: 1200, h: 675 } as const;

/** Each preset is a different arrangement of the same parts. */
const PRESETS: Record<
  AtmospherePreset,
  {
    ridges: number;
    topBaseline: number;
    bottomBaseline: number;
    amplitude: number;
    light: { x: number; y: number; spread: number };
    sky: string;
    reflection?: boolean;
    lines?: boolean;
  }
> = {
  valley: {
    ridges: 5,
    topBaseline: 0.4,
    bottomBaseline: 0.88,
    amplitude: 0.12,
    light: { x: 62, y: 44, spread: 55 },
    sky: 'linear-gradient(to bottom, #0b0d14 0%, #131725 34%, #1c1a20 58%, #0a0a0b 100%)',
  },
  ridge: {
    ridges: 3,
    topBaseline: 0.34,
    bottomBaseline: 0.74,
    amplitude: 0.16,
    light: { x: 30, y: 38, spread: 45 },
    sky: 'linear-gradient(to bottom, #090b11 0%, #14171f 42%, #0d0d10 100%)',
  },
  water: {
    ridges: 2,
    topBaseline: 0.28,
    bottomBaseline: 0.44,
    amplitude: 0.09,
    light: { x: 50, y: 40, spread: 50 },
    sky: 'linear-gradient(to bottom, #0a0c12 0%, #161a26 30%, #0e1016 52%, #08080a 100%)',
    reflection: true,
  },
  portrait: {
    ridges: 0,
    topBaseline: 0,
    bottomBaseline: 0,
    amplitude: 0,
    light: { x: 50, y: 26, spread: 62 },
    sky: 'linear-gradient(to bottom, #101218 0%, #0b0b0e 46%, #060607 100%)',
  },
  texture: {
    ridges: 0,
    topBaseline: 0,
    bottomBaseline: 0,
    amplitude: 0,
    light: { x: 44, y: 56, spread: 70 },
    sky: 'linear-gradient(140deg, #14110c 0%, #0b0a09 44%, #060506 100%)',
  },
  signal: {
    ridges: 0,
    topBaseline: 0,
    bottomBaseline: 0,
    amplitude: 0,
    light: { x: 50, y: 50, spread: 58 },
    sky: 'linear-gradient(to bottom, #08090d 0%, #0d0f16 50%, #07070a 100%)',
    lines: true,
  },
};

const SCRIM: Record<NonNullable<AtmosphereProps['scrim']>, string> = {
  none: 'transparent',
  soft: 'linear-gradient(to bottom, rgb(5 5 5 / 0.55) 0%, rgb(5 5 5 / 0.28) 45%, rgb(5 5 5 / 0.75) 100%)',
  strong:
    'linear-gradient(to bottom, rgb(5 5 5 / 0.78) 0%, rgb(5 5 5 / 0.55) 40%, rgb(5 5 5 / 0.9) 100%)',
};

export function Atmosphere({
  media,
  className = '',
  priority = false,
  scrim = 'soft',
  sizes = '100vw',
}: AtmosphereProps) {
  const preset = PRESETS[media.atmosphere];
  const layers: RidgeLayer[] =
    preset.ridges > 0 && !media.src
      ? ridgeStack(media.id, preset.ridges, {
          width: VIEWBOX.w,
          height: VIEWBOX.h,
          topBaseline: preset.topBaseline,
          bottomBaseline: preset.bottomBaseline,
          amplitude: preset.amplitude,
        })
      : [];

  const warm = media.warmth;

  /* A cut-out gets none of the grade: fog, vignette and scrim assume a
     full-bleed plate and would box a transparent figure in a visible
     rectangle. */
  const isCutout = media.cutout === true;

  return (
    <div
      className={`${isCutout ? '' : 'u-grain'} pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {media.src ? (
        <img
          src={largest(media.src, media.widths)}
          srcSet={srcSet(media.src, media.widths)}
          sizes={sizes}
          alt=""
          width={media.width}
          height={media.height}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          className={`absolute inset-0 h-full w-full ${isCutout ? 'object-contain' : 'object-cover'}`}
          style={{ objectPosition: media.focal }}
        />
      ) : (
        <>
          {/* Sky. The depth gradient the ridges read against. */}
          <div className="absolute inset-0" style={{ background: preset.sky }} />

          {/* Ridge silhouettes, far to near. */}
          {layers.length > 0 && (
            <svg
              viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
              role="presentation"
            >
              {layers.map((layer, i) => (
                <path key={i} d={layer.path} fill={layer.fill} opacity={layer.opacity} />
              ))}

              {/* Reflection: the ridges again, inverted and dimmed. */}
              {preset.reflection && (
                <g
                  transform={`translate(0 ${VIEWBOX.h * 1.06}) scale(1 -0.62)`}
                  opacity={0.34}
                  style={{ filter: 'blur(1.2px)' }}
                >
                  {layers.map((layer, i) => (
                    <path key={`r-${i}`} d={layer.path} fill={layer.fill} />
                  ))}
                </g>
              )}
            </svg>
          )}

          {/* `signal` preset: fine horizontal rules. */}
          {preset.lines && (
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(to bottom, rgb(232 197 71 / 0.14) 0 1px, transparent 1px 9px)',
                maskImage:
                  'radial-gradient(70% 60% at 50% 50%, #000 0%, transparent 78%)',
                WebkitMaskImage:
                  'radial-gradient(70% 60% at 50% 50%, #000 0%, transparent 78%)',
              }}
            />
          )}
        </>
      )}

      {/* The shared grade. Above BOTH modes — that is what keeps a photograph
          and a procedural plate looking like the same camera. */}
      {!isCutout && (
        <>
          {/* Two fog banks: same texture, different scale and phase. */}
          <div
            className="u-gpu absolute inset-0 motion-safe:animate-[fog-drift-a_54s_ease-in-out_infinite]"
            style={{
              background:
                'radial-gradient(58% 34% at 42% 66%, rgb(190 200 220 / 0.1) 0%, transparent 68%)',
            }}
          />
          <div
            className="u-gpu absolute inset-0 motion-safe:animate-[fog-drift-b_78s_ease-in-out_infinite]"
            style={{
              background:
                'radial-gradient(66% 28% at 60% 78%, rgb(170 185 210 / 0.08) 0%, transparent 72%)',
            }}
          />

          {/* The warm source. */}
          <div
            className="u-gpu absolute inset-0 mix-blend-screen motion-safe:animate-[light-breathe_13s_ease-in-out_infinite]"
            style={{
              background: `radial-gradient(${preset.light.spread}% ${preset.light.spread * 0.62}% at ${preset.light.x}% ${preset.light.y}%, rgb(232 197 71 / ${(0.13 * warm).toFixed(3)}) 0%, rgb(201 138 39 / ${(0.07 * warm).toFixed(3)}) 34%, transparent 72%)`,
            }}
          />

          {/* Vignette. */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(120% 90% at 50% 45%, transparent 38%, rgb(5 5 5 / 0.55) 100%)',
            }}
          />

          {/* Scrim: the contrast guarantee for type sitting on top. */}
          {scrim !== 'none' && (
            <div className="absolute inset-0" style={{ background: SCRIM[scrim] }} />
          )}
        </>
      )}
    </div>
  );
}
