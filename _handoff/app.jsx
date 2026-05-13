// app.jsx — root. Renders all 5 screens as artboards on a design canvas,
// plus a Tweaks panel for palette / scroll mode.

const DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "bone",
  "fillViewport": false
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(DEFAULTS);
  React.useEffect(() => { applyTokens(PALETTES[t.palette] || PALETTES.bone); }, [t.palette]);

  // each screen sits in a 1280×900 artboard (16:10-ish desktop frame).
  return (
    <>
      <DesignCanvas>
        <DCSection id="screens" title="Circles Garage · wireframes"
          subtitle="merged direction · monospace · monochrome ink-on-paper · pane-based tooling layout">
          <DCArtboard id="landing"     label="01 · Landing"             width={1280} height={900}><ScreenLanding /></DCArtboard>
          <DCArtboard id="signup"      label="02 · Sign up"             width={1280} height={900}><ScreenSignup /></DCArtboard>
          <DCArtboard id="dashboard"   label="03 · Builder dashboard"   width={1280} height={900}><ScreenDashboard /></DCArtboard>
          <DCArtboard id="leaderboard" label="04 · Leaderboard"         width={1280} height={900}><ScreenLeaderboard /></DCArtboard>
          <DCArtboard id="register"    label="05 · Register mini-app"   width={1280} height={900}><ScreenRegister /></DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Palette">
          <TweakSelect label="Theme" value={t.palette} onChange={(v) => setTweak('palette', v)}
            options={[
              { value: 'bone',       label: 'Bone · warm paper' },
              { value: 'newsprint',  label: 'Newsprint · neutral grey' },
              { value: 'eucalyptus', label: 'Eucalyptus · cool grey-green' },
              { value: 'inverse',    label: 'Inverse · dark mode' },
            ]} />
        </TweakSection>
        <TweakSection label="Canvas">
          <div style={{ fontSize: 12, color: '#888', lineHeight: 1.5 }}>
            scroll/pinch to zoom · drag bg to pan<br/>
            click any artboard label to focus<br/>
            ←/→ to step between artboards · esc to exit
          </div>
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
