'use client';

import { useEffect, useRef, useState } from 'react';
import { Reveal } from '@/components/primitives/Reveal';
import { SectionHead } from '@/components/primitives/SectionHead';
import { INTELLIGENCE, type IntelligenceFilterId } from '@/lib/content';
import { gsap, useGSAP } from '@/lib/gsap';
import { GSAP_EASE, prefersReducedMotion } from '@/lib/motion';

/**
 * INTELLIGENCE — Art Market Pulse
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

export function Intelligence() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const areaRef = useRef<SVGPathElement>(null);
  const nodeRefs = useRef<(SVGGElement | null)[]>([]);

  const [filter, setFilter] = useState<IntelligenceFilterId>('all');
  const [hovered, setHovered] = useState<number | null>(null);

  const series = INTELLIGENCE.series[filter];
  const labels = INTELLIGENCE.series.all.map((point) => point.label);

  /* The live values the tween mutates. Never React state — see the note above. */
  const values = useRef<number[]>(INTELLIGENCE.series.all.map((p) => p.value));

  /* One persistent object for GSAP to tween, interpolated by hand against it:
     `gsap.to(someArray, …)` treats the array as a *list of targets* — seven
     primitive numbers, none animatable — and silently does nothing. */
  const progress = useRef({ t: 1 });

  const paint = () => {
    const points = toPoints(values.current);
    lineRef.current?.setAttribute('d', curve(points));
    areaRef.current?.setAttribute('d', area(points));

    points.forEach(([x, y], i) => {
      nodeRefs.current[i]?.setAttribute('transform', `translate(${x} ${y})`);
    });
  };

  /* Entrance: the curve draws itself once, on first view. */
  useGSAP(
    () => {
      const line = lineRef.current;
      if (!line) return;

      paint();

      if (prefersReducedMotion()) return;

      const length = line.getTotalLength();
      gsap.fromTo(
        line,
        { strokeDasharray: length, strokeDashoffset: length },
        {
          strokeDashoffset: 0,
          duration: 2,
          ease: GSAP_EASE.expo,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
          /* Clearing the dash array keeps the stroke crisp afterwards. */
          onComplete: () => {
            line.style.strokeDasharray = '';
          },
        },
      );
    },
    { scope: sectionRef },
  );

  /*
   * Filter change. A plain `useEffect`, not `useGSAP`: this targets a ref with
   * no selector strings, so the scoping buys nothing, and `useGSAP`'s
   * dependency handling did not re-run on `filter` — the curve stayed frozen on
   * the first series while the rest of the section updated.
   */
  useEffect(
    () => {
      const to = INTELLIGENCE.series[filter].map((p) => p.value);

      if (prefersReducedMotion()) {
        values.current = to;
        paint();
        return;
      }

      /* Where the curve is now — possibly mid-flight from a previous switch. */
      const from = [...values.current];

      progress.current.t = 0;
      const tween = gsap.to(progress.current, {
        t: 1,
        duration: 0.85,
        ease: GSAP_EASE.expo,
        /* Kills any in-flight tween on this object, so rapid switching resolves
           to the last filter chosen instead of two tweens fighting. */
        overwrite: true,
        onUpdate: () => {
          const t = progress.current.t;
          for (let i = 0; i < to.length; i += 1) {
            values.current[i] = from[i] + (to[i] - from[i]) * t;
          }
          paint();
        },
      });

      return () => {
        tween.kill();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filter],
  );

  return (
    <section
      ref={sectionRef}
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
                  viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
                  className="w-full overflow-visible text-amber-400"
                  role="img"
                  aria-label={`${INTELLIGENCE.subtitle}, ${INTELLIGENCE.period}. Illustrative index values from ${series[0].value} in ${series[0].label} to ${series[series.length - 1].value} in ${series[series.length - 1].label}. Full values are available in the table below.`}
                >
                  <defs>
                    <linearGradient id="pulse-wash" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
                      <stop offset="60%" stopColor="currentColor" stopOpacity="0.04" />
                      <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                    </linearGradient>
                    {/* Nodes only, never the whole chart — a blurred stroke
                        would soften the data itself. */}
                    <filter id="pulse-glow" x="-120%" y="-120%" width="340%" height="340%">
                      <feGaussianBlur stdDeviation="5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
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

                  <path ref={areaRef} fill="url(#pulse-wash)" stroke="none" />
                  <path
                    ref={lineRef}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />

                  {/* Each node is a group translated into place, so the tween
                      moves one transform instead of two coordinates. */}
                  {series.map((point, i) => (
                    <g
                      key={point.label}
                      ref={(el) => {
                        nodeRefs.current[i] = el;
                      }}
                    >
                      <circle
                        r="3"
                        fill="currentColor"
                        filter="url(#pulse-glow)"
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
