import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type BuilderRow = {
  handle: string;
  reach_channel: "tg" | "fc" | "email";
  reach_handle: string;
  circles_addr: string;
  org_addr: string | null;
  signed_at: string | null;
  signature: string | null;
  nonce: string | null;
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
let _service: SupabaseClient | null = null;

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

/** Server-only: uses SUPABASE_SERVICE_ROLE_KEY. Never import from a client module. */
export function getServiceSupabase(): SupabaseClient {
  if (_service) return _service;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Missing Supabase service-role env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in apps/web/.env.local.",
    );
  }
  _service = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _service;
}
