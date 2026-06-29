import { redirect } from "next/navigation";
import { content } from "@/lib/content";
import { getCycleInfo, SUBMISSIONS_OPEN } from "@/lib/cycle";
import { EventClosed } from "@/components/event-closed";
import { LiveCountdown } from "@/components/live-countdown";
import { SignInPrompt } from "@/components/sign-in-prompt";
import { UserBadge } from "@/components/user-badge";
import { createClient } from "@/lib/supabase/server";
import { Grid, Page, Pane, S, SDot } from "@workspace/ui/kit";
import { RegisterClient, type SubmissionRow } from "./register-client";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  // Program's over: no form, no DB queries — just the closed notice.
  if (!SUBMISSIONS_OPEN) {
    return (
      <EventClosed
        screen="05 Submit mini-app"
        breadcrumb="dashboard / mini-apps / closed"
      />
    );
  }

  const d = content.draft;
  const cycleInfo = getCycleInfo();
  const { from } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let existingSubmission: SubmissionRow | null = null;
  let prefill: SubmissionRow | null = null;
  let hasPastEntriesWithSameSlug = false;

  if (user) {
    // Require a builder row before letting anyone fill out a submission —
    // otherwise the form 500s on submit from the no_builder guard.
    const { data: builder } = await supabase
      .from("builders")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!builder) redirect("/signup");

    const { data } = await supabase
      .from("submissions")
      .select(
        "app_name, slug, pitch, track, status, cycle, live_url, repo_url, contracts, readme",
      )
      .eq("user_id", user.id)
      .eq("cycle", cycleInfo.cycle)
      .maybeSingle();
    existingSubmission = (data as SubmissionRow | null) ?? null;

    // Resubmit pre-fill: only honour `?from=` when there's no current-cycle
    // row yet (otherwise we'd clobber the edit-in-progress).
    if (from && !existingSubmission) {
      const { data: seed, error: seedErr } = await supabase
        .from("submissions")
        .select(
          "app_name, slug, pitch, track, status, cycle, live_url, repo_url, contracts, readme",
        )
        .eq("user_id", user.id)
        .eq("id", from)
        .maybeSingle();
      if (seedErr) {
        // Silently fall through to "new submission" — a malformed `from`
        // shouldn't 500, but we log so it's visible if the dashboard ever
        // hands us a bad id.
        console.error("register prefill seed failed:", seedErr);
      }
      const seedRow = (seed as SubmissionRow | null) ?? null;
      if (seedRow && seedRow.cycle < cycleInfo.cycle) {
        prefill = seedRow;
      }
    }

    // If a current-cycle row exists, also check whether the same slug has
    // any past-cycle siblings — the changelog field becomes required then.
    if (existingSubmission?.slug) {
      const { data: priors } = await supabase
        .from("submissions")
        .select("id")
        .eq("user_id", user.id)
        .eq("slug", existingSubmission.slug)
        .neq("cycle", cycleInfo.cycle)
        .limit(1);
      hasPastEntriesWithSameSlug = (priors?.length ?? 0) > 0;
    }
  }

  const breadcrumb = prefill
    ? `dashboard / mini-apps / resubmit ${prefill.app_name}`
    : existingSubmission
      ? "dashboard / mini-apps / editing"
      : "dashboard / mini-apps / new submission";

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
      breadcrumb={breadcrumb}
    >
      <Grid cols="2fr 1fr" gap={12} fill>
        <Pane title="submit mini-app · drop the goods" hint="4 steps">
          {!user ? (
            <SignInPrompt intent="submit" next="/register" />
          ) : (
            <RegisterClient
              draft={d}
              existing={existingSubmission}
              prefill={prefill}
              currentCycleLabel={cycleInfo.cycleLabel}
              countdown={cycleInfo.countdownLabel}
              hasPastEntriesWithSameSlug={hasPastEntriesWithSameSlug}
            />
          )}
        </Pane>

        <div
          className="grid min-h-0 gap-3"
          style={{ gridTemplateRows: "auto auto 1fr" }}
        >
          <Pane title="how we judge" hint="holistic · per cycle">
            <div className="font-mono text-xs leading-[1.7]">
              {content.judging.map((j) => (
                <div key={j.num} className="mb-2.5 last:mb-0">
                  <div className="text-ink">
                    {j.num}. {j.name}
                  </div>
                  <div className="text-faint">↳ {j.body}</div>
                </div>
              ))}
            </div>
          </Pane>

          <Pane title="docs · for builders" hint="miniapps">
            <div className="font-mono text-xs leading-[1.65]">
              <div className="mb-2 text-faint">
                how mini-apps plug into circles.
              </div>
              <a
                href="https://docs.aboutcircles.com/miniapps"
                target="_blank"
                rel="noopener noreferrer"
                className="border-b border-ink text-ink hover:bg-ghost"
              >
                → docs.aboutcircles.com/miniapps
              </a>
            </div>
          </Pane>

          <Pane
            title="snapshot"
            hint={`auto · ${cycleInfo.endsAtLabel} 23:59 CET`}
          >
            <div className="font-mono text-xs leading-[1.6] text-faint">
              <div className="mb-2 font-bold text-ink">
                in <LiveCountdown targetMs={cycleInfo.endsAtMs} />
              </div>
              <div>
                cycles run monday → sunday · we check submissions every sunday
                at 23:59 CET. cycle 01 runs mon 18 may → sun 24 may. each
                submit replaces your current entry · the latest version at
                check time is what we judge.
              </div>
            </div>
          </Pane>
        </div>
      </Grid>
    </Page>
  );
}
