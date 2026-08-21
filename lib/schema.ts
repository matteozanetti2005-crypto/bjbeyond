/**
 * The site's structured data, built from `lib/content.ts`.
 *
 * WHAT THIS REPLACES. There was a `public/schema.json` describing the
 * organisation, and nothing in the site ever referenced it — no
 * `<script type="application/ld+json">`, no `<link>`. A crawler had no way to
 * find it and no reason to look, so the file had been describing the site to
 * nobody since it was written. It had also drifted: it pointed at an
 * `og-image.jpg` that does not exist, still listed the Linktree the owner has
 * replaced, and used `contact`, which is not a schema.org property at all — the
 * spelling is `contactPoint`, and a term that is not in the vocabulary is
 * ignored rather than reported.
 *
 * WHY IT IS DERIVED RATHER THAN WRITTEN. Structured data is a second copy of
 * facts the site already states, which makes it the kind of file that is
 * correct on the day it is written and wrong within a year — the Linktree entry
 * is exactly that failure. Everything below reads `SITE`, `SOCIAL` and
 * `CONTACT`, so changing a social link in one place changes what Google is
 * told, and there is no second place to forget.
 *
 * WHAT IT BUYS. This is the vocabulary Google reads to decide that `BJ Beyond`
 * is an entity rather than a phrase: it is what a knowledge panel is assembled
 * from, and `sameAs` is how the accounts on X, TikTok, Threads, Reddit and
 * Beacons get attached to the same entity instead of floating separately.
 *
 * NOT INCLUDED, deliberately: the owner's legal name. It appears in the privacy
 * policy because a data controller has to be named there, which is a different
 * act from publishing it as machine-readable `founder` metadata on every page
 * of the site. Add it if the owner wants the person and the practice linked in
 * search results — it is one property — but that is their call to make.
 */
import { CONTACT, SITE, SOCIAL } from './content';
import { absoluteUrl } from './routes';

/**
 * Stable `@id`s, so the two nodes can reference each other instead of repeating
 * themselves. A fragment on the site's own URL is the convention: it names the
 * thing without claiming the URL resolves to it.
 */
const ORGANISATION_ID = `${SITE.url}/#organization`;
const WEBSITE_ID = `${SITE.url}/#website`;

/**
 * One `@graph` rather than two script tags, which is how you say that these
 * nodes describe one site — `publisher` below is a reference to the node above
 * rather than a second copy of it.
 */
export function siteSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': ORGANISATION_ID,
        name: SITE.name,
        url: SITE.url,
        description: SITE.description,
        slogan: SITE.tagline,
        /* Google reads `logo` for the mark and `image` for a representative
           picture; they are different jobs and it wants both. */
        logo: absoluteUrl('/media/logo-512.webp'),
        image: absoluteUrl('/opengraph-image.jpg'),
        email: CONTACT.emails[0].address.toLowerCase(),
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Milano',
          addressCountry: 'IT',
        },
        /*
          The first address only, and that is a statement about whose it is.
          `CONTACT.emails` also carries the address of the digital creator of
          Phoenix Soulfire — a collaborator, at their own domain. The contact
          page shows it because a reader may need to reach them; listing it here
          would assert it is a contact point OF this organisation, which is a
          different claim, and would republish another person's address as
          machine-readable data attached to someone else's entity.
        */
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: CONTACT.emails[0].role.toLowerCase(),
          email: CONTACT.emails[0].address.toLowerCase(),
        },
        /* The whole point of the graph: these accounts and this organisation
           are one entity. Derived, so removing a platform removes it here. */
        sameAs: SOCIAL.map((social) => social.href),
      },
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: SITE.url,
        name: SITE.name,
        description: SITE.description,
        publisher: { '@id': ORGANISATION_ID },
        inLanguage: 'en',
      },
    ],
  };
}
