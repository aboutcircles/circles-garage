# Leaderboard Participation Stats Spec

## Problem
The `/leaderboard` page derives its "0 builders" status-bar count from a
static empty array (`content.leaderboard`). That count becomes a visible
lie the moment anyone signs up. We also want a public-facing aggregate
signal — "submissions per cycle" across the 6-week program — that gives
admin visibility and helps visitors understand engagement, without
exposing per-user data we don't yet track or want public.

## Success Criteria
- Visitors to `/leaderboard` see a `participation` pane above the empty
  leaderboard table showing: total submissions across the program, plus
  per-cycle submission counts for cycles 01–06.
- Current cycle is visually distinguished (ember live dot, bold);
  past cycles show their snapshot count; future cycles show a faint
  `soon` label and an em-dash for the count.
- The wrong `<S k="builders">` chip in the leaderboard status bar is
  removed (not replaced — the new pane is the single source).
- The wrong "no entries yet" static hint on `/` (landing) is corrected
  to reflect real signup/submission counts when they exist.
- All counts come from one Supabase RPC, cached 60s via ISR (already
  set on `/leaderboard`; landing inherits its own caching).
- No row-level user data is exposed by the new RPC — aggregates only,
  same `security definer` pattern as the existing
  `get_landing_counters`.

## Scope

### In Scope
- New migration `apps/web/supabase/migrations/0008_program_stats.sql`
  that drops `get_landing_counters` and creates `get_program_stats`
  returning `(builders_total bigint, submissions_total bigint,
  submissions_by_cycle jsonb)`.
- Update `apps/web/app/page.tsx::fetchLiveCounters` to call
  `get_program_stats` (only consumes builders/submissions fields).
- Update `apps/web/app/leaderboard/page.tsx` to fetch the same RPC and
  render a new `participation` pane in the LEFT column above the
  existing "who moved the needle" pane.
- Remove `<S k="builders">` chip from the leaderboard status bar.

### Out of Scope
- `/dashboard` and `/signup` — no changes.
- Per-user data (no ranking, no public user links).
- New dependencies (kit primitives only).
- Per-cycle ranking — placeholder `podium` and `movers` panes stay
  untouched; they'll fill in when real scoring exists.
- Caching changes — keep the existing 60s ISR on `/leaderboard`.

## Constraints

### Must Follow
- RPC pattern: `security definer` + `set search_path = public` +
  `revoke all from public` + `grant execute to anon, authenticated`.
  Mirror the structure of the existing `get_landing_counters` in
  `apps/web/supabase/migrations/0002_landing_counters.sql`.
- Page fetch pattern: mirror `fetchLiveCounters` in
  `apps/web/app/page.tsx:37-54` (try/catch, null-safe, normalize
  array-of-one return shape).
- Use kit primitives from `@workspace/ui/kit` (`Pane`, `Grid`, `S`,
  `SDot`, etc.) — no shadcn or new components.
- Inline styles only for dynamic values (grid templates). Layout via
  Tailwind classes (`text-faint`, `text-ember`, `border-hair`) per the
  project CLAUDE.md.
- `/leaderboard` page stays a Server Component (`export const
  revalidate = 60` already set).

### Must Avoid
- Don't use the service-role Supabase key from server pages to bypass
  RLS — the `security definer` RPC is the safe pattern.
- Don't keep two RPCs (`get_landing_counters` + `get_program_stats` in
  parallel) — rename cleanly to avoid drift. The name
  `landing_counters` was misleading (it sounded like page-visit
  analytics); the new name reflects what it actually returns.
- Don't compute per-cycle counts client-side from a `SELECT *` — RLS
  blocks anon from row data, and we don't want a service-role
  workaround.
- Don't render the participation pane in the right column or inside
  the existing leaderboard pane — it's a sibling above the "who moved
  the needle" pane in the left column.
- Don't add a `submitted` chip to the status bar — the new pane is the
  only place this surfaces.

## Technical Approach

### Migration: `0008_program_stats.sql`
```sql
drop function if exists public.get_landing_counters();

create or replace function public.get_program_stats()
returns table(
  builders_total       bigint,
  submissions_total    bigint,
  submissions_by_cycle jsonb
)
language sql
security definer
set search_path = public
as $$
  select
    (select count(*) from public.builders)::bigint    as builders_total,
    (select count(*) from public.submissions)::bigint as submissions_total,
    coalesce(
      (
        select jsonb_object_agg(cycle::text, c)
        from (
          select cycle, count(*)::bigint as c
          from public.submissions
          group by cycle
        ) g
      ),
      '{}'::jsonb
    ) as submissions_by_cycle;
$$;

revoke all on function public.get_program_stats() from public;
grant execute on function public.get_program_stats() to anon, authenticated;
```

Note: `submissions` has a unique `(user_id, cycle)` index from
`0004_github_auth.sql`, so `count(*) where cycle = N` already equals
distinct participating builders in that cycle. No `count(distinct …)`
needed.

### Page changes

