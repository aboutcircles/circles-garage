import { NextResponse, type NextRequest } from "next/server";

import { readSession } from "@/lib/auth";
import { getCycleInfo } from "@/lib/cycle";
import { getServiceSupabase } from "@/lib/supabase";

const TRACKS = new Set(["payments", "social", "games", "tools", "other"]);
const MAX_CONTRACTS = 10;
const MAX_SCREENSHOTS = 10;
const MAX_MEASURES = 20;

type RawContract = { chain: string; addr: string; label: string };

type RegisterBody = {
  app_name: string;
  slug: string;
  pitch: string;
  track: string | null;
  status: string;
  contracts: RawContract[];
  live_url: string;
  repo_url: string | null;
  screenshots: string[];
  readme: { what: string; why: string; try: string };
  measures: string[];
};

function bad(status: number, error: string, hint?: string): NextResponse {
  return NextResponse.json(
    hint ? { error, hint } : { error },
    { status },
  );
}

function isStringArray(v: unknown, cap: number): v is string[] {
  return (
    Array.isArray(v) &&
    v.length <= cap &&
    v.every((x) => typeof x === "string")
  );
}

function parseContracts(v: unknown): RawContract[] | null {
  if (!Array.isArray(v)) return null;
  if (v.length > MAX_CONTRACTS) return null;
  const out: RawContract[] = [];
  for (const entry of v) {
    if (!entry || typeof entry !== "object") return null;
    const e = entry as Record<string, unknown>;
    if (
      typeof e.chain !== "string" ||
      typeof e.addr !== "string" ||
      typeof e.label !== "string"
    ) {
      return null;
    }
    out.push({ chain: e.chain, addr: e.addr, label: e.label });
  }
  return out;
}

function parseReadme(v: unknown): { what: string; why: string; try: string } | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  if (
    typeof o.what !== "string" ||
    typeof o.why !== "string" ||
    typeof o.try !== "string"
  ) {
    return null;
  }
  return { what: o.what, why: o.why, try: o.try };
}

function parseBody(raw: unknown): { body: RegisterBody } | { hint: string } {
  if (!raw || typeof raw !== "object") return { hint: "body-not-object" };
  const o = raw as Record<string, unknown>;

  if (typeof o.app_name !== "string" || o.app_name.trim() === "") {
    return { hint: "missing app_name" };
  }
  if (typeof o.slug !== "string") return { hint: "missing slug" };
  if (typeof o.pitch !== "string" || o.pitch.trim() === "") {
    return { hint: "missing pitch" };
  }
  if (typeof o.live_url !== "string" || o.live_url.trim() === "") {
    return { hint: "missing live_url" };
  }

  let track: string | null = null;
  if (o.track !== null && o.track !== undefined) {
    if (typeof o.track !== "string") return { hint: "invalid track" };
    if (o.track !== "" && !TRACKS.has(o.track)) return { hint: "invalid track" };
    track = o.track === "" ? null : o.track;
  }

  if (typeof o.status !== "string") return { hint: "missing status" };

  const contracts = parseContracts(o.contracts);
  if (contracts === null) return { hint: "invalid contracts" };

  let repo_url: string | null = null;
  if (o.repo_url !== null && o.repo_url !== undefined) {
    if (typeof o.repo_url !== "string") return { hint: "invalid repo_url" };
    repo_url = o.repo_url;
  }

  if (!isStringArray(o.screenshots, MAX_SCREENSHOTS)) {
    return { hint: "invalid screenshots" };
  }

  const readme = parseReadme(o.readme);
  if (!readme) return { hint: "invalid readme" };

  if (!isStringArray(o.measures, MAX_MEASURES)) {
    return { hint: "invalid measures" };
  }

  return {
    body: {
      app_name: o.app_name,
      slug: o.slug,
      pitch: o.pitch,
      track,
      status: o.status,
      contracts,
      live_url: o.live_url,
      repo_url,
      screenshots: o.screenshots,
      readme,
      measures: o.measures,
    },
  };
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  // CSRF guard: when an Origin header is present, it must match the request
  // host. Same-origin browser fetches set Origin; cross-origin attacks do too,
  // but with a foreign host. Enforced in dev as well — sameSite=lax already
  // blocks the easy case, this is defense in depth.
  const origin = req.headers.get("origin");
  if (origin) {
    try {
      const originHost = new URL(origin).host;
      const host = req.headers.get("host");
      if (!host || originHost !== host) {
        return bad(403, "origin-mismatch");
      }
    } catch {
      return bad(403, "origin-mismatch");
    }
  }

  const session = await readSession();
  if (!session) return bad(401, "unauthenticated");

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return bad(400, "body-invalid", "not-json");
  }

  const parsed = parseBody(json);
  if ("hint" in parsed) return bad(400, "body-invalid", parsed.hint);
  const body = parsed.body;

  const app_name = body.app_name.trim();
  const pitch = body.pitch.trim();
  const live_url = body.live_url.trim();
  const slugInput = body.slug.trim();
  const slug = slugInput === "" ? slugify(app_name) : slugInput;
  if (slug === "") return bad(400, "body-invalid", "missing slug");

  const repo_url = body.repo_url?.trim() ? body.repo_url.trim() : null;

  const cleanedContracts = body.contracts
    .map((c) => ({
      chain: c.chain.trim(),
      addr: c.addr.trim(),
      label: c.label.trim(),
    }))
    .filter((c) => c.chain || c.addr || c.label);

  const submitter_addr = session.address.toLowerCase();
  const { cycle } = getCycleInfo();

  const supabase = getServiceSupabase();
  const { error: insertError } = await supabase.from("submissions").insert({
    app_name,
    slug,
    pitch,
    track: body.track,
    status: "draft",
    cycle,
    contracts: cleanedContracts,
    live_url,
    repo_url,
    screenshots: body.screenshots,
    readme: body.readme,
    measures: body.measures,
    submitter_addr,
  });

  if (insertError) {
    if (insertError.code === "23505") {
      return bad(409, "duplicate");
    }
    console.error("[register] insert error", insertError);
    return bad(500, "insert-failed");
  }

  return NextResponse.json({ ok: true, slug });
}
