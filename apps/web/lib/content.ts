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
  /** Trailing links rendered after `text`, each " · "-separated. Used for
   *  rows that need more than one link (e.g. a workshop's recording + slides). */
  links?: readonly { label: string; href: string }[];
};

export type LandingAgent = {
  prompt: string;
};

export type LandingCopy = {
  kicker: string;
  headline: readonly [string, string];
  sub: string;
  ctaPrimary: string;
  ctaSecondary: string;
  agent: LandingAgent;
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
  project: string;
  url: string;
  score: number;
};

// ── per-cycle leaderboard results ──────────────────────────────────
// One snapshot per cycle. `rows` are pre-ranked by descending score
// (ties keep their listed order). The "all time" leaderboard is derived
// by summing each project's score across every cycle — see
// `lib/leaderboard.ts`. Projects are matched across cycles by their URL,
// so a project that places in multiple cycles accumulates its scores.
export type CycleResult = {
  cycle: number;
  rows: readonly LeaderboardRow[];
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
  termsHref: string;
  benefits: readonly string[];
  benefitsMuted: readonly string[];
  notice: SignupNotice;
};

// ── register mini-app draft ────────────────────────────────────────
// Placeholder values rendered as form input `placeholder` attributes when
// the user hasn't typed anything yet. Only the fields read by
// `RegisterClient` exist on this type — the rest of the wireframe's
// scaffolding (autosave clock, id, contract list, etc.) was retired.
export type Draft = {
  name: string;
  pitch: string;
  slug: string;
  appStatus: string;
  liveLink: string;
  repo: string;
  notes: string;
};

// ── root export ────────────────────────────────────────────────────
export type Content = {
  program: Program;
  counters: readonly Counter[];
  landing: LandingCopy;
  schedule: readonly ScheduleEntry[];
  judging: readonly JudgingCriterion[];
  cycles: readonly CycleResult[];
  movers: readonly Mover[];
  signup: SignupForm;
  draft: Draft;
};

