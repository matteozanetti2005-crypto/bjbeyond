/**
 * All site copy, in one place.
 *
 * Most of it is the owner's own text, carried over from bjbeyond.it and treated
 * as approved — do not reword it without asking. The rest comes from the
 * supplied art direction (HERO.ticker, the pillar `terms`, the section CTAs,
 * LABS.intro). Nothing here is invented.
 *
 * VOICE — first person singular. This is a one-person practice, so prose and
 * section labels say "I" and "MY": WORK is "WHAT I DO", METHOD is "MY METHOD",
 * BEYOND.body is "I combine… I deliver…".
 *
 * The one deliberate exception is the brand line "We go further.", kept as
 * written in HERO.subtitle, SITE.description and FOOTER.copyright. It reads as
 * a signature rather than as a claim about headcount, and it is the line the
 * audience already associates with the site. Do not "fix" it for consistency.
 */

export const SITE = {
  name: 'BJ Beyond',
  wordmark: 'BJ BEYOND',
  tagline: 'Intelligence is the standard.',
  domain: 'bjbeyond.it',
  url: 'https://bjbeyond.it',
  locale: 'Milano, Italia',
  description:
    'Art Market Intelligence. We go further. At the intersection of data, AI, and human intuition.',
  /**
   * Alt text for the shared social card.
   *
   * The homepage gets this from `app/opengraph-image.alt.txt`, which is a file
   * convention Next reads for the image sitting beside it and nothing else —
   * there is no way to import it. Inner pages build their card in
   * `lib/routes.ts`, so they need the sentence as a value. Keep the two
   * identical: they describe the same picture.
   */
  ogAlt:
    'BJ Beyond — Intelligence is the standard. Art market intelligence at the intersection of data, AI, and human intuition.',
} as const;

/**
 * NAV used to live here as a list of anchors into this same document. It has
 * moved to `lib/routes.ts` and become a list of real URLs.
 *
 * The move is the point, not a tidy-up. An anchor is a scroll position: it
 * cannot be indexed on its own, cannot carry its own title or link preview, and
 * cannot be the destination of an ad. A menu of anchors was a menu of one page.
 * Menu entries are now addresses, so they belong with the other addresses.
 *
 * Copy still lives in this file. `lib/routes.ts` imports the titles and
 * descriptions from here rather than restating them.
 */

export const HERO = {
  eyebrow: ['ONE STEP', 'BEYOND AI'],
  title: ['INTELLIGENCE', 'IS THE STANDARD.'],
  subtitle: ['WE GO FURTHER.', 'AT THE INTERSECTION OF DATA,', 'AI, AND HUMAN INTUITION.'],
  scrollCue: 'SCROLL',
  ticker: ['DATA', 'AI', 'HUMAN EDGE', 'CULTURE', 'IMPACT'],
} as const;

export const BEYOND = {
  index: '01',
  label: ['WHO IS', 'BJ BEYOND'],
  name: 'BJ BEYOND',
  role: 'INDEPENDENT PRACTICE — MILANO',
  lede: 'Independent practice at the intersection of data, AI, and human intuition.',
  body: [
    'BJ Beyond helps artists, collectors, and companies navigate the new creative economy. I combine deep art market expertise with cutting-edge data science and AI tools.',
    'From artist evaluations to custom Power BI dashboards, I deliver intelligence that actually gets used.',
  ],
  capabilities: [
    ['ART MARKET', 'INTELLIGENCE'],
    ['AI + HUMAN', 'EDGE STRATEGY'],
    ['DATA SYSTEMS', '& VISUALIZATION'],
    ['CULTURE &', 'IMPACT STRATEGY'],
  ],
  stats: [
    { value: '5', label: 'Phoenix Soulfire Pillars' },
    { value: '∞', label: 'Data Points Analyzed' },
    { value: 'AI+', label: 'Human-Edge Strategy' },
    { value: '1:1', label: 'Bespoke Approach' },
  ],
  scrollCue: ['SCROLL TO', 'CONTINUE'],
} as const;

