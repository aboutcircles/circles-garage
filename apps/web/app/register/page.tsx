import { content } from "@/lib/content";
import {
  Btn,
  Check,
  Field,
  Grid,
  Hero,
  Page,
  Pane,
  S,
  SDot,
  Section,
  Slot,
  StatusRow,
} from "@workspace/ui/kit";

export default function RegisterPage() {
  const d = content.draft;
  const passing = d.checks.filter((c) => c.ok).length;

  return (
    <Page
      screen="05 Register mini-app"
      status={
        <>
          <S k="draft" v={d.id} accent />
          <SDot />
          <S k="autosaved" v={d.autosaved} />
          <SDot />
          <S k="status" v={d.status} />
        </>
      }
      breadcrumb={`dashboard / mini-apps / ${d.id} · new submission`}
    >
      <Grid cols="1.4fr 1fr" rows="auto 1fr" gap={12} fill>
        {/* hero (full width) — name, steps, hero copy */}
        <Pane
          title="register mini-app · drop the goods"
          hint="5 sections / autosaves"
          span={2}
        >
          <div className="flex flex-wrap items-end justify-between gap-5">
            <Hero
              size="md"
              sub={
                'Save as you go — only "submit" makes it eligible for the next snapshot.'
              }
            >
              {d.name}
              <span className="text-faint">.draft</span>
            </Hero>
            <Steps all={d.steps} current={d.currentStep} />
          </div>
        </Pane>

        {/* left: identity + contracts */}
        <Pane title="01 · identity">
          <Field label="app name" required value={d.name} />
          <Field
            label="slug"
            value={d.slug}
            hint={`builder.circles.garage/p/${d.slug}`}
          />
          <Field label="one-line pitch" required value={d.pitch} />
          <Field label="track" value={d.track} />
          <Field label="status" value={d.appStatus} />

          <Section
            num="02"
            label="contracts"
            hint="up to 5 · we subscribe to events"
          >
            <div className="font-mono text-[13px] leading-[1.95]">
              {d.contracts.map((c, i) => (
                <div key={i}>
                  [{c.chain}] {c.addr} · {c.label}
                  <span className="ml-2.5 text-faint">
                    {c.verified ? "✓ verified" : "○ pending"}
                  </span>
                </div>
              ))}
              <div className="text-faint">[ + paste address ]</div>
            </div>
          </Section>
        </Pane>

        {/* right: proof of life */}
        <Pane
          title="03 · proof of life"
          hint="live · repo · screenshots · readme"
        >
          <Field label="live link" required value={d.liveLink} />
          <Field label="repo" value={d.repo} />
          <div className="mt-3.5 grid grid-cols-3 gap-2">
            <Slot label="screenshot · home" h={84} />
            <Slot label="screenshot · flow" h={84} />
            <Slot label="+ drop here" h={84} />
          </div>
          <div className="mt-3.5 bg-ghost px-3 py-2.5 font-mono text-xs leading-[1.7]">
            <div className="text-faint"># readme.md</div>
            <div>
              <b>what:</b> {d.readme.what}
            </div>
            <div>
              <b>why:</b> {d.readme.why}
            </div>
            <div>
              <b>try:</b> {d.readme.try}{" "}
              <span className="text-faint">▮</span>
            </div>
          </div>
        </Pane>

        {/* full-width: measures + review */}
        <Pane
          title="04 · how to be measured · 05 · review"
          hint="tick what counts · changeable once per cycle"
          span={2}
        >
          <Grid cols={2} gap={28}>
            <div>
              <div className="mb-2.5 font-mono text-[11px] uppercase tracking-[0.12em] text-faint">
                04 · measures
              </div>
              {d.measures.map((m, i) => (
                <Check key={i} line on={m.on} label={m.label} hint={m.hint} />
              ))}
            </div>

            <div>
              <div className="mb-2.5 font-mono text-[11px] uppercase tracking-[0.12em] text-faint">
                05 · review · {passing}/{d.checks.length} passing
              </div>
              {d.checks.map((c, i) => (
                <StatusRow key={i} ok={c.ok} label={c.label} />
              ))}

              <div className="mt-[18px] flex justify-end gap-2.5">
                <Btn sm>← save &amp; exit</Btn>
                <Btn sm>preview public page</Btn>
                <Btn primary>submit for cycle 12 →</Btn>
              </div>
            </div>
          </Grid>
        </Pane>
      </Grid>
    </Page>
  );
}

function Steps({
  all,
  current,
}: {
  all: readonly string[];
  current: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
      {all.map((s, i) => {
        const completed = i < current;
        const isCurrent = i === current;
        const className = completed
          ? "bg-ink text-paper font-bold"
          : isCurrent
            ? "border border-hair text-ink font-bold"
            : "border border-hair text-faint";

        return (
          <span
            key={s}
            className={`px-2.5 py-1 uppercase tracking-[0.12em] ${className}`}
          >
            {String(i + 1).padStart(2, "0")} · {s}
          </span>
        );
      })}
    </div>
  );
}
