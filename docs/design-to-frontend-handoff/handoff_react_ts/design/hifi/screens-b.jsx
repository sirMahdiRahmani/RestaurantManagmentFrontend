// hifi/screens-b.jsx — Inventory, Stock-in, Guests, Factor, Live menu, Mobile
const { Screen, Card, Btn, Pill, Field, Ph, Kpi, Barline, Phone, Icon, M } = window;

function HFInventory() {
  const st = [["Chicken breast", "24.0", "kg", 70, false, "10kg"], ["Mozzarella", "1.2", "kg", 12, true, "5kg"], ["Saffron", "30", "g", 8, true, "120g"], ["Tomato", "18.0", "kg", 85, false, "8kg"], ["Cooking oil", "42", "L", 60, false, "20L"], ["Onion", "31.0", "kg", 45, false, "15kg"]];
  return (
    <Screen active="inventory" title="Ingredient Stock" sub="Usage auto-deducts as factors are billed" search="Search ingredients…"
      actions={<><Pill warn>2 low</Pill><Btn ic="box" pri>Stock-in</Btn></>}>
      <Card>
        <table className="tbl">
          <thead><tr><th>Ingredient</th><th className="num">On hand</th><th>Level vs par</th><th>Status</th><th className="num">Adjust</th></tr></thead>
          <tbody>{st.map((s, i) => <tr key={i}>
            <td><b style={{ color: "var(--ink)" }}>{s[0]}</b><div style={{ fontSize: 12, color: "var(--faint)" }}>par {s[5]}</div></td>
            <td className="num tnum" style={{ fontWeight: 600 }}>{s[1]} {s[2]}</td>
            <td><Barline pct={s[3]} low={s[4]} /></td>
            <td>{s[4] ? <Pill warn>Reorder</Pill> : <Pill ok>OK</Pill>}</td>
            <td className="num"><span className="row vc" style={{ gap: 8, justifyContent: "flex-end" }}><span className="ava" style={{ width: 28, height: 28, borderRadius: 7 }}>−</span><span className="ava" style={{ width: 28, height: 28, borderRadius: 7 }}>+</span></span></td>
          </tr>)}</tbody>
        </table>
      </Card>
    </Screen>
  );
}

function HFStockIn() {
  const lines = [["Mozzarella", "10", "kg", "95,000", "950,000"], ["Tomato", "20", "kg", "12,000", "240,000"]];
  return (
    <Screen active="inventory" title="New Stock-in" sub="Receiving · updates stock & unit costs"
      actions={<><Btn gho>Save draft</Btn><Btn pri>Receive & update stock</Btn></>}>
      <div className="row" style={{ alignItems: "flex-start" }}>
        <div className="col grow" style={{ minWidth: 0 }}>
          <Card className="card-p"><div className="row" style={{ gap: 12 }}><Field label="Supplier" value="Supplier A" /><Field label="Date" value="2026-06-07" /><Field label="Invoice #" value="PO-3391" /></div></Card>
          <Card>
            <div className="card-h"><h3>Received items</h3><Btn sm gho ic="plus">Add line</Btn></div>
            <table className="tbl">
              <thead><tr><th>Ingredient</th><th className="num">Qty</th><th>Unit</th><th className="num">Unit cost</th><th className="num">Total (Toman)</th></tr></thead>
              <tbody>{lines.map((l, i) => <tr key={i}><td><b style={{ color: "var(--ink)" }}>{l[0]}</b></td><td className="num tnum">{l[1]}</td><td style={{ color: "var(--muted)" }}>{l[2]}</td><td className="num tnum">{l[3]}</td><td className="num tnum" style={{ fontWeight: 600 }}>{l[4]}</td></tr>)}
                <tr><td colSpan={5} style={{ color: "var(--faint)" }}>＋ search ingredient to add a line…</td></tr></tbody>
              <tfoot><tr><td colSpan={4} style={{ borderTop: "1px solid var(--line)", fontWeight: 700, color: "var(--ink)" }}>Total received</td><td className="num tnum" style={{ borderTop: "1px solid var(--line)", fontWeight: 800 }}>1,190,000</td></tr></tfoot>
            </table>
          </Card>
        </div>
        <Card className="card-p" style={{ width: 270, flex: "0 0 270px", background: "var(--surface-2)" }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>Effect on stock</div>
          <div className="col" style={{ gap: 12, fontSize: 14 }}>
            <div className="row between vc"><span>Mozzarella</span><span className="tnum mono" style={{ fontSize: 13 }}>1.2 → 11.2kg</span></div>
            <div className="row between vc"><span>Tomato</span><span className="tnum mono" style={{ fontSize: 13 }}>18 → 38kg</span></div>
            <hr className="div" />
            <div style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.55 }}>New unit costs recompute every recipe using these ingredients.</div>
          </div>
        </Card>
      </div>
    </Screen>
  );
}