/**
 * 02 — DISPATCH
 *
 * A hand-picked shelf of posts from the X profile, sitting directly after the
 * introduction because it is the fastest proof of the voice that section
 * describes.
 *
 * It is deliberately NOT a feed. Nothing is fetched, nothing embeds X's widget
 * script, and the order is the owner's rather than the algorithm's — adding a
 * post means adding an object here and nothing else.
 *
 * WHY NOT THE OFFICIAL EMBED. It arrives as a third-party script that reflows
 * each card after paint, ignores this palette, sets cookies the cookie policy
 * would then have to declare, and renders nothing at all once a post is deleted
 * or the account goes private. Phase 4 in HANDOFF.md was spent taking 111 KB
 * off the critical path; this is where it stays off.
 *
 * TITLE is written for the card. An X post carries no title of its own, and a
 * rail of untitled paragraphs gives the eye nowhere to land — the title is what
 * makes the shelf scannable at a glance.
 */
/**
 * The shape below is deliberately the X API's own, field for field — `id`,
 * `text`, `created_at`, and an author carrying `name` / `username` / `verified`.
 *
 * Nothing calls that API today; the list is written by hand. But the site is a
 * static export with no server, so if it ever fetches, the fetch can only run at
 * build time in CI and write exactly this structure to disk. Modelling it now
 * costs nothing and means the automatic version is one script and zero
 * component changes. Writing a bespoke shape would have guaranteed a rewrite.
 */
export interface DispatchPost {
  /**
   * The post's own numeric id on X — the last segment of its URL. The permalink
   * is derived from it, exactly as it is from an API response.
   *
   * Empty string while no real post is wired: `postUrl` then falls back to the
   * profile rather than building a link to a status that does not exist.
   */
  id: string;
  /**
   * The post, verbatim. Line breaks are preserved when rendered, so paste it as
   * written. Roughly 280 characters is X's own ceiling and a good one here too:
   * the rail stretches every card to the tallest, so one long post pays for
   * itself in dead space under all the others.
   */
  text: string;
  /**
   * ISO date, as `created_at` arrives from the API. Formatted for display in
   * `lib/content.ts`'s own table rather than by `toLocaleDateString`, which
   * would render against the BUILD machine's locale — a European runner and a
   * US one would ship different dates from identical source.
   */
  createdAt: string;
  /**
   * Set when the post is not in English. The document is `lang="en"`, so
   * without this a screen reader pronounces Italian with English phonemes and
   * the post becomes unintelligible.
   */
  lang?: 'it';
}

const post = (p: DispatchPost): DispatchPost => p;

/** Deterministic, and intentionally not `Intl` — see the note on `createdAt`. */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

/** '2026-08-12' → '12 Aug 2026'. */
export function postDate(iso: string): string {
  const [year, month, day] = iso.split('-');
  return `${Number(day)} ${MONTHS[Number(month) - 1]} ${year}`;
}

/** Permalink from the id, the profile when there is not one yet. */
export function postUrl(entry: DispatchPost): string {
  return entry.id
    ? `https://x.com/${DISPATCH_AUTHOR.username}/status/${entry.id}`
    : DISPATCH.profile;
}

/**
 * The account every card is attributed to — the API's `includes.users[0]`.
 *
 * `verified` is false and must stay false unless the account actually carries
 * the platform's badge. Drawing a checkmark it has not been granted would be
 * asserting someone else's credential, which is precisely the thing this site
 * exists to argue against.
 */
export const DISPATCH_AUTHOR = {
  /* The display name as it stands on X — not 'BJ Beyond', which is the site's
     wordmark. The card is a reproduction of a post, so it carries the account's
     own name, trademark glyph included. */
  name: 'Bj™',
  username: 'BJ_Beyond',
  /* Confirmed from the account: the badge is real and granted. It was false
     until then, because drawing an unearned checkmark asserts a credential the
     platform did not give. */
  verified: true,
  /**
   * The monogram, on the site's own dark disc. Not the real X profile picture —
   * that is X's copy, and this is the same mark the header carries. Point it at
   * another slot in lib/media.ts to change it.
   */
  avatar: '/media/logo-128.webp',
} as const;

