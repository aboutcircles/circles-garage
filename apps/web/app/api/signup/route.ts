import { NextResponse, type NextRequest } from "next/server";
import { SiweMessage } from "siwe";
import { createPublicClient, getAddress, http, isAddress } from "viem";
import { gnosis } from "viem/chains";

import {
  NONCE_COOKIE,
  RESERVED_HANDLES,
  SESSION_COOKIE,
  SIGNUP_STATEMENT,
  signSession,
  verifyNonce,
} from "@/lib/auth";
import { getServiceSupabase } from "@/lib/supabase";

const HANDLE_RE = /^[a-z0-9._-]{3,30}$/;
const REACH_CHANNELS = new Set(["tg", "fc", "email"] as const);
const REACH_HANDLE_MAX = 80;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SESSION_MAX_AGE = 7 * 24 * 60 * 60;

type ReachChannel = "tg" | "fc" | "email";

type SignupBody = {
  address: `0x${string}`;
  signature: `0x${string}`;
  message: string;
  handle: string;
  reach_channel: ReachChannel;
  reach_handle: string;
  org_addr?: `0x${string}` | null;
};

function bad(status: number, error: string): NextResponse {
  return NextResponse.json({ error }, { status });
}

function isHexAddress(v: unknown): v is `0x${string}` {
  return typeof v === "string" && /^0x[a-fA-F0-9]{40}$/.test(v);
}

function isHexSignature(v: unknown): v is `0x${string}` {
  return typeof v === "string" && /^0x[a-fA-F0-9]+$/.test(v) && v.length >= 4;
}

function parseBody(raw: unknown): SignupBody | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;

  if (!isHexAddress(o.address)) return null;
  if (!isHexSignature(o.signature)) return null;
  if (typeof o.message !== "string" || o.message.length === 0) return null;
  if (typeof o.handle !== "string") return null;
  if (typeof o.reach_channel !== "string") return null;
  if (!REACH_CHANNELS.has(o.reach_channel as ReachChannel)) return null;
  if (typeof o.reach_handle !== "string") return null;

  let org_addr: `0x${string}` | null = null;
  if (o.org_addr !== undefined && o.org_addr !== null) {
    if (!isHexAddress(o.org_addr)) return null;
    org_addr = o.org_addr;
  }

  return {
    address: o.address,
    signature: o.signature,
    message: o.message,
    handle: o.handle,
    reach_channel: o.reach_channel as ReachChannel,
    reach_handle: o.reach_handle,
    org_addr,
  };
}

function normaliseReachHandle(channel: ReachChannel, raw: string): string | null {
  const trimmed = raw.trim();
  if (trimmed.length === 0 || trimmed.length > REACH_HANDLE_MAX) return null;

  if (channel === "email") {
    const lower = trimmed.toLowerCase();
    if (!EMAIL_RE.test(lower)) return null;
    return lower;
  }
  if (channel === "tg") {
    return trimmed.replace(/^@+/, "");
  }
  return trimmed;
}

function originAllowed(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  const host = req.headers.get("host");
  if (!host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function checksumEq(a: string, b: string): boolean {
  try {
    return getAddress(a) === getAddress(b);
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!originAllowed(req)) return bad(403, "origin-mismatch");

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return bad(400, "body-invalid");
  }
  const body = parseBody(json);
  if (!body) return bad(400, "body-invalid");

  const nonceCookie = req.cookies.get(NONCE_COOKIE)?.value;
  if (!nonceCookie) return bad(400, "nonce-invalid");
  const nonceClaims = await verifyNonce(nonceCookie);
  if (!nonceClaims) return bad(400, "nonce-invalid");

  let siwe: SiweMessage;
  try {
    siwe = new SiweMessage(body.message);
  } catch {
    return bad(400, "message-malformed");
  }

  const reqHost = req.headers.get("host");
  if (!reqHost || siwe.domain !== reqHost) return bad(400, "message-binding");
  if (!checksumEq(siwe.address, body.address)) {
    return bad(400, "message-binding");
  }
  if (siwe.chainId !== 100) return bad(400, "message-binding");
  if (siwe.nonce !== nonceClaims.nonce) return bad(400, "message-binding");
  if (siwe.statement !== SIGNUP_STATEMENT) return bad(400, "message-binding");

  if (!isAddress(body.address)) return bad(400, "address-invalid");

  const handle = body.handle.trim().toLowerCase();
  if (!HANDLE_RE.test(handle)) return bad(400, "handle-invalid");
  if (RESERVED_HANDLES.has(handle)) return bad(400, "handle-reserved");

  const reachHandle = normaliseReachHandle(body.reach_channel, body.reach_handle);
  if (!reachHandle) return bad(400, "reach-invalid");

  let orgAddr: string | null = null;
  if (body.org_addr) {
    if (!isAddress(body.org_addr)) return bad(400, "org-invalid");
    orgAddr = body.org_addr.toLowerCase();
  }

  const rpcUrl = process.env.GNOSIS_RPC_URL;
  if (!rpcUrl) return bad(500, "rpc-misconfigured");

  const publicClient = createPublicClient({
    chain: gnosis,
    transport: http(rpcUrl),
  });

  let signatureOk: boolean;
  try {
    signatureOk = await publicClient.verifyMessage({
      address: getAddress(body.address),
      message: body.message,
      signature: body.signature,
    });
  } catch (err) {
    console.error("[signup] verifyMessage RPC error", err);
    return bad(502, "rpc-unavailable");
  }
  if (!signatureOk) return bad(401, "signature-invalid");

  const addrLower = body.address.toLowerCase();
  const supabase = getServiceSupabase();
  const { error: insertError } = await supabase.from("builders").insert({
    circles_addr: addrLower,
    handle,
    reach_channel: body.reach_channel,
    reach_handle: reachHandle,
    org_addr: orgAddr,
    signed_at: new Date().toISOString(),
    signature: body.signature,
    nonce: nonceClaims.nonce,
  });

  if (insertError) {
    if (insertError.code === "23505") {
      return bad(409, "handle-or-address-taken");
    }
    console.error("[signup] insert error", insertError);
    return bad(500, "insert-failed");
  }

  const token = await signSession(addrLower as `0x${string}`);
  const res = NextResponse.json({
    ok: true,
    address: addrLower,
    handle,
  });
  res.cookies.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  res.cookies.set({
    name: NONCE_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
