import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCycleInfo } from "@/lib/cycle";
import { LiveCountdown } from "@/components/live-countdown";
import { SignInPrompt } from "@/components/sign-in-prompt";
import { UserBadge } from "@/components/user-badge";
import {
  Btn,
  Field,
  Grid,
  Hero,
  Page,
  Pane,
  Pill,
  S,
  SDot,
  Section,
} from "@workspace/ui/kit";

type BuilderRow = {
  handle: string;
  reach: string;
  circles_addr: string;
  org_addr: string;
  team: string[] | null;
  app_name: string;
  track: string | null;
  pitch: string | null;
  github_login: string | null;
};

type SubmissionRow = {
  id: string;
  app_name: string;
  slug: string;
  pitch: string;
  track: string | null;
  status: string;
  cycle: number;
  live_url: string;
  repo_url: string | null;
  created_at: string;
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const cycleInfo = getCycleInfo();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <Page
        screen="03 Dashboard"
        scroll
        status={
          <>
            <S k="cycle" v={cycleInfo.cycleLabel} accent />
            <SDot />
            <S
              k="snapshot"
              v={<LiveCountdown targetMs={cycleInfo.endsAtMs} />}
              accent
            />
          </>
        }
        breadcrumb="dashboard · signed-out"
      >
        <Grid cols={1} gap={12} fill>
          <Pane title="dashboard" hint="builder home">
            <SignInPrompt intent="dashboard" next="/dashboard" />
          </Pane>
        </Grid>
      </Page>
    );
  }

  const githubLogin =
    (user.user_metadata?.user_name as string | undefined) ?? "you";

  const { data: builder } = await supabase
    .from("builders")
    .select(
      "handle,reach,circles_addr,org_addr,team,app_name,track,pitch,github_login",
    )
    .eq("user_id", user.id)
    .maybeSingle<BuilderRow>();

  if (!builder) redirect("/signup");

  const { data: submissionsData } = await supabase
    .from("submissions")
    .select(
      "id,app_name,slug,pitch,track,status,cycle,live_url,repo_url,created_at",
    )
    .eq("user_id", user.id)
    .order("cycle", { ascending: false })
    .order("created_at", { ascending: false });

  const submissions = (submissionsData ?? []) as SubmissionRow[];
  const currentCycleSubs = submissions.filter((s) => s.cycle === cycleInfo.cycle);
  const pastSubs = submissions.filter((s) => s.cycle !== cycleInfo.cycle);
  const hasCurrent = currentCycleSubs.length > 0;

  return (
    <Page
      screen="03 Dashboard"
      scroll
      status={
        <>
          <S k="you" v={`@${githubLogin}`} accent />
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
      breadcrumb={`signed-in · @${githubLogin}${
        builder.org_addr ? ` · org: ${builder.org_addr}` : ""
      }`}
    >
      <Grid cols="1.4fr 1fr" gap={12} fill>
        <Pane title="dashboard" hint={`cycle ${cycleInfo.cycleLabel}`} span={2}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <Hero
              size="md"
              sub={
                hasCurrent
                  ? `you've submitted for cycle ${cycleInfo.cycleLabel}. snapshot fires in ${cycleInfo.countdownLabel}.`
                  : `cycle ${cycleInfo.cycleLabel} closes in ${cycleInfo.countdownLabel} · submit a mini-app to be eligible.`
              }
            >
              hello, @{githubLogin}.
            </Hero>
            <div className="flex gap-2">
              {!hasCurrent && (
                <Btn primary href="/register">
                  + submit mini-app
                </Btn>
              )}
              <Btn href="/leaderboard">leaderboard</Btn>
            </div>
          </div>
        </Pane>

        <Pane
          title="your submissions"
          hint={
            submissions.length === 0
              ? "none yet"
              : `${submissions.length} total · ${currentCycleSubs.length} this cycle`
          }
        >
          {submissions.length === 0 ? (
            <div className="py-6 font-mono text-[13px] leading-[1.7]">
              <div className="text-faint">
                nothing submitted yet. submit your first mini-app to be eligible
                for cycle {cycleInfo.cycleLabel}.
              </div>
              <div className="mt-4">
                <Btn primary href="/register">
                  + submit mini-app
                </Btn>
              </div>
              <div className="mt-3 font-mono text-[11px] text-faint">
                ↳ new to mini-apps?{" "}
                <a
                  href="https://docs.aboutcircles.com/miniapps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-b border-ink text-ink hover:bg-ghost"
                >
                  skim the docs
                </a>
              </div>
            </div>
          ) : (
            <>
              {currentCycleSubs.length > 0 && (
                <Section
                  num="01"
                  label={`cycle ${cycleInfo.cycleLabel}`}
                  hint="this cycle"
                >
                  {currentCycleSubs.map((s) => (
                    <SubmissionRowView key={s.id} sub={s} />
                  ))}
                </Section>
              )}
              {pastSubs.length > 0 && (
                <Section num="02" label="past cycles" hint="archive">
                  {pastSubs.map((s) => (
                    <SubmissionRowView key={s.id} sub={s} />
                  ))}
                </Section>
              )}
            </>
          )}
        </Pane>

        <Pane title="your builder profile" hint="from signup">
          <Field label="handle" value={builder.handle} />
          <Field label="reach" value={builder.reach} />
          <Field label="circles addr" value={builder.circles_addr} />
          <Field label="org addr" value={builder.org_addr} />
          {builder.team && builder.team.length > 0 && (
            <Field label="team" value={builder.team.join(", ")} />
          )}
          <Field label="app name" value={builder.app_name} />
          {builder.track && <Field label="track" value={builder.track} />}
          {builder.pitch && <Field label="pitch" value={builder.pitch} />}
        </Pane>
      </Grid>
    </Page>
  );
}

function SubmissionRowView({ sub }: { sub: SubmissionRow }) {
  return (
    <div className="grid items-start gap-3 border-b border-dotted border-hair py-3 last:border-b-0">
      <div className="flex flex-wrap items-baseline gap-2">
        <span className="font-mono text-base font-bold tracking-[-0.3px]">
          {sub.app_name}
        </span>
        <span className="font-mono text-[11px] text-faint">/{sub.slug}</span>
        <Pill className="ml-auto">{sub.status}</Pill>
      </div>
      <div className="font-mono text-xs text-faint">{sub.pitch}</div>
      <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-faint">
        <span>cycle {String(sub.cycle).padStart(2, "0")}</span>
        {sub.track && (
          <>
            <span>·</span>
            <span>{sub.track}</span>
          </>
        )}
        <span>·</span>
        <a
          href={sub.live_url}
          target="_blank"
          rel="noopener noreferrer"
          className="border-b border-ink text-ink hover:bg-ghost"
        >
          live ↗
        </a>
        {sub.repo_url && (
          <>
            <span>·</span>
            <a
              href={sub.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="border-b border-ink text-ink hover:bg-ghost"
            >
              repo ↗
            </a>
          </>
        )}
      </div>
    </div>
  );
}