export const DISPATCH = {
  index: '02',
  label: ['FROM THE', 'FEED'],
  title: 'DISPATCH',
  description:
    'Short notes on the art market, AI, and the space between them. Hand-picked — nothing here streams in on its own.',
  handle: '@BJ_Beyond',
  profile: 'https://x.com/BJ_Beyond',
  cta: 'FOLLOW ON X',
  /** Per-card action. The whole card is the link; this names the destination. */
  action: 'READ ON X',
  /**
   * Shown at the cut when a post is clamped. X's own wording — change it freely,
   * it is one string. It is not a second link: the whole card already opens the
   * post, and nesting an anchor inside an anchor is invalid.
   */
  readMore: 'Show more',
  /** Touch only — the desktop rail has buttons instead. */
  hint: 'SCROLL FOR MORE',
  /*
    Five real posts, newest first. Every `text` is verbatim — line breaks, curly
    and straight apostrophes, emoji and hashtags as the author typed them — and
    every `createdAt` was read off the post itself rather than inferred from a
    relative stamp like "17h", which is ambiguous either side of midnight and was
    wrong by a day on the first one.

    To add another: paste the post into `text`, set `createdAt`, and set `id` to
    the last segment of its URL — x.com/BJ_Beyond/status/THIS_PART, dropping the
    `?s=20` X appends when you copy a link. With `id` empty the card falls back
    to the profile, so a half-finished entry can never 404.
  */
  posts: [
    post({
      id: '2088763934513750427',
      createdAt: '2026-08-16',
      text: 'The biggest lie of the AI era? Believing that anyone who knows how to hit "enter" will become an author, a designer, or a thinker.\n\nAutomation does not reward those who delegate their thinking to a machine. It rewards those who developed taste, intellectual rigor, and sensitivity long before touching any software.\n\nThe generation box doesn\'t create value out of thin air. It is simply a mirror:\nPut laziness in, and it hands you a flawless cliché.\n\nPut artistic vision and human touch in, and you achieve scale.\n\nStop searching for the magic prompt.\n\nThe only true competitive edge that will never become a commodity is you.',
    }),
    post({
      id: '2088581291796992410',
      createdAt: '2026-08-15',
      text: 'X just dropped a major open-source update to its recommendation system (x-algorithm).\n\nHere is what is actually happening under the hood and how it impacts organic reach:\n\n1. Semantic Embeddings over Hashtags\nThe "For You" feed has fully shifted away from static heuristics and hashtags. Discovery is driven by a two-tower transformer architecture (Phoenix) that maps posts directly to semantic interest clusters through NLP and media embeddings.\n\n2. Conversational Depth is King\nThe highest positive multiplier in the heavy ranker is no longer the Like or Retweet, it is author-engaged reply depth. Meaningful back-and-forth discussions where the creator replies multiply out-of-network distribution exponentially.\n\n3. Bookmarks as High-Utility Signals\nBookmarks carry substantially higher weight than standard likes. The ranking engine treats saves as long-term utility signals, pushing posts to broader, adjacent communities.\n\n4. Candidate Isolation\nThe inference pipeline isolates each candidate post during neural scoring. Your content is evaluated solely on the direct user-to-topic graph relationship, preventing batch-level dilution.\n\n5. "Under the Hood" Visibility Audits\nUsers can now extract account-level diagnostics from their data archive. The JSON payload exposes internal metrics such as `reputation_score`, `bot_probability`, and explicit flags in `tweet_level_interventions`.\n\nTakeaway: Stop optimizing for passive likes. Focus on high-retention substance, bookmark-worthy depth, and active discussion in the replies.\n\nHave you requested your account data archive yet to check your internal reputation score?\nWaiting mine for sharing the analysis with you 🚀',
    }),
    post({
      id: '2086840545473634334',
      createdAt: '2026-08-10',
      text: '🚨 Two key tech security alerts to know today:\n\n1️⃣ Metabase Zero-Day\nBreach on the popular BI platform. Affected several client databases and third-party integrations (including n8n).\n👉 Action item: If you use Metabase (especially cloud/integrations), check credentials, apply the official patch, and rotate API tokens immediately.\n\n2️⃣ Meta AI "Escape" (Sandbox Leak)\nA Meta AI model (Muse Spark 1.1) exploited an external vulnerability during testing. No rogue AI here: just a classic environment misconfiguration that accidentally granted it internet access.\n\n👉 Lesson: The real vulnerability of AI agents remains network permission management in test environments.\n\n---\n\nIs AI agent sandboxing set to become cybersecurity’s next biggest headache? 💬\n\n#CyberSecurity #TechNews #AI #Metabase #DevOps',
    }),
    post({
      id: '2086240565893509221',
      createdAt: '2026-08-09',
      text: 'This is what I do here.\n\nI’m an ex-finance professional who left the spreadsheets to build at the intersection of:\n\n→ Data & Power BI\n→ Human Edge in the AI era\n→ Art market intelligence\n\nI create real tools, frameworks and systems.\nNot content farms. Not engagement bait.\n\nIf you want polished AI noise, keep scrolling.\nIf you want the parts that still require a human, stay.',
    }),
    /* Opens a five-part thread. The card carries only this post, because that is
       what the permalink addresses and what X's own embed of it would show —
       the trailing "1/5" is the author's own signal that it continues. */
    post({
      id: '2059713633358069996',
      createdAt: '2026-05-27',
      text: 'People complain they don’t have enough time, but they spend four hours a day scrolling through stuff they don’t even care about.\n\nThe problem isn’t time. It’s that they can’t stand being alone with their own thoughts anymore.\n\n1/5',
    }),
  ],
} as const;

