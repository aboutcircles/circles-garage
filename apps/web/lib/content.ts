// content.ts — MOCK CONTENT for the wireframes.
// ╔══════════════════════════════════════════════════════════════════╗
// ║  THIS IS PLACEHOLDER DATA. Replace these arrays with real values  ║
// ║  (from API / DB / config) when implementing.                      ║
// ║  All copy strings (headlines, labels, microcopy) live alongside   ║
// ║  the data so they're easy to grep / translate / edit.             ║
// ╚══════════════════════════════════════════════════════════════════╝

// ── program meta ───────────────────────────────────────────────────
export type PoolSplit = {
  winners: number;
  life: number;
  denom: number;
  winnersAmt: string;
  lifeAmt: string;
};

export type Program = {
  name: string;
  domain: string;
  cycle: number;
  pool: string;
  payoutDay: string;
  snapshotIn: string;
  lastUpdated: string;
  nowCET: string;
  poolSplit: PoolSplit;
};

// ── live counters (landing hero) ───────────────────────────────────
export type Counter = {
  k: string;
  v: string;
  d: string;
};

// ── copy: landing ──────────────────────────────────────────────────
export type LandingStep = readonly [string, string, string];

export type LandingCopy = {
  kicker: string;
  headline: readonly [string, string];
  sub: string;
  ctaPrimary: string;
  ctaSecondary: string;
  steps: readonly LandingStep[];
  manifesto: readonly string[];
  bulletin: readonly string[];
};

