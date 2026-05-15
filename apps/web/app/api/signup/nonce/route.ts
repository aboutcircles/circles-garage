import { NextResponse } from "next/server";

import { NONCE_COOKIE, makeNonce, signNonce } from "@/lib/auth";

/**
 * GET /api/signup/nonce
 *
 * Issues a fresh nonce. Stored in a 5-min HttpOnly signed JWT cookie
 * (`garage_nonce`); also returned in the JSON body so the client can build
 * the signed message without parsing the cookie. POST /api/signup consumes
 * the cookie (clears it) — that's what makes the nonce single-use.
 */
export async function GET(): Promise<NextResponse> {
  const nonce = makeNonce();
  const token = await signNonce(nonce);

  const res = NextResponse.json({ ok: true, nonce });
  res.cookies.set({
    name: NONCE_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 300,
  });
  return res;
}
