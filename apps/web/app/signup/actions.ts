"use server";

import { createClient } from "@/lib/supabase/server";

export type SignupInput = {
  handle: string;
  reach: string;
  circles_addr: string;
  org_addr: string;
  team: string[];
  app_name: string;
  track: string | null;
  pitch: string | null;
};

export type SignupResult =
  | { ok: true }
  | { ok: false; code: "unauthenticated" | "duplicate" | "unknown"; message: string };

export async function createBuilder(input: SignupInput): Promise<SignupResult> {
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

  const { error } = await supabase.from("builders").insert({
    user_id: user.id,
    handle: input.handle,
    reach: input.reach,
    circles_addr: input.circles_addr,
    org_addr: input.org_addr,
    team: input.team,
    app_name: input.app_name,
    track: input.track,
    pitch: input.pitch,
  });

  if (error) {
    const code = (error as { code?: string }).code;
    if (code === "23505") {
      return {
        ok: false,
        code: "duplicate",
        message:
          "you're already signed up under this github account. go to /dashboard.",
      };
    }
    return { ok: false, code: "unknown", message: error.message };
  }

  return { ok: true };
}
