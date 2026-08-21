/**
 * Every URL this site publishes, in one place.
 *
 * WHY THIS FILE EXISTS. The site used to be one document: `/` carried the whole
 * narrative and the navigation moved through it with anchors. An anchor is not
 * a URL — Google cannot return `#work` as a result, GA4 records every visit
 * against `/`, and a Meta campaign cannot be pointed at a destination that does
 * not exist, nor given a link preview of its own. This manifest is the list of
 * things that ARE addresses. The sitemap, the navigation and each page's
 * metadata all read it, so publishing a page and announcing it cannot drift
 * apart.
 *
 * TRAILING SLASHES ARE PART OF THE PATH. `next.config.mjs` sets
 * `trailingSlash: true`, so the URL a browser lands on is `/method/`, not
 * `/method`. Write them here exactly as served: a canonical or a sitemap entry
 * missing the slash names a URL that redirects, which is a wasted crawl and a
 * split signal.
 *
 * COPY STILL LIVES IN `lib/content.ts`. The titles and descriptions below are
 * imported from it rather than retyped — a meta description that quietly
 * diverges from the page it describes is the usual way this kind of file rots.
 * The only strings written here are the menu labels, which are names of
 * destinations rather than prose.
 */
import type { MetadataRoute } from 'next';
import { ART, BOOKS, CONTACT, DISPATCH, LABS, METHOD, SITE, WORK } from './content';

export interface SiteRoute {
  /** Path as served, leading and trailing slash included. */
  path: string;
  /** Menu label. A route without one is reachable but unlisted. */
  label?: string;
  /** Feeds `<title>`, through the `%s — BJ Beyond` template in app/layout.tsx. */
  title?: string;
  /** Feeds the meta description and the Open Graph / Twitter card. */
  description?: string;
  /**
   * Relative to the other entries here and nothing else — a hint about this
   * site's own shape, not a score compared between domains.
   */
  priority: number;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;
  /**
   * Not an App Router route: a directory in `public/` holding its own
   * `index.html`. Still a real, indexable URL — which is all the sitemap cares
   * about — but it must be linked with a plain `<a>`, never `next/link`, which
   * would try to resolve it client-side. See README.
   */
  outsideRouter?: true;
  /**
   * The URL is decided, the page is not live yet. Excluded from the menu and
   * from the sitemap: announcing a URL that 404s spends crawl budget to teach
   * Google the site is unreliable, and a menu entry leading nowhere is worse
   * than both.
   *
   * Two different reasons land here. `/art/` and `/books/` have no copy yet —
   * `lib/content.ts` holds the rule that nothing on this site is invented, so
   * they wait for the owner's own words. `/dispatch/` has copy and no page:
   * its card markup lives inline inside the homepage section and wants
   * extracting before it can be rendered twice, which is a refactor that buys
   * nothing until the page is actually wanted.
   *
   * The entries stay here either way, so the URLs are settled before anything
   * links to them. Flip the flag off — do not delete it — when the page ships.
   */
  draft?: true;
}

/**
 * Ordered as the menu reads, which is also roughly the order of importance.
 *
 * `/pages/privacy-policy.html` and `/pages/cookie-policy.html` are deliberately
 * ABSENT. They are the pre-rebuild copies, kept alive so old inbound links
 * still resolve, and they duplicate `/privacy-policy/` and `/cookie-policy/`
 * word for word. Listing a duplicate asks Google to choose between two URLs
 * carrying the same document; leaving it out — and disallowing it in
 * `app/robots.ts` — lets the canonical one win.
 */
