# Local development

Stack: Next.js (port 3000) + a local Supabase (Docker) on a non-default
port range to avoid colliding with other Supabase projects.

## One-time

```bash
# Docker Desktop must be running.
pnpm install
```

`apps/web/supabase/` is the Supabase project root (config + migrations).
Ports are remapped to the `544xx` range in `supabase/config.toml`:

| Service | Port |
|---|---|
| API / REST / Storage | 54421 |
| Postgres | 54422 |
| Studio | 54423 |
| Mailpit | 54424 |
| Analytics | 54427 |

## Run

```bash
cd apps/web
supabase start          # spins up Postgres + applies migrations
                        # (idempotent — safe to re-run)
```

Copy the printed anon key into `apps/web/.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54421
NEXT_PUBLIC_SUPABASE_ANON_KEY=<ANON_KEY from `supabase status -o env`>
```

> Use the **legacy `ANON_KEY`** (long JWT), not the new `PUBLISHABLE_KEY`.
> supabase-js in this repo expects the JWT form for RLS.

Then, from the repo root:

```bash
pnpm dev                # http://localhost:3000
```

## Smoke-test the signup write

```bash
# 1. Counters should be (0,0)
curl -s -X POST http://127.0.0.1:54421/rest/v1/rpc/get_landing_counters \
  -H "apikey: $ANON_KEY" -H "Content-Type: application/json" -d '{}'

# 2. Walk through /signup in the browser → submit.
# 3. Counters should now read (1,0). Landing hero card updates within 15s.
```

## Reset the DB

```bash
supabase db reset       # drops & re-applies all migrations from scratch
```

## Studio

http://127.0.0.1:54423 — browse `builders` and `submissions` rows
without touching the CLI.

## Stop

```bash
supabase stop
```

## Gotchas

- The repo started with no `supabase/config.toml`. `supabase init` was
  run once; the resulting config lives in `apps/web/supabase/config.toml`.
- The default Supabase port range (`54321-54329`) is reserved for the
  user's other projects. Don't change the `544xx` mapping here without
  also updating `.env.local`.
- `builders` and `submissions` are insert-only for the `anon` role.
  Reads happen via the `get_landing_counters` RPC (definer-mode,
  aggregate counts only — no PII leak). Anything that needs to read
  rows must move to a server route with the service role.
