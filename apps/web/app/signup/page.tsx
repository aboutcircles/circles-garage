import { redirect } from "next/navigation";
import { content } from "@/lib/content";
import { Grid, Page, Pane, S, SDot } from "@workspace/ui/kit";
import { createClient } from "@/lib/supabase/server";
import { SignInPrompt } from "@/components/sign-in-prompt";
import { UserBadge } from "@/components/user-badge";
import { SignupClient } from "./signup-client";

export default async function SignupPage() {
  const F = content.signup;
  const requiredCount = F.sections.reduce(
    (acc, s) => acc + s.fields.filter((f) => f.required).length,
    0,
  );

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: existing } = await supabase
      .from("builders")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (existing) redirect("/dashboard");
  }

  return (
    <Page
      screen="02 Sign up"
      scroll
      status={
        <>
          <S k="form" v="signup.txt" />
          <SDot />
          <S k="required *" v={`${requiredCount} fields`} />
          <SDot />
          <S k="time" v="~ 3 min" />
          <UserBadge />
        </>
      }
      breadcrumb="welcome / signup"
    >
      <Grid cols="2fr 1fr" gap={12} fill>
        <Pane title="signup · builder" hint="who's shipping?">
          {user ? (
            <SignupClient
              form={F}
              githubLogin={
                (user.user_metadata?.user_name as string | undefined) ?? ""
              }
            />
          ) : (
            <SignInPrompt intent="signup" next="/signup" />
          )}
        </Pane>

        <div
          className="grid min-h-0 gap-3"
          style={{ gridTemplateRows: "auto auto 1fr" }}
        >
          <Pane title="what you get" hint="benefits">
            <div className="font-mono text-xs leading-[1.9]">
              {F.benefits.map((b, i) => (
                <div key={i}>+ {b}</div>
              ))}
              {F.benefitsMuted.map((b, i) => (
                <div key={i} className="text-faint">
                  + {b}
                </div>
              ))}
            </div>
          </Pane>

          <Pane title="where to find it" hint="circles profile address">
            <div className="font-mono text-xs leading-[1.6] text-faint">
              <div className="mb-2 font-bold text-ink">from the gnosis app</div>
              <div>
                open the{" "}
                <a
                  href="https://app.gnosis.io/welcome"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-b border-ink text-ink hover:bg-ghost"
                >
                  gnosis app
                </a>
                . tap the qr icon next to your avatar.
              </div>
              <div className="my-2 border-t border-hair" />
              <div>
                copy the <span className="text-ink">profile url</span> under
                your handle — or tap <span className="text-ink">advanced</span>{" "}
                → copy the <span className="text-ink">wallet address</span>{" "}
                (0x…). either works here.
              </div>
            </div>
          </Pane>

          <Pane title="notice" hint="fine print">
            <div className="font-mono text-xs leading-[1.6] text-faint">
              <div className="mb-2 font-bold text-ink">{F.notice.head}</div>
              <div>{F.notice.body}</div>
            </div>
          </Pane>
        </div>
      </Grid>
    </Page>
  );
}
