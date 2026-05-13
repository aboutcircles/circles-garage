// kit.jsx — Circles Garage · merged design system primitives
// monospace, monochrome, paper-on-ink. Pane chrome (titled boxes) for
// dense screens, § section markers + dotted-underline fields for forms.

// ── tokens ──────────────────────────────────────────────────────
const k = {
  ink:    'var(--ink, #14110d)',
  paper:  'var(--paper, #f6f4ef)',
  hair:   'var(--hair, rgba(20,17,13,0.12))',
  faint:  'var(--faint, rgba(20,17,13,0.55))',
  ghost:  'var(--ghost, rgba(20,17,13,0.06))',
  mono:   'var(--mono, "JetBrains Mono", "IBM Plex Mono", ui-monospace, Menlo, monospace)',
};

// applied once by app.jsx
function applyTokens(palette) {
  const p = palette || PALETTES.bone;
  const r = document.documentElement;
  r.style.setProperty('--ink', p.ink);
  r.style.setProperty('--paper', p.paper);
  r.style.setProperty('--hair', p.hair);
  r.style.setProperty('--faint', p.faint);
  r.style.setProperty('--ghost', p.ghost);
  r.style.setProperty('--mono', p.mono || '"JetBrains Mono", "IBM Plex Mono", ui-monospace, monospace');
}

const PALETTES = {
  bone:      { paper: '#f6f4ef', ink: '#14110d', hair: 'rgba(20,17,13,0.12)', faint: 'rgba(20,17,13,0.55)', ghost: 'rgba(20,17,13,0.06)' },
  newsprint: { paper: '#ecebe6', ink: '#0d0d0d', hair: 'rgba(0,0,0,0.14)',    faint: 'rgba(0,0,0,0.55)',    ghost: 'rgba(0,0,0,0.06)' },
  eucalyptus:{ paper: '#eef0e9', ink: '#0e1a14', hair: 'rgba(14,26,20,0.14)', faint: 'rgba(14,26,20,0.5)',  ghost: 'rgba(14,26,20,0.06)' },
  inverse:   { paper: '#14110d', ink: '#f6f4ef', hair: 'rgba(246,244,239,0.16)', faint: 'rgba(246,244,239,0.6)', ghost: 'rgba(246,244,239,0.08)' },
};

// ── page shell ──────────────────────────────────────────────────
// every screen wraps in <Page>. Slim dark status bar top, slim light
// command bar bottom, panes go in between via <Grid>/<Pane>.
function Page({ children, screen, status, breadcrumb, cmd, scroll }) {
  return (
    <div data-screen-label={screen} style={{
      width: '100%', height: '100%',
      background: k.paper, color: k.ink,
      fontFamily: k.mono, fontSize: 13,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden', position: 'relative',
    }}>
      <StatusBar status={status} />
      <div style={{ flex: 1, overflow: scroll ? 'auto' : 'hidden', padding: 16 }}>{children}</div>
      <CmdBar breadcrumb={breadcrumb} cmd={cmd} />
    </div>
  );
}

function StatusBar({ status }) {
  return (
    <div style={{
      background: k.ink, color: k.paper,
      padding: '8px 16px',
      fontFamily: k.mono, fontSize: 11,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      letterSpacing: 0.04, flexWrap: 'wrap', gap: 8,
    }}>
      <div style={{ display: 'flex', gap: 18 }}>
        <span style={{ fontWeight: 700 }}>circles/garage</span>
        <span style={{ opacity: 0.55 }}>builder.circles.garage</span>
      </div>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        {status}
      </div>
    </div>
  );
}

// generic key-value cell used inside StatusBar
function S({ k: key, v, accent }) {
  return (
    <span>
      <span style={{ opacity: 0.55, marginRight: 6 }}>{key}</span>
      <span style={{ fontWeight: accent ? 700 : 400 }}>{v}</span>
    </span>
  );
}
function SDot() { return <span style={{ opacity: 0.3 }}>·</span>; }

function CmdBar({ breadcrumb, cmd }) {
  return (
    <div style={{
      borderTop: `1px solid ${k.hair}`,
      padding: '8px 16px',
      fontFamily: k.mono, fontSize: 11,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      color: k.faint, gap: 12,
    }}>
      <span>
        {breadcrumb || <><span style={{ color: k.ink }}>:</span> <span style={{ opacity: 0.6 }}>{cmd || 'press ? for help'}</span></>}
      </span>
      <span style={{ display: 'flex', gap: 16 }}>
        <span><Kbd>?</Kbd> help</span>
        <span><Kbd>g</Kbd> goto</span>
        <span><Kbd>n</Kbd> new app</span>
        <span><Kbd>q</Kbd> sign out</span>
      </span>
    </div>
  );
}

function Kbd({ children }) {
  return (
    <span style={{
      fontFamily: k.mono, fontSize: 10,
      border: `1px solid currentColor`, padding: '0 5px',
      borderRadius: 2, color: k.ink,
    }}>{children}</span>
  );
}

