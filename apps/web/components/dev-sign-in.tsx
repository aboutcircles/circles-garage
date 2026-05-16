"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Btn } from "@workspace/ui/kit";
import { createClient } from "@/lib/supabase/client";

const DEV_PASSWORD = "dev-password-1234";

function userNameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "dev";
  return local.replace(/[^a-z0-9-]/gi, "-").slice(0, 39) || "dev";
}

type Props = {
  next?: string;
};

export function DevSignIn({ next }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (process.env.NODE_ENV === "production") return null;

  const onClick = async () => {
    setErr(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const trimmed = email.trim();
      if (!trimmed) {
        setErr("enter an email");
        setLoading(false);
        return;
      }

      const signIn = await supabase.auth.signInWithPassword({
        email: trimmed,
        password: DEV_PASSWORD,
      });

      if (signIn.error) {
        // User doesn't exist yet — create them. Local stack has
        // enable_confirmations=false so this returns a session immediately.
        const user_name = userNameFromEmail(trimmed);
        const signUp = await supabase.auth.signUp({
          email: trimmed,
          password: DEV_PASSWORD,
          options: { data: { user_name } },
        });
        if (signUp.error) {
          setErr(signUp.error.message);
          setLoading(false);
          return;
        }
      }

      const target = next ?? pathname ?? "/";
      router.refresh();
      router.push(target);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Sign-in failed.");
      setLoading(false);
    }
  };

  return (
    <div className="mt-5 border-t border-dashed border-hair pt-4">
      <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
        dev only · email sign-in
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.dev"
          className="min-w-0 flex-1 border border-hair bg-paper px-2 py-1 font-mono text-xs text-ink placeholder:text-faint focus:border-ink focus:outline-none"
          autoComplete="off"
          spellCheck={false}
        />
        <Btn sm onClick={onClick} disabled={loading}>
          {loading ? "..." : "sign in →"}
        </Btn>
      </div>
      <div className="mt-2 font-mono text-[10px] text-faint">
        creates the user on first use · skips github oauth · NODE_ENV ={" "}
        {process.env.NODE_ENV}
      </div>
      {err && (
        <div className="mt-2 font-mono text-[11px] text-ink">! {err}</div>
      )}
    </div>
  );
}
