import { content } from "@/lib/content";
import { Grid, Page, Pane, S, SDot } from "@workspace/ui/kit";
import { SignupClient } from "./signup-client";

export default function SignupPage() {
  const F = content.signup;

  return (
    <Page
      screen="02 Sign up"
      scroll
      status={
        <>
          <S k="form" v="signup.txt" />
          <SDot />
          <S k="kyc" v="none" />
          <SDot />
          <S k="auth" v="circles avatar" />
          <SDot />
          <S k="time" v="~ 1 min" />
        </>
      }
      breadcrumb="welcome / signup"
    >
      <Grid cols="2fr 1fr" gap={12} fill>
        <Pane title="signup · builder" hint="connect · sign · in">
          <SignupClient form={F} />
        </Pane>

        <div
          className="grid min-h-0 gap-3"
          style={{ gridTemplateRows: "auto 1fr" }}
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
