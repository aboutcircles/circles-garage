import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type BuilderRow = {
  handle: string;
  reach: string;
  circles_addr: string;
  org_addr: string;
  team: string[];
  app_name: string;
  track: string | null;
  pitch: string | null;
};

export type SubmissionRow = {
  app_name: string;
  slug: string;
  pitch: string;
  track: string | null;
  status: string;
  cycle: number;
  contracts: { chain: string; addr: string; label: string }[];
  live_url: string;
  repo_url: string | null;
  screenshots: string[];
  readme: { what: string; why: string; try: string };
  measures: string[];
};

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "Missing Supabase env vars. Copy apps/web/.env.example → apps/web/.env.local and set NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
  _client = createClient(url, anonKey);
  return _client;
}
