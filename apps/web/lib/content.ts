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
// v0 shape — kept for the legacy signup-client.tsx which is being
// rewritten in a follow-up phase. Do not extend; use SignupForm.
export type SignupField = {
  name: string;
  label: string;
  required?: boolean;
  placeholder: string;
  hint?: string;
};

export type SignupSectionV0 = {
  num: string;
  label: string;
  hint: string;
  fields: readonly SignupField[];
};

/** @deprecated retained only for the legacy signup-client.tsx during the rewrite. */
export type SignupFormV0 = {
  sections: readonly SignupSectionV0[];
  steps: readonly string[];
  submit: string;
  consent: string;
  benefits: readonly string[];
  benefitsMuted: readonly string[];
  notice: SignupNotice;
};

// v1 shape — connect → you → review.
// The form fields on step 02 are bespoke (segmented control, group
// picker) so they are no longer enumerated here — the client renders
// them directly. Copy lives below.
export type SignupSection = {
  num: string;
  label: string;
  hint: string;
};

export type SignupNotice = {
  head: string;
  body: string;
};

export type SignupHeroCopy = {
  title: string;
  sub: string;
};

export type SignupConnectCopy = {
  headline: string;
  sub: string;
  primary: string;
  secondary: string;
  noWallet: string;
  gnosisAppUrl: string;
  wrongChain: string;
  notHuman: {
    group: string;
    organization: string;
  };
  noAvatar: string;
};

export type SignupReachChannel = "tg" | "fc" | "email";

export type SignupReachOption = {
  value: SignupReachChannel;
  label: string;
  placeholder: string;
};

export type SignupReachCopy = {
  label: string;
  hint: string;
  channels: readonly SignupReachOption[];
};

export type SignupFieldCopy = {
  label: string;
  hint: string;
};

export type SignupOrgCopy = {
  label: string;
  hint: string;
  skipLabel: string;
};

