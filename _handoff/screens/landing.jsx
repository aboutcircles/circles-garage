// screens/landing.jsx — public homepage for circles/garage

function ScreenLanding() {
  const p = C.program;
  const L = C.landing;
  return (
    <Page screen="01 Landing"
      status={<>
        <S k="cycle" v={p.cycle} accent />
        <SDot />
        <S k="pool" v={p.pool} accent />
        <SDot />
        <S k="builders" v="142" />
        <SDot />
        <S k="new minters · 7d" v="2,914" />
        <SDot />
        <span style={{ opacity: 0.55 }}>{p.nowCET}</span>
      </>}
      breadcrumb="welcome · open call · public">
      <Grid cols="1.6fr 1fr" rows="auto auto 1fr" gap={12} fill>

        {/* hero (full width) */}
        <Pane title="program · open call · cycle 12" hint="welcome.txt" span={2}>
          <Hero
            kicker={L.kicker}
            size="xl"
            sub={L.sub}
            ctas={<>
              <Btn primary>{L.ctaPrimary}</Btn>
              <Btn>{L.ctaSecondary}</Btn>
              <Btn ghost>connect wallet</Btn>
            </>}>
            {L.headline[0]}<br/>{L.headline[1]}
          </Hero>
        </Pane>

        {/* left col */}
        <div style={{ display: 'grid', gridTemplateRows: 'auto auto 1fr', gap: 12, minHeight: 0 }}>
          <Pane title="how it works" hint="3 steps · no rounds">
            {L.steps.map(([n, t, b], i) => (
              <div key={n} style={{
                display: 'grid', gridTemplateColumns: '36px 1fr', padding: '8px 0',
                borderBottom: i < L.steps.length - 1 ? `1px dotted ${k.hair}` : 'none',
              }}>
                <span style={{ color: k.faint }}>{n}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{t}</div>
                  <div style={{ color: k.faint, fontSize: 11, marginTop: 2 }}>{b}</div>
                </div>
              </div>
            ))}
          </Pane>

          <Pane title="leaderboard · this week" hint="top 5 of 142">
            <Table
              head={['#', 'builder · app', 'mints', 'payout']}
              sizes={[{ w: 28 }, {}, { right: true }, { right: true }]}
              rows={C.leaderboard.slice(0, 5).map((r) => ({
                _muted: r.muted,
                cells: [
                  { v: String(r.rank).padStart(2, '0') + (r.star ? ' ★' : ''), muted: true },
                  { v: <><b>{r.builder}</b> <span style={{ color: k.faint, marginLeft: 6 }}>↳ {r.app}</span></> },
                  { v: r.mints },
                  { v: r.payout, bold: true },
                ],
              }))}
            />
            <div style={{ marginTop: 10, fontFamily: k.mono, fontSize: 11, color: k.faint }}>
              ↳ <span style={{ color: k.ink, borderBottom: `1px solid ${k.ink}` }}>see full table (130 more)</span>
            </div>
          </Pane>

          <Pane title="manifesto.md" hint="why this exists">
            <div style={{ fontFamily: k.mono, fontSize: 13, lineHeight: 1.65, color: k.ink }}>
              {L.manifesto.map((p, i) => (
                <p key={i} style={{ margin: i === 0 ? 0 : '10px 0 0', color: i === L.manifesto.length - 1 ? k.faint : k.ink }}>{p}</p>
              ))}
            </div>
          </Pane>
        </div>

        {/* right col */}
        <div style={{ display: 'grid', gridTemplateRows: 'auto auto auto 1fr', gap: 12, minHeight: 0 }}>
          <Pane title="cycle 12 · pool" hint="updated 60s">
            <div style={{ fontFamily: k.mono, fontSize: 36, fontWeight: 700, letterSpacing: -1, lineHeight: 1 }}>{p.pool}</div>
            <PoolBar />
            <div style={{ marginTop: 10, fontFamily: k.mono, fontSize: 11, color: k.faint, lineHeight: 1.6 }}>
              {p.poolSplit.winnersAmt} · winners pool ({p.poolSplit.winners}/{p.poolSplit.denom})<br/>
              {p.poolSplit.lifeAmt} · circle-of-life ({p.poolSplit.life}/{p.poolSplit.denom})
            </div>
          </Pane>

          <Pane title="counters" hint="live">
            {C.counters.slice(0, 3).map((c, i, a) => (
              <div key={c.k} style={{
                display: 'grid', gridTemplateColumns: '1fr auto', padding: '8px 0',
                borderBottom: i < a.length - 1 ? `1px dotted ${k.hair}` : 'none',
                alignItems: 'baseline',
              }}>
                <span>
                  <span style={{ fontWeight: 700, fontSize: 20, letterSpacing: -0.4 }}>{c.v}</span>
                  <span style={{ fontSize: 11, color: k.faint, marginLeft: 8 }}>{c.k}</span>
                </span>
                <span style={{ fontSize: 11, color: k.faint }}>{c.d}</span>
              </div>
            ))}
          </Pane>

          <Pane title="schedule" hint="cycle 12">
            {C.schedule.map((s, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '70px 1fr auto',
                padding: '6px 0', alignItems: 'center',
                borderBottom: i < C.schedule.length - 1 ? `1px dotted ${k.hair}` : 'none',
                fontSize: 12,
              }}>
                <span style={{ color: k.faint }}>{s.d}</span>
                <span>{s.body}</span>
                {s.now && <Pill style={{ fontSize: 9 }}>now</Pill>}
              </div>
            ))}
          </Pane>

          <Pane title="bulletin" hint="from the team">
            <div style={{ fontFamily: k.mono, fontSize: 12, lineHeight: 1.7 }}>
              {C.landing.bulletin.map((b, i) => <div key={i}>· {b}</div>)}
            </div>
          </Pane>
        </div>
      </Grid>
    </Page>
  );
}

function PoolBar() {
  const s = C.program.poolSplit;
  const pct = (s.winners / s.denom) * 100;
  return (
    <div style={{ marginTop: 10, height: 20, border: `1px solid ${k.ink}`, display: 'flex', fontFamily: k.mono, fontSize: 10 }}>
      <div style={{ width: pct + '%', background: k.ink, color: k.paper, display: 'flex', alignItems: 'center', padding: '0 8px' }}>{s.winners}/{s.denom} winners</div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 8px' }}>{s.life}/{s.denom} life</div>
    </div>
  );
}

window.ScreenLanding = ScreenLanding;