export const METHOD = {
  index: '03',
  label: ['MY', 'METHOD'],
  title: 'PHOENIX SOULFIRE',
  trademark: '™',
  description:
    'The five-pillar methodology for evaluating creative potential in the AI era.',
  cta: 'DISCOVER THE FRAMEWORK',
  /* The method has a working implementation of its own, on a subdomain. Same
     shape as AUTHENTIA.primary because it is the same treatment. */
  primary: { label: 'TRY NOW', href: 'https://phoenixsoulfire.bjbeyond.it' },
  scrollCue: ['SCROLL TO', 'EXPLORE'],
  pillars: [
    {
      number: '01',
      title: 'SOUL',
      terms: ['Purpose', 'Alignment', 'Vision'],
      description: 'The irreplaceable human core.',
    },
    {
      number: '02',
      title: 'EDGE',
      terms: ['Market', 'Advantage', 'Disruption'],
      description: 'Human intuition + AI power.',
    },
    {
      number: '03',
      title: 'CLARITY',
      terms: ['Data', 'Insight', 'Truth'],
      description: 'Complexity into insight.',
    },
    {
      number: '04',
      title: 'IMPACT',
      terms: ['Strategy', 'Execution', 'Results'],
      description: 'Results that matter.',
    },
    {
      number: '05',
      title: 'LEGACY',
      terms: ['Sustainability', 'Influence', 'Enduring Value'],
      description: 'Work built to last.',
    },
  ],
} as const;

/**
 * Featured project. Deliberately outside the 01–06 numbering: it is a
 * recommendation, not one of BJ Beyond's own chapters. Every factual claim
 * below comes from verify.authentia.it — do not embellish.
 */
export const AUTHENTIA = {
  eyebrow: 'RECOMMENDED PROJECT',
  title: ['AUTHENTIA', 'ARTE'],
  standfirst: 'Digital documentation of authorship, declared by the author.',
  description:
    'A certification platform that makes what a work carries with it verifiable. Each piece receives a SHA-256 cryptographic fingerprint and an NFC chip, creating a record of declared authorship that can be checked by anyone.',
  points: [
    'SHA-256 cryptographic fingerprint',
    'NFC chip integration',
    'Verifiable record of declared authorship',
  ],
  primary: { label: 'VERIFY A WORK', href: 'https://verify.authentia.it' },
  secondary: { label: 'AUTHENTIA.IT', href: 'https://authentia.it' },
} as const;

/**
 * IN MOTION — companion to the section above, and outside the 01–07 numbering
 * for exactly the reason Authentia is: this is Authentia Arte's channel, not
 * BJ Beyond's. The numbers belong to the owner's own chapters, and lending one
 * to someone else's Instagram would quietly break the rule that makes the
 * sequence mean anything.
 *
 * Each frame is a cover plate inside a drawn phone; pressing it opens the reel
 * on Instagram. No video is hosted, embedded or autoplayed here — see the note
 * on DISPATCH for why no third-party embed appears anywhere on this site.
 *
 * Three to five frames is the working range: fewer reads as an accident, more
 * overflows the lineup.
 *
 * `quote` is the pull-quote printed on the cover itself, repeated as type under
 * the frame — at 184px wide the words on the plate are decorative, and the line
 * beneath is the one anyone can actually read. It is Italian on an English
 * page, hence `lang` on the element that renders it.
 */
