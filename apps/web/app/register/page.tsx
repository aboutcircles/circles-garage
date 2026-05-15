import { content } from "@/lib/content";
import { getCycleInfo } from "@/lib/cycle";
import { LiveCountdown } from "@/components/live-countdown";
import { SignInPrompt } from "@/components/sign-in-prompt";
import { UserBadge } from "@/components/user-badge";
import { createClient } from "@/lib/supabase/server";
import { Btn, Grid, Hero, Page, Pane, S, SDot } from "@workspace/ui/kit";
import { RegisterClient } from "./register-client";

export default async function RegisterPage() {
  const d = content.draft;
  const cycleInfo = getCycleInfo();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let existingSubmission: {
    app_name: string;
    slug: string;
    live_url: string;
  } | null = null;

  if (user) {
    const { data } = await supabase
      .from("submissions")
      .select("app_name, slug, live_url")
      .eq("user_id", user.id)
      .eq("cycle", cycleInfo.cycle)
      .maybeSingle();
    existingSubmission = data ?? null;
  }

  return (
    <Page
      screen="05 Submit mini-app"
      scroll
      status={
        <>
          <S k="form" v="submission.txt" />
          <SDot />
          <S k="cycle" v={cycleInfo.cycleLabel} accent />
          <SDot />
          <S
            k="snapshot"
            v={<LiveCountdown targetMs={cycleInfo.endsAtMs} />}
            accent
          />
          <UserBadge />
        </>
      }
      breadcrumb="dashboard / mini-apps / new submission"
    >
      <Grid cols="2fr 1fr" gap={12} fill>
        <Pane title="submit mini-app · drop the goods" hint="5 steps">
          {!user ? (
            <SignInPrompt intent="submit" next="/register" />
          ) : existingSubmission ? (
            <>
              <Hero
                size="lg"
                sub={`you've already submitted for cycle ${cycleInfo.cycleLabel}. one app per cycle — edit or resubmit lands in the next snapshot.`}
              >
                you&apos;re in.
              </Hero>
              <div className="mt-7 border-t border-hair pt-4 font-mono text-xs leading-[1.6] text-faint">
                {"// "}submissions/{existingSubmission.slug} ·{" "}
                {existingSubmission.app_name}
                <br />
                {"// "}live → {existingSubmission.live_url}
              </div>
              <div className="mt-7 flex items-center gap-2.5">
                <Btn primary href="/dashboard">
                  → dashboard
                </Btn>
                <Btn href="/leaderboard">see leaderboard</Btn>
              </div>
            </>
          ) : (
            <RegisterClient draft={d} />
          )}
        </Pane>

        <div
          className="grid min-h-0 gap-3"
          style={{ gridTemplateRows: "auto auto 1fr" }}
        >
          <Pane title="what we measure" hint="default metrics">
            <div className="font-mono text-xs leading-[1.9]">
              {d.measures.map((m, i) => (
                <div key={i} className={m.on ? "" : "text-faint"}>
                  + {m.label}
                </div>
              ))}
            </div>
          </Pane>

          <Pane title="checks" hint="auto-run on submit">
            <div className="font-mono text-xs leading-[1.9] text-faint">
              {d.checks.map((c, i) => (
                <div key={i}>○ {c.label}</div>
              ))}
            </div>
          </Pane>

          <Pane title="snapshot" hint={`auto · ${cycleInfo.endsAtLabel} 23:59 CET`}>
            <div className="font-mono text-xs leading-[1.6] text-faint">
              <div className="mb-2 font-bold text-ink">
                in <LiveCountdown targetMs={cycleInfo.endsAtMs} />
              </div>
              <div>
                cycles are 7 days · auto-snapshot every sunday 23:59 CET. only
                “submit” makes a draft eligible for the next snapshot. you can
                resubmit anytime before then.
              </div>
            </div>
          </Pane>
        </div>
      </Grid>
    </Page>
  );
}
