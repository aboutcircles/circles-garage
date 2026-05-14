# _spec — design-baseline → prod

Wireframes (`_handoff/`) showed *what* the screens look like. This folder
defines *what they ask, why, and how the data flows* so the program can
actually open the door to real builders next cycle.

Living docs — edit in place as decisions land.

| File | Scope |
|---|---|
| `signup.md` | What `/signup` collects, why, and how to land it |
| `brand.md` | Circles mark + garage voice — Partner Placement pattern, accent token, asset checklist |
| `responsive.md` | Mobile-readable pages + graceful wallet-flow degradation |
| `local-dev.md` | Run the full stack (Next + Supabase) locally |

## Status (cycle 01)

- Local stack: **runnable** (`supabase start` + `pnpm dev`). See `local-dev.md`.
- Signup intake: **needs trim** before opening to real builders. See `signup.md`.
- Brand: **garage-only today**. Needs Partner Placement lockup (symbol/logo + 1px separator + garage) before public launch. See `brand.md`.
- Responsive: **desktop-only today**. Kit `Grid` needs a `collapseAt` prop; `/signup` needs an inline fallback. See `responsive.md`.
