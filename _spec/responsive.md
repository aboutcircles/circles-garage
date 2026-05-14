# responsive — pages browsable on mobile, signup degrades gracefully

The kit was built desktop-first (2-col grids, fixed pane widths, no
breakpoints). For cycle 01 we don't go fully mobile-native — wallet
flows are inherently flaky on phones — but the app should *render* on
phones, be *readable* on phones, and degrade *honestly* on phones.

## Scope

| Surface | Mobile target |
|---|---|
| `/` (landing) | Fully readable. Hero stacks; rail flows below. |
| `/dashboard` | Fully readable. Stats strip + table stack. |
| `/leaderboard` | Table horizontally scrolls inside its `Pane`. Header summary stacks. |
| `/register` (read view) | Fully readable. Sidebar flows below main. |
| `/register` (write view) | Best-effort. Form usable if you got past `/signup`. |
| `/signup` (wallet flow) | **Degrades gracefully** — see §3. |

The bar is "browsable + readable", not "thumb-perfect". No bottom nav,
no hamburger, no native gestures.

## Decisions

### 1. Add `collapseAt` to the kit `Grid`

The `Grid` primitive (`packages/ui/src/components/kit/Grid.tsx`) is the
single chokepoint for top-level layout — every page composes its
two-column structure through it. Extend it instead of touching five
page files.

```tsx
type GridProps = {
  cols?: number | string;
  rows?: string;
  gap?: number;
  fill?: boolean;
  collapseAt?: number;   // px breakpoint; below this, grid forces 1 col
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};
```

Implementation: emit an inline CSS custom property and a media-query
class. Since Tailwind v4 supports arbitrary media queries via the
`@media` directive, the simplest path is a tiny utility class:

```css
/* packages/ui/src/styles/globals.css */
@media (max-width: 767px) {
  .grid-collapse-md {
    grid-template-columns: 1fr !important;
    grid-template-rows: auto !important;
  }
}
```

`Grid` adds `grid-collapse-md` when `collapseAt` is set (`768` is the
only value we use today; the prop is reserved for future tuning).

**Default = `768`** for any `Grid` that uses a string `cols` template.
All current call sites use string templates (`"1.6fr 1fr"`, `"2fr 1fr"`,
`"1.4fr 1fr"`), so they all collapse automatically. Numeric `cols={N}`
calls (none today) keep desktop behavior unless `collapseAt` is set.

Cells maintain document order on collapse → main content above, rails
below. Acceptable for v1; if a page needs a different order (rail
first on mobile), use `order-first md:order-none` on that child.

### 2. Other kit primitives — minimal touches

- **`StatusBar`** already uses `flex-wrap` (`StatusBar.tsx:13`). Leave
  it. The wordmark lockup (per `brand.md` §1) renders the symbol-only
  variant; the URL chunk wraps below on narrow viewports.
- **`Table`** (`Table.tsx`) is `w-full` with pixel column widths. On
  narrow viewports columns overflow. Wrap the `Table` *at its call
  site* in `<div className="overflow-x-auto">` inside the `Pane` —
  `Pane` content padding stays intact. Don't change the primitive.
- **`Pane`** — bordered box, fluid width, no changes needed.
- **`Hero`** — numerals are large; verify the landing hero doesn't
  overflow 375px. If it does, drop the font-size by one step at
  `<640px` via a single class on the page.

### 3. `/signup` on mobile — attempt then fall back

Confirmed in spec review: WalletConnect is out. The mobile experience
is:

1. The form renders responsively (via the `Grid` collapse).
2. User taps `connect circles →`.
3. Client probes `window.ethereum` for ~1s (`EIP-6963` is faster if the
   wallet supports it — listen for `eip6963:announceProvider` events).
4. **Provider detected** (MetaMask / Rabby / Coinbase in-app browser):
   continue the desktop flow. Signature prompt works inside the
   wallet's in-app browser.
5. **No provider after 1s**: render an inline note inside the
   `ConnectCircles` component, *not* a wall:

   ```
   no wallet detected on this device.
   → open this page in your wallet's in-app browser
   → or come back on desktop
   ```

   Keep the `connect circles →` button available; some users have a
   wallet extension that loads late.

We do **not** auto-deeplink to MetaMask. The deeplink format is fragile
across wallets and feels intrusive; the text-only fallback is honest
and reversible.

### 4. What we deliberately don't ship

- ❌ WalletConnect v2 — explicitly rejected by the user. Reserved for
  post-cycle-01 if mobile traffic justifies it.
- ❌ A hamburger / drawer nav. The kit's top-level navigation is
  ambient (StatusBar + CmdBar); we don't have a hidden menu to hide.
- ❌ A hard "open this on desktop" wall. The user wants pages
  *browsable* on mobile — only `/signup`'s wallet step degrades, and
  it degrades inline.
- ❌ Bottom-nav, pull-to-refresh, swipe gestures. Not a native app.
- ❌ Touch-tuned spacing tokens. The kit's existing `text-xs` density
  reads fine on phones; widening for fingertips would re-skin the
  whole aesthetic.

## Verification

After implementation, on a 375×667 viewport (iPhone SE class):

1. `/` renders with hero stacked above the right rail. No horizontal
   scroll.
2. `/leaderboard` table scrolls horizontally inside its pane (the
   surrounding page does not).
3. `/signup` shows the channel control, handle input, and
   `connect circles` button stacked vertically. The "no wallet
   detected" fallback appears after 1s in a desktop browser
   (`window.ethereum = undefined`).
4. `StatusBar` wraps cleanly — wordmark + URL above, cycle/status
   chunk below. Symbol still legible.

If any of those break, the implementation failed.

## Cross-references

- `_spec/signup.md` §"Mobile-first?" — replaced by this doc's §3.
- `_spec/brand.md` §1 — symbol-only `<Wordmark variant="compact" />`
  is what makes the StatusBar survive narrow viewports.
