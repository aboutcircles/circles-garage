import { content } from "@/lib/content";
import { AgentPaste } from "@/components/agent-paste";
import { SignInWithGitHub } from "@/components/sign-in-with-github";
import { Btn, Page, Pane } from "@workspace/ui/kit";

export default function DappconPage() {
  const D = content.dappcon;
  const p = content.program;

  // Step routes follow the dappcon step copy (sign up · build · submit),
  // which differs from the landing page's (sign up · submit · get judged).
  const stepHrefs = [
    "/signup",
    "https://github.com/aboutcircles/embedded-miniapp-boilerplate",
    "/register",
  ] as const;

  const eventRows: ReadonlyArray<readonly [string, string]> = [
    ["dates", D.event.dates],
    ["venue", D.event.venue],
    ["host", D.event.host],
  ];

  const prizeRows: ReadonlyArray<readonly [string, string]> = [
    ["1st", `${p.prizes.first} ${p.prizes.currency}`],
    ["2nd", `${p.prizes.second} ${p.prizes.currency}`],
    ["3rd", `${p.prizes.third} ${p.prizes.currency}`],
  ];

  const heroFacts: ReadonlyArray<readonly [string, string]> = [
    [D.event.dates, D.event.venue],
    [p.pool, "weekly pool"],
    ["top 3", "paid in CRC"],
  ];

  return (
    <Page
      screen="07 DappCon"
      scroll
      status={
        <span className="font-bold">
          DappCon · {p.pool} · <span className="text-ember">●</span> live
        </span>
      }
      breadcrumb="welcome / dappcon"
    >
      <div className="mx-auto flex max-w-[760px] flex-col gap-3">
        {/* 1 hero */}
        <section className="overflow-hidden border-2 border-ink bg-ink text-paper">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-paper/15 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.08em]">
            <span>circles/garage · dappcon berlin</span>
            <span className="text-paper/60">ship this week</span>
          </div>
          <div className="p-4 sm:p-5">
            <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[12px] text-paper/60">
              <span>
                <span className="text-ember">●</span> live at {D.event.name}
              </span>
              <span>{D.event.dates}</span>
              <span>{D.event.venue}</span>
            </div>
            <h1 className="max-w-[650px] text-balance font-mono text-[40px] font-bold leading-[0.98] tracking-[-1.1px] text-paper sm:text-5xl md:text-[56px]">
              {D.headline.join(" ")}
            </h1>
            <p className="mt-4 max-w-[620px] font-mono text-[14px] leading-[1.55] text-paper/60 sm:text-[15px]">
              {D.sub}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
              <SignInWithGitHub next="/signup" label={D.ctaPrimary} ember />
              <Btn
                href="/register"
                className="border-paper text-paper hover:bg-paper hover:text-ink"
              >
                {D.ctaSecondary}
              </Btn>
              <Btn ghost href="/leaderboard" className="text-paper">
                see who&apos;s shipping
              </Btn>
            </div>
            <div className="mt-5 grid gap-3 border-t border-paper/15 pt-4 font-mono text-[12px] sm:grid-cols-3">
              {heroFacts.map(([value, label]) => (
                <div key={`${value}-${label}`} className="min-w-0">
                  <div className="font-bold text-paper">{value}</div>
                  <div className="mt-0.5 text-paper/50">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 2 event + prize strip */}
        <Pane title="the event" hint="jun 16–17 · radialsystem">
          <div className="font-mono text-[13px]">
            {eventRows.map(([label, value]) => (
              <div
                key={label}
                className="grid items-baseline gap-x-3 border-b border-dotted border-hair py-2"
                style={{ gridTemplateColumns: "auto 1fr" }}
              >
                <span className="text-faint">{label}</span>
                <span className="text-right font-bold">{value}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 border-t border-hair pt-3 font-mono text-[13px]">
            {prizeRows.map(([place, amount]) => (
              <div
                key={place}
                className="grid items-baseline gap-x-3 border-b border-dotted border-hair py-2"
                style={{ gridTemplateColumns: "auto 1fr" }}
              >
                <span className="text-faint">{place}</span>
                <span className="text-right font-bold">{amount}</span>
              </div>
            ))}
            <div
              className="grid items-baseline gap-x-3 py-2"
              style={{ gridTemplateColumns: "auto 1fr" }}
            >
              <span className="text-faint">total</span>
              <span className="text-right font-bold">
                {p.pool} / week
              </span>
            </div>
          </div>
        </Pane>

        {/* 3 how it works */}
        <Pane title="how it works" hint="3 steps · this week">
          {D.steps.map(([n, t, b], i) => {
            const href = stepHrefs[i] ?? "/register";
            const external = href.startsWith("http");
            return (
            <a
              key={n}
              href={href}
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className={
                "grid py-2 transition-colors hover:bg-ghost" +
                (i < D.steps.length - 1
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

        {/* 4 build with an agent */}
        <Pane title="build with an agent" flush>
          <AgentPaste prompt={D.agentPrompt} />
        </Pane>

        {/* 5 why circles */}
        <Pane title="why circles" hint="2 lines">
          <div className="font-mono text-[13px] leading-[1.65]">
            {D.why.map((line, i) => (
              <p
                key={i}
                className={
                  (i === 0 ? "m-0 " : "mt-2.5 ") +
                  (i === D.why.length - 1 ? "text-faint" : "text-ink")
                }
              >
                {line}
              </p>
            ))}
          </div>
        </Pane>

        {/* 6 links */}
        <Pane title="links" hint="docs · template · team">
          <div className="font-mono text-[13px]">
            {D.links.map((link, i) => {
              const external = link.href.startsWith("http");
              return (
                <div
                  key={link.href}
                  className={
                    "grid items-baseline gap-x-3 py-2" +
                    (i < D.links.length - 1
                      ? " border-b border-dotted border-hair"
                      : "")
                  }
                  style={{ gridTemplateColumns: "1fr auto" }}
                >
                  <a
                    href={link.href}
                    {...(external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="justify-self-start border-b border-ink text-ink hover:bg-ghost"
                  >
                    {link.label}
                  </a>
                  {link.hint && (
                    <span className="text-right text-[11px] text-faint">
                      {link.hint}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </Pane>
      </div>
    </Page>
  );
}