// ── grid + pane ─────────────────────────────────────────────────
function Grid({ cols = 1, rows, gap = 12, children, style, fill }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: typeof cols === 'number' ? `repeat(${cols}, 1fr)` : cols,
      gridTemplateRows: rows,
      gap,
      height: fill ? '100%' : 'auto',
      ...style,
    }}>{children}</div>
  );
}

function Pane({ title, hint, headRight, span, rowSpan, children, dense, flush, style }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      border: `1px solid ${k.ink}`,
      gridColumn: span ? `span ${span}` : undefined,
      gridRow: rowSpan ? `span ${rowSpan}` : undefined,
      overflow: 'hidden',
      ...style,
    }}>
      {title && (
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: k.ink, color: k.paper,
          padding: '5px 10px',
          fontFamily: k.mono, fontSize: 11,
          letterSpacing: 0.08, textTransform: 'uppercase',
        }}>
          <span><span style={{ opacity: 0.55 }}>┌─</span> {title} <span style={{ opacity: 0.55 }}>─┐</span></span>
          {(headRight || hint) && (
            <span style={{ opacity: 0.7, fontSize: 10, textTransform: 'none', letterSpacing: 0 }}>
              {headRight || hint}
            </span>
          )}
        </div>
      )}
      <div style={{
        padding: flush ? 0 : (dense ? 12 : 16),
        flex: 1, position: 'relative',
        overflow: 'hidden',
      }}>{children}</div>
    </div>
  );
}