export const ROUTES: readonly SiteRoute[] = [
  {
    path: '/',
    label: 'HOME',
    priority: 1.0,
    changeFrequency: 'weekly',
  },
  {
    path: '/art/',
    label: 'ART',
    title: 'Art',
    description: ART.standfirst,
    priority: 0.9,
    changeFrequency: 'monthly',
  },
  {
    path: '/books/',
    label: 'BOOKS',
    title: 'Books',
    description: BOOKS.standfirst,
    priority: 0.9,
    changeFrequency: 'monthly',
    /* The page is built and reachable at its URL; the three entries on it are
       placeholders. `draft` is what keeps invented titles out of Google and out
       of the menu until real ones replace them. See the note on BOOKS in
       lib/content.ts — this flag is one of three that lift together. */
    draft: true,
  },
  {
    path: '/method/',
    label: 'METHOD',
    title: `${METHOD.title}${METHOD.trademark}`,
    description: METHOD.description,
    priority: 0.9,
    changeFrequency: 'monthly',
  },
  {
    path: '/labs/',
    label: 'LABS',
    title: 'Labs',
    description: LABS.description,
    priority: 0.8,
    changeFrequency: 'monthly',
  },
  {
    path: '/services/',
    label: 'SERVICES',
    title: 'Services',
    description: WORK.description,
    priority: 0.9,
    changeFrequency: 'monthly',
  },
  {
    path: '/dispatch/',
    label: 'DISPATCH',
    title: 'Dispatch',
    description: DISPATCH.description,
    priority: 0.7,
    changeFrequency: 'weekly',
    draft: true,
  },
  {
    path: '/contact/',
    label: 'CONTACT',
    title: 'Contact',
    description: CONTACT.description,
    priority: 0.8,
    changeFrequency: 'yearly',
  },

  /* Standalone apps, carried over from the previous site untouched. */
  {
    path: '/phoenix/',
    priority: 0.7,
    changeFrequency: 'monthly',
    outsideRouter: true,
  },
  {
    path: '/frequency/',
    priority: 0.7,
    changeFrequency: 'monthly',
    outsideRouter: true,
  },

  { path: '/privacy-policy/', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/cookie-policy/', priority: 0.3, changeFrequency: 'yearly' },
] as const;

/** What the menu lists: everything labelled, minus what is not finished. */
export const NAV_ROUTES = ROUTES.filter(
  (route): route is SiteRoute & { label: string } =>
    route.label !== undefined && !route.draft,
);

/** What the sitemap announces. A draft page is not announced. */
export const INDEXABLE_ROUTES = ROUTES.filter((route) => !route.draft);

/**
 * A path in the form this manifest writes them.
 *
 * `trailingSlash: true` means every URL is served with one, but `usePathname`
 * does not reliably report it — so the comparison "is this the current page"
 * has to normalise rather than trust what it is handed. One character's
 * difference silently un-highlights the whole menu.
 */
export function withSlash(path: string): string {
  return path.endsWith('/') ? path : `${path}/`;
}

/** Absolute URL for a path in this manifest. Crawlers require absolute. */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE.url).toString();
}

/** The manifest entry for a path, so a page can read its own metadata. */
export function routeFor(path: string): SiteRoute {
  const match = ROUTES.find((route) => route.path === path);
  if (!match) throw new Error(`No route declared in lib/routes.ts for "${path}"`);
  return match;
}

/**
 * The `metadata` export for a page, built from its manifest entry.
 *
 * Centralised because these fields have to agree with each other: a canonical
 * that disagrees with the Open Graph URL is the kind of mismatch that costs a
 * page its own search result, and doing it by hand on every page is a fresh
 * chance to get it wrong on every page.
 *
 * THE CARD IS SPELLED OUT IN FULL, and both halves of it are here for a reason
 * found by reading the built HTML rather than by reasoning about it.
 *
 * `images` — declaring `openGraph` on a page REPLACES the object inherited from
 * the layout, and the picture that `app/opengraph-image.jpg` contributes lives
 * inside that object. Setting a page title was therefore enough to silently
 * strip the page of its preview image: every inner page was shipping a link
 * that unfurls as a bare grey rectangle. On a page whose whole purpose is to be
 * the destination of an ad, that is most of the ad.
 *
 * `twitter` — the same shape of bug one layer along, and quieter. The layout's
 * twitter card does NOT inherit the page's title, it keeps its own, so sharing
 * `/method/` announced the homepage's headline and the homepage's description
 * under the method page's URL. Nothing errors; it is simply wrong, on the one
 * surface nobody checks because it renders somewhere else.
 *
 * One shared image for now. A picture per page is better — it is the difference
 * between an ad that shows what it sells and one that shows a logo — but that
 * is artwork to commission, not code to write. Add `opengraph-image.jpg` inside
 * a route's own folder and Next prefers it over this automatically.
 */
const OG_IMAGE = {
  url: '/opengraph-image.jpg',
  width: 1200,
  height: 630,
  alt: SITE.ogAlt,
} as const;

export function metadataFor(path: string) {
  const route = routeFor(path);
  const cardTitle = route.title ? `${route.title} — ${SITE.name}` : undefined;

  return {
    title: route.title,
    description: route.description,
    alternates: { canonical: route.path },
    openGraph: {
      type: 'website' as const,
      url: route.path,
      title: cardTitle,
      description: route.description,
      siteName: SITE.name,
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: cardTitle,
      description: route.description,
      images: [OG_IMAGE],
    },
    /* A page that is not live must never be indexed, whatever links to it. */
    ...(route.draft ? { robots: { index: false, follow: false } } : {}),
  };
}
