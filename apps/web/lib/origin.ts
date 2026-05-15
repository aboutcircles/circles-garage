import type { NextRequest } from "next/server";

/**
 * Returns the public origin for absolute redirects.
 *
 * Order of preference:
 *  1. NEXT_PUBLIC_SITE_URL env var (most reliable; set this in prod)
 *  2. X-Forwarded-Host + X-Forwarded-Proto (reverse-proxy headers)
 *  3. request.nextUrl.origin (works for direct hits, wrong behind proxies
 *     like DigitalOcean App Platform that present the internal localhost:PORT
 *     host to the app)
 */
export function getPublicOrigin(request: NextRequest): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (envUrl) return envUrl.replace(/\/$/, "");

  const forwardedHost = request.headers.get("x-forwarded-host");
  if (forwardedHost) {
    const proto =
      request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ??
      "https";
    return `${proto}://${forwardedHost}`;
  }

  return request.nextUrl.origin;
}
