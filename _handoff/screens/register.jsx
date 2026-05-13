// screens/register.jsx — mini-app submission / edit draft

function ScreenRegister() {
  const d = C.draft;
  return (
    <Page screen="05 Register mini-app"
      status={<>
        <S k="draft" v={d.id} accent />
        <SDot />
        <S k="autosaved" v={d.autosaved} />
        <SDot />
        <S k="status" v={d.status} />
      </>}
      breadcrumb={'dashboard / mini-apps / ' + d.id + ' · new submission'}>

      <Grid cols="1.4fr 1fr" rows="auto 1fr" gap={12} fill>

        {/* hero (full width) — name, steps, hero copy */}
        <Pane title="register mini-app · drop the goods" hint="5 sections / autosaves" span={2}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap' }}>
            <Hero size="md" sub='Save as you go — only "submit" makes it eligible for the next snapshot.'>
              {d.name}<span style={{ color: k.faint }}>.draft</span>
            </Hero>
            <Steps all={d.steps} current={d.currentStep} />
          </div>
        </Pane>

        {/* left: identity + contracts */}
        <Pane title="01 · identity">
          <Field label="app name"        required value={d.name} />
          <Field label="slug"            value={d.slug} hint={'builder.circles.garage/p/' + d.slug} />
          <Field label="one-line pitch"  required value={d.pitch} />
          <Field label="track"           value={d.track} />
          <Field label="status"          value={d.appStatus} />

          <Section num="02" label="contracts" hint="up to 5 · we subscribe to events">
            <div style={{ fontFamily: k.mono, fontSize: 13, lineHeight: 1.95 }}>
              {d.contracts.map((c, i) => (
                <div key={i}>
                  [{c.chain}] {c.addr} · {c.label}
                  <span style={{ color: k.faint, marginLeft: 10 }}>{c.verified ? '✓ verified' : '○ pending'}</span>
                </div>
              ))}
              <div style={{ color: k.faint }}>[ + paste address ]</div>
            </div>
          </Section>
        </Pane>

        {/* right: proof of life */}
        <Pane title="03 · proof of life" hint="live · repo · screenshots · readme">
          <Field label="live link" required value={d.liveLink} />
          <Field label="repo"      value={d.repo} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 14 }}>
            <Slot label="screenshot · home" h={84} />
            <Slot label="screenshot · flow" h={84} />
            <Slot label="+ drop here" h={84} />
          </div>
          <div style={{
            marginTop: 14, padding: '10px 12px', background: k.ghost,
            fontFamily: k.mono, fontSize: 12, lineHeight: 1.7,
          }}>
            <div style={{ color: k.faint }}># readme.md</div>
            <div><b>what:</b> {d.readme.what}</div>
            <div><b>why:</b>  {d.readme.why}</div>
            <div><b>try:</b>  {d.readme.try} <span style={{ color: k.faint }}>▮</span></div>
          </div>
        </Pane>

        {/* full-width: measures + review */}
        <Pane title="04 · how to be measured · 05 · review" hint="tick what counts · changeable once per cycle" span={2}>
          <Grid cols={2} gap={28}>

            <div>
              <div style={{ fontFamily: k.mono, fontSize: 11, color: k.faint, textTransform: 'uppercase', letterSpacing: 0.12, marginBottom: 10 }}>04 · measures</div>
              {d.measures.map((m, i) => <Check key={i} line on={m.on} label={m.label} hint={m.hint} />)}
            </div>

            <div>
              <div style={{ fontFamily: k.mono, fontSize: 11, color: k.faint, textTransform: 'uppercase', letterSpacing: 0.12, marginBottom: 10 }}>
                05 · review · {d.checks.filter((c) => c.ok).length}/{d.checks.length} passing
              </div>
              {d.checks.map((c, i) => <StatusRow key={i} ok={c.ok} label={c.label} />)}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
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

function Steps({ all, current }) {
  return (
    <div style={{ display: 'flex', gap: 6, fontFamily: k.mono, fontSize: 10, alignItems: 'center', flexWrap: 'wrap' }}>
      {all.map((s, i) => (
        <span key={s} style={{
          padding: '4px 10px',
          background: i < current ? k.ink : 'transparent',
          color:      i < current ? k.paper : (i <= current ? k.ink : k.faint),
          border:     i < current ? 'none' : `1px solid ${k.hair}`,
          fontWeight: i <= current ? 700 : 400,
          textTransform: 'uppercase', letterSpacing: 0.12,
        }}>
          {String(i + 1).padStart(2, '0')} · {s}
        </span>
      ))}
    </div>
  );
}

window.ScreenRegister = ScreenRegister;
