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
| Motion | CSS transitions on one shared IntersectionObserver · GSAP + ScrollTrigger for desktop scroll choreography, loaded on demand |
| Deploy | GitHub Pages, from `.github/workflows/deploy.yml` |

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

> **There is no `lint` script, on purpose.** There used to be one calling
> `next lint`, which Next 16 removed, against an ESLint configuration that did
> not exist — so every `eslint-disable` comment in the tree was suppressing a
> rule nothing was running. Its replacement, `eslint-config-next`'s flat config,
> cannot run here either: it loads `typescript-eslint`, which refuses to start
> against the TypeScript 7 this project builds with
> ([typescript-eslint#10940](https://github.com/typescript-eslint/typescript-eslint/issues/10940)).
> Rather than leave 300 packages installed that error on launch, the script is
> gone until that lands. `npm run typecheck` is the gate in the meantime, and
> with `noUnusedLocals` and `noUnusedParameters` it is a strict one.

> **On `/phoenix` and `/frequency`:** these are directories in `public/` containing `index.html`. Static hosts resolve a directory to its index automatically, so both work in production. `next dev` does not, so `next.config.mjs` carries dev-only rewrites to match. The build prints a warning that rewrites are ignored when exporting — that is expected and correct; they exist purely for development parity.

---

## Project structure

```
app/            layout, homepage, the inner pages, global tokens
  art/ books/ method/ services/        the pages the menu leads to
  labs/ contact/
  privacy-policy/ cookie-policy/       legal, own shell
  sitemap.ts robots.ts                 generated from lib/routes.ts
  schema.json/                         generated from lib/schema.ts
components/
  atmosphere/   procedural photography substitute (see below)
  chrome/       nav, intro, cursor, scroll sync, logo, page shell,
                consent banner, analytics
  primitives/   reveal, magnetic, arrow link, rail
  sections/     hero, about, dispatch, method, authentia, in-motion,
                labs, work, intelligence, contact, footer
lib/
  content.ts    ALL copy — single source of truth
  routes.ts     ALL urls — single source of truth
  schema.ts     JSON-LD, derived from content.ts
  analytics.ts  measurement ids, and the consent rule over them
  media.ts      image manifest — the only place photography enters
  motion.ts     easing + duration tokens
  reveal.ts     the shared IntersectionObserver behind every entrance
  gsap.ts       the desktop gate, and the dynamic import behind it
  gsap-runtime.ts  the library itself — never imported statically
public/         legacy apps and assets, copied verbatim into the build
_legacy/        the pre-rebuild index.html, kept for reference only (not built)
```

---

## Pages

The site was one document with an anchor menu. It is now a homepage plus a set
of real URLs, because an anchor cannot be indexed, cannot carry its own title or
link preview, and cannot be the destination of an ad.

**[`lib/routes.ts`](lib/routes.ts) is the single source of truth for URLs.** The
sitemap, the navigation, `ArrowLink`'s decision between `next/link` and `<a>`,
and every page's metadata all read it. Adding a page means adding an entry there
and creating `app/<name>/page.tsx` with:

```ts
export const metadata: Metadata = metadataFor('/name/');
```

That one call produces the title, description, canonical, Open Graph card and
Twitter card together — they have to agree, and doing them by hand per page is a
fresh chance to get one wrong per page.

Two rules that are easy to break:

- **Trailing slashes are part of the path.** `trailingSlash: true` means the
  served URL is `/method/`. A manifest entry or canonical without the slash
  names a URL that redirects.
- **`draft: true` keeps a page out of the menu and out of the sitemap, and
  marks it `noindex`.** `/books/` and `/dispatch/` carry it today — `/books/`
  because its three entries are placeholders the owner asked for, `/dispatch/`
  because the page is not built. Announcing a URL that 404s, or letting Google
  index invented book titles under a real author's name, are the two things
  this flag prevents.

The homepage keeps the full scroll narrative — it is the brand experience and
the landing for cold traffic. The inner pages are flatter on purpose: someone
arriving from an ad wants the answer, not the entrance, which is also why
`PageShell` mounts `IntroProvider` with `curtain={false}`.

**Links between pages are plain `<a>`, never `next/link`.** That is a
measurement decision, not a routing one, and it is load-bearing — see below.

---

## Structured data

Every page carries one `<script type="application/ld+json">` describing an
`Organization` and a `WebSite`, built by [`lib/schema.ts`](lib/schema.ts) from
`SITE`, `SOCIAL` and `CONTACT`. This is the vocabulary Google reads to treat
**BJ Beyond** as an entity rather than a phrase, and `sameAs` is what attaches
the X, TikTok, Threads, Reddit and Beacons accounts to that same entity.

There used to be a `public/schema.json` doing none of this. Nothing referenced
it — no script tag, no link — so no crawler could find it, and it had drifted
into naming a social account the owner had replaced, an image that does not
exist, and a `contact` property that is not in the schema.org vocabulary at all
(the spelling is `contactPoint`; an unknown term is ignored, not reported).

It is now **derived, not written**, which is the point: structured data is a
second copy of facts the site already states, and a second copy that is
maintained by hand is the kind that goes quietly wrong. Change a social link in
`lib/content.ts` and the JSON-LD changes with it.

The `/schema.json` URL still resolves — [`app/schema.json/route.ts`](app/schema.json/route.ts)
serialises the same object — so any old link keeps working without there being
two definitions of these facts.

**Not included, deliberately:** the owner's legal name as `founder`. It appears
in the privacy policy because a data controller must be named there; publishing
it as machine-readable metadata on every page is a different act, and the
owner's call. It is one property when they want it.

---

## Consent and measurement

**Nothing measurable loads before consent.** Not GA4, not the Meta pixel — no
request is made to Google or Meta until the visitor accepts.

GA4 previously ran on every visit with no banner and nothing to refuse it. That
was a gap on its own; adding an advertising pixel to it would have made the
cookie policy's own statement — that the site uses no advertising profiling
cookies — untrue.

| Piece | Where |
|---|---|
| Measurement IDs, consent signals | [`lib/analytics.ts`](lib/analytics.ts) |
| Banner, stored choice, withdrawal | [`components/chrome/Consent.tsx`](components/chrome/Consent.tsx) |
| The tags, and per-route page views | [`components/chrome/Analytics.tsx`](components/chrome/Analytics.tsx) |
| Consent Mode v2 defaults (denied) | inline in `<head>`, [`app/layout.tsx`](app/layout.tsx) |

- **The Meta pixel is live.** Setting `META_PIXEL_ID` also publishes the cookie
  policy's marketing rows and its extra-EU transfer notice, which are derived
  from that same constant in [`lib/legal.ts`](lib/legal.ts). The document cannot
  describe a pixel the site does not run, or stay silent about one it does.
  Setting it back to `null` withdraws both together.
- **No page-view code exists, on purpose.** Every internal link is a plain
  `<a>`, so each page is a fresh document load and both tags do their own
  counting — which is what they are built for.

  This replaced three failed attempts at driving them by hand under
  `next/link`, each of which failed silently: manual sending **doubled** every
  navigation (GA4's Enhanced Measurement was already tracking History API
  changes), `send_page_view: false` removed the landing page instead of the
  duplicate, and leaving GA to Enhanced Measurement alone **lost a third of the
  navigations**. Measured by intercepting `sendBeacon`/`fetch`/`XHR` — resource
  timing undercounts, because GA4 batches events into one request.

  If client-side navigation is ever wanted back, the manual sending has to be
  rebuilt **and re-measured on the live domain**. Not on localhost: the Meta
  pixel reports the origin rather than the page path there, so it cannot be
  verified. The full reasoning is in `Analytics.tsx`.
- **Expect lower numbers than before.** Visitors who ignore the banner are now
  invisible. The old figures were not more accurate — they were collected
  without asking.

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
- `/docs/*`, `/CNAME`
- `/schema.json` — same URL, no longer a static file; see **Structured data**

`/assets/*` was on this list and is gone. It held four files — a 14.7MB MP4 and
three images — that nothing in the site referenced: not the sections, not the
standalone apps, not a stylesheet. They were 85% of every deploy. Git history
still has them if one is ever wanted back.

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

**GitHub Pages**, and only GitHub Pages. `.github/workflows/deploy.yml`
installs, builds, and uploads `out/`.

Two things that have each broken the live site once:

- **Pages' source must stay on GitHub Actions**, not "Deploy from a branch".
  On a branch source, Jekyll rebuilds from the repository root, finds no
  `index.html`, and renders the README as the homepage.
- **`public/.nojekyll` is required.** Without it Jekyll strips `_next/`, which
  removes every stylesheet and script.

`vercel.json` and `wrangler.jsonc` used to sit alongside this for platforms
nobody deploys to — the Cloudflare one registered under a different project's
name. They were removed rather than maintained; both were three lines, and git
still has them if a second target is ever wanted.

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
