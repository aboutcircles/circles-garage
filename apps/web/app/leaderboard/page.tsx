import type { SupabaseClient } from "@supabase/supabase-js";
import { content } from "@/lib/content";
import { getCycleInfo, TOTAL_CYCLES } from "@/lib/cycle";
import { getAllTimeRows, getLatestCycle } from "@/lib/leaderboard";
import { createClient } from "@/lib/supabase/server";
import { LiveCountdown } from "@/components/live-countdown";
import { Btn, Grid, Page, Pane, S, SDot } from "@workspace/ui/kit";
import { LeaderboardTable } from "./leaderboard-table-client";

export const revalidate = 60;

type ProgramStats = {
  buildersTotal: number;
  submissionsTotal: number;
  submissionsByCycle: Record<number, number>;
};

async function fetchProgramStats(
  supabase: SupabaseClient,
): Promise<ProgramStats | null> {
  try {
    const { data, error } = await supabase.rpc("get_program_stats");
    if (error || !Array.isArray(data) || data.length === 0) return null;
    const row = data[0] as {
      builders_total: number | string;
      submissions_total: number | string;
      submissions_by_cycle: Record<string, number | string> | null;
    };
    const byCycle: Record<number, number> = {};
    const raw = row.submissions_by_cycle ?? {};
    for (const [k, v] of Object.entries(raw)) {
      const cycleNum = Number(k);
      const count = Number(v);
      if (Number.isInteger(cycleNum) && cycleNum >= 1 && cycleNum <= TOTAL_CYCLES) {
        byCycle[cycleNum] = count;
      }
    }
    return {
      buildersTotal: Number(row.builders_total ?? 0),
      submissionsTotal: Number(row.submissions_total ?? 0),
      submissionsByCycle: byCycle,
    };
  } catch {
    return null;
  }
}

export default async function LeaderboardPage() {
  const cycleInfo = getCycleInfo();
  const supabase = await createClient();
  const stats = await fetchProgramStats(supabase);
  const currentCycle = cycleInfo.cycle;
  const cycle = cycleInfo.cycleLabel;
  const latest = getLatestCycle();
  const weekRows = latest?.rows ?? [];
  const allTimeRows = getAllTimeRows();
  const latestCycleLabel = latest
    ? String(latest.cycle).padStart(2, "0")
    : cycle;
  const empty = weekRows.length === 0;
  const now = new Date();
  const programOpen = now.getTime() >= cycleInfo.startedAtMs;
  const startsAtLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "Europe/Berlin",
  })
    .format(new Date(cycleInfo.startedAtMs))
    .toUpperCase();

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
        </>
      }
      breadcrumb={`leaderboard / cycle ${cycle} / ${programOpen ? "open" : "pre-launch"}`}
    >
      <Grid cols="1.6fr 1fr" gap={12} fill>
        {/* left column */}
        <div
          className="grid min-h-0 gap-3"
          style={{ gridTemplateRows: "auto 1fr" }}
        >
          <ParticipationPane
            stats={stats}
            currentCycle={currentCycle}
            isOver={cycleInfo.isOver}
          />
          <Pane
            title="who moved the needle"
            hint={
              empty
                ? programOpen
                  ? `cycle ${cycle} · live`
                  : `cycle ${cycle} opens ${startsAtLabel}`
                : "rank by ↓ judges' score"
            }
          >
          {empty ? (
            <div className="py-6 font-mono text-[13px] leading-[1.7]">
              <div className="text-faint">
                {stats && stats.submissionsTotal > 0 && programOpen
                  ? `no ranks yet · ${stats.submissionsTotal} submitted · cycle ${cycle} is open. first snapshot in `
                  : programOpen
                    ? `no entries yet · cycle ${cycle} is open. first snapshot in `
                    : `cycle ${cycle} opens ${startsAtLabel}. first snapshot in `}
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
            <LeaderboardTable
              weekRows={weekRows}
              allTimeRows={allTimeRows}
              weekLabel={`cycle ${latestCycleLabel}`}
            />
          )}
          </Pane>
        </div>

        {/* right column */}
        <div
          className="grid min-h-0 gap-3"
          style={{ gridTemplateRows: "auto auto auto 1fr" }}
        >
          <Pane title={`podium · cycle ${latestCycleLabel}`} hint="winners">
            {weekRows.length === 0 ? (
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
                {weekRows.slice(0, 3).map((r) => (
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
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noreferrer"
                        className="border-b border-ink font-bold text-ink hover:bg-ghost"
                      >
                        {r.project}
                      </a>
                    </span>
                    <span className="font-bold">{r.score}</span>
                  </div>
                ))}
              </div>
            )}
          </Pane>

          <Pane title="prizes" hint="weekly · top 3">
            <div
              className="font-mono text-[13px]"
              style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "6px 12px" }}
            >
              {(["first", "second", "third"] as const).map((k, i) => (
                <div key={k} className="contents">
                  <span className="text-faint">
                    {["1st", "2nd", "3rd"][i]}
                  </span>
                  <span className="border-b border-dotted border-hair" />
                  <span className="font-bold">
                    {content.program.prizes[k]}
                  </span>
                </div>
              ))}
              <div className="contents">
                <span className="text-faint">total</span>
                <span className="border-b border-hair" />
                <span>
                  <b>{content.program.prizes.total}</b>
                  <span className="ml-1 text-faint">
                    · {content.program.prizes.currency}
                  </span>
                </span>
              </div>
            </div>
            <div className="mt-2.5 font-mono text-[11px] text-faint">
              ↳ paid every monday, after the snapshot is judged.
            </div>
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
                <div key={i} className={s.pinned ? "font-bold" : ""}>
                  <span className="mr-2 text-faint">
                    {s.pinned ? "★ " : ""}
                    {s.d}
                  </span>
                  · {s.body}
                </div>
              ))}
            </div>
          </Pane>
        </div>
      </Grid>
    </Page>
  );
}

