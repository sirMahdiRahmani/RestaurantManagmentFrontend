// js/screen-menu.jsx
function LiveMenu({ variant }) {
  const menu = {
    Grill: [["Chicken Kabab", "86,000"], ["Koobideh", "78,000"], ["Joojeh", "92,000"]],
    Pizza: [["Margherita", "120,000"], ["Pepperoni", "138,000"]],
    Drinks: [["Lemonade", "28,000"], ["Doogh", "22,000"], ["Tea", "12,000"]],
  };

  // A — digital menu board (TV / desktop)
  if (variant === 0) return (
    <div className="col">
      <div className="row between center wrap" style={{ gap: 10 }}>
        <div><span className="tiny">PUBLISHED · auto-syncs with food prices</span><div className="h h-md">Live menu board — screen / TV</div></div>
        <div className="row center" style={{ gap: 8 }}><Chip ok>● Live</Chip><Btn gho>Copy link</Btn><Btn pri>Publish changes</Btn></div>
      </div>
      <Anno>Big-screen board for inside the restaurant — prices pull straight from Foods, so a price edit updates here instantly.</Anno>
      <div className="sk" style={{ padding: 30, background: "#1c1c20", color: "#f3f0e9", borderColor: "#1c1c20" }}>
        <div className="row between center" style={{ marginBottom: 18 }}>
          <b style={{ fontFamily: "var(--hand-bold)", fontSize: 30 }}>Saffron House</b>
          <span className="mono" style={{ opacity: .7, fontSize: 12 }}>today's menu · 2026-06-07</span>
        </div>
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 28 }}>
          {Object.entries(menu).map(([cat, items]) => (
            <div key={cat}>
              <div style={{ fontFamily: "var(--hand-bold)", fontSize: 20, color: "var(--accent)", borderBottom: "2px solid #3a3a40", paddingBottom: 6, marginBottom: 8 }}>{cat}</div>
              {items.map((it, i) => (
                <div key={i} className="row between" style={{ padding: "5px 0", fontSize: 17 }}>
                  <span>{it[0]}</span>
                  <span className="mono" style={{ opacity: .9 }}>₸ {it[1]}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // B — customer QR mobile menu + ordering
  if (variant === 1) return (
    <div className="row wrap" style={{ alignItems: "flex-start", gap: 30 }}>
      <div className="col" style={{ maxWidth: 340 }}>
        <Anno>What the guest sees after scanning the table QR — browse, see photos, and optionally order from their phone.</Anno>
        <Card>
          <Block title="Customer-facing menu">
            <div className="col small" style={{ gap: 8 }}>
              <div className="row between"><span className="muted">Link</span><span className="mono">resto.os/m/saffron</span></div>
              <div className="row between"><span className="muted">QR on each table</span><Chip ok>active</Chip></div>
              <div className="row between"><span className="muted">Self-ordering</span><Chip on>on</Chip></div>
            </div>
            <Ph h={120} label="table-tent QR card" style={{ marginTop: 12 }} />
          </Block>
        </Card>
      </div>
      <Phone label="guest phone · table 7">
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Ph h={92} label="hero / restaurant photo" style={{ borderRadius: 0, borderTop: "none", borderLeft: "none", borderRight: "none" }} />
          <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
            <b className="h h-md">Saffron House</b>
            <div className="row wrap" style={{ gap: 6 }}><Chip on>Grill</Chip><Chip>Pizza</Chip><Chip>Drinks</Chip></div>
            {menu.Grill.map((it, i) => (
              <div key={i} className="row center" style={{ gap: 10 }}>
                <Ph w={42} h={42} label="" />
                <div className="grow"><b className="small">{it[0]}</b><div className="tiny">₸ {it[1]}</div></div>
                <Ic>＋</Ic>
              </div>
            ))}
            <Btn pri style={{ justifyContent: "center", marginTop: "auto" }}>View order · 2 items →</Btn>
          </div>
        </div>
      </Phone>
    </div>
  );

  // C — printable price list
  return (
    <div className="col" style={{ alignItems: "center" }}>
      <Anno>Printable price list — a clean A4/A5 PDF you can post or hand out; generated from the same menu data.</Anno>
      <div className="row center" style={{ gap: 10 }}><Btn gho>A5</Btn><Btn gho>A4</Btn><Btn pri>🖨 Print price list</Btn></div>
      <div className="sk" style={{ width: "min(540px,100%)", padding: 34, background: "#fff" }}>
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <b className="h h-lg">Saffron House</b><div className="tiny">price list · valid 2026-06</div>
        </div>
        {Object.entries(menu).map(([cat, items]) => (
          <div key={cat} style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: "var(--hand-bold)", fontSize: 17, color: "var(--accent)", marginBottom: 4 }}>{cat}</div>
            {items.map((it, i) => (
              <div key={i} className="row" style={{ alignItems: "baseline", gap: 8, padding: "3px 0" }}>
                <span>{it[0]}</span>
                <span style={{ flex: 1, borderBottom: "2px dotted #c9c5bc", transform: "translateY(-3px)" }} />
                <span className="mono">₸ {it[1]}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
window.LiveMenu = LiveMenu;
LiveMenu.variants = ["A — Menu board (TV)", "B — QR mobile menu", "C — Printable list"];
LiveMenu.caps = [
  "In-house big-screen board; prices auto-sync from Foods.",
  "Guest QR menu with photos and optional self-ordering.",
  "Print-ready A4/A5 price list from the same data.",
];
