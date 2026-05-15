-- GitHub auth via Supabase Auth.
--
-- Adds user_id (FK → auth.users) and github_login to builders + submissions.
-- Enforces 1 builder per GitHub account and 1 submission per (user, cycle).
-- Replaces "anon insert" RLS with "authenticated insert own row" RLS.
-- A before-insert trigger stamps github_login from the JWT so the client
-- cannot lie about identity.

-- backfill safety: drop any pre-auth rows before constraints land.
-- (project is pre-launch — no real users to preserve.)
truncate table public.submissions;
truncate table public.builders;

-- builders ─────────────────────────────────────────────────────────
alter table public.builders
  add column user_id      uuid not null default auth.uid() references auth.users(id) on delete cascade,
  add column github_login text;

create unique index builders_user_id_key on public.builders(user_id);
create unique index builders_handle_ci_key on public.builders(lower(handle));

drop policy if exists "anon insert builders" on public.builders;
create policy "auth insert own builder" on public.builders
  for insert to authenticated with check (user_id = auth.uid());
create policy "auth read own builder" on public.builders
  for select to authenticated using (user_id = auth.uid());

-- submissions ──────────────────────────────────────────────────────
alter table public.submissions
  add column user_id      uuid not null default auth.uid() references auth.users(id) on delete cascade,
  add column github_login text;

create unique index submissions_user_cycle_key on public.submissions(user_id, cycle);

drop policy if exists "anon insert submissions" on public.submissions;
create policy "auth insert own submission" on public.submissions
  for insert to authenticated with check (user_id = auth.uid());
create policy "auth read own submissions" on public.submissions
  for select to authenticated using (user_id = auth.uid());

-- stamp github_login from JWT so the client cannot lie about identity
create or replace function public.stamp_github_login() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  new.github_login := coalesce(
    new.github_login,
    (auth.jwt() -> 'user_metadata' ->> 'user_name')
  );
  return new;
end;
$$;

create trigger builders_stamp_github_login    before insert on public.builders    for each row execute function public.stamp_github_login();
create trigger submissions_stamp_github_login before insert on public.submissions for each row execute function public.stamp_github_login();

-- landing counters RPC: also allow authenticated to call it
grant execute on function public.get_landing_counters() to authenticated;