function HFGuests() {
  const g = [["M. Karimi", "0912 •••• 41", 38, "4.2M", "Gold"], ["L. Nouri", "0938 •••• 22", 61, "7.9M", "Gold"], ["S. Ahmadi", "0935 •••• 09", 12, "980k", "Silver"], ["R. Tehrani", "0901 •••• 77", 3, "210k", "New"]];
  return (
    <Screen active="guests" title="Guests" sub="1,204 members · loyalty enabled" search="Search name or phone…"
      actions={<Btn ic="plus" pri>Add guest</Btn>}>
      <div className="row">
        <Kpi lab="Total guests" val="1,204" sub="+38 this week" up="" />
        <Kpi lab="Gold tier" val="86" sub="top spenders" />
        <Kpi lab="Avg lifetime" val="1.6M" unit="Toman" sub="per guest" />
        <Kpi lab="Visits today" val="312" sub="covers" />
      </div>
      <Card>
        <table className="tbl">
          <thead><tr><th>Guest</th><th>Phone</th><th className="num">Visits</th><th className="num">Lifetime (Toman)</th><th>Tier</th><th>Last seen</th></tr></thead>
          <tbody>{g.map((x, i) => <tr key={i}>
            <td><div className="row vc" style={{ gap: 12 }}><span className="ava rd">{x[0][0]}</span><b style={{ color: "var(--ink)" }}>{x[0]}</b></div></td>
            <td className="mono" style={{ color: "var(--muted)", fontSize: 13 }}>{x[1]}</td>
            <td className="num tnum">{x[2]}</td><td className="num tnum" style={{ fontWeight: 600 }}>{x[3]}</td>
            <td>{x[4] === "Gold" ? <Pill on>Gold</Pill> : x[4] === "New" ? <Pill>New</Pill> : <Pill>Silver</Pill>}</td>
            <td style={{ color: "var(--muted)" }}>{["2d ago", "3d ago", "1w ago", "today"][i]}</td>
          </tr>)}</tbody>
        </table>
      </Card>
    </Screen>
  );
}

function HFFactor() {
  const lines = [["2", "Chicken Kabab", "86,000", "172,000"], ["1", "Margherita Pizza", "120,000", "120,000"], ["2", "Lemonade", "28,000", "56,000"], ["1", "Baklava", "45,000", "45,000"]];
  return (
    <Screen active="factor" title="Factor #2042" sub="Table 7 · dine-in · M. Karimi"
      actions={<><Btn gho>Hold</Btn><Btn ic="print" pri>Print factor · 467,670</Btn></>}>
      <div className="row" style={{ alignItems: "flex-start" }}>
        <div className="col grow" style={{ minWidth: 0 }}>
          <div className="row vc wrap" style={{ gap: 8 }}><span className="pill on">Grill</span><span className="pill">Pizza</span><span className="pill">Salad</span><span className="pill">Drinks</span><span className="pill">Dessert</span></div>
          <div className="grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
            {["Chicken Kabab", "Koobideh", "Joojeh", "Lamb Chop", "Saffron Rice", "Grilled Tomato", "Lemonade", "Doogh"].map((n, i) => <Card key={i} className="card-p" style={{ padding: 12, textAlign: "center" }}><Ph h={56} label="" /><div style={{ fontSize: 13, fontWeight: 600, marginTop: 8 }}>{n}</div></Card>)}
          </div>
        </div>
        <Card style={{ width: 360, flex: "0 0 360px" }}>
          <div className="card-h"><h3>Order</h3><Pill on>Table 7</Pill></div>
          <table className="tbl"><tbody>{lines.map((l, i) => <tr key={i}>
            <td style={{ width: 56 }}><span className="row vc" style={{ gap: 6 }}><span className="ava" style={{ width: 24, height: 24, borderRadius: 6, fontSize: 13 }}>−</span><b className="tnum">{l[0]}</b></span></td>
            <td><b style={{ color: "var(--ink)", fontSize: 13.5 }}>{l[1]}</b></td><td className="num tnum" style={{ fontWeight: 600 }}>{l[3]}</td>
          </tr>)}</tbody></table>
          <div className="card-p col" style={{ gap: 9, borderTop: "1px solid var(--line)", fontSize: 14 }}>
            <div className="row between"><span style={{ color: "var(--muted)" }}>Subtotal</span><span className="tnum">393,000</span></div>
            <div className="row between"><span style={{ color: "var(--muted)" }}>Service 10%</span><span className="tnum">39,300</span></div>
            <div className="row between"><span style={{ color: "var(--muted)" }}>VAT 9%</span><span className="tnum">35,370</span></div>
            <hr className="div" />
            <div className="row between vc"><b style={{ fontSize: 16 }}>Total</b><b className="tnum" style={{ fontSize: 20 }}>467,670<span className="cur">Toman</span></b></div>
          </div>
        </Card>
      </div>
    </Screen>
  );
}