**`apps/web/app/leaderboard/page.tsx`:**
- Add `createClient` import + `SupabaseClient` type import.
- Add `fetchProgramStats(supabase)` helper modeled on
  `fetchLiveCounters` (try/catch, normalize array-of-one, parse the
  `submissions_by_cycle` jsonb into a `Record<number, number>`).
- In the page body, fetch the RPC alongside any existing data.
- Change main `<Grid cols="1.6fr 1fr">` so the left column wraps in a
  vertical stack:
  ```tsx
  <div className="grid min-h-0 gap-3"
       style={{ gridTemplateRows: "auto 1fr" }}>
    <ParticipationPane … />
    <Pane title="who moved the needle">…</Pane>
  </div>
  ```
- Right column unchanged.
- Remove `<S k="builders" v={String(rows.length)} />` (and the `<SDot
  />` that precedes it) from the status bar.

**`apps/web/app/page.tsx`:**
- Update `fetchLiveCounters` to call `get_program_stats`. Map
  `row.builders_total` → `live.builders`, `row.submissions_total` →
  `live.submissions`. Ignore `submissions_by_cycle` here.
- If `live.submissions > 0` (regardless of `lbCount`), update the
  leaderboard preview pane's empty-state copy from "no entries yet"
  to something accurate, e.g. "no ranks yet · {N} submitted". (Small
  copy nudge; keep the structure of the existing branch.)

### Participation pane layout

```
┌─ PARTICIPATION ────────────── live · 60s cache ┐
│ submissions total            7                  │
│ ─────────────────────────────────────────────── │
│ ● cycle 01  live             3                  │
│   cycle 02                   —  soon            │
│   cycle 03                   —  soon            │
│   cycle 04                   —  soon            │
│   cycle 05                   —  soon            │
│   cycle 06                   —  soon            │
└─────────────────────────────────────────────────┘
```

- `Pane` with `title="participation"`. Hint: `"live · 60s cache"` when
  the RPC returned data, `"static"` when it failed.
- Two-column grid: `gridTemplateColumns: "1fr auto"`, ~`6px 12px` gap.
- Total submissions row on top, then a horizontal divider
  (`border-t border-hair`), then 6 cycle rows.
- Current cycle: `text-ember` dot (`●`) prefix, bold label, bold count.
- Past cycle: regular label, plain count.
- Future cycle: `text-faint` label, em-dash (`—`) for the count, inline
  `soon` in `text-faint` ~11px next to the label.
- Iterate `Array.from({ length: TOTAL_CYCLES }, (_, i) => i + 1)`.

### Key Files
- `apps/web/supabase/migrations/0008_program_stats.sql` — new (replaces
  the stale in-progress draft `0008_cycle_participation.sql`).
- `apps/web/app/leaderboard/page.tsx` — modify.
- `apps/web/app/page.tsx` — modify `fetchLiveCounters`, update empty-
  state hint copy.

### Existing Code to Leverage
- `fetchLiveCounters` in `apps/web/app/page.tsx:37-54` — copy/adapt the
  try/catch + array-of-one parse pattern.
- `createClient` from `apps/web/lib/supabase/server.ts`.
- `getCycleInfo()` + `TOTAL_CYCLES` from `apps/web/lib/cycle.ts`.
- `Pane`, `Grid`, `S`, `SDot` from `@workspace/ui/kit`.
- Theme tokens already defined in `packages/ui/src/styles/globals.css`:
  `text-ember`, `text-faint`, `border-hair`, `text-ink`.

## Edge Cases
- **RPC fails / returns null**: render the pane with `0` for totals
  and all cycles, hint label = `"static"`, no live dot. Don't crash.
- **`submissions_by_cycle` is empty `{}`**: each cycle row defaults to
  its phase-appropriate display (past/current → `0`, future → `soon`).
- **Program is over (`cycleInfo.isOver`)**: all 6 cycles render as
  past with their final counts. No future cycles shown.
- **Cycle 07+ keys appear in `submissions_by_cycle`** (corruption):
  ignore — only render keys `1..TOTAL_CYCLES`.
- **Mid-program data drift** (e.g. `cycle = 0` row): also ignored by
  the same range filter.

## Failed / Reverted Approaches
- An earlier in-progress edit added a `<S k="submitted">` chip to the
  status bar AND replaced the broken `<S k="builders">` count with a
  real value. Decision: the new pane is the single source of truth;
  the `builders` chip is removed entirely, no `submitted` chip added.
- An earlier in-progress migration `0008_cycle_participation.sql`
  created a parallel RPC alongside `get_landing_counters`. Final spec
  replaces (drops + creates) instead — single RPC, single name.

## Open Questions
None blocking.

---

**Implementation note**: the workspace has uncommitted edits to
`apps/web/app/leaderboard/page.tsx` and the stale migration draft
`apps/web/supabase/migrations/0008_cycle_participation.sql` from
before this spec was finalized. Before reimplementing: `/clear` for a
fresh context, then `git restore apps/web/app/leaderboard/page.tsx`
and `rm apps/web/supabase/migrations/0008_cycle_participation.sql` so
implementation starts from a clean tree.
