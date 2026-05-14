# brand — Circles mark, garage voice

circles/garage is run by the Circles team but presented as its own
surface for a 6-week builder program. The mark does the affiliating;
the copy doesn't have to. **No "official Circles initiative" wording
anywhere.**

## The rule that drives everything

From the Circles brand guidelines PDF (`_media-kit/media-kit-main/Circles Brand Guidelines.pdf`):

> **"In no way should the logo be modified, distorted, or redrawn."**
> *(page 4)*

> **"We always use our logo with the symbol included since the symbol
> is our most recognisable brand element."** *(page 7)*

That kills the obvious move (retype "circles" in JetBrains Mono next to
the symbol). The supported move is the **Partner Placement** pattern
shown on page 9: their logo, untouched, followed by a 1px separator,
followed by ours.

## Inputs

**From the media kit** (`_media-kit/media-kit-main/`):

- **Symbol**: half-`C` with offset disc — indigo `#251B9F` C, orange
  `#FF491B` ball.
- **Full logo**: symbol + "Circles" wordmark in DM Sans, locked
  together as a single asset. Never separated when space allows.
- **Font**: DM Sans (only inside the logo SVG — we don't import it).

**From the garage kit** (`packages/ui/`):

- Monospace everywhere (JetBrains Mono).
- Strictly monochrome `bone` palette (`#14110d` on `#f6f4ef`).
- Pane + status-bar tool aesthetic, terse lowercase voice.

These don't blend; they lock together via the Partner Placement rule.

## The treatment (subtle, one accent)

### 1. StatusBar lockup — symbol only + separator + garage

Page 6 of the guidelines treats tight horizontal contexts (favicons,
icons, narrow rails) as a valid place for the **symbol on its own**.
The StatusBar is exactly that case. Result:

```
[symbol]│ garage         cycle 01 · ● live
```

- The `circles-symbol.svg` renders ~14–16px tall, inline with the
  StatusBar type. The inner disc is the orange accent (already in the
  SVG — we don't re-color it).
- A **1px vertical hair** sits between the symbol and "garage"
  (`border-l border-hair`, ~14px tall to match the symbol). This is
  the page-9 Partner Placement separator, scaled down.
- **"garage"** stays in JetBrains Mono — our type. We never put a
  retyped "Circles" next to the symbol; the symbol carries that name.
- Implemented as `<Wordmark variant="compact" />`.

### 2. Footer lockup — full Circles logo + separator + garage wordmark

The footer has horizontal room, so we use the **full official logo**
(`circles-logo.svg` — symbol + DM Sans wordmark together, unmodified)
in the page-9 Partner Placement composition:

```
[Circles logo]│ garage     circles is money, reimagined.   → aboutcircles.com   → docs.aboutcircles.com   → t.me/circlesbuilders
```

- `circles-logo.svg` renders at ~20–22px tall.
- 1px vertical stroke separator, same height as the logo.
- "garage" in JetBrains Mono, same baseline.
- Implemented as `<Wordmark variant="full" />`.
- We do **not** import DM Sans — the SVG paths are pre-rendered
  outlines. Zero font weight added to the bundle.

### 3. One accent token: orange `#FF491B` — named `--ember`

Naming matters here. The kit already uses `accent` as a *typography*
prop on `<S>` (`packages/ui/src/components/kit/S.tsx`, also visible at
`_handoff/kit.jsx:74-78`) to mean "render this value in bold weight."
A CSS variable also called `--accent` would collide cognitively even
though it lives in a different layer. We name the color token `--ember`
instead. The `accent={true}` prop stays a typography concern; `--ember`
is the orange color.

Also relevant: the original designer rejected accent color in the
wireframe (`_handoff/README.md:218` — *"Tried red marker — looked too
'decorated'."*). We override that prior because the Circles partnership
introduces a new requirement (subtle affiliation), not because we want
decoration. The token must stay rare.

Add to `packages/ui/src/styles/globals.css`:

```css
:root[data-palette="bone"] {
  --ember: #FF491B;
}
:root[data-palette="inverse"] {
  --ember: #FF6A3D;   /* slight lift for the dark palette */
}
```

Tailwind: `text-ember`, `bg-ember`, `border-ember`.

**Use only on:**
- The inner disc of the symbol (already baked into the SVG).
- The primary CTA — `sign up →` button border + arrow.
- The `● live` status dot when a cycle is open.
- A single underline rule on the active leaderboard rank? Optional.

That's it. No chart lines, no focus rings, no pills, no dividers. Use
it five places and we lose its meaning *and* break faith with the
no-decoration prior.

Indigo `#251B9F` stays where the SVG already uses it and **nowhere
else**. The garage palette is still ink-on-paper.

### 4. Footer attribution copy

Bottom of every page, three links, monochrome, mono, `text-faint`:

```
circles is money, reimagined.   → aboutcircles.com   → docs.aboutcircles.com   → t.me/circlesbuilders
```

- "Money, Reimagined" is the parent tagline (page 2 of the guidelines)
  — borrowed verbatim as the only marketing prose on the page.
- No "powered by", no badges, no second logo line.

### 5. Copy moves (`apps/web/lib/content.ts`)

- `landing.kicker` — drop affiliation copy entirely. Keep:
  `// builder program · cycle 01 · open call · live now`
- `landing.headline` — unchanged. *"Get paid to ship / mini-apps on Circles."*
  Already does the affiliating in two words.
- `landing.manifesto[0]` — tighten to echo the parent tagline:
  *"Circles is money, reimagined. Mini-apps are how it becomes a daily habit instead of a thesis."*
- `program.name` stays `circles/garage`.

## Assets to drop in

Already staged in `apps/web/public/brand/`:

| File | Source | Purpose |
|---|---|---|
| `circles-symbol.svg` | `Logo (Light)/symbol color.svg` | StatusBar (compact lockup) |
| `circles-symbol-black.svg` | `Logo (Light)/symbol black.svg` | Mono fallback |
| `circles-logo.svg` | `Logo (Light)/logo color.svg` | Footer (full lockup) — official, untouched |
| `circles-logo-black.svg` | `Logo (Light)/logo black.svg` | Mono fallback |
| `circles-logo-white.svg` | `Logo (Dark)/logo white.svg` | For inverse palette |

To produce:

| File | Size | Notes |
|---|---|---|
| `apps/web/public/og.png` | 1200×630 | Bone bg, full Partner Placement lockup top-left, big mono headline, footer tagline. |
| `apps/web/public/favicon.svg` | 32×32 | The Circles **symbol** on bone bg (page 10: *"For favicons we prefer to use our symbol only"*). Replace `apps/web/app/favicon.ico`. |

Out of scope for v1: motion, lottie, illustrations. The kit aesthetic
is deliberately still; we are not borrowing the trust-network
illustration style. That would mute the sub-brand.

## What we deliberately don't do

- ❌ "Official Circles initiative" / "Powered by Circles" / "A Circles
  program" copy — drop everywhere. Wrong framing for the voice.
- ❌ **Retype "Circles" in JetBrains Mono.** Violates page 4 (no
  redrawing) and page 7 (never use the wordmark without the symbol).
- ❌ Use the symbol alone where the full logo would fit. The compact
  variant is reserved for the StatusBar's tight rail.
- ❌ Re-skin to indigo or Circles teal. The garage stays mono ink-on-paper.
- ❌ Mirror the aboutcircles.com layout. Different audience.
- ❌ Use indigo or orange anywhere outside the four spots in §3.
- ❌ Name the CSS variable `--accent`. `accent` is already a kit prop.
- ❌ Import DM Sans. The wordmark lives inside the SVG.

## Implementation order

Don't try this in one PR.

1. **Now** (reversible): drop affiliation copy, add the
   `<Wordmark variant="compact" />` to the StatusBar, add `--ember`
   token, apply to the primary CTA + live dot.
2. **Next**: footer block with `<Wordmark variant="full" />`, favicon swap.
3. **Before public launch**: OG image, copy pass with the Circles team.

## Approval gates

Confirm with the user before shipping public:

1. **Partner Placement composition** — the page-9 example uses the
   logo at a fixed height with a specific separator weight. Get a
   visual sign-off from the Circles team before public launch.
2. **Domain** — `builder.circles.garage` is the planned host. Confirm DNS.
3. **Footer destinations** — confirm `t.me/circlesbuilders` (or the
   real channel) and the docs link.
4. **Clear-space rule** — page 5 of the guidelines specifies a
   clear-space margin around the logo equal to the height of the
   symbol. Honour it in OG image and footer composition.