function ParticipationPane({
  stats,
  currentCycle,
  isOver,
}: {
  stats: ProgramStats | null;
  currentCycle: number;
  isOver: boolean;
}) {
  const cycles = Array.from({ length: TOTAL_CYCLES }, (_, i) => i + 1);
  const hint = stats ? "live · 60s cache" : "static";
  const submissionsTotal = stats?.submissionsTotal ?? 0;
  const byCycle = stats?.submissionsByCycle ?? {};

  return (
    <Pane title="participation" hint={hint}>
      <div
        className="font-mono text-[13px]"
        style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "6px 12px" }}
      >
        <span className="text-faint">submissions total</span>
        <span className="font-bold">{submissionsTotal}</span>
        <span className="col-span-2 border-t border-hair" />
        {cycles.map((n) => {
          const isCurrent = stats !== null && !isOver && n === currentCycle;
          const isPast = stats === null || isOver || n < currentCycle;
          const count = byCycle[n] ?? 0;
          if (isCurrent) {
            return (
              <div key={n} className="contents">
                <span className="font-bold text-ink">
                  <span className="mr-1.5 text-ember">●</span>
                  cycle {String(n).padStart(2, "0")}
                  <span className="ml-1.5 text-[11px] font-normal text-ember">live</span>
                </span>
                <span className="font-bold">{count}</span>
              </div>
            );
          }
          if (isPast) {
            return (
              <div key={n} className="contents">
                <span>cycle {String(n).padStart(2, "0")}</span>
                <span>{count}</span>
              </div>
            );
          }
          return (
            <div key={n} className="contents">
              <span className="text-faint">
                cycle {String(n).padStart(2, "0")}
                <span className="ml-1.5 text-[11px]">soon</span>
              </span>
              <span className="text-faint">—</span>
            </div>
          );
        })}
      </div>
    </Pane>
  );
}
