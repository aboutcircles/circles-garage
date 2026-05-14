-- builders ─────────────────────────────────────────────────────────
create table public.builders (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  handle       text not null,
  reach        text not null,
  circles_addr text not null,
  org_addr     text not null,
  team         text[] not null default '{}',
  app_name     text not null,
  track        text,
  pitch        text
);

alter table public.builders enable row level security;

create policy "anon insert builders"
  on public.builders for insert to anon
  with check (true);

-- submissions ──────────────────────────────────────────────────────
create table public.submissions (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  app_name    text not null,
  slug        text not null,
  pitch       text not null,
  track       text,
  status      text not null default 'draft',
  contracts   jsonb not null default '[]'::jsonb,
  live_url    text not null,
  repo_url    text,
  screenshots text[] not null default '{}',
  readme      jsonb not null default '{}'::jsonb,
  measures    text[] not null default '{}'
);

alter table public.submissions enable row level security;

create policy "anon insert submissions"
  on public.submissions for insert to anon
  with check (true);
