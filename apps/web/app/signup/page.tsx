import { content } from "@/lib/content";
import {
  Btn,
  Field,
  Grid,
  Hero,
  Page,
  Pane,
  S,
  SDot,
  Section,
} from "@workspace/ui/kit";

export default function SignupPage() {
  const F = content.signup;

  return (
    <Page
      screen="02 Sign up"
      status={
        <>
          <S k="form" v="signup.txt" />
          <SDot />
          <S k="required *" v="6 fields" />
          <SDot />
          <S k="kyc" v="none" />
          <SDot />
          <S k="time" v="~ 3 min" />
        </>
      }
      breadcrumb="welcome / signup"
    >
      <Grid cols="2fr 1fr" gap={12} fill>
        {/* form pane */}
        <Pane title="signup · builder" hint="who's shipping?">
          <Hero
            size="lg"
            sub="Three minutes. No KYC. We need to know where to send prize money and where to look up your numbers."
          >
            who&apos;s shipping?
          </Hero>

          {F.sections.map((sec) => (
            <Section
              key={sec.num}
              num={sec.num}
              label={sec.label}
              hint={sec.hint}
            >
              {sec.fields.map((f) => (
                <Field key={f.label} {...f} />
              ))}
            </Section>
          ))}

          <div className="mt-7 border-t border-hair pt-[18px] font-mono text-xs leading-[1.55] text-faint">
            [ ] {F.consent}
          </div>
          <div className="mt-4 flex items-center gap-2.5">
            <Btn primary>sign &amp; create →</Btn>
            <Btn>← back</Btn>
            <span className="ml-auto font-mono text-[11px] text-faint">
              step 1/1 · then → dashboard
            </span>
          </div>
        </Pane>

        {/* sidebar */}
        <div
          className="grid min-h-0 gap-3"
          style={{ gridTemplateRows: "auto auto 1fr" }}
        >
          <Pane title="what you get" hint="benefits">
            <div className="font-mono text-xs leading-[1.9]">
              {F.benefits.map((b, i) => (
                <div key={i}>+ {b}</div>
              ))}
              {F.benefitsMuted.map((b, i) => (
                <div key={i} className="text-faint">
                  + {b}
                </div>
              ))}
            </div>
          </Pane>

          <Pane title="already in?" hint="sign in">
            <div className="flex flex-col gap-2">
              <Btn sm>connect wallet</Btn>
              <Btn sm>sign in w/ email link</Btn>
            </div>
          </Pane>

          <Pane title="notice" hint="fine print">
            <div className="font-mono text-xs leading-[1.6] text-faint">
              <div className="mb-2 font-bold text-ink">{F.notice.head}</div>
              <div>{F.notice.body}</div>
            </div>
          </Pane>
        </div>
      </Grid>
    </Page>
  );
}
