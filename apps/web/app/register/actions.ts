"use server";

import { createClient } from "@/lib/supabase/server";
import { getCycleInfo } from "@/lib/cycle";

export type SubmissionInput = {
  app_name: string;
  slug: string;
  pitch: string;
  track: string | null;
  contracts: { chain: string; addr: string; label: string }[];
  live_url: string;
  repo_url: string | null;
  notes: string;
  changelog: string;
};

export type SubmissionResult =
  | { ok: true; cycle: number }
  | {
      ok: false;
      code:
        | "unauthenticated"
        | "no_builder"
        | "missing_changelog"
        | "unknown";
      message: string;
    };

export async function createSubmission(
  input: SubmissionInput,
): Promise<SubmissionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      code: "unauthenticated",
      message: "you're signed out. refresh the page and sign in again.",
    };
  }

  const { data: builder } = await supabase
    .from("builders")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!builder) {
    return {
      ok: false,
      code: "no_builder",
      message: "finish signing up before submitting a mini-app.",
    };
  }

  const cycle = getCycleInfo().cycle;

  // If this slug already exists in a past cycle for this user, treat it as
  // a resubmit and require the builder to write what changed this cycle.
  // The message names the past entry so the user knows what they're
  // colliding with and can pick a recovery path (resubmit from dashboard,
  // or change the slug here). If the lookup itself fails we fail closed
  // rather than silently bypassing the changelog gate.
  const { data: pastWithSlug, error: pastErr } = await supabase
    .from("submissions")
    .select("app_name, cycle")
    .eq("user_id", user.id)
    .eq("slug", input.slug)
    .neq("cycle", cycle)
    .order("cycle", { ascending: false })
    .limit(1);

  if (pastErr) {
    console.error("submissions past-slug lookup failed:", pastErr);
    return {
      ok: false,
      code: "unknown",
      message:
        "we couldn't validate your submission. try again — refresh the page if it keeps failing.",
    };
  }

  const past = pastWithSlug?.[0];

  if (past && input.changelog.trim() === "") {
    const pastCycleLabel = String(past.cycle).padStart(2, "0");
    return {
      ok: false,
      code: "missing_changelog",
      message: `slug "${input.slug}" was used by ${past.app_name} in cycle ${pastCycleLabel}. add a "what changed this cycle" note to resubmit it, or change the slug above for a separate project.`,
    };
  }

  // Note: `screenshots` and `measures` columns still exist in the schema
  // but are no longer collected by the form. Omit them from the upsert
  // payload so resubmits don't clobber any future server-set values; the
  // column defaults (`'{}'`) fire on first insert.
  const readme = input.changelog.trim()
    ? { notes: input.notes, changelog: input.changelog }
    : { notes: input.notes };

  const { error } = await supabase.from("submissions").upsert(
    {
      user_id: user.id,
      app_name: input.app_name,
      slug: input.slug,
      pitch: input.pitch,
      track: input.track,
      status: "draft",
      cycle,
      contracts: input.contracts,
      live_url: input.live_url,
      repo_url: input.repo_url,
      readme,
    },
    { onConflict: "user_id,cycle" },
  );

  if (error) {
    console.error("submissions upsert failed:", error);
    return {
      ok: false,
      code: "unknown",
      message:
        "we couldn't save your submission. try again — refresh the page if it keeps failing.",
    };
  }

  return { ok: true, cycle };
}
