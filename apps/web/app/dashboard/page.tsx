import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCycleInfo } from "@/lib/cycle";
import { HotkeyEnter } from "@/components/hotkey-enter";
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
      "handle,reach,circles_addr,org_addr,team,github_login",
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
  const isFirstTime = submissions.length === 0;

  const pageStatus = (
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
  );
  const breadcrumb = `signed-in · @${githubLogin}${
    builder.org_addr ? ` · org: ${builder.org_addr}` : ""
  }`;

  if (isFirstTime) {
    return (
      <Page
        screen="03 Dashboard"
        scroll
        status={pageStatus}
        breadcrumb={breadcrumb}
      >
        <Grid cols={1} gap={12} fill>
          <Pane title="next step" hint="submit your first mini-app">
            <div className="mx-auto max-w-[640px] py-8">
              <Hero
                size="lg"
                sub={`you're signed up as @${githubLogin}. cycle ${cycleInfo.cycleLabel} closes in ${cycleInfo.countdownLabel} — submit your first mini-app to be eligible.`}
              >
                one more step.
              </Hero>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/register"
                  autoFocus
                  className="inline-flex cursor-pointer items-center gap-2 border border-ink bg-ink px-6 py-3.5 font-mono text-sm font-bold uppercase tracking-[0.04em] text-paper focus:outline-none focus:ring-2 focus:ring-ink focus:ring-offset-2 focus:ring-offset-paper"
                >
                  + submit mini-app
                </Link>
                <a
                  href="https://docs.aboutcircles.com/miniapps/what-are-circles-mini-apps.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-faint underline underline-offset-[3px] hover:text-ink"
                >
                  what&apos;s a mini-app? ↗
                </a>
              </div>
              <div className="mt-3 font-mono text-[11px] text-faint">
                ↳ press <kbd className="border border-hair px-1">enter</kbd> to
                continue
              </div>
              <HotkeyEnter href="/register" />
              <div className="mt-8 border-t border-hair pt-4 font-mono text-[11px] leading-[1.7] text-faint">
                {`// you'll add: name, pitch, live url, contract addresses, and a short readme.`}
                <br />
                {`// you can save and come back — each submit replaces the current cycle's entry.`}
              </div>
            </div>
          </Pane>
        </Grid>
      </Page>
    );
  }

  return (
    <Page
      screen="03 Dashboard"
      scroll
      status={pageStatus}
      breadcrumb={breadcrumb}
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
          hint={`${submissions.length} total · ${currentCycleSubs.length} this cycle`}
        >
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
        </Pane>

        <Pane title="your builder profile" hint="from signup">
          <Field label="handle" value={builder.handle} />
          <Field label="reach" value={builder.reach} />
          <Field label="circles addr" value={builder.circles_addr} />
          <Field label="org addr" value={builder.org_addr} />
          {builder.team && builder.team.length > 0 && (
            <Field label="team" value={builder.team.join(", ")} />
          )}
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
