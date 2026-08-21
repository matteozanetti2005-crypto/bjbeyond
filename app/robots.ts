import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/routes';

/**
 * Required by `output: 'export'`. A `sitemap.ts` / `robots.ts` is a Route
 * Handler, and a handler is dynamic until it says otherwise — which a build
 * with no server cannot honour, so it fails the export outright rather than
 * shipping a route that could never run. Both files are pure functions over a
 * constant, so declaring them static is a statement of fact, not a workaround.
 */
export const dynamic = 'force-static';

/**
 * `out/robots.txt`.
 *
 * The permission it grants was already in force — absent a `robots.txt` a
 * crawler assumes everything is allowed — so the line that earns this file is
 * `Sitemap`. It is the only way a crawler finds the sitemap without being told
 * in Search Console, and the only way the other search engines find it at all.
 *
 * `/pages/` is disallowed, and that is a decision worth stating: those two
 * files are the pre-rebuild privacy and cookie policies, kept served so old
 * inbound links keep resolving. They are word-for-word duplicates of
 * `/privacy-policy/` and `/cookie-policy/`, and a duplicate that is crawled
 * competes with the original for the same query. A person following an old link
 * still gets the page — `Disallow` governs crawling, not access.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/pages/'],
    },
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
