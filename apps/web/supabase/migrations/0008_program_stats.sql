-- Program-wide aggregate stats for landing + leaderboard pages.
--
-- Replaces 0002_landing_counters.sql's `get_landing_counters`. The old
-- name was misleading (it sounded like page-visit analytics) and the
-- new function adds a per-cycle submissions breakdown for the
-- /leaderboard participation pane.
--
-- Anon has insert-only RLS on `builders` and `submissions` (see
-- 0001_init.sql) — this RPC runs as `security definer` so it can
-- compute aggregate counts without exposing row data. The function
-- returns aggregates only; no row contents leave the database.
--
-- `submissions` has a unique (user_id, cycle) index from
-- 0004_github_auth.sql, so `count(*) where cycle = N` already equals
-- the number of distinct participating builders in that cycle —
-- `count(distinct ...)` is unnecessary.

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
