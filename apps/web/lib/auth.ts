import "server-only";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "garage_session";
export const NONCE_COOKIE = "garage_nonce";

const ISSUER = "circles/garage";
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;
const NONCE_TTL_SECONDS = 5 * 60;

export type SessionClaims = { address: `0x${string}` };
export type NonceClaims = { nonce: string };

function getSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "AUTH_SESSION_SECRET is missing or shorter than 32 bytes. Generate one with `openssl rand -hex 32` and set it in apps/web/.env.local.",
    );
  }
  return new TextEncoder().encode(secret);
}

function getAudience(): string {
  const aud = process.env.AUTH_AUDIENCE;
  if (aud && aud.length > 0) return aud;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "AUTH_AUDIENCE is required in production. Set it to the public domain, e.g. builder.circles.garage.",
    );
  }
  return "localhost";
}

export function makeNonce(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  let out = "";
  for (let i = 0; i < bytes.length; i++) {
    out += bytes[i]!.toString(16).padStart(2, "0");
  }
  return out;
}

export async function signSession(address: `0x${string}`): Promise<string> {
  return await new SignJWT({ address })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(ISSUER)
    .setAudience(getAudience())
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySession(
  token: string,
): Promise<SessionClaims | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      issuer: ISSUER,
      audience: getAudience(),
    });
    const address = payload.address;
    if (typeof address !== "string" || !address.startsWith("0x")) return null;
    return { address: address as `0x${string}` };
  } catch {
    return null;
  }
}

export async function readSession(): Promise<SessionClaims | null> {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  return verifySession(raw);
}

export async function signNonce(nonce: string): Promise<string> {
  return await new SignJWT({ nonce })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(ISSUER)
    .setAudience(getAudience())
    .setIssuedAt()
    .setExpirationTime(`${NONCE_TTL_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifyNonce(token: string): Promise<NonceClaims | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      issuer: ISSUER,
      audience: getAudience(),
    });
    const nonce = payload.nonce;
    if (typeof nonce !== "string") return null;
    return { nonce };
  } catch {
    return null;
  }
}

export const SIGNUP_STATEMENT =
  "circles/garage — sign in to register as a builder.";

export const RESERVED_HANDLES: ReadonlySet<string> = new Set([
  "admin",
  "root",
  "api",
  "signup",
  "register",
  "login",
  "logout",
  "builders",
  "garage",
  "circles",
  "leaderboard",
  "dashboard",
  "settings",
  "support",
  "help",
  "about",
  "terms",
  "privacy",
  "www",
  "app",
  "mail",
  "static",
  "assets",
  "system",
  "null",
  "undefined",
]);
