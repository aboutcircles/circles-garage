import { content } from "@/lib/content";
import { getCycleInfo } from "@/lib/cycle";
import { LiveCountdown } from "@/components/live-countdown";
import { Btn, Grid, Page, Pane, S, SDot, Table } from "@workspace/ui/kit";

export const revalidate = 60;

export default function LeaderboardPage() {
  const cycleInfo = getCycleInfo();
  const cycle = cycleInfo.cycleLabel;
  const rows = content.leaderboard;
  const empty = rows.length === 0;

  return (
    <Page
      screen="04 Leaderboard"
      scroll
      status={
        <>
          <S k="cycle" v={cycle} accent />
          <SDot />
          <S
            k="snapshot"
            v={<LiveCountdown targetMs={cycleInfo.endsAtMs} />}
            accent
          />
          <SDot />
          <S k="ends" v={`${cycleInfo.endsAtLabel} 23:59 CET`} />
          <SDot />
          <S k="builders" v={String(rows.length)} />
        </>
      }
      breadcrumb={`leaderboard / cycle ${cycle} / open`}
    >
      <Grid cols="1.6fr 1fr" gap={12} fill>
        {/* main table */}
        <Pane
          title="who moved the needle"
          hint={
            empty
              ? `cycle ${cycle} just opened`
              : `rank by ↓ new minters · ${rows.length} builders`
          }
        >
          {empty ? (
            <div className="py-6 font-mono text-[13px] leading-[1.7]">
              <div className="text-faint">
                no entries yet · cycle {cycle} opened today. first snapshot in{" "}
                <LiveCountdown targetMs={cycleInfo.endsAtMs} />.
              </div>
              <div className="mt-4 flex items-center gap-2.5">
                <Btn primary href="/signup">
                  sign up →
                </Btn>
                <Btn href="/register">submit a mini-app →</Btn>
              </div>
            </div>
          ) : (
            <>
              {/* filter strip */}
              <div className="mb-3 flex gap-[22px] border-b border-ink pb-2.5 font-mono text-[11px] text-faint">
                <span className="-mb-[11px] border-b-2 border-ink pb-2.5 font-bold text-ink">
                  this week
                </span>
                <span>all time</span>
                <span>circle of life</span>
                <span>by track</span>
                <span className="ml-auto">
                  rank ↓ <span className="text-ink">new minters</span>
                </span>
                <span>search ⌕</span>
                <span>export csv ↓</span>
              </div>

              <Table
                head={[
                  "#",
                  "builder",
                  "org",
                  "app",
                  "pitch",
                  "mints",
                  "vol",
                  "payout",
                  "streak",
                ]}
                sizes={[
                  { w: 30 },
                  {},
                  {},
                  {},
                  {},
                  { right: true },
                  { right: true },
                  { right: true },
                  { right: true, w: 50 },
                ]}
                rows={rows.map((r) => ({
                  _muted: r.muted,
                  cells: [
                    {
                      v:
                        String(r.rank).padStart(2, "0") + (r.star ? " ★" : ""),
                      muted: true,
                    },
                    { v: r.builder, bold: true },
                    { v: r.org, muted: true, size: 11 },
                    { v: r.app, bold: true },
                    { v: r.pitch, muted: true, size: 11 },
                    { v: r.mints },
                    { v: r.vol, muted: true },
                    { v: r.payout, bold: true },
                    { v: r.streak, muted: true, size: 11 },
                  ],
                }))}
              />

              <div className="mt-3.5 flex justify-between font-mono text-[11px] text-faint">
                <span>↳ {rows.length} builders</span>
              </div>
            </>
          )}
        </Pane>

        {/* right column */}
        <div
          className="grid min-h-0 gap-3"
          style={{ gridTemplateRows: "auto auto auto 1fr" }}
        >
          <Pane title="podium · this week" hint="winners">
            {rows.length === 0 ? (
              <div className="font-mono text-[11px] text-faint">
                no winners yet — first snapshot in{" "}
                <LiveCountdown targetMs={cycleInfo.endsAtMs} />.
              </div>
            ) : (
              <div
                className="grid items-baseline font-mono text-[13px]"
                style={{
                  gridTemplateColumns: "auto 1fr auto",
                  gap: "8px 12px",
                }}
              >
                {rows.slice(0, 3).map((r) => (
                  <div key={r.rank} className="contents">
                    <span
                      className={
                        "text-[22px] font-bold tracking-[-0.5px] " +
                        (r.rank === 1 ? "text-ink" : "text-faint")
                      }
                    >
                      {String(r.rank).padStart(2, "0")}
                    </span>
                    <span>
                      <b>{r.builder}</b>
                      <br />
                      <span className="text-[11px] text-faint">
                        ↳ {r.app}
                      </span>
                    </span>
                    <span className="font-bold">{r.payout}</span>
                  </div>
                ))}
              </div>
            )}
          </Pane>

          <Pane title="circle of life" hint="longest streak">
            {content.circleOfLife.length === 0 ? (
              <div className="font-mono text-[11px] text-faint">
                streaks accrue after the first snapshot.
              </div>
            ) : (
              <div className="font-mono text-xs leading-[1.8]">
                {content.circleOfLife.map((c) => (
                  <div key={c.builder}>
                    <b>{c.builder}</b>
                    <span className="ml-2">· {c.weeks} wks</span>
                    <span className="ml-2 text-faint">
                      · {c.bonus} bonus
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Pane>

          <Pane title="movers" hint="biggest jumps">
            {content.movers.length === 0 ? (
              <div className="font-mono text-[11px] text-faint">
                movers appear after rankings settle.
              </div>
            ) : (
              <div className="font-mono text-xs leading-[1.8]">
                {content.movers.map((m) => (
                  <div
                    key={m.builder}
                    className={m.dir === "down" ? "text-faint" : "text-ink"}
                  >
                    <b>{m.builder}</b>
                    <span className="ml-2">
                      · #{String(m.from).padStart(2, "0")} → #
                      {String(m.to).padStart(2, "0")}
                    </span>
                    <span className="ml-2">
                      · {m.dir === "up" ? "↑" : "↓"}{" "}
                      {Math.abs(m.from - m.to)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Pane>

          <Pane title="schedule" hint={`cycle ${cycle}`}>
            <div className="font-mono text-xs leading-[1.85]">
              {content.schedule.map((s, i) => (
                <div key={i}>
                  <span className="mr-2 text-faint">{s.d}</span>· {s.body}
                  {s.now && (
                    <span className="ml-2 border border-ink px-1 text-[9px] font-bold">
                      NOW
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Pane>
        </div>
      </Grid>
    </Page>
  );
}
