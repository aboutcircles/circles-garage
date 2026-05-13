# CLAUDE.md — circles/garage agent conventions

This file is loaded into the context of every Claude Code session in this
repo. Keep it short. If a rule isn't here, fall back to the README.

## What this repo is

Five-screen builder dashboard for the Circles protocol (`/`, `/signup`,
`/dashboard`, `/leaderboard`, `/register`). All static-render today, no
backend wired up.

Originally a static wireframe — see `_handoff/` for the source artefact
(JSX + a `content.js` mock data file) and the design rationale in
`_handoff/README.md`. Read it before making design changes.

## Stack

pnpm + turbo monorepo. Next.js 16 App Router + React 19 + Tailwind v4 +
TypeScript (strict). JetBrains Mono via `next/font/google`.

## Conventions

### Pages = RSC by default
Every route under `apps/web/app/**/page.tsx` is a Server Component. **Do
not add `"use client"`** unless you actually need state/effects/event
handlers. If a screen needs interactivity, lift the interactive subtree
into a `*-client.tsx` component that the RSC imports.

### Use the kit, don't roll your own
The design system lives in `packages/ui/src/components/kit/` and is
exported via `@workspace/ui/kit`. Always import from the barrel:

```ts
import { Page, Pane, Grid, Hero, Field, Table, Btn, S, SDot } from "@workspace/ui/kit"
```

Components: `Page`, `StatusBar`, `CmdBar`, `S`, `SDot`, `Kbd`, `Grid`,
`Pane`, `Section`, `Hero`, `Field`, `Slot`, `Btn`, `Pill`, `StatStrip`,
`Table`, `Check`, `StatusRow`. Read their source — each is small.

Don't add shadcn primitives unless a kit primitive truly doesn't cover
the case. The aesthetic is bespoke; shadcn defaults will clash.

### Tailwind classes for layout
Use Tailwind utility classes for everything. **Inline styles are
permitted only for dynamic values** — grid templates, computed widths,
SVG attributes, dynamic pixel heights. The kit components follow this
rule; new screens should too.

Tokens are exposed as Tailwind utilities: `bg-paper`, `text-ink`,
`text-faint`, `border-hair`, `bg-ghost`. They map to CSS custom
properties so palette switching is a `data-palette="…"` attribute swap
on `<html>`.

### Content is typed
All mock copy + data lives in `apps/web/lib/content.ts`, fully typed.
Don't hard-code strings or numbers in screens — pull from `content`.
When wiring real APIs, replace the values; the types should stay.

### No new dependencies without reason
The kit is intentionally self-contained. Don't add `react-hook-form`,
`@radix-ui/*`, `framer-motion`, etc., for cosmetic work. Ask the user
before adding anything to `package.json`.

### Commits must pass `pnpm check`
Husky pre-commit runs `turbo typecheck lint`. If it fails, fix the root
cause — don't `--no-verify`. The check takes ~3s with turbo cache.

## Module resolution gotcha

`packages/ui` uses `moduleResolution: Bundler` to match Next.js's
webpack/turbopack resolver (so kit imports don't need `.js` extensions).
The shared `base.json` in `packages/typescript-config` uses NodeNext,
but `packages/ui/tsconfig.json` overrides this. **Don't revert that
override** — it's why the build works.

## Anti-patterns to avoid

- `"use client"` at the page level "just in case"
- Re-implementing kit primitives inline instead of importing them
- Inline styles for static layout (use Tailwind)
- Adding state/effects for purely visual work (almost all of this is
  pre-rendered)
- Editing `_handoff/` files — that's a frozen reference. If you need to
  port something missing, copy it into the live tree first.

## Source-of-truth files

| Need to change... | Edit... |
|---|---|
| copy / mock data | `apps/web/lib/content.ts` |
| design tokens | `packages/ui/src/styles/globals.css` |
| primitives | `packages/ui/src/components/kit/*.tsx` |
| a page's layout | `apps/web/app/<route>/page.tsx` |
| eslint rules | `packages/eslint-config/*.js` |
