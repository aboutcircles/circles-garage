// screens/leaderboard.jsx — public ranking + secondary panels

function ScreenLeaderboard() {
  const p = C.program;
  return (
    <Page screen="04 Leaderboard"
      status={<>
        <S k="cycle" v={p.cycle} accent />
        <SDot />
        <S k="snapshot" v={p.snapshotIn} accent />
        <SDot />
        <S k="updated" v={p.lastUpdated} />
        <SDot />
        <S k="builders" v={C.leaderboard.length + '+'} />
      </>}
      breadcrumb={'leaderboard / cycle ' + p.cycle + ' / open'}>

      <Grid cols="1.6fr 1fr" gap={12} fill>

        {/* main table */}
        <Pane title="who moved the needle" hint="rank by ↓ new minters · 142 builders">

          {/* filter strip */}
          <div style={{
            display: 'flex', gap: 22, paddingBottom: 10, marginBottom: 12,
            fontFamily: k.mono, fontSize: 11, color: k.faint,
            borderBottom: `1px solid ${k.ink}`,
          }}>
            <span style={{ color: k.ink, fontWeight: 700, borderBottom: `2px solid ${k.ink}`, paddingBottom: 10, marginBottom: -11 }}>this week</span>
            <span>all time</span>
            <span>circle of life</span>
            <span>by track</span>
            <span style={{ marginLeft: 'auto' }}>rank ↓ <span style={{ color: k.ink }}>new minters</span></span>
            <span>search ⌕</span>
            <span>export csv ↓</span>
          </div>

          <Table
            head={['#', 'builder', 'org', 'app', 'pitch', 'mints', 'vol', 'payout', 'streak']}
            sizes={[{ w: 30 }, {}, {}, {}, {}, { right: true }, { right: true }, { right: true }, { right: true, w: 50 }]}
            rows={C.leaderboard.map((r) => ({
              _muted: r.muted,
              cells: [
                { v: String(r.rank).padStart(2, '0') + (r.star ? ' ★' : ''), muted: true },
                { v: r.builder, bold: true },
                { v: r.org, muted: true, size: 11 },
                { v: r.app, bold: true },
                { v: r.pitch, muted: true, size: 11 },
                { v: r.mints },
                { v: r.vol, muted: true },
                { v: r.payout, bold: true },
                { v: r.streak, muted: true, size: 11 },
              ],
            }))}
          />

          <div style={{ marginTop: 14, fontFamily: k.mono, fontSize: 11, color: k.faint, display: 'flex', justifyContent: 'space-between' }}>
            <span>↳ top 12 of 142</span>
            <span>
              <span style={{ color: k.ink, borderBottom: `1px solid ${k.ink}`, marginRight: 14 }}>load 50 more</span>
              <span style={{ color: k.ink, borderBottom: `1px solid ${k.ink}` }}>open archive</span>
            </span>
          </div>
        </Pane>

        {/* right column */}
        <div style={{ display: 'grid', gridTemplateRows: 'auto auto auto 1fr', gap: 12, minHeight: 0 }}>

          <Pane title="podium · this week" hint="winners">
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '8px 12px', fontFamily: k.mono, fontSize: 13, alignItems: 'baseline' }}>
              {C.leaderboard.slice(0, 3).map((r) => (
                <React.Fragment key={r.rank}>
                  <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, color: r.rank === 1 ? k.ink : k.faint }}>{String(r.rank).padStart(2, '0')}</span>
                  <span>
                    <b>{r.builder}</b><br/>
                    <span style={{ color: k.faint, fontSize: 11 }}>↳ {r.app}</span>
                  </span>
                  <span style={{ fontWeight: 700 }}>{r.payout}</span>
                </React.Fragment>
              ))}
            </div>
          </Pane>

          <Pane title="circle of life" hint="longest streak">
            <div style={{ fontFamily: k.mono, fontSize: 12, lineHeight: 1.8 }}>
              {C.circleOfLife.map((c) => (
                <div key={c.builder}>
                  <b>{c.builder}</b>
                  <span style={{ marginLeft: 8 }}>· {c.weeks} wks</span>
                  <span style={{ marginLeft: 8, color: k.faint }}>· {c.bonus} bonus</span>
                </div>
              ))}
              <div style={{ color: k.faint, marginTop: 4 }}>+9 more on the wall</div>
            </div>
          </Pane>

          <Pane title="movers" hint="biggest jumps">
            <div style={{ fontFamily: k.mono, fontSize: 12, lineHeight: 1.8 }}>
              {C.movers.map((m) => (
                <div key={m.builder} style={{ color: m.dir === 'down' ? k.faint : k.ink }}>
                  <b>{m.builder}</b>
                  <span style={{ marginLeft: 8 }}>· #{String(m.from).padStart(2, '0')} → #{String(m.to).padStart(2, '0')}</span>
                  <span style={{ marginLeft: 8 }}>· {m.dir === 'up' ? '↑' : '↓'} {Math.abs(m.from - m.to)}</span>
                </div>
              ))}
            </div>
          </Pane>

          <Pane title="schedule" hint={'cycle ' + p.cycle}>
            <div style={{ fontFamily: k.mono, fontSize: 12, lineHeight: 1.85 }}>
              {C.schedule.map((s, i) => (
                <div key={i}>
                  <span style={{ color: k.faint, marginRight: 8 }}>{s.d}</span>
                  · {s.body}
                  {s.now && <span style={{ marginLeft: 8, fontWeight: 700, padding: '0 4px', border: `1px solid ${k.ink}`, fontSize: 9 }}>NOW</span>}
                </div>
              ))}
            </div>
          </Pane>
        </div>
      </Grid>
    </Page>
  );
}

window.ScreenLeaderboard = ScreenLeaderboard;