// A4 invoice (doc frame, standalone)
function HFInvoice() {
  const lines = [["Chicken Kabab", "2", "86,000", "172,000"], ["Margherita Pizza", "1", "120,000", "120,000"], ["Lemonade", "2", "28,000", "56,000"], ["Baklava", "1", "45,000", "45,000"]];
  return (
    <div style={{ padding: 52, fontSize: 14, color: "var(--ink-2)" }}>
      <div className="row between" style={{ alignItems: "flex-start" }}>
        <div><span className="mark" style={{ width: 48, height: 48, borderRadius: 12, background: "var(--accent)", color: "#fff", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 22, marginBottom: 12 }}>S</span><div style={{ fontSize: 20, fontWeight: 800, color: "var(--ink)" }}>Saffron House Restaurant</div><div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 4 }} className="mono">Tehran, IR · Reg #4471-22 · VAT #IR-0098</div></div>
        <div style={{ textAlign: "right" }}><div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-.02em", color: "var(--ink)" }}>FACTOR</div><div className="mono" style={{ color: "var(--muted)" }}>No. 2042</div><div className="mono" style={{ color: "var(--faint)", fontSize: 13 }}>2026-06-07</div></div>
      </div>
      <hr className="div" style={{ margin: "26px 0" }} />
      <div className="row between"><div><div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em", color: "var(--faint)", textTransform: "uppercase", marginBottom: 6 }}>Bill to</div><b style={{ color: "var(--ink)", fontSize: 15 }}>M. Karimi</b><div style={{ color: "var(--muted)" }} className="mono">0912 •••• 41</div></div><div style={{ textAlign: "right" }}><div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em", color: "var(--faint)", textTransform: "uppercase", marginBottom: 6 }}>Order</div><b style={{ color: "var(--ink)", fontSize: 15 }}>Table 7 · dine-in</b></div></div>
      <table className="tbl" style={{ marginTop: 30 }}>
        <thead><tr><th>#</th><th>Description</th><th className="num">Qty</th><th className="num">Unit</th><th className="num">Amount</th></tr></thead>
        <tbody>{lines.map((l, i) => <tr key={i}><td style={{ color: "var(--faint)" }}>{i + 1}</td><td><b style={{ color: "var(--ink)" }}>{l[0]}</b></td><td className="num tnum">{l[1]}</td><td className="num tnum" style={{ color: "var(--muted)" }}>{l[2]}</td><td className="num tnum" style={{ fontWeight: 600 }}>{l[3]}</td></tr>)}</tbody>
      </table>
      <div className="row" style={{ justifyContent: "flex-end", marginTop: 24 }}>
        <div style={{ width: 280 }} className="col">
          <div className="row between"><span style={{ color: "var(--muted)" }}>Subtotal</span><span className="tnum">393,000</span></div>
          <div className="row between"><span style={{ color: "var(--muted)" }}>Service 10%</span><span className="tnum">39,300</span></div>
          <div className="row between"><span style={{ color: "var(--muted)" }}>VAT 9%</span><span className="tnum">35,370</span></div>
          <hr className="div" />
          <div className="row between vc"><b style={{ fontSize: 16 }}>Total due</b><b className="tnum" style={{ fontSize: 22, color: "var(--accent)" }}>467,670<span className="cur">Toman</span></b></div>
        </div>
      </div>
      <hr className="div" style={{ margin: "40px 0 18px" }} />
      <div className="row between" style={{ fontSize: 12.5, color: "var(--faint)" }}><span>Thank you for dining with us.</span><span>Authorized signature ______________</span></div>
    </div>
  );
}

