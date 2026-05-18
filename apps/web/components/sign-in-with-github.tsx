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
  const [handedOff, setHandedOff] = useState(false);
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

      const { sdk } = await import("@farcaster/miniapp-sdk");
      const inMiniApp = await sdk.isInMiniApp().catch(() => false);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${baseOrigin}/auth/callback?next=${encodeURIComponent(target)}`,
          skipBrowserRedirect: inMiniApp,
        },
      });
      if (error) {
        setErr(error.message);
        setLoading(false);
        return;
      }
      if (inMiniApp && data?.url) {
        await sdk.actions.openUrl(data.url);
        setHandedOff(true);
        setLoading(false);
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Sign-in failed.");
      setLoading(false);
    }
  };

  const btnLabel = loading
    ? "redirecting…"
    : handedOff
      ? "opened in browser — finish there"
      : label;

  return (
    <div>
      <Btn
        primary={primary && !ember}
        ember={ember}
        onClick={onClick}
        disabled={loading}
      >
        {btnLabel}
      </Btn>
      {handedOff && (
        <div className="mt-3 font-mono text-[11px] text-faint">
          sign in completes in your browser. return here when done.
        </div>
      )}
      {err && (
        <div className="mt-3 font-mono text-[11px] text-ink">! {err}</div>
      )}
    </div>
  );
}
