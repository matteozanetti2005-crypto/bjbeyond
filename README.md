# BJ Beyond

**Art Market Intelligence. AI + Human Judgment. Real Impact.**

Live: [bjbeyond.it](https://bjbeyond.it)

---

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router), static export |
| Language | TypeScript, strict |
| Styling | Tailwind CSS v4 (CSS-first `@theme` tokens) |
| Motion | Framer Motion (component states) · GSAP + ScrollTrigger (scroll choreography) |
| Deploy | GitHub Pages **and** Vercel from the same build output |

---

## Quick start

```bash
npm install
```

```bash
npm run dev
```

Then open <http://localhost:3000>.

| Script | Does |
|---|---|
| `npm run dev` | Dev server with HMR |
| `npm run build` | Static export into `out/` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run media` | Regenerates `public/media/` from `media-src/` |

> **On `/phoenix` and `/frequency`:** these are directories in `public/` containing `index.html`. Static hosts resolve a directory to its index automatically, so both work in production. `next dev` does not, so `next.config.mjs` carries dev-only rewrites to match. The build prints a warning that rewrites are ignored when exporting — that is expected and correct; they exist purely for development parity.

---

## Project structure

```
app/            layout, page, global tokens
components/
  atmosphere/   procedural photography substitute (see below)
  chrome/       nav, intro sequence, cursor, scroll sync, logo
  primitives/   reveal, magnetic, arrow link
  sections/     hero, jbond, method, labs, work, intelligence, contact, footer
lib/
  content.ts    ALL copy — single source of truth
  media.ts      image manifest — the only place photography enters
  motion.ts     easing + duration tokens
  gsap.ts       plugin registration
public/         legacy apps and assets, copied verbatim into the build
_legacy/        the pre-rebuild index.html, kept for reference only (not built)
```

---

## Photography

Source art lives in `media-src/` as bitmaps wrapped in SVG envelopes:

| File | Contains |
|---|---|
| `background.svg` | A four-panel contact sheet, 7680×4352 |
| `avatar.svg` | The cut-out portrait, RGB + alpha mask layers |
| `logo.svg` | The white BJ monogram with alpha |

`npm run media` turns these into the responsive WebP variants the site serves —
splitting the contact sheet into four scenes, cropping away its burned-in
reference labels, and emitting each at several widths. All the imagery on the
site totals **~790 KB**, down from 6.6 MB of source.

Two things in that script are deliberate and easy to get wrong:

- The **background** is read by extracting the embedded JPEG, not by rasterising
  the SVG. Rendering the wrapper applies its own viewBox placement, which
  reframes the sheet so the panel grid no longer lines up.
- The **portrait** is the opposite: it *must* be rasterised, because the
  envelope holds a colour layer and a separate greyscale alpha mask, and only
  the renderer composites them into the cut-out figure.

Slots still without a photograph — the three Labs plates — render a
**procedural atmosphere** instead: layered ridge silhouettes, drifting fog, a
warm source and grain, generated deterministically from the slot id. To give one
a real image, add its variants to `public/media/` and set `src` + `widths` on
that slot in [`lib/media.ts`](lib/media.ts). Nothing else needs to change.

---

## Preserved from the previous site

These URLs predate the rebuild and still resolve exactly as before:

- `/phoenix` — Phoenix Simulator
- `/frequency` — Frequency Studio
- `/pages/privacy-policy.html`, `/pages/cookie-policy.html`
- `/assets/*`, `/docs/*`, `/schema.json`, `/CNAME`

They are served verbatim from `public/` and are **not** managed by the router.
Link to them with a plain `<a>`, never `next/link` — they are not App Router
routes and `next/link` would try to resolve them client-side.

**Phoenix and Frequency are deliberately untouched.** Their markup, styling and
behaviour are byte-identical to the pre-rebuild files; they keep their own
design. Do not restyle them to match the main site unless explicitly asked.

## Legal pages

The privacy and cookie policies **were** rebuilt, and now live as real routes:

- `/privacy-policy` — [`app/privacy-policy/page.tsx`](app/privacy-policy/page.tsx)
- `/cookie-policy` — [`app/cookie-policy/page.tsx`](app/cookie-policy/page.tsx)

Both render through [`components/legal/LegalPage.tsx`](components/legal/LegalPage.tsx)
from structured content in [`lib/legal.ts`](lib/legal.ts). The wording is
transcribed verbatim from the original documents — it is a legal statement about
data handling, so only the presentation changed.

The old `/pages/*.html` files are still served untouched, so any link already
published elsewhere keeps working. The site's own footer points at the new
routes.

---

## Deployment

Both targets consume the same `out/` directory.

**GitHub Pages** — `.github/workflows/deploy.yml` installs, builds, and uploads
`out/`. `public/.nojekyll` is required: without it Jekyll strips `_next/`, which
removes every stylesheet and script.

**Vercel** — auto-detects Next.js. `vercel.json` keeps the legacy capitalised
`/Phoenix` URL working.

**Cloudflare** — `wrangler.jsonc` serves `./out`. Run `npm run build` first.

---

## Notes

- **Art Market Pulse data is illustrative**, not a live market feed. The
  interface says so on screen. Do not present it as real market data.
- **API keys are not hardcoded.** The Phoenix simulator and worker read them
  from user-supplied `<input type="password">` fields at runtime. (An earlier
  version of this README warned otherwise; that warning was out of date.)
- The BJ monogram in `components/chrome/Logo.tsx` is a geometric
  reconstruction, drawn as SVG because the bitmap in `/assets` is dark-on-dark
  with no alpha and cannot be shown white on a dark background. Replace its two
  paths with the official vector when available.

---

*One step beyond AI.*