// ── copy: schedule ─────────────────────────────────────────────────
export type ScheduleEntry = {
  d: string;
  body: string;
  now?: boolean;
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
export type CircleOfLife = {
  builder: string;
  weeks: number;
  bonus: string;
};

export type MoverDirection = "up" | "down";

export type Mover = {
  builder: string;
  from: number;
  to: number;
  dir: MoverDirection;
};

// ── logged-in user (dashboard / register screens) ──────────────────
export type AppStatus = "LIVE" | "DRAFT";

export type App = {
  name: string;
  status: AppStatus;
  wau: string;
  vol: string;
  streak: string;
  line: string;
  chart: readonly number[];
  muted?: boolean;
};

export type Activity = {
  t: string;
  body: string;
};

export type Todo = {
  done: boolean;
  body: string;
  hint?: string;
};

export type Me = {
  handle: string;
  address: string;
  org: string;
  rank: number;
  rankPrev: number;
  newMinters7d: string;
  projectedPayout: string;
  streakBonus: string;
  coLifeWeeks: number;
  apps: readonly App[];
  activity: readonly Activity[];
  todos: readonly Todo[];
};

// ── sign-up form ───────────────────────────────────────────────────
export type SignupField = {
  label: string;
  required?: boolean;
  placeholder: string;
  hint?: string;
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
  consent: string;
  benefits: readonly string[];
  benefitsMuted: readonly string[];
  notice: SignupNotice;
};

// ── register mini-app draft ────────────────────────────────────────
export type Contract = {
  chain: string;
  addr: string;
  label: string;
  verified: boolean;
};

export type DraftReadme = {
  what: string;
  why: string;
  try: string;
};

export type Measure = {
  on: boolean;
  label: string;
  hint?: string;
};

export type DraftCheck = {
  ok: boolean;
  label: string;
};

export type Draft = {
  id: string;
  autosaved: string;
  status: string;
  name: string;
  pitch: string;
  slug: string;
  track: string;
  appStatus: string;
  liveLink: string;
  repo: string;
  contracts: readonly Contract[];
  readme: DraftReadme;
  measures: readonly Measure[];
  checks: readonly DraftCheck[];
  steps: readonly string[];
  currentStep: number;
};

// ── root export ────────────────────────────────────────────────────
export type Content = {
  program: Program;
  counters: readonly Counter[];
  landing: LandingCopy;
  schedule: readonly ScheduleEntry[];
  leaderboard: readonly LeaderboardRow[];
  circleOfLife: readonly CircleOfLife[];
  movers: readonly Mover[];
  me: Me;
  signup: SignupForm;
  draft: Draft;
};

export const content: Content = {
  // ── program meta ────────────────────────────────────────────────
  program: {
    name: "circles/garage",
    domain: "builder.circles.garage",
    cycle: 12,
    pool: "€487.20", // weekly pool, in xDAI
    payoutDay: "Mon",
    snapshotIn: "2d 14h 11m", // countdown to next snapshot
    lastUpdated: "17 min ago",
    nowCET: "17:42 CET",
    // payout split (numerators sum to denominator)
    poolSplit: {
      winners: 2,
      life: 1,
      denom: 3,
      winnersAmt: "€332.80",
      lifeAmt: "€166.40",
    },
  },

  // ── live counters (landing hero) ───────────────────────────────
  counters: [
    { k: "builders signed", v: "142", d: "+38 / wk" },
    { k: "mini-apps live", v: "63", d: "of 89 submitted" },
    { k: "new minters · 7d", v: "2,914", d: "↑ 3.1× wk-on-wk" },
    { k: "weekly pool", v: "€487", d: "paid every mon" },
  ],

  // ── copy: landing ──────────────────────────────────────────────
  landing: {
    kicker: "// builder program · open call · cycle 12 of 12",
    headline: ["Get paid to ship", "mini-apps on Circles."],
    sub: "~€500 weekly pool, paid every Monday. ⅔ to the apps moving WAU. ⅓ to the apps that keep showing up. No decks, no rounds, no gatekeepers.",
    ctaPrimary: "start submission →",
    ctaSecondary: "read rules.md",
    steps: [
      ["i.", "sign up", "handle · org · contact. 3 fields, no kyc."],
      [
        "ii.",
        "register a mini-app",
        "contracts · repo · live link. we wire up the meter.",
      ],
      [
        "iii.",
        "get measured. get paid.",
        "every monday. ⅔ to top movers, ⅓ to apps still moving.",
      ],
    ],
    manifesto: [
      "Circles is a protocol for stable, social money. Mini-apps are how that becomes a daily habit instead of a thesis.",
      "We pay the people building the habit-forming surfaces — not the ones with the best pitch.",
      "The metric is whatever moves weekly active users on chain. We publish the formula. You optimise for it. We pay the winners.",
      "~ writing in public, paid in private.",
    ],
    bulletin: [
      "cycle 12 pool funded.",
      "new metric available: re-activations.",
      "wed call topic: how the meter works.",
    ],
  },

  // ── copy: schedule ─────────────────────────────────────────────
  schedule: [
    { d: "MON 12", body: "snapshot · prizes paid" },
    { d: "WED 14", body: "builder call · 18:00 CET", now: true },
    { d: "FRI 16", body: "last day to register" },
    { d: "MON 19", body: "next snapshot" },
  ],

  // ── leaderboard rows ───────────────────────────────────────────
  // numbers are mocks; structure is what the API should return.
  leaderboard: [
    {
      rank: 1,
      builder: "splits.eth",
      org: "pocket-collective",
      app: "dropparty",
      pitch: "split a tab, mint to non-holders",
      mints: "+412",
      vol: "€11.0k",
      payout: "€124.30",
      streak: "6w",
      star: true,
    },
    {
      rank: 2,
      builder: "manyfold",
      org: "manyfold-labs",
      app: "pocket-mint",
      pitch: "NFC tap-to-mint stickers",
      mints: "+298",
      vol: "€2.1k",
      payout: "€89.40",
      streak: "3w",
    },
    {
      rank: 3,
      builder: "haylee.crc",
      org: "café-tab",
      app: "café-tab",
      pitch: "café tabs paid in CRC",
      mints: "+187",
      vol: "€840",
      payout: "€56.10",
      streak: "11w",
      star: true,
    },
    {
      rank: 4,
      builder: "ofgr.eth",
      org: "ofgr-ofgr",
      app: "re/circle",
      pitch: "weekly recap of your circle",
      mints: "+142",
      vol: "€420",
      payout: "€42.60",
      streak: "1w",
    },
    {
      rank: 5,
      builder: "0xcap.eth",
      org: "bzzar-collective",
      app: "bzzar",
      pitch: "p2p marketplace for IRL stuff",
      mints: "+97",
      vol: "€1.2k",
      payout: "€29.10",
      streak: "—",
    },
    {
      rank: 6,
      builder: "minae",
      org: "sourdough",
      app: "crumb",
      pitch: "group orders for local bakeries",
      mints: "+74",
      vol: "€620",
      payout: "€22.20",
      streak: "4w",
    },
    {
      rank: 7,
      builder: "rxiv",
      org: "rxiv-rxiv",
      app: "tonight",
      pitch: "pop-up event tickets",
      mints: "+58",
      vol: "€310",
      payout: "€17.40",
      streak: "2w",
    },
    {
      rank: 8,
      builder: "noxe",
      org: "noxe-eth",
      app: "splitsie",
      pitch: "flatmate bill splits",
      mints: "+47",
      vol: "€150",
      payout: "€14.10",
      streak: "7w",
      star: true,
    },
    {
      rank: 9,
      builder: "p.sundae",
      org: "sundae-coop",
      app: "cone",
      pitch: "ice cream stamp card",
      mints: "+31",
      vol: "€90",
      payout: "€9.30",
      streak: "—",
      muted: true,
    },
    {
      rank: 10,
      builder: "kab.eth",
      org: "kab-studio",
      app: "thread",
      pitch: "invite-only msg threads",
      mints: "+24",
      vol: "€60",
      payout: "€7.20",
      streak: "1w",
    },
    {
      rank: 11,
      builder: "oyl",
      org: "oyl-house",
      app: "tab",
      pitch: "rolling open tab w/ friends",
      mints: "+18",
      vol: "€40",
      payout: "€5.40",
      streak: "—",
      muted: true,
    },
    {
      rank: 12,
      builder: "wenmoon.crc",
      org: "wenmoon",
      app: "whenwen",
      pitch: "when2meet but on-chain",
      mints: "+12",
      vol: "€20",
      payout: "€3.60",
      streak: "—",
      muted: true,
    },
  ],

  // ── leaderboard secondary panels ───────────────────────────────
  circleOfLife: [
    { builder: "haylee.crc", weeks: 11, bonus: "€56.10" },
    { builder: "noxe", weeks: 7, bonus: "€21.20" },
    { builder: "splits.eth", weeks: 6, bonus: "€18.40" },
  ],
  movers: [
    { builder: "splits.eth", from: 7, to: 1, dir: "up" },
    { builder: "minae", from: 14, to: 6, dir: "up" },
    { builder: "0xcap", from: 2, to: 5, dir: "down" },
  ],

  // ── logged-in user (dashboard / register screens) ──────────────
  me: {
    handle: "splits.eth",
    address: "0x4a82…f12",
    org: "pocket-collective",
    rank: 3,
    rankPrev: 7,
    newMinters7d: "+412",
    projectedPayout: "€124.30",
    streakBonus: "€18.40",
    coLifeWeeks: 6,
    apps: [
      {
        name: "dropparty",
        status: "LIVE",
        wau: "+286",
        vol: "€11k",
        streak: "6w",
        line: "splits a tab between everyone at a party, mints to non-holders",
        chart: [3, 4, 6, 9, 12, 11, 14, 18, 21, 28],
      },
      {
        name: "pocket-mint",
        status: "LIVE",
        wau: "+126",
        vol: "€2.1k",
        streak: "2w",
        line: "tap-to-mint NFC stickers, redeemable for CRC drinks",
        chart: [1, 2, 2, 3, 4, 6, 5, 8, 10, 12],
      },
      {
        name: "re/circle",
        status: "DRAFT",
        wau: "—",
        vol: "—",
        streak: "—",
        line: "weekly recap of who in your circle minted what",
        chart: [],
        muted: true,
      },
    ],
    activity: [
      { t: "17:24", body: "dropparty · 18 new minters since midnight" },
      { t: "09:11", body: "payout for cycle 11 sent · 0xa3…1f → €87.10" },
      { t: "1d ago", body: "judges left a note on re/circle ↗" },
      { t: "3d ago", body: "cycle 12 starts" },
    ],
    todos: [
      { done: true, body: "verify circles org sig" },
      { done: false, body: "add screenshots to pocket-mint" },
      { done: false, body: "finalise re/circle before fri", hint: "due fri" },
    ],
  },

  // ── sign-up form (labels live with the form, not the data) ─────
  signup: {
    sections: [
      {
        num: "01",
        label: "you",
        hint: "3 fields, all required",
        fields: [
          { label: "handle", required: true, placeholder: "splits.eth" },
          {
            label: "reach",
            required: true,
            placeholder: "telegram / farcaster / email",
          },
          {
            label: "circles addr (v2)",
            required: true,
            placeholder: "0x____________________________________",
            hint: "we use this to pay you & verify org ownership",
          },
        ],
      },
      {
        num: "02",
        label: "your circle",
        hint: "org you submit under",
        fields: [
          {
            label: "circles org address",
            required: true,
            placeholder: "0x____________________________________",
          },
          {
            label: "team members",
            placeholder: "0x…, 0x…, 0x…",
            hint: "comma-separated CRC addresses",
          },
        ],
      },
      {
        num: "03",
        label: "the app · light touch",
        hint: "you can add the rest later",
        fields: [
          { label: "working name", required: true, placeholder: "pocket-mint" },
          {
            label: "track",
            placeholder: "payments | social | games | tools | other",
          },
          {
            label: "one-line pitch",
            placeholder: "what does it do in one breath",
          },
        ],
      },
    ],
    consent:
      "I read the rules. The weekly snapshot is final. My handle & numbers can show on the public leaderboard.",
    benefits: [
      "builder page on the public leaderboard",
      "auto-pulled WAU + tx volume",
      "eligibility for ~€500/wk in xDAI",
      "invite to the builder TG & wed call",
    ],
    benefitsMuted: ["co-marketing when top-3"],
    notice: {
      head: "no kyc · no fee",
      body: "just keep your circles org sig & we're good.",
    },
  },

  // ── register mini-app draft ────────────────────────────────────
  draft: {
    id: "#df-219",
    autosaved: "14:02:11",
    status: "not yet eligible",
    name: "pocket-mint",
    pitch: "tap-to-mint NFC stickers, redeemable for CRC drinks",
    slug: "pocket-mint",
    track: "payments",
    appStatus: "live · v0.4",
    liveLink: "pocketmint.xyz",
    repo: "github.com/manyfold/pocket-mint",
    contracts: [
      { chain: "gno", addr: "0x4a82…9f12", label: "hub", verified: true },
      {
        chain: "gno",
        addr: "0x9911…c0e0",
        label: "redemption",
        verified: true,
      },
    ],
    readme: {
      what: "tap-to-mint NFC stickers stuck to coasters / lamp posts / a friend's jacket.",
      why: "onboarding is one tap. zero install. zero seed phrases.",
      try: "walk in, find a coaster. tap.",
    },
    measures: [
      { on: true, label: "new minters · last 7d", hint: "default" },
      { on: true, label: "re-activations via your invite link" },
      { on: false, label: "tx count" },
      { on: false, label: "CRC volume routed through your contracts" },
      { on: false, label: "custom event (paste an event signature)" },
    ],
    checks: [
      { ok: true, label: "contracts respond to read calls" },
      { ok: true, label: "live link returns 200" },
      { ok: false, label: "screenshots · ≥ 2 added" },
      { ok: true, label: "readme · ≥ 3 sentences" },
      { ok: false, label: "circles org sig matches submitter" },
    ],
    steps: ["identity", "contracts", "proof", "measure", "review"],
    currentStep: 2, // 0-indexed, "proof" is current
  },
};