export const IN_MOTION = {
  eyebrow: 'FROM AUTHENTIA ARTE',
  title: ['IN', 'MOTION'],
  standfirst: 'Selected reels from the Authentia Arte channel.',
  description:
    'Artists, works, and the certification process — as it happens, in their own frames.',
  /*
    Supplied by the owner. It was worth waiting for: the handle is linked
    nowhere on authentia.it, and Instagram handles are squatted routinely, so a
    guess would have sent readers to a stranger under Authentia's name.

    Lowercased in the URL — Instagram resolves either case — while `handle`
    keeps the capitalisation the account is actually written with.

    Same three fields as DISPATCH, on purpose: the two sections carry the same
    footer treatment because they are the same gesture, one per platform.
  */
  handle: '@Authentia_Arte',
  profile: 'https://www.instagram.com/authentia_arte/',
  cta: 'VIEW THE CHANNEL',
  /** Per-frame action, spoken to screen readers rather than drawn on the card. */
  action: 'WATCH ON INSTAGRAM',
  /*
    Permalinks supplied by the owner, each paired with its cover by hand.

    Stored stripped of the `?utm_source=ig_web_copy_link&igsh=…` that Instagram
    appends when you copy a link: that query is share-attribution telemetry, it
    identifies the copying session, and none of it is needed to reach the reel.
    Strip it from any URL added here.
  */
  reels: [
    {
      id: '01',
      title: 'Bruno Donzelli',
      quote: 'la mia Pittura Ironica',
      mediaKey: 'reel-01',
      href: 'https://www.instagram.com/reel/DaQCEdlM8rn/',
    },
    {
      id: '02',
      title: 'Fabio Campagna',
      quote: 'il mio processo creativo',
      mediaKey: 'reel-02',
      href: 'https://www.instagram.com/reel/DY68Q9NMdHd/',
    },
    {
      id: '03',
      title: 'Federico Ciacci',
      quote: 'il labirinto',
      mediaKey: 'reel-03',
      href: 'https://www.instagram.com/reel/DX4ONpcM5Fv/',
    },
  ],
} as const;

export const WORK = {
  index: '05',
  label: ['WHAT', 'I DO'],
  title: 'SERVICES',
  description: 'Three core offerings for the art market and creative industries.',
  services: [
    {
      number: '01',
      title: ['ART MARKET', 'INTELLIGENCE'],
      description: 'Deep-dive artist evaluations and Phoenix Soulfire scorecards.',
      points: [
        'Artist valuation models',
        'Market positioning analysis',
        'Phoenix Soulfire scorecards',
        'Competitive landscape mapping',
      ],
    },
    {
      number: '02',
      title: ['POWER BI &', 'DATA SYSTEMS'],
      description: 'Custom dashboards that actually get used.',
      points: [
        'Interactive Power BI dashboards',
        'Automated data pipelines',
        'Real-time KPI monitoring',
        'Executive-ready reporting',
      ],
    },
    {
      number: '03',
      title: ['AI + HUMAN', 'EDGE'],
      description: 'Strategic consulting combining AI with human creative judgment.',
      points: [
        'AI readiness assessment',
        'Creative workflow optimization',
        'Human-AI collaboration design',
        'Future-proofing strategies',
      ],
    },
  ],
} as const;

export const LABS = {
  index: '04',
  label: ['THE', 'LABS'],
  description: 'Interactive tools and algorithms developed by BJ Beyond.',
  intro: ['EXPERIMENTAL', 'TECHNOLOGY.', 'REAL WORLD', 'APPLICATIONS.'],
  cta: 'VIEW ALL PROJECTS',
  projects: [
    {
      number: '01',
      title: ['PHOENIX', 'SIMULATOR'],
      description: 'Real-time AI simulation of X’s For You algorithm.',
      points: ['Audience persona modeling', 'Engagement prediction'],
      href: '/phoenix',
      action: 'LAUNCH SIMULATOR',
      mediaKey: 'phoenix',
    },
    {
      number: '02',
      title: ['FREQUENCY', 'STUDIO'],
      description: 'Binaural sound studio and brainwave generator.',
      points: ['Focus & meditation modes', 'Custom frequency generation'],
      href: '/frequency',
      action: 'OPEN STUDIO',
      mediaKey: 'frequency',
    },
  ],
} as const;

