-- /signup rewrite: builders holds the person, submissions holds the work.
-- Tighten builders to identity + contact + audit fields; split the freeform
-- `reach` column into an explicit channel + handle pair; revoke the open-door
-- anon insert policies on both tables (writes now go through API routes that
-- verify a wallet signature first). builders is empty in prod, so the
-- destructive `drop column` is safe. All statements are idempotent.

-- builders: drop app/team columns — those live on a submission, not a person.
alter table public.builders
  drop column if exists app_name,
  drop column if exists track,
  drop column if exists pitch,
  drop column if exists team;

alter table public.builders
  alter column org_addr drop not null;

-- Replace the freeform `reach text` with an explicit channel + handle pair.
-- Table is empty in prod, so we can drop and replace without a backfill.
alter table public.builders
  drop column if exists reach,
  add column if not exists reach_channel text,
  add column if not exists reach_handle  text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'builders_reach_channel_chk'
  ) then
    alter table public.builders
      add constraint builders_reach_channel_chk
        check (reach_channel in ('tg', 'fc', 'email'));
  end if;
end$$;

-- Audit trail for the SIWE-style signature we required to insert.
alter table public.builders
  add column if not exists signed_at  timestamptz,
  add column if not exists signature  text,
  add column if not exists nonce      text;

-- Treat the on-chain address as identity (case-insensitive). Handle is
-- display-only and must also be unique to keep the leaderboard sane.
create unique index if not exists builders_circles_addr_uniq
  on public.builders (lower(circles_addr));
create unique index if not exists builders_handle_uniq
  on public.builders (lower(handle));

-- Submissions: tie each to the submitter's CRC v2 address. No FK to
-- builders.id needed — the address is the identity.
alter table public.submissions
  add column if not exists submitter_addr text;

create index if not exists submissions_submitter_addr_idx
  on public.submissions (lower(submitter_addr));

-- Revoke the open-door insert policies. All writes now go through API
-- routes that verify a signature first.
drop policy if exists "anon insert builders"   on public.builders;
drop policy if exists "anon insert submissions" on public.submissions;
