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
} as const;

/** Order mirrors scroll order, so the active item never jumps backwards. */
export const NAV = [
  { label: 'METHOD', href: '#method' },
  { label: 'LABS', href: '#labs' },
  { label: 'WORK', href: '#work' },
  { label: 'INTELLIGENCE', href: '#intelligence' },
  { label: 'CONTACT', href: '#contact' },
] as const;

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

export const METHOD = {
  index: '02',
  label: ['MY', 'METHOD'],
  title: 'PHOENIX SOULFIRE',
  trademark: '™',
  description:
    'The five-pillar methodology for evaluating creative potential in the AI era.',
  cta: 'DISCOVER THE FRAMEWORK',
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

export const WORK = {
  index: '04',
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
  index: '03',
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
  index: '05',
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

export const CONTACT = {
  index: '06',
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
  { label: 'LINKTREE', href: 'https://linktr.ee/Bj_Beyond' },
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
