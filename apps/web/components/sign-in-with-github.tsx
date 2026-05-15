"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Btn } from "@workspace/ui/kit";
import { createClient } from "@/lib/supabase/client";

type Props = {
  next?: string;
  label?: string;
  primary?: boolean;
  ember?: boolean;
};

export function SignInWithGitHub({
  next,
  label = "sign in with github",
  primary = true,
  ember = false,
}: Props) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onClick = async () => {
    setErr(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const target = next ?? pathname ?? "/";
      const baseOrigin =
        process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
        window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${baseOrigin}/auth/callback?next=${encodeURIComponent(target)}`,
        },
      });
      if (error) {
        setErr(error.message);
        setLoading(false);
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Sign-in failed.");
      setLoading(false);
    }
  };

  return (
    <div>
      <Btn
        primary={primary && !ember}
        ember={ember}
        onClick={onClick}
        disabled={loading}
      >
        {loading ? "redirecting…" : label}
      </Btn>
      {err && (
        <div className="mt-3 font-mono text-[11px] text-ink">! {err}</div>
      )}
    </div>
  );
}
