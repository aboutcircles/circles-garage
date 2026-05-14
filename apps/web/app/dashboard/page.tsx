import { content } from "@/lib/content";
import type { App } from "@/lib/content";
import {
  Btn,
  Grid,
  Hero,
  Page,
  Pane,
  S,
  SDot,
  StatStrip,
} from "@workspace/ui/kit";

export default function DashboardPage() {
  const me = content.me;
  const p = content.program;

  const liveApps = me.apps.filter((a) => a.status === "LIVE");
  const draftApps = me.apps.filter((a) => a.status === "DRAFT");
  const openTodos = me.todos.filter((t) => !t.done);

  return (
    <Page
      screen="03 Dashboard"
      status={
        <>
          <S k="you" v={me.handle} accent />
          <SDot />
          <S k="rank" v={"#" + String(me.rank).padStart(2, "0")} accent />
          <SDot />
          <S k="payout" v={me.projectedPayout} accent />
          <SDot />
          <S k="snapshot" v={p.snapshotIn} />
        </>
      }
      breadcrumb={`signed-in · ${me.address} · org: ${me.org}`}
    >
      <Grid cols="1.4fr 1fr" rows="auto auto 1fr" gap={12} fill>
        {/* hero (full width) */}
        <Pane
          title="dashboard"
          hint={`cycle ${p.cycle} · welcome back`}
          span={2}
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <Hero
              size="md"
              sub={`Cycle ${p.cycle} snapshot in ${p.snapshotIn}. Keep moving.`}
            >
              hello, {me.handle}.
            </Hero>
            <div className="flex gap-2">
              <Btn sm>edit profile</Btn>
              <Btn sm primary href="/register">
                + submit mini-app
              </Btn>
            </div>
          </div>
          <div className="mt-4">
            <StatStrip
              items={[
                {
                  k: "rank · this week",
                  v: "#" + String(me.rank).padStart(2, "0"),
                  d: `was #${String(me.rankPrev).padStart(2, "0")} last week`,
                },
                {
                  k: "new minters · 7d",
                  v: me.newMinters7d,
                  d: `across ${liveApps.length} apps`,
                },
                {
                  k: "projected payout",
                  v: me.projectedPayout,
                  d: `incl. ${me.streakBonus} streak bonus`,
                },
                {
                  k: "circle of life",
                  v: `${me.coLifeWeeks} wks`,
                  d: "don't break it",
                },
              ]}
            />
          </div>
        </Pane>

        {/* mini-apps (left, spans 2 rows) */}
        <Pane
          title="your mini-apps"
          hint={`${liveApps.length} live · ${draftApps.length} draft`}
          rowSpan={2}
        >
          {me.apps.map((a) => (
            <AppRow key={a.name} app={a} />
          ))}
          <div className="mt-3.5 flex items-center gap-3">
            <Btn sm>+ register another</Btn>
            <span className="font-mono text-[11px] text-faint">
              3 mini-apps max per org
            </span>
          </div>
        </Pane>

        {/* right: pool */}
        <Pane title={`pool · cycle ${p.cycle}`} hint="your share">
          <div className="font-mono text-[30px] font-bold tracking-[-0.8px]">
            {me.projectedPayout}
          </div>
          <div className="mt-2.5 flex h-5 border border-ink font-mono text-[10px]">
            <div
              className="flex items-center bg-ink px-2 text-paper"
              style={{ width: "66.6%" }}
            >
              ⅔ winners · {p.poolSplit.winnersAmt}
            </div>
            <div className="flex flex-1 items-center px-2">⅓ life</div>
          </div>
          <div className="mt-2.5 font-mono text-[11px] leading-[1.6] text-faint">
            ~ {me.projectedPayout} = your projected share
            <br />
            {me.streakBonus} streak bonus ({me.coLifeWeeks}w)
          </div>
        </Pane>

        {/* right: activity + todo */}
        <Grid cols={2} gap={12}>
          <Pane title="activity" hint="tail -f">
            <div className="font-mono text-xs leading-[1.85]">
              {me.activity.map((a, i) => (
                <div key={i}>
                  <span className="mr-2 text-faint">{a.t}</span>
                  {a.body}
                </div>
              ))}
            </div>
          </Pane>

          <Pane title="todo" hint={`${openTodos.length} open`}>
            <div className="font-mono text-[13px] leading-[2]">
              {me.todos.map((t, i) => (
                <div
                  key={i}
                  className={
                    "flex justify-between gap-2 " +
                    (t.done ? "text-faint line-through" : "text-ink")
                  }
                >
                  <span>
                    [{t.done ? "x" : " "}] {t.body}
                  </span>
                  {t.hint && (
                    <span className="text-[11px] text-faint">· {t.hint}</span>
                  )}
                </div>
              ))}
            </div>
          </Pane>
        </Grid>
      </Grid>
    </Page>
  );
}

function AppRow({ app }: { app: App }) {
  const chart = app.chart;
  const hasChart = chart.length > 0;
  const max = hasChart ? Math.max(...chart, 1) : 1;

  return (
    <div
      className="grid items-center gap-4 border-b border-dotted border-hair py-3"
      style={{
        gridTemplateColumns: "1.4fr 80px auto",
        opacity: app.muted ? 0.55 : 1,
      }}
    >
      <div>
        <div className="font-mono text-base font-bold tracking-[-0.3px]">
          {app.name}
          <span className="ml-2 text-[10px] font-normal text-faint">
            [{app.status}]
          </span>
        </div>
        <div className="mt-1 max-w-[360px] text-xs text-faint">{app.line}</div>
        <div className="mt-1.5 text-[11px] text-faint">
          WAU {app.wau} · {app.vol} · streak {app.streak}
        </div>
      </div>
      <div>
        {hasChart ? (
          <svg
            width="80"
            height="32"
            viewBox={`0 0 ${chart.length * 8} 32`}
            preserveAspectRatio="none"
          >
            {chart.map((v, i) => (
              <rect
                key={i}
                x={i * 8 + 1}
                y={30 - (v / max) * 26}
                width="5"
                height={(v / max) * 26}
                fill="var(--ink)"
              />
            ))}
          </svg>
        ) : (
          <div className="flex h-8 w-20 items-center justify-center border border-dashed border-hair font-mono text-[9px] text-faint">
            NO DATA
          </div>
        )}
      </div>
      <div className="flex gap-1.5">
        <Btn sm>open</Btn>
        <Btn sm ghost>
          edit
        </Btn>
      </div>
    </div>
  );
}