export type SignupForm = {
  steps: readonly string[];
  sections: readonly SignupSection[];
  hero: SignupHeroCopy;
  submit: string;
  consent: string;
  benefits: readonly string[];
  benefitsMuted: readonly string[];
  notice: SignupNotice;
  connect: SignupConnectCopy;
  reach: SignupReachCopy;
  handle: SignupFieldCopy;
  org: SignupOrgCopy;
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
  // Cycles are 7 days. Each cycle auto-snapshots Sunday 23:59 CET; prizes
  // are paid the following Monday. The current cycle's countdown is in
  // `snapshotIn`. (Static for now — wire to a server-computed value when
  // we have a clock running.)
  program: {
    name: "circles/garage",
    domain: "builder.circles.garage",
    cycle: 1,
    pool: "€500.00", // weekly pool, in xDAI
    payoutDay: "Mon",
    snapshotIn: "3d 12h", // countdown to sun 17 may 23:59 CET
    lastUpdated: "just now",
    nowCET: "12:00 CET",
    // payout split (numerators sum to denominator)
    poolSplit: {
      winners: 2,
      life: 1,
      denom: 3,
      winnersAmt: "€333.33",
      lifeAmt: "€166.67",
    },
  },

  // ── live counters (landing hero) ───────────────────────────────
  counters: [
    { k: "builders signed", v: "0", d: "open call · day 1" },
    { k: "mini-apps submitted", v: "0", d: "register yours" },
    { k: "auto-snapshot", v: "SUN 17", d: "3d 12h · 23:59 CET" },
    { k: "weekly pool", v: "€500", d: "paid every mon" },
  ],

  // ── copy: landing ──────────────────────────────────────────────
  landing: {
    kicker: "// builder program · cycle 01 · open call · live now",
    headline: ["Get paid to ship", "mini-apps on Circles."],
    sub: "Cycle 01 is open. 7-day cycles · auto-snapshot every Sunday 23:59 CET · €500 weekly pool paid Monday morning. ⅔ to the apps moving WAU. ⅓ to the apps that keep showing up. No decks, no rounds, no gatekeepers.",
    ctaPrimary: "sign up →",
    ctaSecondary: "submit a mini-app →",
    steps: [
      ["i.", "sign up", "handle · org · contact. 3 fields, no kyc."],
      [
        "ii.",
        "submit a mini-app",
        "contracts · repo · live link. we wire up the meter.",
      ],
      [
        "iii.",
        "get measured. get paid.",
        "auto-snapshot sun 23:59 CET. ⅔ to top movers, ⅓ to apps still moving. paid mon.",
      ],
    ],
    manifesto: [
      "Circles is money, reimagined. Mini-apps are how it becomes a daily habit instead of a thesis.",
      "We pay the people building the habit-forming surfaces — not the ones with the best pitch.",
      "The metric is whatever moves weekly active users on chain. We publish the formula. You optimise for it. We pay the winners.",
      "~ writing in public, paid in private.",
    ],
    bulletin: [
      "cycle 01 open call · live now.",
      "auto-snapshot every sun 23:59 CET · prizes paid mon morning.",
      "wed call topic: how the meter works (open to all).",
    ],
  },

  // ── copy: schedule ─────────────────────────────────────────────
  schedule: [
    { d: "THU 14", body: "cycle 01 open call · live", now: true },
    { d: "SUN 17", body: "cycle 01 auto-snapshot · 23:59 CET" },
    { d: "MON 18", body: "first prizes paid · cycle 02 starts" },
    { d: "WED 20", body: "builder call · 18:00 CET" },
  ],

  // ── leaderboard rows ───────────────────────────────────────────
  // cycle 01 has just opened — no entries yet.
  leaderboard: [],

  // ── leaderboard secondary panels ───────────────────────────────
  circleOfLife: [],
  movers: [],

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
  // v1 flow: connect → you → review. Step 02 form fields (handle,
  // reach, org picker, consent) are bespoke components — they live in
  // signup-client.tsx, not in this content blob.
  signup: {
    steps: ["connect", "you", "review"],
    sections: [
      { num: "01", label: "connect", hint: "one wallet prompt" },
      { num: "02", label: "you", hint: "handle, reach, optional org" },
      { num: "03", label: "review", hint: "sign · create row" },
    ],
    hero: {
      title: "who's shipping?",
      sub: "One wallet prompt + one signature. No KYC. We use your Circles avatar to pay you.",
    },
    submit: "sign & create →",
    consent:
      "I read the rules. The weekly snapshot is final. My handle & numbers can show on the public leaderboard.",
    benefits: [
      "builder page on the public leaderboard",
      "auto-pulled WAU + tx volume",
      "eligibility for ~€500/wk in xDAI",
      "invite to the wed builder call",
    ],
    benefitsMuted: ["co-marketing when top-3"],
    notice: {
      head: "no kyc · no fee",
      body: "your Circles avatar is your identity. one signature is enough.",
    },
    connect: {
      headline: "connect your Circles avatar",
      sub: "We read your avatar on Gnosis Chain to pre-fill your handle and list any groups you can submit under.",
      primary: "connect browser wallet",
      secondary: "connect with Gnosis app",
      noWallet:
        "no wallet detected · get a Circles avatar in the Gnosis app, then come back.",
      gnosisAppUrl: "https://app.gnosis.io/circles",
      wrongChain:
        "switch your wallet to Gnosis Chain (chainId 100) and reconnect.",
      notHuman: {
        group:
          "you're connected as a group avatar — reconnect with your personal wallet. garage is for builders, not orgs.",
        organization:
          "you're connected as an organization avatar — reconnect with your personal wallet.",
      },
      noAvatar:
        "you don't have a Circles avatar yet. create one in the Gnosis app, then come back.",
    },
    reach: {
      label: "where can we reach you?",
      hint: "we'll DM you with the wed call link + prize details.",
      channels: [
        { value: "tg", label: "tg", placeholder: "@your_tg" },
        { value: "fc", label: "fc", placeholder: "you.eth" },
        { value: "email", label: "email", placeholder: "you@mail.com" },
      ],
    },
    handle: {
      label: "handle",
      hint: "lowercase · 3-30 · letters digits . _ -",
    },
    org: {
      label: "submit under",
      hint: "pick a group you belong to, or skip — you can set this later.",
      skipLabel: "— skip / set later —",
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
