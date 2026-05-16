// content.ts — MOCK CONTENT for the wireframes.
// ╔══════════════════════════════════════════════════════════════════╗
// ║  THIS IS PLACEHOLDER DATA. Replace these arrays with real values  ║
// ║  (from API / DB / config) when implementing.                      ║
// ║  All copy strings (headlines, labels, microcopy) live alongside   ║
// ║  the data so they're easy to grep / translate / edit.             ║
// ╚══════════════════════════════════════════════════════════════════╝

// ── program meta ───────────────────────────────────────────────────
export type Prizes = {
  first: string; // "$250"
  second: string; // "$150"
  third: string; // "$100"
  total: string; // "$500"
  currency: string; // "CRC"
};

export type Program = {
  name: string;
  domain: string;
  cycle: number;
  totalCycles: number;
  pool: string; // "$500"
  payoutDay: string;
  prizes: Prizes;
};

// ── live counters (landing hero) ───────────────────────────────────
export type Counter = {
  k: string;
  v: string;
  d: string;
};

// ── copy: landing ──────────────────────────────────────────────────
export type LandingStep = readonly [string, string, string];

export type BulletinItem = {
  text: string;
  href?: string;
  hrefLabel?: string; // optional separate label for the link portion
};

export type LandingCopy = {
  kicker: string;
  headline: readonly [string, string];
  sub: string;
  ctaPrimary: string;
  ctaSecondary: string;
  steps: readonly LandingStep[];
  manifesto: readonly string[];
  bulletin: readonly BulletinItem[];
};

// ── copy: schedule ─────────────────────────────────────────────────
export type ScheduleEntry = {
  d: string;
  body: string;
  href?: string;
  now?: boolean;
  pinned?: boolean; // for the grand finale, always visible
};

// ── judging criteria ───────────────────────────────────────────────
export type JudgingCriterion = {
  num: string;
  name: string;
  body: string;
};

// ── leaderboard rows ───────────────────────────────────────────────
export type LeaderboardRow = {
  rank: number;
  builder: string;
  org: string;
  app: string;
  pitch: string;
  mints: string;
  vol: string;
  payout: string;
  streak: string;
  star?: boolean;
  muted?: boolean;
};

// ── leaderboard secondary panels ───────────────────────────────────
export type MoverDirection = "up" | "down";

export type Mover = {
  builder: string;
  from: number;
  to: number;
  dir: MoverDirection;
};

// ── sign-up form ───────────────────────────────────────────────────
export type SignupField = {
  name: string;
  label: string;
  required?: boolean;
  placeholder: string;
  hint?: string;
  /** Renders as read-only with value pre-filled by the client. */
  locked?: boolean;
  /** When present, appends a `↳ <linkLabel> →` link after the hint. */
  createLink?: { href: string; label: string };
};

export type SignupSection = {
  num: string;
  label: string;
  hint: string;
  fields: readonly SignupField[];
};

export type SignupNotice = {
  head: string;
  body: string;
};

export type SignupForm = {
  sections: readonly SignupSection[];
  steps: readonly string[];
  submit: string;
  consent: string;
  consentHref: string;
  benefits: readonly string[];
  benefitsMuted: readonly string[];
  notice: SignupNotice;
};

// ── register mini-app draft ────────────────────────────────────────
// Placeholder values rendered as form input `placeholder` attributes when
// the user hasn't typed anything yet. Only the fields read by
// `RegisterClient` exist on this type — the rest of the wireframe's
// scaffolding (autosave clock, id, contract list, etc.) was retired.
export type DraftReadme = {
  what: string;
  why: string;
  try: string;
};

export type Draft = {
  name: string;
  pitch: string;
  slug: string;
  appStatus: string;
  liveLink: string;
  repo: string;
  readme: DraftReadme;
};

