// hifi/kit.jsx — hi-fi design system kit
// ---- icons (simple line glyphs) ----
const ICONS = {
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  receipt: "M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6",
  user: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 20a8 8 0 0116 0",
  dish: "M3 12a9 9 0 0118 0zM2 12h20M12 7v-3",
  edit: "M4 20h4L19 9l-4-4L4 16zM14 6l4 4",
  layers: "M12 3l9 5-9 5-9-5zM3 13l9 5 9-5",
  box: "M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10",
  monitor: "M3 4h18v12H3zM8 20h8M12 16v4",
  search: "M11 11m-7 0a7 7 0 1014 0a7 7 0 10-14 0M21 21l-4-4",
  plus: "M12 5v14M5 12h14",
  print: "M6 9V3h12v6M6 18H4v-6h16v6h-2M8 14h8v6H8z",
  bell: "M6 9a6 6 0 1112 0c0 5 2 6 2 6H4s2-1 2-6M10 21h4",
};
function Icon({ n, s = 19 }) {
  return <svg viewBox="0 0 24 24" width={s} height={s} style={{ stroke: "currentColor", strokeWidth: 1.8, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" }}><path d={ICONS[n]} /></svg>;
}

// money — bare number + optional unit
function M({ v, u }) { return <span className="tnum">{v}{u && <span className="cur">Toman</span>}</span>; }

const NAV = [
  { h: "Operate", items: [
    { id: "dashboard", t: "Dashboard", ic: "grid" },
    { id: "factor", t: "Factor / Invoice", ic: "receipt" },
    { id: "guests", t: "Guests", ic: "user" },
  ]},
  { h: "Menu & Recipes", items: [
    { id: "foods", t: "Foods & Menu", ic: "dish" },
    { id: "editor", t: "Add / Edit Food", ic: "edit" },
    { id: "categories", t: "Categories", ic: "layers" },
  ]},
  { h: "Inventory", items: [
    { id: "inventory", t: "Ingredient Stock", ic: "box", badge: "2" },
  ]},
  { h: "Public", items: [
    { id: "menu", t: "Live Price Menu", ic: "monitor" },
  ]},
];

function Sidebar({ active }) {
  return (
    <aside className="side">
      <div className="brand">
        <span className="mark">S</span>
        <div><b>Saffron House</b><small>manager console</small></div>
      </div>
      {NAV.map(g => (
        <div key={g.h}>
          <div className="nav-h">{g.h}</div>
          {g.items.map(it => (
            <div key={it.id} className={"nav-i" + (it.id === active ? " on" : "")}>
              <Icon n={it.ic} />
              <span>{it.t}</span>
              {it.badge && <span className="badge">{it.badge}</span>}
            </div>
          ))}
        </div>
      ))}
      <div className="side-foot">
        <span className="av">RK</span>
        <div><b style={{ fontSize: 13 }}>R. Karimi</b><small>Owner · admin</small></div>
      </div>
    </aside>
  );
}

function Topbar({ title, sub, search, actions }) {
  return (
    <div className="topbar">
      <div><h1>{title}</h1>{sub && <div className="sub">{sub}</div>}</div>
      {search && <div className="search"><Icon n="search" s={16} /><span>{search}</span></div>}
      {actions && <div className="row vc" style={{ gap: 10, marginLeft: search ? 0 : "auto" }}>{actions}</div>}
    </div>
  );
}

// desktop app screen wrapper
function Screen({ active, title, sub, search, actions, children }) {
  return (
    <div className="app">
      <Sidebar active={active} />
      <div className="main">
        <Topbar title={title} sub={sub} search={search} actions={actions} />
        <div className="content">{children}</div>
      </div>
    </div>
  );
}

// building blocks
function Card({ className = "", style, children }) { return <div className={"card " + className} style={style}>{children}</div>; }
function Btn({ pri, gho, sm, ic, children, style }) {
  return <span className={["btn", pri ? "pri" : "", gho ? "gho" : "", sm ? "sm" : ""].join(" ")} style={style}>{ic && <Icon n={ic} s={16} />}{children}</span>;
}
function Pill({ ok, warn, dgr, on, children }) {
  return <span className={["pill", ok ? "ok" : "", warn ? "warn" : "", dgr ? "dgr" : "", on ? "on" : ""].join(" ")}>{children}</span>;
}
function Field({ label, value, ph, area, w, suffix }) {
  return <div className="field" style={{ width: w }}>{label && <label>{label}</label>}<div className={"input" + (value ? "" : " ph") + (area ? " area" : "")}><span style={{ flex: 1 }}>{value || ph}</span>{suffix && <span style={{ color: "var(--faint)", fontSize: 12 }}>{suffix}</span>}</div></div>;
}
function Ph({ label, w = "100%", h = 90, style }) { return <div className="ph" style={{ width: w, height: h, ...style }}>{label}</div>; }
function Kpi({ lab, val, unit, sub, up, down }) {
  return <Card className="card-p grow kpi" style={{ minWidth: 0 }}>
    <div className="lab">{lab}</div>
    <div className="val">{val}{unit && <span className="cur" style={{ fontSize: 14 }}>{unit}</span>}</div>
    {sub && <div className="sub">{up && <span className="up">▲ {up}</span>}{down && <span className="down">▼ {down}</span>}{sub}</div>}
  </Card>;
}
function Bars({ data, h = 150 }) {
  const max = Math.max(...data.map(d => d.v));
  return <div className="bars" style={{ height: h }}>{data.map((d, i) => <div className="b" key={i}><div className={"bar" + (d.hi ? " hi" : "")} style={{ height: (d.v / max * 100) + "%" }} /><div className="bl">{d.l}</div></div>)}</div>;
}
function Barline({ pct, low, w = 130 }) { return <div className={"barline" + (low ? " low" : "")} style={{ width: w }}><i style={{ width: pct + "%" }} /></div>; }

// frame on the board
function Frame({ label, tag, kind = "desk", id, children }) {
  return <div className="frame">
    <div className="frame-label"><span className="dot" /><b>{label}</b>{tag && <span className="tag">{tag}</span>}</div>
    <div className={"artboard " + kind} id={id} data-screen-label={label}>{children}</div>
  </div>;
}
function Phone({ children }) {
  return <div style={{ background: "#fff", minHeight: 760, display: "flex", flexDirection: "column" }}>{children}</div>;
}

Object.assign(window, { Icon, M, Sidebar, Topbar, Screen, Card, Btn, Pill, Field, Ph, Kpi, Bars, Barline, Frame, Phone, NAV });
