'use client';

import { useEffect, useRef, useState } from 'react';
import { Reveal } from '@/components/primitives/Reveal';
import { SectionHead } from '@/components/primitives/SectionHead';
import { INTELLIGENCE, type IntelligenceFilterId } from '@/lib/content';
import { prefersReducedMotion } from '@/lib/motion';
import { useRevealRef } from '@/lib/reveal';

/**
 * INTELLIGENCE — Art Market Pulse
 *
 * No animation library. This section was the last consumer of GSAP that ran
 * below the desktop breakpoint, so the two things it animated were moved to the
 * platform: the entrance is a CSS transition on `stroke-dashoffset` (see
 * `.u-draw` in globals.css) and the filter change is the interpolation below,
 * which is the only part CSS genuinely cannot do — the path data has to be
 * recomputed per frame, not interpolated between two declared states.
 *
 * The filter tween writes straight into the SVG through refs, never React
 * state, so a switch costs zero re-renders — setState in the update callback
 * would re-render the whole section on every frame of the tween.
 *
 * The dataset is illustrative, and says so in the interface rather than in a
 * comment — see INTELLIGENCE.disclaimer in lib/content.ts.
 */

const VIEW = { w: 1000, h: 300, padX: 24, padY: 34 } as const;

/** Shared across every series, so switching filters compares like for like. A
 *  per-series max would make each filter look identically strong. */
const CEILING = 132;

function toPoints(values: number[]): [number, number][] {
  const innerW = VIEW.w - VIEW.padX * 2;
  const innerH = VIEW.h - VIEW.padY * 2;
  const step = innerW / (values.length - 1);

  return values.map((value, i) => [
    VIEW.padX + i * step,
    VIEW.padY + innerH - (value / CEILING) * innerH,
  ]);
}

/**
 * Catmull-Rom converted to cubic beziers: passes through every data point
 * exactly, where a smoothing spline would quietly misreport the values.
 */
function curve(points: [number, number][]): string {
  if (points.length < 2) return '';

  let d = `M ${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)}`;

  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;

    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;

    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
  }

  return d;
}

function area(points: [number, number][]): string {
  const base = VIEW.h - VIEW.padY;
  return `${curve(points)} L ${points[points.length - 1][0].toFixed(2)} ${base} L ${points[0][0].toFixed(2)} ${base} Z`;
}

/**
 * The unfiltered series, resolved at module scope so the chart can be rendered
 * into the markup instead of being drawn in after hydration.
 *
 * These strings are constant, which is what lets React and the per-frame
 * `setAttribute` calls share the same elements: React only touches an attribute
 * when the value it rendered last differs from the one it is rendering now, so a
 * prop that never changes is written once and then left alone.
 */
const BASE_VALUES = INTELLIGENCE.series.all.map((point) => point.value);
const BASE_POINTS = toPoints(BASE_VALUES);
const BASE_LINE = curve(BASE_POINTS);
const BASE_AREA = area(BASE_POINTS);

/** Duration of a filter change, in milliseconds. */
const SWITCH_MS = 850;

