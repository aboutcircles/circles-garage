// screens/signup.jsx — builder signup form

function ScreenSignup() {
  const F = C.signup;
  return (
    <Page screen="02 Sign up"
      status={<>
        <S k="form" v="signup.txt" />
        <SDot />
        <S k="required *" v="6 fields" />
        <SDot />
        <S k="kyc" v="none" />
        <SDot />
        <S k="time" v="~ 3 min" />
      </>}
      breadcrumb="welcome / signup">
      <Grid cols="2fr 1fr" gap={12} fill>

        {/* form pane */}
        <Pane title="signup · builder" hint="who's shipping?">
          <Hero size="lg"
            sub="Three minutes. No KYC. We need to know where to send prize money and where to look up your numbers.">
            who's shipping?
          </Hero>

          {F.sections.map((sec) => (
            <Section key={sec.num} num={sec.num} label={sec.label} hint={sec.hint}>
              {sec.fields.map((f) => <Field key={f.label} {...f} />)}
            </Section>
          ))}

          <div style={{ marginTop: 28, paddingTop: 18, borderTop: `1px solid ${k.hair}`, fontFamily: k.mono, fontSize: 12, color: k.faint, lineHeight: 1.55 }}>
            [ ] {F.consent}
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 10, alignItems: 'center' }}>
            <Btn primary>sign &amp; create →</Btn>
            <Btn>← back</Btn>
            <span style={{ marginLeft: 'auto', fontFamily: k.mono, fontSize: 11, color: k.faint }}>
              step 1/1 · then → dashboard
            </span>
          </div>
        </Pane>

        {/* sidebar */}
        <div style={{ display: 'grid', gridTemplateRows: 'auto auto 1fr', gap: 12, minHeight: 0 }}>
          <Pane title="what you get" hint="benefits">
            <div style={{ fontFamily: k.mono, fontSize: 12, lineHeight: 1.9 }}>
              {F.benefits.map((b, i) => <div key={i}>+ {b}</div>)}
              {F.benefitsMuted.map((b, i) => <div key={i} style={{ color: k.faint }}>+ {b}</div>)}
            </div>
          </Pane>

          <Pane title="already in?" hint="sign in">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Btn sm>connect wallet</Btn>
              <Btn sm>sign in w/ email link</Btn>
            </div>
          </Pane>

          <Pane title="notice" hint="fine print">
            <div style={{ fontFamily: k.mono, fontSize: 12, color: k.faint, lineHeight: 1.6 }}>
              <div style={{ color: k.ink, fontWeight: 700, marginBottom: 8 }}>{F.notice.head}</div>
              <div>{F.notice.body}</div>
            </div>
          </Pane>
        </div>
      </Grid>
    </Page>
  );
}

window.ScreenSignup = ScreenSignup;