// ── root export ────────────────────────────────────────────────────
export type Content = {
  program: Program;
  counters: readonly Counter[];
  landing: LandingCopy;
  schedule: readonly ScheduleEntry[];
  judging: readonly JudgingCriterion[];
  leaderboard: readonly LeaderboardRow[];
  movers: readonly Mover[];
  signup: SignupForm;
  draft: Draft;
};

export const content: Content = {
  // ── program meta ────────────────────────────────────────────────
  // 6-week program. Cycles run Friday→Friday. Cycle 01 is a short
  // opener (Mon 18 May → Fri 22 May). Snapshot + prizes + builder Q&A
  // all happen Friday 23:59 CET.
  program: {
    name: "circles/garage",
    domain: "garage.aboutcircles.com",
    cycle: 1,
    totalCycles: 6,
    pool: "$500", // weekly prize pool, paid in CRC
    payoutDay: "Fri",
    prizes: {
      first: "$250",
      second: "$150",
      third: "$100",
      total: "$500",
      currency: "CRC",
    },
  },

  // ── live counters (landing hero) ───────────────────────────────
  counters: [
    { k: "builders signed", v: "0", d: "open call" },
    { k: "mini-apps submitted", v: "0", d: "register yours" },
    { k: "weekly prize pool", v: "$500", d: "top 3 · paid in CRC" },
    // .v overridden at render to cycleInfo.finaleLabel so it stays correct
    { k: "grand finale", v: "FRI 26 JUN", d: "cycle 06 wrap" },
  ],

  // ── copy: landing ──────────────────────────────────────────────
  landing: {
    kicker:
      "// circles/garage · 6-week builder program · friday-to-friday · paid in CRC",
    headline: ["Get paid to ship", "mini-apps on Circles."],
    sub: "Top 3 builders share $500 in CRC every week. 6 cycles, Friday-to-Friday. No pitch deck. Submit a working mini-app. Winners get paid the same Friday.",
    ctaPrimary: "sign up →",
    ctaSecondary: "submit a mini-app →",
    steps: [
      ["i.", "sign up", "github · contact · circles profile."],
      [
        "ii.",
        "submit a mini-app",
        "contracts · live link · readme.",
      ],
      [
        "iii.",
        "get judged. get paid.",
        "we check submissions every friday at 23:59 CET. top 3 paid the same day in CRC.",
      ],
    ],
    manifesto: [
      "Circles is money issued by people, not banks. Mini-apps are how it stops being a thesis and becomes a daily habit.",
      "circles/garage pays the builders making that habit real — judged on what shipped, not on the pitch.",
      "We weigh five things: how deeply you use Circles primitives, whether a non-crypto person would open it twice, the UX, weekly referrals (invites that landed a new wallet inside the app), and weekly activity inside the Circles app.",
      "Once you've placed top-3, you file a 200-word progress note each cycle: what shipped, links, what's next. We keep paying the apps that keep moving.",
      "6 weeks. 6 cycles. $500 every week, shared by the top 3 builders, paid in CRC on Friday. Grand finale Fri 26 Jun.",
      "~ build in public, get paid every Friday.",
    ],
    bulletin: [
      {
        text: "builder telegram",
        hrefLabel: "join the group",
        href: "https://t.me/about_circles/499",
      },
      {
        text: "office hours · schedule TBD",
        href: "", // TODO: link to calendar or event
      },
      {
        text: "stuck? reach the team",
        hrefLabel: "→ telegram",
        href: "https://t.me/about_circles/499",
      },
    ],
  },

  // ── copy: schedule ─────────────────────────────────────────────
  // Launch week's events + the pinned grand finale. The "now" flag is
  // driven from the current date by the consumer, not hard-coded here.
  schedule: [
    {
      d: "MON 18",
      body: "garage opens · launch",
      href: "", // TODO: event link
    },
    {
      d: "TUE 19",
      body: "workshop · time TBD",
      href: "", // TODO: event link + confirmed time
    },
    {
      d: "FRI 22",
      body: "cycle 01 snapshot · builder q&a · first prizes",
      href: "", // TODO: event link
    },
    {
      d: "FRI 26 JUN",
      body: "grand finale · cycle 06 wrap",
      href: "", // TODO: event link
      pinned: true,
    },
  ],

  // ── judging criteria ───────────────────────────────────────────
  // Holistic, not auto-measured. Shown on /register and /rules so
  // builders know what we're looking at when we judge.
  judging: [
    {
      num: "01",
      name: "Circles integration quality",
      body: "Does the app use Circles primitives, or is CRC bolted on?",
    },
    {
      num: "02",
      name: "Usefulness",
      body: "Would a non-crypto person open this twice? Would we personally use it, and why or why not?",
    },
    {
      num: "03",
      name: "UX",
      body: "Does it feel built, or built-for-a-grant?",
    },
    {
      num: "04",
      name: "Referrals",
      body: "Invite links from the app that landed a new wallet connecting inside the app within the same cycle. Not counted in cycle 01 — definition locks at the cycle 01 snapshot.",
    },
    {
      num: "05",
      name: "Activity",
      body: "Weekly unique wallets that opened the mini-app inside the Circles app (and time spent), where analytics exist. Mixpanel CSV every Friday from the Circles team.",
    },
    {
      num: "06",
      name: "Shipped — repeat winners only",
      body: "From the cycle after your first top-3 placement, you file a 200-word progress note each cycle: what shipped, links, what's next.",
    },
  ],

  // ── leaderboard rows ───────────────────────────────────────────
  // cycle 01 has just opened — no entries yet.
  leaderboard: [],

  // ── leaderboard secondary panels ───────────────────────────────
  movers: [],

  // ── sign-up form ───────────────────────────────────────────────
  signup: {
    sections: [
      {
        num: "01",
        label: "you",
        hint: "who you are + how to reach you + where to pay",
        fields: [
          {
            name: "handle",
            label: "github handle",
            required: true,
            placeholder: "(from github)",
            locked: true,
            hint: "from your github · not editable",
          },
          {
            name: "reach",
            label: "telegram or email",
            required: true,
            placeholder: "@handle or you@domain.com",
            hint: "where we ping you about prizes & updates",
          },
          {
            name: "circles_addr",
            label: "circles profile address",
            required: true,
            placeholder: "0x____________________________________",
            hint: "this is where prizes get paid · paste the wallet address or your profile url",
            createLink: {
              href: "https://app.gnosis.io/welcome",
              label: "don't have a circles profile? get one",
            },
          },
          {
            name: "org_addr",
            label: "circles org address",
            placeholder: "0x____________________________________",
            hint: "optional · on-chain address for your team / treasury",
          },
          {
            name: "team",
            label: "team members",
            placeholder: "0x…, 0x…, 0x…",
            hint: "optional · comma-separated circles addresses",
          },
        ],
      },
    ],
    steps: ["you", "review"],
    submit: "create →",
    consent:
      "I read the rules. The weekly snapshot is final. My handle & app can show on the public leaderboard.",
    consentHref: "/rules",
    benefits: [
      "builder page on the public leaderboard",
      "weekly CRC prizes for top 3: $250 / $150 / $100",
      "invite to the builder TG & weekly workshop",
    ],
    benefitsMuted: ["co-marketing when top-3"],
    notice: {
      head: "no fee",
      body: "just bring a circles profile address. we pay in CRC.",
    },
  },

  // ── register mini-app draft ────────────────────────────────────
  // Used solely as `placeholder` strings in the /register form.
  draft: {
    name: "pocket-mint",
    pitch: "tap-to-mint NFC stickers, redeemable for CRC drinks",
    slug: "pocket-mint",
    appStatus: "live · v0.4",
    liveLink: "pocketmint.xyz",
    repo: "github.com/manyfold/pocket-mint",
    readme: {
      what: "tap-to-mint NFC stickers stuck to coasters / lamp posts / a friend's jacket.",
      why: "onboarding is one tap. zero install. zero seed phrases.",
      try: "walk in, find a coaster. tap.",
    },
  },
};
