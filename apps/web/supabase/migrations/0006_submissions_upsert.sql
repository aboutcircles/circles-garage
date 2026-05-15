-- Allow builders to resubmit (overwrite) their own submission within a
-- cycle. We rely on a (user_id, cycle) unique index + upsert in the
-- server action; that needs an UPDATE policy in addition to the INSERT
-- policy already created in 0004.

create policy "auth update own submission" on public.submissions
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
