// js/screen-factor.jsx
function Factor({ variant }) {
  const lines = [
    ["2", "Chicken Kabab", "86,000", "172,000"],
    ["1", "Margherita Pizza", "120,000", "120,000"],
    ["2", "Lemonade", "28,000", "56,000"],
    ["1", "Baklava", "45,000", "45,000"],
  ];
  const Receipt = ({ w = 280 }) => (
    <div className="sk" style={{ width: w, padding: "18px 16px", fontFamily: "var(--mono)", fontSize: 12.5, background: "#fff" }}>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <div className="sk" style={{ width: 34, height: 34, margin: "0 auto 6px", display: "grid", placeItems: "center", fontFamily: "var(--hand-bold)" }}>R</div>
        <b style={{ fontFamily: "var(--hand-bold)", fontSize: 16 }}>Saffron House</b>
        <div style={{ opacity: .7 }}>Tehran · 021-•••</div>
      </div>
      <div style={{ borderTop: "2px dashed #bbb", borderBottom: "2px dashed #bbb", padding: "6px 0", display: "flex", justifyContent: "space-between" }}>
        <span>Factor #2042</span><span>Table 7</span>
      </div>
      <div style={{ padding: "8px 0" }}>
        {lines.map((l, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
            <span>{l[0]}× {l[1]}</span><span>{l[3]}</span>
          </div>
        ))}
      </div>
      <div style={{ borderTop: "2px dashed #bbb", paddingTop: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}><span>Subtotal</span><span>393,000</span></div>
        <div style={{ display: "flex", justifyContent: "space-between", opacity: .7 }}><span>Service 10%</span><span>39,300</span></div>
        <div style={{ display: "flex", justifyContent: "space-between", opacity: .7 }}><span>VAT 9%</span><span>35,370</span></div>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--hand-bold)", fontSize: 15, marginTop: 4 }}><span>TOTAL</span><span>₸ 467,670</span></div>
      </div>
      <div style={{ textAlign: "center", marginTop: 10, opacity: .7 }}>— thank you —<br />[ QR: pay & rate ]</div>
    </div>
  );

  // A — POS builder + live receipt preview
  if (variant === 0) return (
    <div className="row wrap" style={{ alignItems: "flex-start" }}>
      <div className="col grow" style={{ minWidth: 360 }}>
        <div className="row between center"><div className="h h-md">Factor #2042 · Table 7</div><div className="row center" style={{ gap: 8 }}><Chip>Guest: M. Karimi</Chip><Btn sm gho>Assign table</Btn></div></div>
        <Anno>Order builder on the left, the printable factor previews live on the right — what you see prints to the thermal printer.</Anno>
        <Card>
          <div className="row wrap" style={{ gap: 8 }}>
            <Chip on>Grill</Chip><Chip>Pizza</Chip><Chip>Salad</Chip><Chip>Drinks</Chip><Chip>Dessert</Chip>
          </div>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(120px,1fr))", marginTop: 14 }}>
            {["Chicken Kabab", "Koobideh", "Joojeh", "Lamb Chop", "Saffron Rice", "Lemonade"].map((n, i) => (
              <div key={i} className="sk" style={{ padding: 10, textAlign: "center", cursor: "pointer" }}>
                <Ph h={46} label="" /><div className="small" style={{ marginTop: 6 }}>{n}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <table className="tbl">
            <thead><tr><th>Qty</th><th>Item</th><th className="num">Price</th><th className="num">Total</th><th></th></tr></thead>
            <tbody>
              {lines.map((l, i) => (
                <tr key={i}><td><span className="row center" style={{ gap: 6 }}><Ic>−</Ic>{l[0]}<Ic>＋</Ic></span></td><td>{l[1]}</td><td className="num muted">₸ {l[2]}</td><td className="num">₸ {l[3]}</td><td className="muted">✕</td></tr>
              ))}
            </tbody>
          </table>
        </Card>
        <div className="row" style={{ gap: 10 }}><Btn gho className="grow">Save / hold</Btn><Btn pri className="grow">🖨 Print factor · ₸ 467,670</Btn></div>
      </div>
      <Receipt />
    </div>
  );

  // B — formal A4 invoice
  return (
    <div className="col" style={{ alignItems: "center" }}>
      <Anno>Formal A4 factor — for businesses & accounting. Header with tax IDs, itemized table, totals, signature block.</Anno>
      <div className="row center" style={{ gap: 10 }}><Btn gho>⤓ PDF</Btn><Btn gho>✉ Email</Btn><Btn pri>🖨 Print A4</Btn></div>
      <div className="sk" style={{ width: "min(720px,100%)", padding: 36, background: "#fff" }}>
        <div className="row between" style={{ alignItems: "flex-start" }}>
          <div><div className="sk" style={{ width: 44, height: 44, display: "grid", placeItems: "center", fontFamily: "var(--hand-bold)", marginBottom: 8 }}>R</div><b className="h h-lg">Saffron House Restaurant</b><div className="tiny">Tehran, IR · Reg #••••• · VAT #•••••</div></div>
          <div style={{ textAlign: "right" }}><div className="h h-lg">FACTOR</div><div className="mono small">No. 2042</div><div className="mono small muted">2026-06-07</div></div>
        </div>
        <Divider />
        <div className="row between"><div><div className="tiny">BILL TO</div><b>M. Karimi</b><div className="small muted">0912 •••• 41</div></div><div style={{ textAlign: "right" }}><div className="tiny">TABLE / ORDER</div><b>Table 7 · dine-in</b></div></div>
        <table className="tbl" style={{ marginTop: 18 }}>
          <thead><tr><th>#</th><th>Description</th><th className="num">Qty</th><th className="num">Unit</th><th className="num">Amount</th></tr></thead>
          <tbody>{lines.map((l, i) => (<tr key={i}><td className="muted">{i + 1}</td><td>{l[1]}</td><td className="num">{l[0]}</td><td className="num muted">₸ {l[2]}</td><td className="num">₸ {l[3]}</td></tr>))}</tbody>
        </table>
        <div className="row" style={{ justifyContent: "flex-end", marginTop: 16 }}>
          <div style={{ width: 240 }}>
            <div className="row between small"><span className="muted">Subtotal</span><span className="mono">₸ 393,000</span></div>
            <div className="row between small"><span className="muted">Service 10%</span><span className="mono">₸ 39,300</span></div>
            <div className="row between small"><span className="muted">VAT 9%</span><span className="mono">₸ 35,370</span></div>
            <Divider />
            <div className="row between"><b>Total due</b><b className="mono h h-md" style={{ color: "var(--accent)" }}>₸ 467,670</b></div>
          </div>
        </div>
        <Divider />
        <div className="row between tiny" style={{ marginTop: 20 }}><span>Thank you for dining with us.</span><span>Signature ____________</span></div>
      </div>
    </div>
  );
}
window.Factor = Factor;
Factor.variants = ["A — POS builder + receipt", "B — A4 invoice"];
Factor.caps = [
  "Build the order; thermal-receipt factor previews live and prints.",
  "Formal A4 factor with tax IDs and totals for accounting.",
];
