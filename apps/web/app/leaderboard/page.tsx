import { content } from "@/lib/content";
import { Grid, Page, Pane, S, SDot, Table } from "@workspace/ui/kit";

export default function LeaderboardPage() {
  const p = content.program;

  return (
    <Page
      screen="04 Leaderboard"
      status={
        <>
          <S k="cycle" v={p.cycle} accent />
          <SDot />
          <S k="snapshot" v={p.snapshotIn} accent />
          <SDot />
          <S k="updated" v={p.lastUpdated} />
          <SDot />
          <S k="builders" v={content.leaderboard.length + "+"} />
        </>
      }
      breadcrumb={"leaderboard / cycle " + p.cycle + " / open"}
    >
      <Grid cols="1.6fr 1fr" gap={12} fill>
        {/* main table */}
        <Pane
          title="who moved the needle"
          hint="rank by ↓ new minters · 142 builders"
        >
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
            rows={content.leaderboard.map((r) => ({
              _muted: r.muted,
              cells: [
                {
                  v: String(r.rank).padStart(2, "0") + (r.star ? " ★" : ""),
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
            <span>↳ top 12 of 142</span>
            <span>
              <span className="mr-3.5 border-b border-ink text-ink">
                load 50 more
              </span>
              <span className="border-b border-ink text-ink">open archive</span>
            </span>
          </div>
        </Pane>

        {/* right column */}
        <div
          className="grid min-h-0 gap-3"
          style={{ gridTemplateRows: "auto auto auto 1fr" }}
        >
          <Pane title="podium · this week" hint="winners">
            <div
              className="grid items-baseline font-mono text-[13px]"
              style={{
                gridTemplateColumns: "auto 1fr auto",
                gap: "8px 12px",
              }}
            >
              {content.leaderboard.slice(0, 3).map((r) => (
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
                    <span className="text-[11px] text-faint">↳ {r.app}</span>
                  </span>
                  <span className="font-bold">{r.payout}</span>
                </div>
              ))}
            </div>
          </Pane>

          <Pane title="circle of life" hint="longest streak">
            <div className="font-mono text-xs leading-[1.8]">
              {content.circleOfLife.map((c) => (
                <div key={c.builder}>
                  <b>{c.builder}</b>
                  <span className="ml-2">· {c.weeks} wks</span>
                  <span className="ml-2 text-faint">· {c.bonus} bonus</span>
                </div>
              ))}
              <div className="mt-1 text-faint">+9 more on the wall</div>
            </div>
          </Pane>

          <Pane title="movers" hint="biggest jumps">
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
                    · {m.dir === "up" ? "↑" : "↓"} {Math.abs(m.from - m.to)}
                  </span>
                </div>
              ))}
            </div>
          </Pane>

          <Pane title="schedule" hint={"cycle " + p.cycle}>
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
