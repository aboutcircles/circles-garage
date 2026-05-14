-- Stamp each submission with the cycle it was submitted into. We don't
-- compute this server-side from created_at — the client passes the cycle
-- number it observed at submit time, so the record reflects the user's
-- intent (e.g. a submission made at 23:59:55 Sunday belongs to that cycle
-- even if it lands after the snapshot).

alter table public.submissions
  add column if not exists cycle integer not null default 1;
