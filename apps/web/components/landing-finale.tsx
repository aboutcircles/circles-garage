import { content } from "@/lib/content";
import { getCycleInfo } from "@/lib/cycle";
import { getAllTimeRows } from "@/lib/leaderboard";
import { UserBadge } from "@/components/user-badge";
import { Btn, Grid, Hero, Page, Pane, S, SDot, Table } from "@workspace/ui/kit";

export type FinaleLive = { builders: number; submissions: number };

/**
 * Public wrap-up landing, rendered by `/` once `SUBMISSIONS_OPEN`
 * (lib/cycle.ts) is false: event-over notice, a link to the closing
 * ceremony recording, the full all-time leaderboard and the program
 * totals. Copy
 * lives in `content.finale`. Renders the same signed-in or out — only the
 * hero CTAs and the status-bar badge react to auth.
 */
export function LandingFinale({
  live,
  signedIn,
}: {
  live: FinaleLive | null;
  signedIn: boolean;
}) {
  const F = content.finale;
  const cycleInfo = getCycleInfo();
  const allTime = getAllTimeRows();
  const winners = content.cycles
    .slice()
    .sort((a, b) => a.cycle - b.cycle)
    .flatMap((c) => (c.rows[0] ? [{ cycle: c.cycle, row: c.rows[0] }] : []));

  const stats = F.stats.map((s) => {
    if (live && s.k === "builders signed")
      return { ...s, v: String(live.builders) };
    if (live && s.k === "mini-apps submitted")
      return { ...s, v: String(live.submissions) };
    if (s.k === "projects ranked") return { ...s, v: String(allTime.length) };
    return s;
  });

  return (
    <Page
      screen="01 Landing"
      scroll
      status={
        <>
          <S k="program" v="closed" accent />
          <SDot />
          <S k="cycles" v={cycleInfo.cycleOfTotal} accent />
          <SDot />
          <S k="finale" v={cycleInfo.finaleLabel} />
          <SDot />
          <span>
            <span className="text-faint mr-1">●</span>
            wrapped
          </span>
          <UserBadge />
        </>
      }
      breadcrumb="welcome · finale · public"
    >
      <Grid cols="1.6fr 1fr" rows="auto 1fr" gap={12} fill>
        {/* hero (full width) */}
        <Pane title="program · closed" hint="finale.txt" span={2}>
          <Hero
            kicker={F.kicker}
            size="xl"
            sub={F.sub}
            ctas={
              <>
                <Btn ember href={F.video.url} target="_blank">
                  ▶ watch the closing ceremony
                </Btn>
                <Btn href="/leaderboard">per-cycle results →</Btn>
                {signedIn && (
                  <Btn ghost href="/dashboard">
                    → dashboard
                  </Btn>
                )}
              </>
            }
          >
            {F.headline.join(" ")}
          </Hero>
        </Pane>

        {/* left col */}
        <Pane
          title="final standings · all time"
          hint={`${allTime.length} projects · ${cycleInfo.totalCycles} cycles`}
        >
          <div className="overflow-x-auto">
            <Table
              head={["#", "project", "score"]}
              sizes={[{ w: 30 }, {}, { right: true, w: 80 }]}
              rows={allTime.map((r) => ({
                cells: [
                  { v: String(r.rank).padStart(2, "0"), muted: true },
                  {
                    v: (
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noreferrer"
                        className="border-b border-ink text-ink hover:bg-ghost"
                      >
                        {r.project}
                      </a>
                    ),
                    bold: true,
                  },
                  { v: r.score, bold: true },
                ],
              }))}
            />
          </div>
          <div className="mt-3 font-mono text-[11px] text-faint">
            ↳ cumulative judges&apos; scores across all cycles ·{" "}
            <a href="/leaderboard" className="border-b border-ink text-ink">
              per-cycle snapshots
            </a>
          </div>
        </Pane>

        {/* right col */}
        <div
          className="grid min-h-0 gap-3"
          style={{ gridTemplateRows: "auto auto 1fr" }}
        >
          <Pane title="by the numbers" hint={live ? "live" : "final"}>
            {stats.map((c, i, a) => (
              <div
                key={c.k}
                className={
                  "grid items-baseline gap-x-3 py-2" +
                  (i < a.length - 1 ? " border-b border-dotted border-hair" : "")
                }
                style={{ gridTemplateColumns: "1fr auto" }}
              >
                <span>
                  <span className="text-xl font-bold tracking-[-0.4px]">
                    {c.v}
                  </span>
                  <span className="ml-2 text-[11px] text-faint">{c.k}</span>
                </span>
                <span className="text-[11px] text-faint">{c.d}</span>
              </div>
            ))}
          </Pane>

          <Pane title="cycle winners" hint="rank 01 · each cycle">
            <div
              className="grid items-baseline font-mono text-xs"
              style={{ gridTemplateColumns: "auto 1fr auto", gap: "8px 12px" }}
            >
              {winners.map(({ cycle, row }) => (
                <div key={cycle} className="contents">
                  <span className="text-faint">
                    c{String(cycle).padStart(2, "0")}
                  </span>
                  <span>
                    <a
                      href={row.url}
                      target="_blank"
                      rel="noreferrer"
                      className="border-b border-ink font-bold text-ink hover:bg-ghost"
                    >
                      {row.project}
                    </a>
                  </span>
                  <span className="font-bold">{row.score}</span>
                </div>
              ))}
            </div>
          </Pane>

          <Pane title="thank you" hint="from the team">
            <div className="font-mono text-[13px] leading-[1.65] text-ink">
              {F.outro.map((para, i) => (
                <p
                  key={i}
                  className={
                    (i === 0 ? "m-0 " : "mt-2.5 ") +
                    (i === F.outro.length - 1 ? "text-faint" : "text-ink")
                  }
                >
                  {para}
                </p>
              ))}
            </div>
          </Pane>
        </div>
      </Grid>
    </Page>
  );
}