/** `expo.out`, the house curve, as the plain function GSAP was wrapping. */
function easeOutExpo(t: number): number {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function Intelligence() {
  const lineRef = useRef<SVGPathElement>(null);
  const areaRef = useRef<SVGPathElement>(null);
  const nodeRefs = useRef<(SVGGElement | null)[]>([]);

  /* Observed for the drawing entrance — the same shared observer every other
     reveal on the page uses. */
  const plotRef = useRevealRef();

  const [filter, setFilter] = useState<IntelligenceFilterId>('all');
  const [hovered, setHovered] = useState<number | null>(null);

  const series = INTELLIGENCE.series[filter];
  const labels = INTELLIGENCE.series.all.map((point) => point.label);

  /* The live values the interpolation mutates. Never React state — see the note
     above. Copied, because it is written in place. */
  const values = useRef<number[]>([...BASE_VALUES]);

  const paint = () => {
    const points = toPoints(values.current);
    lineRef.current?.setAttribute('d', curve(points));
    areaRef.current?.setAttribute('d', area(points));

    points.forEach(([x, y], i) => {
      nodeRefs.current[i]?.setAttribute('transform', `translate(${x} ${y})`);
    });
  };

  /*
   * Filter change: the one thing here that has to run per frame, because each
   * frame is a different path string rather than a different value of one
   * property. Seven interpolations and two `setAttribute` calls — GSAP was
   * being loaded on every phone to schedule this.
   */
  useEffect(
    () => {
      const to = INTELLIGENCE.series[filter].map((p) => p.value);

      /* Nothing to travel: the first run, where the markup already holds this
         exact geometry, and any switch back to a series already on screen. */
      if (to.every((value, i) => value === values.current[i])) return;

      if (prefersReducedMotion()) {
        values.current = to;
        paint();
        return;
      }

      /* Where the curve is now — possibly mid-flight from a previous switch. */
      const from = [...values.current];
      const start = performance.now();
      let frame = 0;

      const step = (now: number) => {
        const elapsed = Math.min(1, (now - start) / SWITCH_MS);
        const t = easeOutExpo(elapsed);

        for (let i = 0; i < to.length; i += 1) {
          values.current[i] = from[i] + (to[i] - from[i]) * t;
        }
        paint();

        if (elapsed < 1) frame = requestAnimationFrame(step);
      };

      frame = requestAnimationFrame(step);

      /* Cancelling on cleanup is what makes rapid switching resolve to the last
         filter chosen: the next run reads `values.current` wherever this one
         stopped and travels from there. It is what `overwrite: true` bought. */
      return () => cancelAnimationFrame(frame);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filter],
  );

  return (
    <section
      id="intelligence"
      aria-labelledby="intelligence-heading"
      className="relative bg-ink-950 py-[var(--spacing-section)]"
    >
      <div className="u-gutter">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-3">
            <SectionHead index={INTELLIGENCE.index} label={INTELLIGENCE.label} as="h2" id="intelligence-heading" />

            <Reveal delay={0.1}>
              <p className="mt-12 text-title font-extralight leading-[1.12] text-paper">
                {INTELLIGENCE.title.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
              <p className="mt-5 max-w-xs text-body text-mist-300">
                {INTELLIGENCE.description}
              </p>
              <p className="mt-5 text-meta text-mist-400">
                {INTELLIGENCE.subtitle}
                <span className="tabular ml-2">{INTELLIGENCE.period}</span>
              </p>
              <p className="u-label mt-5 flex items-center gap-2.5 text-mist-300">
                <span aria-hidden="true" className="block h-px w-4 bg-amber-400" />
                {INTELLIGENCE.legend}
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-9">
            <Reveal delay={0.15}>
              <div
                role="tablist"
                aria-label="Filter market segment"
                className="flex flex-wrap gap-x-7 border-b border-rule"
              >
                {INTELLIGENCE.filters.map((option) => {
                  const isActive = option.id === filter;
                  return (
                    /* `min-h-11` (44px), not tight padding: these are the
                       section's primary control and were 31px tall. */
                    <button
                      key={option.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setFilter(option.id as IntelligenceFilterId)}
                      className={`u-label relative inline-flex min-h-11 items-center transition-colors duration-200 ${
                        isActive ? 'text-amber-400' : 'text-mist-400 hover:text-paper'
                      }`}
                    >
                      {option.label}
                      <span
                        aria-hidden="true"
                        className={`absolute bottom-0 left-0 h-px w-full origin-left bg-amber-400 transition-transform duration-500 ease-[var(--ease-expo)] ${
                          isActive ? 'scale-x-100' : 'scale-x-0'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="relative mt-8">
                {/* `text-amber-400` is the colour source for everything inside
                    — curve, nodes and wash all draw with `currentColor`, so the
                    gold lives only in the token. */}
                <svg
                  ref={plotRef}
                  viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
                  className="u-draw w-full overflow-visible text-amber-400"
                  style={{ '--reveal-duration': '2000ms' } as React.CSSProperties}
                  role="img"
                  aria-label={`${INTELLIGENCE.subtitle}, ${INTELLIGENCE.period}. Illustrative index values from ${series[0].value} in ${series[0].label} to ${series[series.length - 1].value} in ${series[series.length - 1].label}. Full values are available in the table below.`}
                >
                  <defs>
                    <linearGradient id="pulse-wash" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
                      <stop offset="60%" stopColor="currentColor" stopOpacity="0.04" />
                      <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                    </linearGradient>
                    {/*
                      The node halo, as a gradient rather than a filter.

                      This was an `feGaussianBlur` applied per node. An SVG
                      filter is re-rasterised whenever anything inside its
                      source changes — and switching filters rewrites every
                      node's transform on each of the 0.85s tween's frames, so
                      seven gaussian blurs were being recomputed per frame for
                      the whole transition. A radial gradient is painted once
                      and then simply moves with its group.

                      Stops chosen to match what the blur produced: bright at
                      the core, gone by the rim. Still `currentColor`, so the
                      gold continues to live only in the token.
                    */}
                    <radialGradient id="pulse-node-halo">
                      <stop offset="0%" stopColor="currentColor" stopOpacity="0.5" />
                      <stop offset="35%" stopColor="currentColor" stopOpacity="0.22" />
                      <stop offset="70%" stopColor="currentColor" stopOpacity="0.06" />
                      <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {[0, 0.5, 1].map((ratio) => {
                    const y = VIEW.padY + (VIEW.h - VIEW.padY * 2) * ratio;
                    return (
                      <line
                        key={ratio}
                        x1={VIEW.padX}
                        y1={y}
                        x2={VIEW.w - VIEW.padX}
                        y2={y}
                        stroke="var(--color-rule)"
                        strokeWidth="1"
                      />
                    );
                  })}

                  {/* Both paths carry the unfiltered geometry from the start,
                      so the chart is in the exported HTML rather than being
                      drawn in on hydration. `paint()` overwrites `d` in place
                      afterwards; React leaves it alone because the value it
                      rendered never changes. */}
                  <path ref={areaRef} d={BASE_AREA} fill="url(#pulse-wash)" stroke="none" />
                  {/* `data-draw` is the hook for the wipe-in entrance. It is a
                      clip and not a dash draw, for a reason worth reading before
                      changing it — see `.u-draw` in globals.css. */}
                  <path
                    ref={lineRef}
                    d={BASE_LINE}
                    data-draw
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />

                  {/* Each node is a group translated into place, so a switch
                      moves one transform instead of two coordinates. The initial
                      translate is rendered for the same reason the paths carry
                      their `d`: constant per index, so React writes it once. */}
                  {series.map((point, i) => (
                    <g
                      key={point.label}
                      ref={(el) => {
                        nodeRefs.current[i] = el;
                      }}
                      transform={`translate(${BASE_POINTS[i][0]} ${BASE_POINTS[i][1]})`}
                    >
                      <circle r="13" fill="url(#pulse-node-halo)" />
                      <circle
                        r="3"
                        fill="currentColor"
                        opacity={hovered === i ? 1 : 0.85}
                      />
                      {/* Invisible hit area, sized in viewBox units, so it has
                          to survive the smallest render: at 375px the chart is
                          ~335px wide (scale 0.335), making r="68" a 45.5px
                          target. Spacing is ~159 units, so targets never
                          overlap. */}
                      <circle
                        r="68"
                        fill="transparent"
                        className="cursor-pointer"
                        onMouseEnter={() => setHovered(i)}
                        onMouseLeave={() => setHovered(null)}
                        onFocus={() => setHovered(i)}
                        onBlur={() => setHovered(null)}
                        tabIndex={0}
                        role="button"
                        aria-label={`${point.label}: ${point.value}`}
                      />
                      <text
                        y="-18"
                        textAnchor="middle"
                        className="tabular pointer-events-none fill-paper text-[15px] transition-opacity duration-200"
                        opacity={hovered === i ? 1 : 0}
                      >
                        {point.value}
                      </text>
                    </g>
                  ))}
                </svg>

                {/* Axis in HTML, not SVG text, so it inherits the type scale
                    and stays legible at any width. */}
                <div
                  className="mt-3 flex justify-between"
                  style={{
                    paddingInline: `${(VIEW.padX / VIEW.w) * 100}%`,
                  }}
                  aria-hidden="true"
                >
                  {labels.map((label) => (
                    /* mist-400, not mist-500 — readable labels have to clear
                       the 4.5:1 text minimum. */
                    <span key={label} className="u-label text-mist-400">
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              <p className="mt-8 flex items-start gap-2.5 border-t border-rule pt-5 text-meta text-mist-400">
                <span
                  aria-hidden="true"
                  className="mt-[0.55em] block h-1 w-1 shrink-0 rounded-full bg-mist-500"
                />
                {INTELLIGENCE.disclaimer}
              </p>

              {/*
                Screen-reader equivalent of the chart.

                `sr-only` goes on the WRAPPER, not the table: it works by
                constraining the box to 1px with hidden overflow, and a
                `display: table` element ignores any width below its content —
                on the table itself it left a full-width box off-screen and gave
                the document 102px of horizontal scroll.
              */}
              <div className="sr-only">
              <table>
                <caption>
                  {INTELLIGENCE.subtitle} — {INTELLIGENCE.period}.{' '}
                  {INTELLIGENCE.disclaimer}
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Month</th>
                    <th scope="col">Index value</th>
                  </tr>
                </thead>
                <tbody>
                  {series.map((point) => (
                    <tr key={point.label}>
                      <th scope="row">{point.label}</th>
                      <td>{point.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
