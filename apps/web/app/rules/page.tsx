import { content } from "@/lib/content";
import { getCycleInfo } from "@/lib/cycle";
import { UserBadge } from "@/components/user-badge";
import {
  Btn,
  Grid,
  Hero,
  Page,
  Pane,
  S,
  SDot,
  Section,
} from "@workspace/ui/kit";

const berlinDateTimeParts = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Europe/Berlin",
});

function formatBerlinDateTimeCET(ms: number): string {
  // Produces e.g. "MON 18 MAY 00:00 CET" (en-US default order is weekday,
  // month, day, time — we reshape it to weekday day month time to match the
  // rest of the UI's "DAY DD MMM" rhythm from cycle.ts).
  const parts = berlinDateTimeParts.formatToParts(new Date(ms));
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";
  const weekday = get("weekday").toUpperCase();
  const day = get("day");
  const month = get("month").toUpperCase();
  const hour = get("hour");
  const minute = get("minute");
  return `${weekday} ${day} ${month} ${hour}:${minute} CET`;
}

export default function RulesPage() {
  const p = content.program;
  const cycleInfo = getCycleInfo();
  const prizes = p.prizes;

  const prizeRows: ReadonlyArray<readonly [string, string]> = [
    ["1st", `${prizes.first} ${prizes.currency}`],
    ["2nd", `${prizes.second} ${prizes.currency}`],
    ["3rd", `${prizes.third} ${prizes.currency}`],
  ];

  const cadenceBullets = [
    "every cycle ends Friday 23:59 CET — snapshot, builder Q&A, prizes paid in CRC same day.",
    "you can save your submission as often as you want · only the latest version at snapshot time counts.",
    "one submission per cycle per builder · resubmit to overwrite.",
  ];

  const eligibilityBullets = [
    "sign up at /signup with a github account · github handle is your builder handle.",
    "bring a circles profile address — we pay there.",
    "optional: a circles org address per app (on-chain address that receives CRC payouts) and team member CRC addresses.",
    "no fee. no equity. no decks.",
  ];

  return (
    <Page
      screen="06 Rules"
      scroll
      status={
        <>
          <S k="doc" v="rules.md" />
          <SDot />
          <S k="cycle" v={cycleInfo.cycleOfTotal} accent />
          <SDot />
          <S k="prize" v={prizes.total} accent />
          <UserBadge />
        </>
      }
      breadcrumb="welcome / rules"
    >
      <Grid cols="2fr 1fr" gap={12} fill>
        <Pane title="the rules" hint="how circles/garage works">
          <Hero
            size="md"
            sub={`6-week builder program · Friday-to-Friday cycles · ${prizes.total} every week in ${prizes.currency}, shared by the top 3. No pitch deck. Submit a working mini-app. Winners get paid the same Friday.`}
          >
            the rules.
          </Hero>

          <Section num="01" label="cadence" hint="6 cycles · friday-to-friday">
            <p className="font-mono text-[13px] leading-[1.65] text-ink">
              cycle 01 is a 5-day opener: Mon 18 May → Fri 22 May. cycles
              02–06 run the full Fri → Fri week. grand finale{" "}
              {cycleInfo.finaleLabel}.
            </p>
            <div className="mt-3 font-mono text-[13px] leading-[1.9]">
              {cadenceBullets.map((b, i) => (
                <div
                  key={i}
                  className={
                    "py-1.5" +
                    (i < cadenceBullets.length - 1
                      ? " border-b border-dotted border-hair"
                      : "")
                  }
                >
                  <span className="text-faint">·</span> {b}
                </div>
              ))}
            </div>
          </Section>

          <Section num="02" label="prizes" hint="weekly · top 3">
            <div className="font-mono text-[13px]">
              {prizeRows.map(([place, amount]) => (
                <div
                  key={place}
                  className="grid items-baseline gap-x-3 border-b border-dotted border-hair py-2"
                  style={{ gridTemplateColumns: "60px 1fr auto" }}
                >
                  <span className="text-faint">{place}</span>
                  <span aria-hidden="true" className="overflow-hidden whitespace-nowrap text-faint">
                    ··············································································
                  </span>
                  <span className="font-bold">{amount}</span>
                </div>
              ))}
              <div
                className="grid items-baseline gap-x-3 py-2"
                style={{ gridTemplateColumns: "60px 1fr auto" }}
              >
                <span className="text-faint">total</span>
                <span aria-hidden="true" className="overflow-hidden whitespace-nowrap text-faint">
                  ··············································································
                </span>
                <span className="font-bold">
                  {prizes.total} / week in {prizes.currency}
                </span>
              </div>
            </div>
            <p className="mt-3 font-mono text-[13px] leading-[1.6] text-faint">
              ↳ payments hit your{" "}
              <span className="text-ink">circles_addr</span> on Friday after
              the snapshot.
            </p>
          </Section>

          <Section
            num="03"
            label="how we judge"
            hint="5 holistic criteria + 1 for repeat winners"
          >
            <div className="font-mono text-[13px]">
              {content.judging.map((c, i) => (
                <div
                  key={c.num}
                  className={
                    "py-2.5" +
                    (i < content.judging.length - 1
                      ? " border-b border-dotted border-hair"
                      : "")
                  }
                >
                  <div>
                    <span className="text-faint">{c.num}.</span>{" "}
                    <span className="font-bold">{c.name}</span>
                  </div>
                  <div className="mt-0.5 text-[11px] text-faint">
                    ↳ {c.body}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section num="04" label="eligibility" hint="who can enter">
            <div className="font-mono text-[13px] leading-[1.9]">
              {eligibilityBullets.map((b, i) => (
                <div
                  key={i}
                  className={
                    "py-1.5" +
                    (i < eligibilityBullets.length - 1
                      ? " border-b border-dotted border-hair"
                      : "")
                  }
                >
                  <span className="text-faint">·</span> {b}
                </div>
              ))}
            </div>
          </Section>

          <Section
            num="05"
            label="snapshot & fairness"
            hint="the rules of the game"
          >
            <p className="font-mono text-[13px] leading-[1.65] text-ink">
              the weekly snapshot is final. we publish the leaderboard after
              every Friday snapshot. anything submitted after 23:59 CET rolls
              into the next cycle.
            </p>
            <p className="mt-2.5 font-mono text-[13px] leading-[1.65] text-faint">
              your handle and app can show on the public leaderboard. metrics
              shown are computed by the circles team from on-chain + host-app
              data.
            </p>
          </Section>

          <div className="mt-7 border-t border-hair pt-3 font-mono text-[11px] text-faint">
            ↳ questions? reach the team in the builder telegram (link on the
            landing page).
          </div>
        </Pane>

        <div
          className="grid min-h-0 gap-3"
          style={{ gridTemplateRows: "auto auto" }}
        >
          <Pane title="this cycle" hint={cycleInfo.cycleOfTotal}>
            <div className="font-mono text-[13px]">
              <div
                className="grid items-baseline gap-x-3 border-b border-dotted border-hair py-2"
                style={{ gridTemplateColumns: "auto 1fr" }}
              >
                <span className="text-faint">started</span>
                <span className="text-right">
                  {formatBerlinDateTimeCET(cycleInfo.startedAtMs)}
                </span>
              </div>
              <div
                className="grid items-baseline gap-x-3 border-b border-dotted border-hair py-2"
                style={{ gridTemplateColumns: "auto 1fr" }}
              >
                <span className="text-faint">ends</span>
                <span className="text-right">
                  {formatBerlinDateTimeCET(cycleInfo.endsAtMs)}
                </span>
              </div>
              <div
                className="grid items-baseline gap-x-3 border-b border-dotted border-hair py-2"
                style={{ gridTemplateColumns: "auto 1fr" }}
              >
                <span className="text-faint">prize</span>
                <span className="text-right font-bold">
                  {prizes.total} {prizes.currency}
                </span>
              </div>
              <div
                className="grid items-baseline gap-x-3 py-2"
                style={{ gridTemplateColumns: "auto 1fr" }}
              >
                <span className="text-faint">program ends</span>
                <span className="text-right">{cycleInfo.finaleLabel}</span>
              </div>
            </div>
          </Pane>

          <Pane title="next steps" hint="go ship">
            <div className="flex flex-col items-stretch gap-2.5">
              <Btn primary href="/signup">
                → sign up
              </Btn>
              <Btn href="/register">→ submit a mini-app</Btn>
              <Btn ghost href="/">
                ← back to landing
              </Btn>
            </div>
          </Pane>
        </div>
      </Grid>
    </Page>
  );
}
