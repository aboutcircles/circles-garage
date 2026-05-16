-- Drop app-level fields from builders.
--
-- app_name / track / pitch were collected at signup as a holdover from
-- the original single-screen wireframe. They duplicate columns on
-- `submissions` (the canonical home for app metadata) and add friction
-- to builder onboarding, so the signup form now collects only builder
-- identity.

alter table public.builders
  drop column if exists app_name,
  drop column if exists track,
  drop column if exists pitch;
