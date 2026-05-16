import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPublicOrigin } from "@/lib/origin";

/**
 * Brand-link target — clicking the "garage" wordmark in any chrome row
 * lands here. Logged-in users go to /dashboard, everyone else to the
 * landing page.
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const dest = user ? "/dashboard" : "/";
  return NextResponse.redirect(`${getPublicOrigin(request)}${dest}`, {
    status: 303,
  });
}
