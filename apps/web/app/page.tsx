import { content } from "@/lib/content";
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

export default function LandingPage() {
  const p = content.program;
  const L = content.landing;

  return (
    <Page
      screen="01 Landing"
      status={
        <>
          <S k="cycle" v={p.cycle} accent />
          <SDot />
          <S k="pool" v={p.pool} accent />
          <SDot />
          <S k="builders" v="142" />
          <SDot />
          <S k="new minters · 7d" v="2,914" />
          <SDot />
          <span className="opacity-[0.55]">{p.nowCET}</span>
        </>
      }
      breadcrumb="welcome · open call · public"
    >
      <Grid cols="1.6fr 1fr" rows="auto auto 1fr" gap={12} fill>
        {/* hero (full width) */}
        <Pane
          title="program · open call · cycle 12"
          hint="welcome.txt"
          span={2}
        >
          <Hero
            kicker={L.kicker}
            size="xl"
            sub={L.sub}
            ctas={
              <>
                <Btn primary>{L.ctaPrimary}</Btn>
                <Btn>{L.ctaSecondary}</Btn>
                <Btn ghost>connect wallet</Btn>
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
            {L.steps.map(([n, t, b], i) => (
              <div
                key={n}
                className={
                  "grid py-2" +
                  (i < L.steps.length - 1
                    ? " border-b border-dotted border-hair"
                    : "")
                }
                style={{ gridTemplateColumns: "36px 1fr" }}
              >
                <span className="text-faint">{n}</span>
                <div>
                  <div className="text-sm font-bold">{t}</div>
                  <div className="mt-0.5 text-[11px] text-faint">{b}</div>
                </div>
              </div>
            ))}
          </Pane>

          <Pane title="leaderboard · this week" hint="top 5 of 142">
            <Table
              head={["#", "builder · app", "mints", "payout"]}
              sizes={[{ w: 28 }, {}, { right: true }, { right: true }]}
              rows={content.leaderboard.slice(0, 5).map((r) => ({
                _muted: r.muted,
                cells: [
                  {
                    v:
                      String(r.rank).padStart(2, "0") + (r.star ? " ★" : ""),
                    muted: true,
                  },
                  {
                    v: (
                      <>
                        <b>{r.builder}</b>
                        <span className="ml-1.5 text-faint">↳ {r.app}</span>
                      </>
                    ),
                  },
                  { v: r.mints },
                  { v: r.payout, bold: true },
                ],
              }))}
            />
            <div className="mt-2.5 font-mono text-[11px] text-faint">
              ↳{" "}
              <span className="border-b border-ink text-ink">
                see full table (130 more)
              </span>
            </div>
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
          <Pane title="cycle 12 · pool" hint="updated 60s">
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

          <Pane title="counters" hint="live">
            {content.counters.slice(0, 3).map((c, i, a) => (
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
                <span className="text-[11px] text-faint">{c.d}</span>
              </div>
            ))}
          </Pane>

          <Pane title="schedule" hint="cycle 12">
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
                {s.now && (
                  <Pill className="text-[9px]">now</Pill>
                )}
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
