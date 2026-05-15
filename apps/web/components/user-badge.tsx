import { S, SDot } from "@workspace/ui/kit";
import { createClient } from "@/lib/supabase/server";

export async function UserBadge() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const login =
    (user.user_metadata?.user_name as string | undefined) ??
    (user.user_metadata?.preferred_username as string | undefined) ??
    user.email ??
    "user";

  return (
    <>
      <SDot />
      <S
        k="signed in"
        v={
          <span className="inline-flex items-center gap-1.5">
            <span className="font-bold">@{login}</span>
            <span className="opacity-[0.55]">·</span>
            <form method="post" action="/auth/signout" className="inline">
              <button
                type="submit"
                className="cursor-pointer border-0 bg-transparent p-0 font-mono text-[11px] underline-offset-[3px] opacity-[0.55] hover:underline hover:opacity-100"
              >
                sign out
              </button>
            </form>
          </span>
        }
      />
    </>
  );
}
