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
  readme: { what: string; why: string; try: string };
  measures: string[];
};

export type SubmissionResult =
  | { ok: true; cycle: number }
  | {
      ok: false;
      code: "unauthenticated" | "no_builder" | "duplicate" | "unknown";
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

  const { error } = await supabase.from("submissions").insert({
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
    screenshots: [],
    readme: input.readme,
    measures: input.measures,
  });

  if (error) {
    const code = (error as { code?: string }).code;
    if (code === "23505") {
      return {
        ok: false,
        code: "duplicate",
        message: `you already have a submission in cycle ${cycle}. one app per cycle.`,
      };
    }
    return { ok: false, code: "unknown", message: error.message };
  }

  return { ok: true, cycle };
}
