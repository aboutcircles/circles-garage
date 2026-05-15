import type { SupabaseClient } from "@supabase/supabase-js";
import { content } from "@/lib/content";
import { getCycleInfo } from "@/lib/cycle";
import { createClient } from "@/lib/supabase/server";
import { LiveCountdown } from "@/components/live-countdown";
import { SignInWithGitHub } from "@/components/sign-in-with-github";
import { UserBadge } from "@/components/user-badge";
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

type LiveCounters = { builders: number; submissions: number };

async function fetchLiveCounters(
  supabase: SupabaseClient,
): Promise<LiveCounters | null> {
  try {
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
  const supabase = await createClient();
  const [live, authResult] = await Promise.all([
    fetchLiveCounters(supabase),
    supabase.auth.getUser(),
  ]);
  const signedIn = !!authResult.data.user;
  const now = new Date();
  const programOpen = now.getTime() >= cycleInfo.startedAtMs;
  const berlinFmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Berlin",
    day: "numeric",
    month: "short",
  });
  const todayParts = berlinFmt.formatToParts(now);
  const todayBerlinDay = Number(
    todayParts.find((p) => p.type === "day")?.value ?? NaN,
  );
  const todayBerlinMonth =
    todayParts.find((p) => p.type === "month")?.value.toUpperCase() ?? "";
  const startsAtLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "Europe/Berlin",
  })
    .format(new Date(cycleInfo.startedAtMs))
    .toUpperCase();
  const counters = content.counters.map((c) => {
    if (live && c.k === "builders signed") return { ...c, v: String(live.builders) };
    if (live && c.k === "mini-apps submitted")
      return { ...c, v: String(live.submissions) };
    if (c.k === "builders signed")
      return {
        ...c,
        d: programOpen
          ? `cycle ${cycleInfo.cycleLabel} · live`
          : "open call · pre-launch",
      };
    if (c.k === "grand finale") return { ...c, v: cycleInfo.finaleLabel };
    return c;
  });
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
          <S
            k="snapshot"
            v={<LiveCountdown targetMs={cycleInfo.endsAtMs} />}
            accent
          />
          <SDot />
          <span>
            <span className={programOpen ? "text-ember mr-1" : "text-faint mr-1"}>
              ●
            </span>
            {programOpen ? "live" : "open call"}
          </span>
          <UserBadge />
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
              signedIn ? (
                <>
                  <Btn ember href="/dashboard">
                    → dashboard
                  </Btn>
                  <Btn href="/register">{L.ctaSecondary}</Btn>
                  <Btn ghost href="/leaderboard">
                    see leaderboard
                  </Btn>
                </>
              ) : (
                <>
                  <SignInWithGitHub
                    next="/dashboard"
                    label="sign in with github →"
                    ember
                  />
                  <Btn href="/register">{L.ctaSecondary}</Btn>
                  <Btn ghost href="/leaderboard">
                    see leaderboard
                  </Btn>
                </>
              )
            }
          >
            {L.headline.join(" ")}
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
                  {programOpen
                    ? `no entries yet · cycle ${cycle} is open.`
                    : `cycle ${cycle} opens ${startsAtLabel}.`}
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
          <Pane
            title={`cycle ${cycle} · pool`}
            hint="weekly · top 3 · paid friday"
          >
            <div className="font-mono text-4xl font-bold leading-none tracking-[-1px]">
              {p.pool}
            </div>
            <PrizesBreakdown />
          </Pane>

          <Pane title="counters" hint={countersHint}>
            {counters.slice(0, 4).map((c, i, a) => (
              <div
                key={c.k}
                className={
                  "grid items-baseline gap-x-3 py-2" +
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

          <Pane title="schedule" hint={`cycle ${cycle}`}>
            {content.schedule.map((s, i) => {
              // s.d is either "MON 18" (weekday + day, current month) or
              // "FRI 26 JUN" (weekday + day + month, e.g. grand finale).
              // Match day-of-month AND month so e.g. "FRI 22" doesn't go
              // "now" on the 22nd of every month.
              const tokens = s.d.split(/\s+/);
              const dayToken = tokens[1] ?? "";
              const monthToken = (tokens[2] ?? "").toUpperCase();
              const entryDay = Number(dayToken);
              const entryMonth = monthToken || todayBerlinMonth;
              const isNow =
                Number.isFinite(entryDay) &&
                entryDay === todayBerlinDay &&
                entryMonth === todayBerlinMonth;
              return (
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
                  <span
                    className={
                      s.pinned ? "font-bold text-ink" : "text-faint"
                    }
                  >
                    {s.pinned ? `★ ${s.d}` : s.d}
                  </span>
                  <span className={s.pinned ? "font-bold" : undefined}>
                    {s.href ? (
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border-b border-ink text-ink hover:bg-ghost"
                      >
                        {s.body}
                      </a>
                    ) : (
                      s.body
                    )}
                  </span>
                  {isNow && <Pill className="text-[9px]">now</Pill>}
                </div>
              );
            })}
          </Pane>

          <Pane title="bulletin" hint="from the team">
            <div className="font-mono text-xs leading-[1.7]">
              {L.bulletin.map((b, i) => {
                if (!b.href) {
                  return (
                    <div key={i}>
                      · <span className="text-faint">{b.text}</span>
                      <span className="ml-1.5 text-[10px] uppercase tracking-[0.18em] text-faint">
                        [soon]
                      </span>
                    </div>
                  );
                }
                if (b.hrefLabel) {
                  const idx = b.text.indexOf(b.hrefLabel);
                  if (idx >= 0) {
                    const before = b.text.slice(0, idx);
                    const after = b.text.slice(idx + b.hrefLabel.length);
                    return (
                      <div key={i}>
                        · {before}
                        <a
                          href={b.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border-b border-ink text-ink hover:bg-ghost"
                        >
                          {b.hrefLabel}
                        </a>
                        {after}
                      </div>
                    );
                  }
                }
                return (
                  <div key={i}>
                    ·{" "}
                    <a
                      href={b.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-b border-ink text-ink hover:bg-ghost"
                    >
                      {b.text}
                    </a>
                  </div>
                );
              })}
            </div>
          </Pane>
        </div>
      </Grid>
    </Page>
  );
}

function PrizesBreakdown() {
  const { first, second, third, total, currency } = content.program.prizes;
  const rows: readonly [string, string][] = [
    ["1st", first],
    ["2nd", second],
    ["3rd", third],
  ];
  return (
    <div className="mt-2.5 font-mono text-xs leading-[1.6]">
      {rows.map(([label, amount]) => (
        <div
          key={label}
          className="grid items-baseline border-b border-dotted border-hair py-1.5"
          style={{ gridTemplateColumns: "1fr auto" }}
        >
          <span className="text-faint">{label}</span>
          <span className="font-bold">{amount}</span>
        </div>
      ))}
      <div
        className="grid items-baseline border-t border-hair py-1.5"
        style={{ gridTemplateColumns: "1fr auto" }}
      >
        <span className="text-faint">total</span>
        <span>
          <span className="font-bold">{total}</span>
          <span className="ml-1.5 text-faint">· {currency}</span>
        </span>
      </div>
    </div>
  );
}
