# Circles Garage — wireframes

Wireframes for a builder dashboard / mini-app submission site on the
Circles protocol. Five screens, one cohesive design system.

The vibe is **cypherpunk garage**: monospace everywhere, monochrome
ink-on-paper, every section is a titled pane, top status bar with live
program metrics, bottom command bar with keyboard shortcuts. Reads more
like a dev tool than a marketing site — which is the point.

---

## Run it

Open `index.html` in a browser. No build step. No deps to install — React,
ReactDOM, and Babel are loaded from unpkg as `<script>` tags.

If you serve over `http://` (recommended), font loading is cleaner:

```
npx serve .
# or
python3 -m http.server 8000
```

---

## File map

```
index.html              entry · loads scripts in dependency order
app.jsx                 root component · canvas + tweaks panel
kit.jsx                 design system primitives (the only file you
                          import "components" from)
content.js              ALL mock data + copy. Replace this with real
                          data when wiring to an API.
screens/
  landing.jsx           01 · public homepage
  signup.jsx            02 · builder signup form
  dashboard.jsx         03 · logged-in builder dashboard
  leaderboard.jsx       04 · public ranking + secondary panels
  register.jsx          05 · register/edit a mini-app draft
design-canvas.jsx       vendored canvas shell (pan/zoom artboard frame —
                          for design review; remove when shipping a real app)
tweaks-panel.jsx        vendored tweaks panel (palette switcher; remove
                          when shipping)
```

Everything is plain JSX, no JSX modules — scripts run in global scope and
each one attaches its exports to `window`. This is a wireframe artefact,
not a production scaffold. When you reimplement, you'll likely:

- Bundle with Vite / Next / your stack of choice
- Convert window-scoped components to ES modules
- Replace `content.js` with API calls / a CMS / a config file
- Strip the `design-canvas.jsx` + `tweaks-panel.jsx` chrome
- Move inline styles to your styling solution of choice (the styles are
  intentionally hand-rolled — no Tailwind / styled-components — so you're
  not forced into a system you don't use)

---

## Design system primitives (`kit.jsx`)

These are the lego pieces every screen uses. Read `kit.jsx` for the full
signatures; quick reference:

### Tokens
```js
k.ink     // primary fg     (#14110d in default 'bone' palette)
k.paper   // primary bg     (#f6f4ef)
k.hair    // 12% fg         (subtle lines)
k.faint   // 55% fg         (secondary text)
k.ghost   // 6% fg          (filled background blocks)
k.mono    // font stack
```

All tokens read from CSS custom properties, so palette switching is one
`document.documentElement.style.setProperty(…)` call (handled by
`applyTokens()` and the Tweaks panel).

### Page shell
```jsx
<Page screen="01 Landing" status={…} breadcrumb="…">
  <Grid cols="1.6fr 1fr" rows="auto 1fr" gap={12} fill>
    <Pane title="hero" hint="welcome.txt" span={2}>…</Pane>
    <Pane title="left col">…</Pane>
    <Pane title="right col">…</Pane>
  </Grid>
</Page>
```

`<Page>` gives you the dark **StatusBar** on top + light **CmdBar** on
bottom + scrollable body in between. Use `<Grid>` to lay out
`<Pane>`s — each Pane has a black title strip with `┌─ TITLE ─┐` chrome
and a hint slot on the right.

`<S>` and `<SDot>` are little helpers for the StatusBar:

```jsx
status={<>
  <S k="cycle" v={12} accent />
  <SDot />
  <S k="pool" v="€487.20" accent />
</>}
```

### Content building blocks
- `<Section num="01" label="you" hint="…">` — `§ section` divider used
  inside a `<Pane>` for form / doc subsections
- `<Hero size="xl" kicker sub ctas>` — big monospace headline
- `<Field label value placeholder required hint>` — dotted-underline
  inline field (the form vocabulary)
- `<Btn primary sm ghost>` · `<Pill>` · `<Slot label h>` (image
  placeholder) · `<Kbd>` — small components
- `<StatStrip items={[{ k, v, d }, …]}>` — 4-tile metric row
- `<Table head={[…]} rows={[…]} sizes={[…]}>` — generic mono table
- `<Check on label hint line>` — checkbox row (`line` toggles ascii-style)
- `<StatusRow ok label>` — ✓ / ○ pass-fail indicator

### Palettes
Defined at the top of `kit.jsx`. Switch by passing a palette key to the
Tweaks panel. Built-in: `bone` (default), `newsprint`, `eucalyptus`,
`inverse` (dark mode).

---

## What's in each screen

### 01 · Landing (`screens/landing.jsx`)
Public homepage. Hero pane with big headline + CTAs. Three-column
"how it works". Mini leaderboard preview. Manifesto block. Right rail:
live pool, counters, schedule, bulletin.

**To replace:** copy in `C.landing` (headline, sub, steps, manifesto,
bulletin) + live numbers in `C.program` and `C.counters`.

### 02 · Sign up (`screens/signup.jsx`)
Three sections (you / your circle / the app), form data-driven by
`C.signup.sections`. Right rail with benefits + sign-in alternatives.

**Form fields collected:** handle, contact, CRC v2 address, org address,
team members (optional), working app name, track, one-line pitch.

**To wire up:** validate Circles addresses, verify the user controls the
org address (sig challenge), POST to your signup endpoint.

### 03 · Dashboard (`screens/dashboard.jsx`)
Logged-in view. StatusBar shows the user's rank, payout, snapshot
countdown. Hero pane with greeting + 4-tile metric strip. Mini-apps list
with sparklines. Pool breakdown. Activity feed. Todo list.

**To wire up:** auth gating, pull metrics for the logged-in builder's
contracts, real payout projection, activity feed from event indexer.

### 04 · Leaderboard (`screens/leaderboard.jsx`)
Public ranking, sorted by new minters. Tabs for `this week / all time /
circle of life / by track`. Full table on the left with builder · org ·
app · pitch · mints · vol · payout · streak. Right column: podium,
circle of life leaders, biggest movers, schedule.

**To wire up:** API endpoint returning ranked rows; alternate ranking
modes are tabs (`?rank=…`); CSV export.

### 05 · Register mini-app (`screens/register.jsx`)
Multi-section form for submitting / editing a mini-app draft. Identity,
contracts (with verification status), proof-of-life (live link, repo,
screenshots, readme), measure selection, review checks.

**To wire up:** autosave every N seconds, contract-readiness checks
(can we read events?), live-link 200 check, screenshot uploads,
readme parsing, eligibility logic (`d.checks` should be computed
server-side or via contract reads).

---

## Content (`content.js`) — what to replace

`content.js` is the **only** file with mock copy + data. Single object
`C`, attached to `window`. Top-level keys:

```js
C.program        // cycle number, pool, dates, payout split formula
C.counters       // 4 live-ish counters for the landing hero
C.landing        // headline, sub, ctas, steps, manifesto, bulletin
C.schedule       // dates for the current cycle
C.leaderboard    // ranked array of builders / apps
C.circleOfLife   // longest-streak builders
C.movers         // biggest rank jumps this week
C.me             // signed-in user (handle, apps, activity, todo)
C.signup         // form sections + labels + benefits copy + notice
C.draft          // current mini-app draft being edited (Register screen)
```

When you wire this up, you'll likely split it:

- `C.program` + `C.schedule` → server config / cycle endpoint
- `C.leaderboard` + `C.circleOfLife` + `C.movers` → `/api/leaderboard`
- `C.me` → `/api/me` (auth required)
- `C.draft` → `/api/draft/{id}` (auth + ownership check)
- Copy fields (`C.landing.*`, `C.signup.*`) → keep as static config or
  push to a tiny CMS so non-engineers can edit

---

## Design decisions worth knowing

**Why all-monospace?** It's the "cypherpunk garage" texture without
leaning on Matrix-green or CRT scanlines. Mono signals "this is a tool
made by builders, for builders" — and forces honest information density
(no marketing whitespace to hide behind).

**Why panes everywhere?** Borrowed from tmux / window managers. Every
labelled box clearly delineates its responsibility. Easier to add new
sections later (just add a new Pane) without redesigning the whole
screen.

**Why no accent colour?** Tried red marker — looked too "decorated".
Strictly monochrome forces emphasis through weight, position, and
inversion (filled vs hollow). Adds back later if needed via the marker
palette token.

**Why a top status bar?** Two reasons: (1) the program is fundamentally
about *current-cycle live metrics* — these belong always-visible, not
buried; (2) signals "this site is alive, not static marketing".

**Why a bottom command bar?** Suggests power-user keyboard navigation is
on the roadmap. Even if you skip it in v1, the visual real estate is
reserved.

---

## Suggested next screens (not yet wireframed)

If you keep extending, candidates:

- **Mini-app public detail page** (`/p/{slug}`) — pitch, contracts,
  screenshots, live numbers, "open the app", share buttons
- **Mini-apps index / discovery** — browse all apps, filter by track
- **Builder public page** (`/b/{handle}`) — bio, apps, all-time stats
- **Admin / judge view** — verify submissions, run cycle snapshots, send
  payouts
- **Rules / docs page** — markdown-rendered rules of the program

The pane vocabulary scales to all of these — keep `<Page>` + `<Pane>` +
`<Section>` + `<Field>` and the visual system holds.

---

## Stripping the canvas chrome

When you turn this into a real site, the design canvas wrapping is
unwanted chrome. Steps:

1. Remove `<DesignCanvas>`, `<DCSection>`, `<DCArtboard>` from `app.jsx`
2. Replace with a router (Next.js routes, React Router, whatever)
3. Each route renders one of the `Screen*` components directly
4. Remove `<script src="design-canvas.jsx">` and `<script
   src="tweaks-panel.jsx">` from `index.html`
5. Delete the `DCArtboard` size constraint (1280×900) — let screens
   flex to the viewport instead. The screens are designed responsively
   (CSS grid with `1fr`s) so this should just work

---

## Open questions for the team

These came up while designing and warrant a decision before
implementation:

1. **Auth model** — connect-wallet only? Email magic link? Both? Affects
   the signup flow.
2. **Submission limit** — UI says "3 mini-apps max per org". Is that
   enforced? Per-cycle or all-time?
3. **Cycle of Life formula** — UI shows "6 wks · €18.40 bonus". What's
   the actual formula? (Weeks alive × base × multiplier? Linear? Capped?)
4. **Re-activation tracking** — listed as a metric. What counts as a
   re-activation? Returning user who didn't mint last week?
5. **Editing after submission** — can a builder edit a mini-app mid-cycle?
   Current UI implies yes (`d.measures` "changeable once per cycle"), but
   contracts can't be removed.
6. **Payouts** — direction is xDAI on Gnosis. Anything special needed
   for treasury custody / batching?