function HFMenuBoard() {
  const menu = { Grill: [["Chicken Kabab", "86,000"], ["Koobideh", "78,000"], ["Joojeh", "92,000"], ["Lamb Chop", "145,000"]], Pizza: [["Margherita", "120,000"], ["Pepperoni", "138,000"]], "Salad & Sides": [["Caesar Salad", "65,000"], ["Saffron Rice", "40,000"]], Drinks: [["Lemonade", "28,000"], ["Doogh", "22,000"], ["Tea", "12,000"]] };
  return (
    <div style={{ background: "#12141c", color: "#f3f2ef", padding: 44, minHeight: 912 }}>
      <div className="row between vc" style={{ marginBottom: 34 }}>
        <div className="row vc" style={{ gap: 14 }}><span style={{ width: 46, height: 46, borderRadius: 12, background: "var(--accent)", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 22 }}>S</span><div><div style={{ fontSize: 28, fontWeight: 800 }}>Saffron House</div><div style={{ fontSize: 13, color: "#8b8f9c" }} className="mono">today's menu · 7 June 2026</div></div></div>
        <span className="pill ok" style={{ fontSize: 13 }}>● Live · auto-synced</span>
      </div>
      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "30px 56px" }}>
        {Object.entries(menu).map(([cat, items]) => <div key={cat}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#9db0ff", borderBottom: "1px solid #2a2e3b", paddingBottom: 10, marginBottom: 12 }}>{cat}</div>
          {items.map((it, i) => <div className="row between vc" key={i} style={{ padding: "8px 0", fontSize: 18 }}><span>{it[0]}</span><span className="tnum" style={{ color: "#d7dae4" }}>{it[1]}</span></div>)}
        </div>)}
      </div>
    </div>
  );
}

// ---- mobile ----
function HFQRMenu() {
  const items = [["Chicken Kabab", "86,000", "Char-grilled, saffron marinade"], ["Koobideh", "78,000", "Minced lamb skewers"], ["Joojeh", "92,000", "Saffron chicken"]];
  return (
    <Phone>
      <Ph h={150} label="restaurant / hero photo" style={{ borderRadius: 0, border: "none" }} />
      <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
        <div><div style={{ fontSize: 20, fontWeight: 800 }}>Saffron House</div><div style={{ fontSize: 13, color: "var(--muted)" }}>Table 7 · dine-in menu</div></div>
        <div className="row" style={{ gap: 8, overflow: "hidden" }}><span className="pill on">Grill</span><span className="pill">Pizza</span><span className="pill">Drinks</span></div>
        {items.map((it, i) => <div key={i} className="row vc" style={{ gap: 12 }}>
          <Ph w={56} h={56} label="" /><div className="grow"><b style={{ fontSize: 14.5 }}>{it[0]}</b><div style={{ fontSize: 12, color: "var(--faint)", lineHeight: 1.4 }}>{it[2]}</div><div className="tnum" style={{ fontWeight: 700, marginTop: 3 }}>{it[1]}<span className="cur">Toman</span></div></div>
          <span className="btn pri sm" style={{ padding: "7px 10px" }}><Icon n="plus" s={15} /></span>
        </div>)}
        <span className="btn pri" style={{ justifyContent: "center", marginTop: "auto" }}>View order · 2 items · 200,000</span>
      </div>
    </Phone>
  );
}

function HFOnboard() {
  return (
    <Phone>
      <div style={{ padding: "32px 22px", display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
        <span className="mark" style={{ width: 52, height: 52, borderRadius: 14, background: "var(--accent)", color: "#fff", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 24, margin: "8px auto 0" }}>S</span>
        <div style={{ textAlign: "center" }}><div style={{ fontSize: 21, fontWeight: 800 }}>Join Saffron rewards</div><div style={{ fontSize: 13.5, color: "var(--muted)", marginTop: 4 }}>Earn points on every visit</div></div>
        <div className="field" style={{ marginTop: 6 }}><label>Mobile number</label><div className="input"><span style={{ flex: 1 }}>0912 345 6789</span></div></div>
        <div className="field"><label>Name</label><div className="input ph"><span style={{ flex: 1 }}>Your name</span></div></div>
        <label className="row vc" style={{ gap: 9, fontSize: 12.5, color: "var(--muted)" }}><span style={{ width: 18, height: 18, borderRadius: 5, border: "1px solid var(--line)", background: "var(--accent)", display: "grid", placeItems: "center", color: "#fff", fontSize: 12 }}>✓</span>Agree to receive menu & offers by SMS</label>
        <span className="btn pri" style={{ justifyContent: "center", marginTop: 4 }}>Get my code</span>
        <div style={{ textAlign: "center", fontSize: 12.5, color: "var(--faint)" }}>We'll text a 4-digit code to verify →</div>
      </div>
    </Phone>
  );
}

Object.assign(window, { HFInventory, HFStockIn, HFGuests, HFFactor, HFInvoice, HFMenuBoard, HFQRMenu, HFOnboard });
