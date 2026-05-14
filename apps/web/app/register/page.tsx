import { content } from "@/lib/content";
import { getCycleInfo } from "@/lib/cycle";
import { LiveCountdown } from "@/components/live-countdown";
import { Grid, Page, Pane, S, SDot } from "@workspace/ui/kit";
import { RegisterClient } from "./register-client";

// Re-render every minute so the cycle number / end-date refresh, even
// though the countdown itself ticks client-side.
export const revalidate = 60;

export default function RegisterPage() {
  const d = content.draft;
  const cycleInfo = getCycleInfo();

  return (
    <Page
      screen="05 Submit mini-app"
      scroll
      status={
        <>
          <S k="form" v="submission.txt" />
          <SDot />
          <S k="cycle" v={cycleInfo.cycleLabel} accent />
          <SDot />
          <S
            k="snapshot"
            v={<LiveCountdown targetMs={cycleInfo.endsAtMs} />}
            accent
          />
        </>
      }
      breadcrumb="dashboard / mini-apps / new submission"
    >
      <Grid cols="2fr 1fr" gap={12} fill>
        <Pane title="submit mini-app · drop the goods" hint="5 steps">
          <RegisterClient draft={d} />
        </Pane>

        <div
          className="grid min-h-0 gap-3"
          style={{ gridTemplateRows: "auto auto 1fr" }}
        >
          <Pane title="what we measure" hint="default metrics">
            <div className="font-mono text-xs leading-[1.9]">
              {d.measures.map((m, i) => (
                <div key={i} className={m.on ? "" : "text-faint"}>
                  + {m.label}
                </div>
              ))}
            </div>
          </Pane>

          <Pane title="checks" hint="auto-run on submit">
            <div className="font-mono text-xs leading-[1.9] text-faint">
              {d.checks.map((c, i) => (
                <div key={i}>○ {c.label}</div>
              ))}
            </div>
          </Pane>

          <Pane title="snapshot" hint={`auto · ${cycleInfo.endsAtLabel} 23:59 CET`}>
            <div className="font-mono text-xs leading-[1.6] text-faint">
              <div className="mb-2 font-bold text-ink">
                in <LiveCountdown targetMs={cycleInfo.endsAtMs} />
              </div>
              <div>
                cycles are 7 days · auto-snapshot every sunday 23:59 CET. only
                “submit” makes a draft eligible for the next snapshot. you can
                resubmit anytime before then.
              </div>
            </div>
          </Pane>
        </div>
      </Grid>
    </Page>
  );
}
