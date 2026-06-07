// js/app.jsx — shell: sidebar nav + variation tabs + tweaks
const { useState, useEffect } = React;

const NAV = [
  { group: "Operate", items: [
    { id: "dashboard", label: "Dashboard", ic: "▦", comp: () => window.Dashboard },
    { id: "factor",    label: "Factor / Invoice", ic: "🧾", comp: () => window.Factor },
    { id: "guests",    label: "Guests", ic: "☺", comp: () => window.Guests },
  ]},
  { group: "Menu & Recipes", items: [
    { id: "foods",      label: "Foods & Menu", ic: "🍲", comp: () => window.Foods },
    { id: "editor",     label: "Add / Edit Food", ic: "✎", comp: () => window.FoodEditor },
    { id: "categories", label: "Categories", ic: "▤", comp: () => window.Categories },
  ]},
  { group: "Inventory", items: [
    { id: "inventory", label: "Ingredient Stock", ic: "📦", comp: () => window.Inventory },
  ]},
  { group: "Public", items: [
    { id: "menu", label: "Live Price Menu", ic: "◳", comp: () => window.LiveMenu },
  ]},
];
const ALL = NAV.flatMap(g => g.items);

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "style": "sketch",
  "accent": "#3b5bdb",
  "density": "comfy",
  "annotations": true
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [screen, setScreen] = useState(() => localStorage.getItem("wf_screen") || "dashboard");
  const [variant, setVariant] = useState(() => +(localStorage.getItem("wf_var_" + (localStorage.getItem("wf_screen") || "dashboard")) || 0));

  useEffect(() => {
    document.body.dataset.style = t.style;
    document.body.dataset.density = t.density;
    document.body.dataset.anno = t.annotations ? "on" : "off";
    document.documentElement.style.setProperty("--accent", t.accent);
  }, [t]);

  useEffect(() => { localStorage.setItem("wf_screen", screen); }, [screen]);
  useEffect(() => { localStorage.setItem("wf_var_" + screen, variant); }, [screen, variant]);

  function go(id) {
    setScreen(id);
    setVariant(+(localStorage.getItem("wf_var_" + id) || 0));
  }

  const def = ALL.find(s => s.id === screen) || ALL[0];
  const Comp = def.comp();
  const variants = (Comp && Comp.variants) || ["A"];
  const caps = (Comp && Comp.caps) || [];
  const v = Math.min(variant, variants.length - 1);

  return (
    <div className="app">
      {/* sidebar */}
      <aside className="side">
        <div className="brand">
          <span className="logo">R</span>
          <div>
            <b>RestoOS</b>
            <small>manager console</small>
          </div>
        </div>
        {NAV.map(g => (
          <div key={g.group}>
            <div className="nav-h">{g.group}</div>
            {g.items.map(it => (
              <div key={it.id} className={"nav-i" + (it.id === screen ? " active" : "")} onClick={() => go(it.id)}>
                <span className="ic">{it.ic}</span>
                <span>{it.label}</span>
                {it.comp() && it.comp().variants && it.comp().variants.length > 1 &&
                  <span className="tiny" style={{ marginLeft: "auto" }}>{it.comp().variants.length}</span>}
              </div>
            ))}
          </div>
        ))}
        <div className="side-foot">
          wireframes · v1<br />low-fi · not final visuals
        </div>
      </aside>

      {/* main */}
      <div className="main">
        <div className="topbar">
          <div>
            <div className="crumb">{NAV.find(g => g.items.includes(def)).group} /</div>
            <h1>{def.label}</h1>
          </div>
          {variants.length > 1 && (
            <div className="variants">
              <span className="vl">Approaches</span>
              {variants.map((nm, i) => (
                <span key={i} className={"vtab" + (i === v ? " active" : "")} onClick={() => setVariant(i)}>
                  {nm.split(" — ")[0]}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="stage">
          <div className="stage-inner">
            <div className="vcap">
              <b>{variants[v]}</b>
              {caps[v] && <span>— {caps[v]}</span>}
            </div>
            {Comp ? <Comp variant={v} /> : <div className="muted">Coming soon…</div>}
          </div>
        </div>
      </div>

      <TweaksPanel>
        <TweakSection label="Wireframe style" />
        <TweakRadio label="Look" value={t.style} options={["sketch", "clean"]}
          onChange={(val) => setTweak("style", val)} />
        <TweakRadio label="Density" value={t.density} options={["compact", "comfy"]}
          onChange={(val) => setTweak("density", val)} />
        <TweakToggle label="Show annotations" value={t.annotations}
          onChange={(val) => setTweak("annotations", val)} />
        <TweakSection label="Accent" />
        <TweakColor label="Accent" value={t.accent}
          options={["#3b5bdb", "#0f766e", "#b45309", "#7c3aed", "#be123c"]}
          onChange={(val) => setTweak("accent", val)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