export const content: Content = {
  // ── program meta ────────────────────────────────────────────────
  // 6-week program. Cycles run Monday→Sunday (Mon 18 May → Sun 24 May
  // for cycle 01). The snapshot/submission deadline is Sunday 23:59 CET;
  // winners are judged and prizes paid the next day (Monday). Builder
  // Q&A is Fri 22 May.
  program: {
    name: "circles/garage",
    domain: "garage.aboutcircles.com",
    cycle: 1,
    totalCycles: 6,
    pool: "$500", // weekly prize pool, paid in CRC
    payoutDay: "Mon",
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
    { k: "grand finale", v: "MON 29 JUN", d: "cycle 06 wrap" },
  ],

  // ── copy: landing ──────────────────────────────────────────────
  landing: {
    kicker:
      "// circles/garage · 6-week builder program · monday-to-sunday · paid in CRC",
    headline: ["Get paid to ship", "mini-apps on Circles."],
    sub: "Top 3 builders share $500 in CRC every week. 6 cycles, Monday-to-Sunday. No pitch deck. Submit a working mini-app.",
    ctaPrimary: "sign up →",
    ctaSecondary: "submit a mini-app →",
    agent: {
      prompt:
        "Read https://garage.aboutcircles.com/SKILL.md and help me ship a circles mini-app",
    },
    steps: [
      ["i.", "sign up", "github · contact · circles profile."],
      [
        "ii.",
        "submit a mini-app",
        "pitch · live link · ship it.",
      ],
      [
        "iii.",
        "get judged. get paid.",
        "we check submissions every sunday at 23:59 CET. top 3 announced and paid in CRC the next day.",
      ],
    ],
    manifesto: [
      "Circles is money issued by people, not banks. Mini-apps are how it stops being a thesis and becomes a daily habit.",
      "circles/garage pays the builders making that habit real — judged on what shipped, not on the pitch.",
      "We weigh five things: how deeply you use Circles primitives, whether a non-crypto person would open it twice, the UX, weekly referrals (invites that landed a new wallet inside the app), and weekly activity inside the Circles app.",
      "Once you've placed top-3, you file a 200-word progress note each cycle: what shipped, links, what's next. We keep paying the apps that keep moving.",
      "6 weeks. 6 cycles. $500 every week, shared by the top 3 builders, paid in CRC every Monday. Grand finale Mon 29 Jun.",
      "~ build in public, get paid every Monday.",
    ],
    bulletin: [
      {
        text: "workshop 01 · kickoff",
        links: [
          {
            label: "watch recording",
            href: "https://vimeo.com/1193867453?share=copy&fl=sv&fe=ci",
          },
          { label: "slides (pdf)", href: "/circles-kickoff-workshop-may19.pdf" },
        ],
      },
      {
        text: "workshop 02 · invitation & referrals",
        links: [
          {
            label: "watch recording",
            href: "https://vimeo.com/1197962587?share=copy&fl=sv&fe=ci",
          },
          { label: "slides (pdf)", href: "/2026-06-02-referral-signup.pdf" },
        ],
      },
      {
        text: "workshop 03 · office hours",
        links: [
          { label: "slides (pdf)", href: "/2026-06-12-office-hours.pdf" },
        ],
      },
      {
        text: "build with AI · skill.md",
        hrefLabel: "skill.md",
        href: "https://garage.aboutcircles.com/SKILL.md",
      },
      {
        text: "circles mini-app docs",
        hrefLabel: "docs.aboutcircles.com/miniapps",
        href: "https://docs.aboutcircles.com/miniapps",
      },
      {
        text: "builder telegram",
        hrefLabel: "join the group",
        href: "https://t.me/about_circles/499",
      },
      {
        text: "office hours · every friday · rsvp on luma",
        hrefLabel: "rsvp on luma",
        href: "https://luma.com/mnc6heva",
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
      d: "MON 1",
      body: "cycle 03 opens",
      href: "",
    },
    {
      d: "TUE 2",
      body: "workshop · 18:00 CET",
      href: "https://luma.com/1p0zmid1",
    },
    {
      d: "FRI 5",
      body: "office hours",
      href: "https://luma.com/mnc6heva",
    },
    {
      d: "SUN 7",
      body: "cycle 03 snapshot · prizes mon",
      href: "", // TODO: event link
    },
    {
      d: "MON 29 JUN",
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
      body: "Weekly unique wallets that opened the mini-app inside the Circles app (and time spent), where analytics exist. Mixpanel CSV every Sunday from the Circles team.",
    },
    {
      num: "06",
      name: "Shipped — repeat winners only",
      body: "From the cycle after your first top-3 placement, you file a 200-word progress note each cycle: what shipped, links, what's next.",
    },
  ],

  // ── leaderboard rows · per cycle ────────────────────────────────
  // Each entry is one weekly snapshot. The "this week" view shows the
  // latest cycle here; the "all time" view sums scores across all cycles
  // (matched by project URL). Add a new `{ cycle, rows }` block each week.
  cycles: [
    {
      cycle: 1,
      rows: [
        { rank: 1, project: "CRC Boosts", url: "https://crc-boost-market.vercel.app", score: 100 },
        { rank: 2, project: "THP for Good", url: "https://thp.gnosis.box", score: 90 },
        { rank: 3, project: "Circles Markets", url: "https://circles-markets.netlify.app/", score: 80 },
        { rank: 4, project: "Circles Chat", url: "https://app.circles-chat.org", score: 60 },
        { rank: 5, project: "Mutual Aid Map", url: "https://mutual-aid-map.vercel.app", score: 60 },
        { rank: 6, project: "Card Circles", url: "https://cards-maxnormal.vercel.app/", score: 60 },
        { rank: 7, project: "SplitCircles", url: "https://splitcircles.vercel.app/", score: 50 },
        { rank: 8, project: "All Together", url: "https://all-together-gamma.vercel.app", score: 50 },
        { rank: 9, project: "Hunch", url: "https://hunch-teleshops-projects.vercel.app", score: 50 },
        { rank: 10, project: "Yield", url: "https://yield-gnosis-mini-app.vercel.app/", score: 50 },
        { rank: 11, project: "Nft Viewer", url: "https://nft-viewer-ten.vercel.app/", score: 50 },
        { rank: 12, project: "ChessBuddy", url: "https://chessbuddy-ivory.vercel.app", score: 50 },
        { rank: 13, project: "Circles Splitter", url: "https://crc-split.vercel.app/", score: 50 },
        { rank: 14, project: "money-library", url: "https://github.com/Means-Of-Production/money-library", score: 20 },
        { rank: 15, project: "Balaio", url: "https://www.usebalaio.com/", score: 20 },
        { rank: 16, project: "DreamCircle Agents", url: "https://dreamnet.ink/dreamcircle-agents", score: 20 },
        { rank: 17, project: "HistoryGuessr", url: "https://history-guessr.vercel.app/", score: 20 },
        { rank: 18, project: "organic", url: "https://organic-network.vercel.app/", score: 20 },
        { rank: 19, project: "Vendyz", url: "https://vendyz.vercel.app/", score: 20 },
        { rank: 20, project: "chai", url: "https://app.chai.sh/", score: 20 },
        { rank: 21, project: "Neynart", url: "https://farcaster.xyz/miniapps/A2SFoJHW7Y9B/neynart", score: 20 },
      ],
    },
    {
      cycle: 2,
      rows: [
        { rank: 1, project: "Yield", url: "https://yield-gnosis-mini-app.vercel.app/", score: 100 },
        { rank: 2, project: "The Kitty", url: "https://thekitty.gnosis.box", score: 90 },
        { rank: 3, project: "HatchLife", url: "https://hatchlife.vercel.app/", score: 80 },
        { rank: 4, project: "Shorts", url: "https://circles-shorts.pages.dev/", score: 60 },
        { rank: 5, project: "Trust Cleaner", url: "https://trust-cleaner.vercel.app", score: 60 },
        { rank: 6, project: "hootpot", url: "https://hootpot.vercel.app", score: 60 },
        { rank: 7, project: "Word Circles", url: "https://word-circles.vercel.app/", score: 60 },
        { rank: 8, project: "Dollar Auction", url: "https://koeppelmann.github.io/CirclesTools/dollarAuction/miniapp.html", score: 60 },
        { rank: 9, project: "BLESS", url: "https://bless-crc.vercel.app/", score: 50 },
        { rank: 10, project: "Circles 4 UBI", url: "https://circles4ubi-distribution.replit.app/", score: 50 },
        { rank: 11, project: "echo", url: "https://1echo.netlify.app", score: 20 },
        { rank: 12, project: "HistoryGuessr", url: "https://history-guessr.vercel.app/", score: 20 },
        { rank: 13, project: "circles-chat", url: "https://app.circles-chat.org/?p1a", score: 20 },
        { rank: 14, project: "Snake Xenzia", url: "https://snake-xenzia-nh32.vercel.app", score: 20 },
        { rank: 15, project: "Hunch", url: "https://hunch-teleshops-projects.vercel.app", score: 20 },
        { rank: 16, project: "SplitCircles", url: "https://splitcircles.vercel.app/", score: 20 },
      ],
    },
    {
      cycle: 3,
      rows: [
        { rank: 1, project: "Circles Commons", url: "https://circles-commons.vercel.app", score: 100 },
        { rank: 2, project: "Word Circles", url: "https://word-circles.vercel.app/", score: 90 },
        { rank: 3, project: "FuseCoop", url: "https://fuse-coop.vercel.app/", score: 80 },
        { rank: 4, project: "Coopera", url: "https://coopera-crc.vercel.app", score: 60 },
        { rank: 5, project: "Circles 4 UBI", url: "https://circles4ubi-distribution.replit.app/", score: 50 },
        { rank: 6, project: "The Kitty", url: "https://thekitty.gnosis.box", score: 50 },
        { rank: 7, project: "Circlo", url: "https://circlo-iota.vercel.app", score: 20 },
        { rank: 8, project: "TrustBook", url: "https://trust-book-tau.vercel.app/", score: 20 },
        { rank: 9, project: "Six Degrees of Circles", url: "https://six-degrees-pkg.vercel.app/", score: 20 },
      ],
    },
  ],

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
    termsHref: "/terms",
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
    notes:
      "open the link, connect a Gnosis wallet with any CRC balance, tap 'mint' on the home page. mobile only — demo video: https://twitter.com/manyfold/status/...",
  },
};
