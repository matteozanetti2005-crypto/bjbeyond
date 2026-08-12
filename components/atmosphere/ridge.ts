/**
 * Procedural ridge geometry — the silhouettes that stand in for photography.
 *
 * DETERMINISTIC by requirement: this runs during static export and again in the
 * browser, so `Math.random()` would produce a different path in each, React
 * would flag a hydration mismatch and the silhouette would snap on load. Every
 * value derives from a seeded PRNG keyed to the slot id.
 *
 * Paths are computed once per slot and emitted as static SVG. Nothing
 * recomputes on scroll or resize — movement is CSS transforms on the result.
 */

/** FNV-1a. Turns a slot id into a stable 32-bit seed. */
function seedFrom(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** mulberry32 — small, fast, well-distributed. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface RidgeOptions {
  width: number;
  height: number;
  /** Where the ridge sits vertically, 0-1 of height. */
  baseline: number;
  /** Peak deviation from the baseline, 0-1 of height. */
  amplitude: number;
  /** How many sine components are summed. More octaves = craggier. */
  octaves: number;
  /** Horizontal resolution. 64 is smooth at any realistic render size. */
  segments?: number;
}

/**
 * One closed silhouette path. The profile sums sines at increasing frequency
 * and decreasing amplitude — fractal noise, but continuous, so the outline
 * stays geologically plausible rather than spiky.
 */
export function ridgePath(seedKey: string, opts: RidgeOptions): string {
  const { width, height, baseline, amplitude, octaves, segments = 64 } = opts;
  const rand = mulberry32(seedFrom(seedKey));

  const waves = Array.from({ length: octaves }, (_, i) => ({
    frequency: (i + 1) * (0.55 + rand() * 0.9),
    amplitude: (amplitude * height) / (i + 1.35),
    phase: rand() * Math.PI * 2,
  }));

  const baseY = baseline * height;
  const points: string[] = [];

  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    let y = baseY;
    for (const wave of waves) {
      y += Math.sin(t * Math.PI * 2 * wave.frequency + wave.phase) * wave.amplitude;
    }
    // Fixed precision keeps the server and client strings byte-identical.
    points.push(`${(t * width).toFixed(1)} ${y.toFixed(1)}`);
  }

  return `M ${points.join(' L ')} L ${width} ${height} L 0 ${height} Z`;
}

export interface RidgeLayer {
  path: string;
  fill: string;
  opacity: number;
}

/**
 * A depth stack. Far ridges sit high and read light and hazy; near ridges sit
 * low and read almost black. That luminance inversion is the aerial-perspective
 * cue a real photograph of a foggy valley gives.
 */
export function ridgeStack(
  seedKey: string,
  count: number,
  config: {
    width: number;
    height: number;
    topBaseline: number;
    bottomBaseline: number;
    amplitude: number;
  },
): RidgeLayer[] {
  const { width, height, topBaseline, bottomBaseline, amplitude } = config;

  return Array.from({ length: count }, (_, i) => {
    const depth = count === 1 ? 0 : i / (count - 1); // 0 = farthest
    const baseline = topBaseline + (bottomBaseline - topBaseline) * depth;

    // Far ridges are flatter: distance compresses relief.
    const layerAmplitude = amplitude * (0.45 + depth * 0.75);

    // Luminance falls from hazy blue-grey to near-black as layers approach.
    const lightness = Math.round(20 - depth * 17);
    const saturation = Math.round(9 - depth * 7);

    return {
      path: ridgePath(`${seedKey}-${i}`, {
        width,
        height,
        baseline,
        amplitude: layerAmplitude,
        octaves: 3 + i,
      }),
      fill: `hsl(226 ${saturation}% ${lightness}%)`,
      opacity: 1,
    };
  });
}