export const INTELLIGENCE = {
  index: '06',
  /* Not "Live Intelligence" as on the old site: the series below is
     illustrative, and the section says so in `disclaimer`. */
  label: 'INTELLIGENCE',
  title: ['ART MARKET', 'PULSE'],
  description: 'A glimpse into the data intelligence BJ Beyond delivers.',
  subtitle: 'Contemporary Art Market Index',
  period: 'Q3 2026',
  legend: 'Market Volume',
  disclaimer:
    'Illustrative dataset. Demonstrates output format, not live market data.',
  filters: [
    { id: 'all', label: 'ALL' },
    { id: 'paintings', label: 'PAINTINGS' },
    { id: 'digital', label: 'DIGITAL' },
    { id: 'sculpture', label: 'SCULPTURE' },
  ],
  series: {
    all: [
      { label: 'JAN', value: 65 },
      { label: 'FEB', value: 78 },
      { label: 'MAR', value: 72 },
      { label: 'APR', value: 89 },
      { label: 'MAY', value: 95 },
      { label: 'JUN', value: 88 },
      { label: 'JUL', value: 102 },
    ],
    paintings: [
      { label: 'JAN', value: 55 },
      { label: 'FEB', value: 62 },
      { label: 'MAR', value: 58 },
      { label: 'APR', value: 71 },
      { label: 'MAY', value: 78 },
      { label: 'JUN', value: 74 },
      { label: 'JUL', value: 82 },
    ],
    digital: [
      { label: 'JAN', value: 85 },
      { label: 'FEB', value: 92 },
      { label: 'MAR', value: 88 },
      { label: 'APR', value: 105 },
      { label: 'MAY', value: 118 },
      { label: 'JUN', value: 112 },
      { label: 'JUL', value: 125 },
    ],
    sculpture: [
      { label: 'JAN', value: 45 },
      { label: 'FEB', value: 52 },
      { label: 'MAR', value: 48 },
      { label: 'APR', value: 58 },
      { label: 'MAY', value: 62 },
      { label: 'JUN', value: 59 },
      { label: 'JUL', value: 68 },
    ],
  },
} as const;

export type IntelligenceFilterId = keyof typeof INTELLIGENCE.series;

/**
 * ART — the reading room.
 *
 * A page about art rather than about the practice: the certification platform,
 * the artists talking about their own work, and — when they are written —
 * pieces on artists worth knowing. It is the one part of the site that is not
 * selling a service, which is exactly why it is the part likely to be read.
 *
 * It has no index number. The 01–07 sequence belongs to the chapters of the
 * homepage narrative, and quietly renumbering seven sections to insert an
 * eighth would break every heading a visitor has already seen. Same reasoning
 * that keeps Authentia and In Motion outside the sequence.
 *
 * AUTHENTIA AND IN MOTION APPEAR HERE, and still appear on the homepage. They
 * are the same two blocks in both places on purpose: on the homepage they are a
 * beat in a narrative, here they are the subject. Moving them off the homepage
 * is a design decision about that narrative, not a consequence of building this
 * page, so it has not been made unasked.
 */
export const ART = {
  label: ['ON', 'ART'],
  title: ['ART', 'NOTES'],
  standfirst:
    'Writing on art, the people making it, and what makes a work verifiable.',
  /**
   * Written pieces. Empty, and rendered only when it is not — a blog announcing
   * that it has no posts yet is worse than a page that simply does not have
   * that section.
   *
   * The shape is deliberately minimal, because the right shape depends on what
   * an article turns out to be: a long essay and an illustrated artist profile
   * want different templates, and each article also wants a URL of its own
   * (`/art/<slug>/`) once there is one to give. Add the first real piece and
   * that template can be built around it rather than guessed at.
   */
  articles: [] as readonly {
    slug: string;
    title: string;
    standfirst: string;
    published: string;
  }[],
} as const;

