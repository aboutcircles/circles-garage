import { content } from "@/lib/content";
import { getCycleInfo } from "@/lib/cycle";
import { getSupabase } from "@/lib/supabase";
import { LiveCountdown } from "@/components/live-countdown";
import {
  Btn,
  Grid,
  Hero,
  Page,
  Pane,
  Pill,
  S,
  SDot,
  Table,
} from "@workspace/ui/kit";

// Re-render every 15 seconds. The countdown ticks client-side at minute
// precision via <LiveCountdown>; this revalidate is so the cycle number
// and live row counts refresh too.
export const revalidate = 15;

type LiveCounters = { builders: number; submissions: number };

async function fetchLiveCounters(): Promise<LiveCounters | null> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.rpc("get_landing_counters");
    if (error || !Array.isArray(data) || data.length === 0) return null;
    const row = data[0] as {
      builders_count: number | string;
      submissions_count: number | string;
    };
    return {
      builders: Number(row.builders_count ?? 0),
      submissions: Number(row.submissions_count ?? 0),
    };
  } catch {
    return null;
  }
}

export default async function LandingPage() {
  const p = content.program;
  const L = content.landing;
  const cycleInfo = getCycleInfo();
  const cycle = cycleInfo.cycleLabel;
  const lbCount = content.leaderboard.length;
  const live = await fetchLiveCounters();
  const counters = content.counters.map((c) => {
    if (live && c.k === "builders signed") return { ...c, v: String(live.builders) };
    if (live && c.k === "mini-apps submitted")
      return { ...c, v: String(live.submissions) };
    if (c.k === "auto-snapshot") return { ...c, v: cycleInfo.endsAtLabel };
    return c;
  });
  const signedCount = counters[0]?.v ?? "0";
  const countersHint = live ? "live · 15s refresh" : "static";

  return (
    <Page
      screen="01 Landing"
      scroll
      status={
        <>
          <S k="cycle" v={cycle} accent />
          <SDot />
          <S k="pool" v={p.pool} accent />
          <SDot />
          <S k="builders" v={signedCount} />
          <SDot />
          <S
            k="snapshot"
            v={<LiveCountdown targetMs={cycleInfo.endsAtMs} />}
            accent
          />
        </>
      }
      breadcrumb="welcome · open call · public"
    >
      <Grid cols="1.6fr 1fr" rows="auto auto 1fr" gap={12} fill>
        {/* hero (full width) */}
        <Pane
          title={`program · open call · cycle ${cycle}`}
          hint="welcome.txt"
          span={2}
        >
          <Hero
            kicker={L.kicker}
            size="xl"
            sub={L.sub}
            ctas={
              <>
                <Btn primary href="/signup">
                  {L.ctaPrimary}
                </Btn>
                <Btn href="/register">{L.ctaSecondary}</Btn>
                <Btn ghost href="/leaderboard">
                  see leaderboard
                </Btn>
              </>
            }
          >
            {L.headline[0]}
            <br />
            {L.headline[1]}
          </Hero>
        </Pane>

        {/* left col */}
        <div
          className="grid min-h-0 gap-3"
          style={{ gridTemplateRows: "auto auto 1fr" }}
        >
          <Pane title="how it works" hint="3 steps · no rounds">
            {L.steps.map(([n, t, b], i) => {
              const href =
                i === 0 ? "/signup" : i === 1 ? "/register" : "/leaderboard";
              return (
                <a
                  key={n}
                  href={href}
                  className={
                    "grid py-2 transition-colors hover:bg-ghost" +
                    (i < L.steps.length - 1
                      ? " border-b border-dotted border-hair"
                      : "")
                  }
                  style={{ gridTemplateColumns: "36px 1fr" }}
                >
                  <span className="text-faint">{n}</span>
                  <div>
                    <div className="text-sm font-bold">
                      {t} <span className="text-faint">→</span>
                    </div>
                    <div className="mt-0.5 text-[11px] text-faint">{b}</div>
                  </div>
                </a>
              );
            })}
          </Pane>

          <Pane
            title={`leaderboard · cycle ${cycle}`}
            hint={lbCount === 0 ? "no entries yet" : `top 5 of ${lbCount}`}
          >
            {lbCount === 0 ? (
              <div className="py-2 font-mono text-[13px] leading-[1.7]">
                <div className="text-faint">
                  no entries yet · cycle {cycle} just opened.
                </div>
                <div className="mt-2.5">
                  <a
                    href="/signup"
                    className="border-b border-ink text-ink hover:bg-ghost"
                  >
                    be the first → sign up
                  </a>
                </div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table
                    head={["#", "builder · app", "mints", "payout"]}
                    sizes={[{ w: 28 }, {}, { right: true }, { right: true }]}
                    rows={content.leaderboard.slice(0, 5).map((r) => ({
                      _muted: r.muted,
                      cells: [
                        {
                          v:
                            String(r.rank).padStart(2, "0") +
                            (r.star ? " ★" : ""),
                          muted: true,
                        },
                        {
                          v: (
                            <>
                              <b>{r.builder}</b>
                              <span className="ml-1.5 text-faint">
                                ↳ {r.app}
                              </span>
                            </>
                          ),
                        },
                        { v: r.mints },
                        { v: r.payout, bold: true },
                      ],
                    }))}
                  />
                </div>
                <div className="mt-2.5 font-mono text-[11px] text-faint">
                  ↳{" "}
                  <a
                    href="/leaderboard"
                    className="border-b border-ink text-ink"
                  >
                    see full table ({Math.max(0, lbCount - 5)} more)
                  </a>
                </div>
              </>
            )}
          </Pane>

          <Pane title="manifesto.md" hint="why this exists">
            <div className="font-mono text-[13px] leading-[1.65] text-ink">
              {L.manifesto.map((para, i) => (
                <p
                  key={i}
                  className={
                    (i === 0 ? "m-0 " : "mt-2.5 ") +
                    (i === L.manifesto.length - 1 ? "text-faint" : "text-ink")
                  }
                >
                  {para}
                </p>
              ))}
            </div>
          </Pane>
        </div>

        {/* right col */}
        <div
          className="grid min-h-0 gap-3"
          style={{ gridTemplateRows: "auto auto auto 1fr" }}
        >
          <Pane title={`cycle ${cycle} · pool`} hint="weekly · paid mon">
            <div className="font-mono text-4xl font-bold leading-none tracking-[-1px]">
              {p.pool}
            </div>
            <PoolBar />
            <div className="mt-2.5 font-mono text-[11px] leading-[1.6] text-faint">
              {p.poolSplit.winnersAmt} · winners pool ({p.poolSplit.winners}/
              {p.poolSplit.denom})
              <br />
              {p.poolSplit.lifeAmt} · circle-of-life ({p.poolSplit.life}/
              {p.poolSplit.denom})
            </div>
          </Pane>

          <Pane title="counters" hint={countersHint}>
            {counters.slice(0, 3).map((c, i, a) => {
              const isSnapshot = c.k === "auto-snapshot";
              return (
                <div
                  key={c.k}
                  className={
                    "grid items-baseline py-2" +
                    (i < a.length - 1
                      ? " border-b border-dotted border-hair"
                      : "")
                  }
                  style={{ gridTemplateColumns: "1fr auto" }}
                >
                  <span>
                    <span className="text-xl font-bold tracking-[-0.4px]">
                      {c.v}
                    </span>
                    <span className="ml-2 text-[11px] text-faint">{c.k}</span>
                  </span>
                  <span className="text-[11px] text-faint">
                    {isSnapshot ? (
                      <>
                        <LiveCountdown targetMs={cycleInfo.endsAtMs} /> · 23:59
                        CET
                      </>
                    ) : (
                      c.d
                    )}
                  </span>
                </div>
              );
            })}
          </Pane>

          <Pane title="schedule" hint={`cycle ${cycle}`}>
            {content.schedule.map((s, i) => (
              <div
                key={i}
                className={
                  "grid items-center py-1.5 text-xs" +
                  (i < content.schedule.length - 1
                    ? " border-b border-dotted border-hair"
                    : "")
                }
                style={{ gridTemplateColumns: "70px 1fr auto" }}
              >
                <span className="text-faint">{s.d}</span>
                <span>{s.body}</span>
                {s.now && <Pill className="text-[9px]">now</Pill>}
              </div>
            ))}
          </Pane>

          <Pane title="bulletin" hint="from the team">
            <div className="font-mono text-xs leading-[1.7]">
              {L.bulletin.map((b, i) => (
                <div key={i}>· {b}</div>
              ))}
            </div>
          </Pane>
        </div>
      </Grid>
    </Page>
  );
}

function PoolBar() {
  const s = content.program.poolSplit;
  const pct = (s.winners / s.denom) * 100;
  return (
    <div className="mt-2.5 flex h-5 border border-ink font-mono text-[10px]">
      <div
        className="flex items-center bg-ink px-2 text-paper"
        style={{ width: pct + "%" }}
      >
        {s.winners}/{s.denom} winners
      </div>
      <div className="flex flex-1 items-center px-2">
        {s.life}/{s.denom} life
      </div>
    </div>
  );
}