// ── content primitives ─────────────────────────────────────────
function Section({ num, label, hint, children, style }) {
  return (
    <div style={{ marginTop: 28, ...style }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 14 }}>
        <span style={{ fontFamily: k.mono, fontSize: 11, color: k.faint }}>§ {num}</span>
        <span style={{ fontFamily: k.mono, fontSize: 16, fontWeight: 700, letterSpacing: -0.2 }}>— {label}</span>
        <span style={{ flex: 1, borderTop: `1px solid ${k.hair}` }} />
        {hint && <span style={{ fontFamily: k.mono, fontSize: 11, color: k.faint }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Hero({ kicker, children, sub, ctas, size = 'lg' }) {
  const sizes = { xl: 52, lg: 40, md: 32 };
  return (
    <div>
      {kicker && <div style={{ fontFamily: k.mono, fontSize: 11, color: k.faint, letterSpacing: 0.15, marginBottom: 8 }}>{kicker}</div>}
      <div style={{
        fontFamily: k.mono, fontSize: sizes[size], fontWeight: 700,
        letterSpacing: -1.3, lineHeight: 1.02,
      }}>{children}</div>
      {sub && <div style={{ fontFamily: k.mono, fontSize: 14, color: k.faint, marginTop: 14, maxWidth: 640, lineHeight: 1.55 }}>{sub}</div>}
      {ctas && <div style={{ display: 'flex', gap: 12, marginTop: 18, alignItems: 'center' }}>{ctas}</div>}
    </div>
  );
}

// dotted-underline inline field
function Field({ label, value, placeholder, required, hint }) {
  return (
    <div style={{ padding: '10px 0', borderBottom: `1px dotted ${k.hair}` }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, fontFamily: k.mono, fontSize: 13 }}>
        <span style={{ width: 220, color: k.faint, flexShrink: 0 }}>
          {label}{required && <span style={{ color: k.ink }}> *</span>}:
        </span>
        <span style={{ flex: 1, color: value ? k.ink : k.faint, fontStyle: value ? 'normal' : 'italic' }}>
          {value || placeholder || '________'}
        </span>
      </div>
      {hint && <div style={{ fontFamily: k.mono, fontSize: 11, color: k.faint, marginLeft: 232, marginTop: 2 }}>↳ {hint}</div>}
    </div>
  );
}

function Slot({ label, h = 100, style }) {
  return (
    <div style={{
      border: `1px dashed ${k.hair}`,
      height: h,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: k.faint, fontFamily: k.mono, fontSize: 10,
      letterSpacing: 0.1, textTransform: 'uppercase',
      position: 'relative', overflow: 'hidden',
      ...style,
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(135deg, transparent 49.5%, ${k.hair} 49.5%, ${k.hair} 50.5%, transparent 50.5%)`,
        backgroundSize: '12px 12px', opacity: 0.5,
      }} />
      <span style={{ position: 'relative', background: k.paper, padding: '0 8px' }}>{label}</span>
    </div>
  );
}

function Btn({ children, primary, ghost, sm, style }) {
  if (ghost) {
    return (
      <span style={{
        fontFamily: k.mono, fontSize: 12, color: k.ink,
        textDecoration: 'underline', textUnderlineOffset: 3,
        cursor: 'pointer', ...style,
      }}>{children}</span>
    );
  }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      border: `${primary ? 1 : 1}px solid ${k.ink}`,
      background: primary ? k.ink : 'transparent',
      color: primary ? k.paper : k.ink,
      padding: sm ? '5px 10px' : '8px 14px',
      fontFamily: k.mono, fontSize: sm ? 11 : 12,
      letterSpacing: 0.04, textTransform: 'uppercase',
      fontWeight: 700, cursor: 'pointer',
      ...style,
    }}>{children}</span>
  );
}

function Pill({ children, hollow, style }) {
  return (
    <span style={{
      display: 'inline-block',
      border: `1px solid ${k.ink}`,
      background: hollow ? 'transparent' : 'transparent',
      color: k.ink,
      padding: '1px 7px 2px',
      fontFamily: k.mono, fontSize: 10,
      letterSpacing: 0.1, textTransform: 'uppercase',
      ...style,
    }}>{children}</span>
  );
}

// 4-tile stat strip for inside a Pane
function StatStrip({ items }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: `repeat(${items.length}, 1fr)`,
      border: `1px solid ${k.hair}`,
    }}>
      {items.map((it, i) => (
        <div key={i} style={{
          padding: '12px 14px',
          borderRight: i < items.length - 1 ? `1px solid ${k.hair}` : 'none',
        }}>
          <div style={{ fontFamily: k.mono, fontSize: 10, color: k.faint, letterSpacing: 0.12, textTransform: 'uppercase' }}>{it.k}</div>
          <div style={{ fontFamily: k.mono, fontSize: 28, fontWeight: 700, letterSpacing: -0.7, marginTop: 6 }}>{it.v}</div>
          {it.d && <div style={{ fontFamily: k.mono, fontSize: 10, color: k.faint, marginTop: 4 }}>{it.d}</div>}
        </div>
      ))}
    </div>
  );
}

// generic mono table
function Table({ head, rows, sizes }) {
  return (
    <table style={{ width: '100%', fontFamily: k.mono, fontSize: 12, borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ fontSize: 9, color: k.faint, textTransform: 'uppercase', letterSpacing: 0.18 }}>
          {head.map((h, i) => (
            <th key={i} style={{
              textAlign: (sizes && sizes[i] && sizes[i].right) ? 'right' : 'left',
              padding: '6px 8px 6px 0',
              borderBottom: `1px solid ${k.ink}`,
              width: sizes && sizes[i] ? sizes[i].w : undefined,
              fontWeight: 400,
            }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri} style={{ borderBottom: `1px dotted ${k.hair}`, opacity: row._muted ? 0.5 : 1 }}>
            {row.cells.map((c, ci) => (
              <td key={ci} style={{
                textAlign: (sizes && sizes[ci] && sizes[ci].right) ? 'right' : 'left',
                padding: '10px 8px 10px 0',
                color: c.muted ? k.faint : k.ink,
                fontWeight: c.bold ? 700 : 400,
                fontSize: c.size || 12,
              }}>{c.v ?? c}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// checkbox row
function Check({ on, label, hint, line }) {
  if (line) {
    // ascii inline form: [x] label
    return (
      <div style={{ fontFamily: k.mono, fontSize: 13, lineHeight: 1.9, color: on ? k.ink : k.faint }}>
        [{on ? 'x' : ' '}] {label} {hint && <span style={{ color: k.faint, marginLeft: 6 }}>· {hint}</span>}
      </div>
    );
  }
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0',
      borderBottom: `1px dotted ${k.hair}`,
      fontFamily: k.mono, fontSize: 13,
    }}>
      <span style={{
        width: 14, height: 14, border: `1.5px solid ${k.ink}`,
        background: on ? k.ink : 'transparent',
        display: 'inline-block', position: 'relative', flexShrink: 0,
      }}>
        {on && <span style={{ position: 'absolute', top: -4, left: 1, color: k.paper, fontSize: 13, fontWeight: 700 }}>✓</span>}
      </span>
      <span style={{ flex: 1 }}>{label}</span>
      {hint && <span style={{ color: k.faint, fontSize: 11 }}>{hint}</span>}
    </div>
  );
}

// small status indicator row (review checks)
function StatusRow({ ok, label }) {
  return (
    <div style={{
      display: 'flex', gap: 10, padding: '6px 0', alignItems: 'center',
      fontFamily: k.mono, fontSize: 12,
      borderBottom: `1px dotted ${k.hair}`,
    }}>
      <span style={{ width: 14, color: ok ? k.ink : k.faint, fontWeight: 700 }}>{ok ? '✓' : '○'}</span>
      <span style={{ color: ok ? k.ink : k.faint, flex: 1 }}>{label}</span>
    </div>
  );
}

// ── exports ─────────────────────────────────────────────────────
Object.assign(window, {
  k, PALETTES, applyTokens,
  Page, StatusBar, CmdBar, S, SDot, Kbd,
  Grid, Pane,
  Section, Hero, Field, Slot, Btn, Pill,
  StatStrip, Table, Check, StatusRow,
});