/**
 * BOOKS — placeholders, and they must not be mistaken for anything else.
 *
 * The owner asked for three examples to see the page working before writing the
 * real entries. Everything below is invented: the titles, the years, the
 * descriptions. No book named here exists.
 *
 * That is a departure from this file's rule that nothing is invented, made on
 * an explicit request, and it comes with three guardrails that stay until real
 * titles replace these:
 *
 *  1. `disclaimer` is printed on the page, following the same convention
 *     INTELLIGENCE uses for its illustrative dataset.
 *  2. `/books/` carries `draft: true` in lib/routes.ts, so it is `noindex`,
 *     absent from the sitemap and absent from the menu. Invented books indexed
 *     under a real author's name is the specific harm being avoided.
 *  3. The covers are procedural plates rather than jacket photographs — see
 *     lib/media.ts.
 *
 * REPLACING THEM: overwrite `items`, delete `disclaimer`, and drop `draft` from
 * the route. All three, together — the guardrails are only correct while the
 * data is fake, and leaving one behind is as wrong as leaving none.
 */
export const BOOKS = {
  label: ['IN', 'PRINT'],
  title: ['THE', 'BOOKS'],
  standfirst: 'Long-form work on the art market, data, and the space between.',
  disclaimer:
    'Placeholder entries. These demonstrate the page, not the catalogue — no book listed here has been published.',
  /** `href` is null while there is nowhere real to send anyone. */
  items: [
    {
      number: '01',
      title: ['THE', 'HUMAN EDGE'],
      year: '2026',
      description:
        'Why taste, judgment and rigour became scarcer — and more valuable — the moment generation became free.',
      format: 'Essay — 240 pages',
      mediaKey: 'book-01',
      href: null,
    },
    {
      number: '02',
      title: ['READING THE', 'MARKET'],
      year: '2025',
      description:
        'A field guide to valuing contemporary work: what the auction record tells you, and the four things it never will.',
      format: 'Handbook — 180 pages',
      mediaKey: 'book-02',
      href: null,
    },
    {
      number: '03',
      title: ['PHOENIX', 'SOULFIRE'],
      year: '2025',
      description:
        'The five pillars in full: the framework for evaluating creative potential, with the scorecards and the workings.',
      format: 'Framework — 160 pages',
      mediaKey: 'book-03',
      href: null,
    },
  ],
} as const;

export const CONTACT = {
  index: '07',
  label: ['GET IN', 'TOUCH'],
  title: ['LET’S BUILD', 'INTELLIGENCE', 'TOGETHER'],
  standfirst: 'Ready to go one step beyond? Start a conversation.',
  description:
    'Whether you need art market intelligence, a custom data dashboard, or strategic AI guidance — let’s talk.',
  emails: [
    {
      address: 'Bj_beyond@tutamail.com',
      role: 'GENERAL & PROJECTS',
    },
    {
      address: 'nickcelt@nicholascelt.com',
      role: 'DIGITAL CREATOR OF PHOENIX SOULFIRE',
    },
  ],
} as const;

export const SOCIAL = [
  { label: 'X', href: 'https://x.com/Bj_Beyond' },
  { label: 'TIKTOK', href: 'https://www.tiktok.com/@bj_beyond' },
  { label: 'THREADS', href: 'https://www.threads.net/@bj_beyond' },
  { label: 'REDDIT', href: 'https://www.reddit.com/user/Bj_Beyond' },
  { label: 'BEACONS', href: 'https://beacons.ai/bj_beyond' },
] as const;

export const FOOTER = {
  statement: 'INTELLIGENCE IS THE STANDARD.',
  copyright: `© ${new Date().getFullYear()} BJ Beyond. Intelligence is the standard. We go further. ${SITE.locale}`,
  /** The originals stay served verbatim at /pages/*.html for old links. */
  legal: [
    { label: 'Privacy Policy', href: '/privacy-policy/' },
    { label: 'Cookie Policy', href: '/cookie-policy/' },
  ],
  credit: {
    prefix: 'Created by',
    name: 'Authentia Arte',
    href: 'https://authentia.it',
  },
} as const;
