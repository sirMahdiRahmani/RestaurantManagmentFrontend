// js/ui.jsx — shared low-fi wireframe primitives
const { useState } = React;

// sketch box
function Sk({ className = "", style, children, ...rest }) {
  return <div className={"sk " + className} style={style} {...rest}>{children}</div>;
}
function Card({ className = "", style, children, ...rest }) {
  return <div className={"sk card " + className} style={style} {...rest}>{children}</div>;
}
function Btn({ pri, gho, sm, children, style }) {
  const c = ["btn", pri ? "pri" : "", gho ? "gho" : "", sm ? "sm" : ""].join(" ");
  return <span className={c} style={style}>{children}</span>;
}
function Field({ label, value, placeholder, area, w, suffix }) {
  return (
    <div className="field" style={{ width: w }}>
      {label && <label>{label}</label>}
      <div className={"inp" + (area ? " area" : "")}>
        <span style={{ color: value ? "var(--ink)" : "var(--ink-soft)", flex: 1 }}>
          {value || placeholder || "…"}
        </span>
        {suffix && <span className="tiny" style={{ marginLeft: 8 }}>{suffix}</span>}
      </div>
    </div>
  );
}
// striped image placeholder
function Ph({ label, w = "100%", h = 90, style }) {
  return <div className="ph" style={{ width: w, height: h, ...style }}>{label}</div>;
}
function Anno({ children }) { return <div className="anno">{children}</div>; }
function Chip({ children, on, warn, ok }) {
  const c = ["chip", on ? "on" : "", warn ? "warn" : "", ok ? "ok" : ""].join(" ");
  return <span className={c}>{children}</span>;
}
function Dot({ c }) { return <span className={"dot " + (c || "")} />; }
function Sticker({ children }) { return <span className="sticker">{children}</span>; }
function Divider() { return <hr className="divider" />; }

// little inline icon = a labeled square (kept dead simple, wireframe style)
function Ic({ children }) {
  return <span style={{
    width: 22, height: 22, border: "2px solid var(--line)", display: "grid",
    placeItems: "center", fontSize: 12, flex: "0 0 auto", lineHeight: 1,
    fontFamily: "var(--mono)"
  }}>{children}</span>;
}

// stat / KPI block
function Stat({ label, value, sub, accent }) {
  return (
    <Card className="grow" style={{ minWidth: 150 }}>
      <div className="tiny" style={{ marginBottom: 6 }}>{label}</div>
      <div className="h h-xl" style={{ color: accent ? "var(--accent)" : "var(--ink)" }}>{value}</div>
      {sub && <div className="small muted" style={{ marginTop: 4 }}>{sub}</div>}
    </Card>
  );
}

// simple bar chart from numbers
function Bars({ data, h = 120 }) {
  const max = Math.max(...data.map(d => d.v));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: h }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%", justifyContent: "flex-end" }}>
          <div className="sk" style={{
            width: "100%", height: (d.v / max * 100) + "%",
            background: d.hi ? "var(--accent)" : "var(--accent-soft)",
            borderColor: "var(--line)", minHeight: 4
          }} />
          <div className="tiny">{d.l}</div>
        </div>
      ))}
    </div>
  );
}

// phone frame
function Phone({ children, label }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div className="phone">
        <div className="notch" />
        <div className="screen">{children}</div>
      </div>
      {label && <div className="tiny">{label}</div>}
    </div>
  );
}

// section header inside a screen
function Block({ title, action, children, style }) {
  return (
    <div className="col" style={style}>
      {(title || action) && (
        <div className="row between center">
          {title && <div className="h h-md">{title}</div>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

Object.assign(window, {
  Sk, Card, Btn, Field, Ph, Anno, Chip, Dot, Sticker, Divider, Ic, Stat, Bars, Phone, Block
});
