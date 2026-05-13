// screens/dashboard.jsx — logged-in builder dashboard

function ScreenDashboard() {
  const me = C.me;
  const p = C.program;
  return (
    <Page screen="03 Dashboard"
      status={<>
        <S k="you" v={me.handle} accent />
        <SDot />
        <S k="rank" v={'#' + String(me.rank).padStart(2, '0')} accent />
        <SDot />
        <S k="payout" v={me.projectedPayout} accent />
        <SDot />
        <S k="snapshot" v={p.snapshotIn} />
      </>}
      breadcrumb={`signed-in · ${me.address} · org: ${me.org}`}>

      <Grid cols="1.4fr 1fr" rows="auto auto 1fr" gap={12} fill>

        {/* hero (full width) */}
        <Pane title="dashboard" hint={'cycle ' + p.cycle + ' · welcome back'} span={2}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' }}>
            <Hero size="md" sub={`Cycle ${p.cycle} snapshot in ${p.snapshotIn}. Keep moving.`}>
              hello, {me.handle}.
            </Hero>
            <div style={{ display: 'flex', gap: 8 }}>
              <Btn sm>edit profile</Btn>
              <Btn sm primary>+ register mini-app</Btn>
            </div>
          </div>
          <div style={{ marginTop: 18 }}>
            <StatStrip items={[
              { k: 'rank · this week',    v: '#' + String(me.rank).padStart(2, '0'), d: `was #${String(me.rankPrev).padStart(2, '0')} last week` },
              { k: 'new minters · 7d',    v: me.newMinters7d,                        d: 'across ' + me.apps.filter((a) => a.status === 'LIVE').length + ' apps' },
              { k: 'projected payout',    v: me.projectedPayout,                     d: 'incl. ' + me.streakBonus + ' streak bonus' },
              { k: 'circle of life',      v: me.coLifeWeeks + ' wks',                d: "don't break it" },
            ]} />
          </div>
        </Pane>

        {/* mini-apps (left, spans 2 rows) */}
        <Pane title="your mini-apps" hint={`${me.apps.filter((a) => a.status === 'LIVE').length} live · ${me.apps.filter((a) => a.status === 'DRAFT').length} draft`} rowSpan={2}>
          {me.apps.map((a) => <AppRow key={a.name} app={a} />)}
          <div style={{ marginTop: 14, display: 'flex', gap: 12, alignItems: 'center' }}>
            <Btn sm>+ register another</Btn>
            <span style={{ fontFamily: k.mono, fontSize: 11, color: k.faint }}>3 mini-apps max per org</span>
          </div>
        </Pane>

        {/* right: pool */}
        <Pane title={'pool · cycle ' + p.cycle} hint="your share">
          <div style={{ fontFamily: k.mono, fontSize: 30, fontWeight: 700, letterSpacing: -0.8 }}>{me.projectedPayout}</div>
          <div style={{ marginTop: 10, height: 20, border: `1px solid ${k.ink}`, display: 'flex', fontFamily: k.mono, fontSize: 10 }}>
            <div style={{ width: '66.6%', background: k.ink, color: k.paper, display: 'flex', alignItems: 'center', padding: '0 8px' }}>⅔ winners · {p.poolSplit.winnersAmt}</div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 8px' }}>⅓ life</div>
          </div>
          <div style={{ marginTop: 10, fontFamily: k.mono, fontSize: 11, color: k.faint, lineHeight: 1.6 }}>
            ~ {me.projectedPayout} = your projected share<br/>
            {me.streakBonus} streak bonus ({me.coLifeWeeks}w)
          </div>
        </Pane>

        {/* right: activity + todo */}
        <Grid cols={2} gap={12}>
          <Pane title="activity" hint="tail -f">
            <div style={{ fontFamily: k.mono, fontSize: 12, lineHeight: 1.85 }}>
              {me.activity.map((a, i) => (
                <div key={i}>
                  <span style={{ color: k.faint, marginRight: 8 }}>{a.t}</span>
                  {a.body}
                </div>
              ))}
            </div>
          </Pane>

          <Pane title="todo" hint={me.todos.filter((t) => !t.done).length + ' open'}>
            <div style={{ fontFamily: k.mono, fontSize: 13, lineHeight: 2 }}>
              {me.todos.map((t, i) => (
                <div key={i} style={{
                  color: t.done ? k.faint : k.ink,
                  textDecoration: t.done ? 'line-through' : 'none',
                  display: 'flex', justifyContent: 'space-between', gap: 8,
                }}>
                  <span>[{t.done ? 'x' : ' '}] {t.body}</span>
                  {t.hint && <span style={{ color: k.faint, fontSize: 11 }}>· {t.hint}</span>}
                </div>
              ))}
            </div>
          </Pane>
        </Grid>
      </Grid>
    </Page>
  );
}

function AppRow({ app }) {
  const a = app;
  const max = a.chart.length ? Math.max(...a.chart, 1) : 1;
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1.4fr 80px auto', gap: 16,
      alignItems: 'center', padding: '12px 0',
      borderBottom: `1px dotted ${k.hair}`,
      opacity: a.muted ? 0.55 : 1,
    }}>
      <div>
        <div style={{ fontFamily: k.mono, fontSize: 16, fontWeight: 700, letterSpacing: -0.3 }}>
          {a.name}
          <span style={{ fontSize: 10, color: k.faint, marginLeft: 8, fontWeight: 400 }}>[{a.status}]</span>
        </div>
        <div style={{ fontSize: 12, color: k.faint, marginTop: 4, maxWidth: 360 }}>{a.line}</div>
        <div style={{ fontSize: 11, color: k.faint, marginTop: 6 }}>
          WAU {a.wau} · {a.vol} · streak {a.streak}
        </div>
      </div>
      <div>
        {a.chart.length ? (
          <svg width="80" height="32" viewBox={`0 0 ${a.chart.length * 8} 32`} preserveAspectRatio="none">
            {a.chart.map((v, i) => (
              <rect key={i} x={i * 8 + 1} y={30 - (v / max) * 26} width="5" height={(v / max) * 26} fill={k.ink} />
            ))}
          </svg>
        ) : (
          <div style={{ width: 80, height: 32, border: `1px dashed ${k.hair}`, fontSize: 9, color: k.faint, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: k.mono }}>NO DATA</div>
        )}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <Btn sm>open</Btn>
        <Btn sm ghost>edit</Btn>
      </div>
    </div>
  );
}

window.ScreenDashboard = ScreenDashboard;
