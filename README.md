# circles/garage

Builder dashboard / mini-app submission site for the Circles protocol.
Cypherpunk-garage aesthetic: monospace everywhere, monochrome, titled
panes, top status bar, bottom command bar.

Five routes, all RSC-rendered, all driven by a single typed content file.
This is a wireframe-to-production port — see `_handoff/README.md` for
the design rationale and `CLAUDE.md` for agent conventions.

## Run

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Routes: `/`, `/signup`, `/dashboard`, `/leaderboard`, `/register`.

## Common commands

```bash
pnpm dev          # next dev (turbopack)
pnpm build        # next build
pnpm check        # typecheck + lint (also runs on pre-commit)
pnpm typecheck    # tsc --noEmit, all packages
pnpm lint         # eslint, all packages
pnpm format       # prettier --write
```

`pnpm check` runs automatically via husky pre-commit. Bypass with
`git commit --no-verify` only if you know why.

## Layout

```
apps/web/
  app/
    page.tsx            # /            (landing)
    signup/page.tsx     # /signup
    dashboard/page.tsx  # /dashboard
    leaderboard/page.tsx# /leaderboard
    register/page.tsx   # /register
  lib/content.ts        # ALL mock copy + data, fully typed
packages/
  ui/src/
    components/kit/     # design system primitives (Page, Pane, Hero,
                        #   Field, Table, etc.) — exported via
                        #   @workspace/ui/kit
    styles/globals.css  # palette tokens + Tailwind v4 @theme
  eslint-config/        # shared eslint config
  typescript-config/    # shared tsconfig bases
```

## Adding shadcn primitives

The kit replaces shadcn for this project's aesthetic. If you do need a
shadcn primitive (form input wiring, popover, etc.), add it via:

```bash
cd apps/web && pnpm dlx shadcn@latest add <name>
```

It will be placed in `packages/ui/src/components/` (shared).

## Replacing mock data

`apps/web/lib/content.ts` is the only place mock copy + data lives.
Replace its values with API calls / a config service when wiring up.
The types tell you what shape each endpoint should return. See
`_handoff/README.md` § "Content" for the API split.

## Stack

- pnpm + turbo monorepo
- Next.js 16 (App Router, Turbopack, RSC by default)
- React 19
- Tailwind v4
- TypeScript (strict, NodeNext in libs / Bundler in app)
- JetBrains Mono via `next/font/google`
