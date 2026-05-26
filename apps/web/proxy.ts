import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/server";

export async function proxy(request: NextRequest) {
  // Canonical agent-skill file is /SKILL.md (matches Tempo convention
  // and the prompt shipped on the landing). Forward the lowercase alias
  // so builders sharing the URL can paste either case. Strict equality
  // keeps /SKILL.md serving normally — only the exact lowercase variant
  // 308s.
  if (request.nextUrl.pathname === "/skill.md") {
    return NextResponse.redirect(new URL("/SKILL.md", request.url), 308);
  }
  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.svg|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
