-- Live counters for the landing page.
--
-- The anon role has insert-only RLS on `builders` and `submissions`
-- (see 0001_init.sql) — it cannot SELECT row data. This RPC returns
-- aggregate counts only, running as `security definer` so it bypasses
-- RLS to compute the counts but never returns row contents.

create or replace function public.get_landing_counters()
returns table(builders_count bigint, submissions_count bigint)
language sql
security definer
set search_path = public
as $$
  select
    (select count(*) from public.builders)::bigint   as builders_count,
    (select count(*) from public.submissions)::bigint as submissions_count;
$$;

revoke all on function public.get_landing_counters() from public;
grant execute on function public.get_landing_counters() to anon;
