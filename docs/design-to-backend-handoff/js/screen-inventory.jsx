// js/screen-inventory.jsx
function Inventory({ variant }) {
  const stock = [
    { n: "Chicken breast", q: "24.0", u: "kg", lvl: 70, st: "ok", par: "10kg" },
    { n: "Mozzarella", q: "1.2", u: "kg", lvl: 12, st: "low", par: "5kg" },
    { n: "Saffron", q: "30", u: "g", lvl: 8, st: "low", par: "120g" },
    { n: "Tomato", q: "18.0", u: "kg", lvl: 85, st: "ok", par: "8kg" },
    { n: "Cooking oil", q: "42", u: "L", lvl: 60, st: "ok", par: "20L" },
    { n: "Onion", q: "31.0", u: "kg", lvl: 45, st: "ok", par: "15kg" },
  ];
  const Bar = ({ lvl, st }) => (
    <div className="sk" style={{ height: 12, padding: 0, width: 120, overflow: "hidden", borderRadius: 6 }}>
      <div style={{ width: lvl + "%", height: "100%", background: st === "low" ? "var(--alert)" : "var(--ok)" }} />
    </div>
  );

  // A — stock table with quick adjust
  if (variant === 0) return (
    <div className="col">
      <div className="row between center wrap" style={{ gap: 10 }}>
        <Field placeholder="🔎 Search ingredients…" w={240} />
        <div className="row center" style={{ gap: 8 }}><Chip warn>2 low</Chip><Btn pri>📦 Stock-in</Btn></div>
      </div>
      <Anno>Live stock levels vs. par. Usage auto-drops as factors are printed; quick +/− for manual counts.</Anno>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <table className="tbl">
          <thead><tr><th>Ingredient</th><th className="num">On hand</th><th>Level vs par</th><th>Status</th><th>Adjust</th></tr></thead>
          <tbody>
            {stock.map((s, i) => (
              <tr key={i}>
                <td><b>{s.n}</b><div className="tiny">par {s.par}</div></td>
                <td className="num">{s.q} {s.u}</td>
                <td><Bar lvl={s.lvl} st={s.st} /></td>
                <td>{s.st === "low" ? <Chip warn>Reorder</Chip> : <Chip ok>OK</Chip>}</td>
                <td><span className="row center" style={{ gap: 6 }}><Ic>−</Ic><span className="mono small">{s.q}</span><Ic>＋</Ic></span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );

  // B — stock-in / receiving form
  if (variant === 1) return (
    <div className="row wrap" style={{ alignItems: "flex-start" }}>
      <div className="col grow" style={{ minWidth: 360 }}>
        <Anno>Receiving form — the ingredient INPUT flow. Scan/add lines, set qty & cost; stock and unit-cost update on save.</Anno>
        <Card>
          <Block title="New stock-in">
            <div className="row"><Field label="Supplier" value="Supplier A" /><Field label="Date" value="2026-06-07" /><Field label="Invoice #" placeholder="PO-…" /></div>
          </Block>
        </Card>
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: 14 }} className="h h-md">Received items</div>
          <table className="tbl">
            <thead><tr><th>Ingredient</th><th className="num">Qty</th><th>Unit</th><th className="num">Unit cost</th><th className="num">Total</th></tr></thead>
            <tbody>
              <tr><td>Mozzarella</td><td className="num">10</td><td className="muted">kg</td><td className="num">₸ 95,000</td><td className="num">₸ 950,000</td></tr>
              <tr><td>Tomato</td><td className="num">20</td><td className="muted">kg</td><td className="num">₸ 12,000</td><td className="num">₸ 240,000</td></tr>
              <tr><td className="muted" colSpan={5}>＋ add line — search ingredient…</td></tr>
            </tbody>
            <tfoot><tr style={{ borderTop: "2px solid var(--line)" }}><td colSpan={4}><b>Total received</b></td><td className="num"><b>₸ 1,190,000</b></td></tr></tfoot>
          </table>
        </Card>
        <div className="row" style={{ justifyContent: "flex-end", gap: 10 }}><Btn gho>Save draft</Btn><Btn pri>Receive & update stock</Btn></div>
      </div>
      <Card style={{ width: 240, background: "#faf9f6" }}>
        <Block title="Effect on stock">
          <div className="col" style={{ gap: 10 }}>
            <div className="row between"><span className="small">Mozzarella</span><span className="mono small">1.2 → 11.2kg</span></div>
            <div className="row between"><span className="small">Tomato</span><span className="mono small">18 → 38kg</span></div>
            <Divider />
            <div className="tiny">New unit costs recompute every recipe that uses these.</div>
          </div>
        </Block>
      </Card>
    </div>
  );

  // C — alert-first cards
  return (
    <div className="col">
      <Anno>Alert-first — surfaces what needs ordering now; the rest collapses below. Good for a phone glance.</Anno>
      <div className="h h-md">Needs reorder</div>
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))" }}>
        {stock.filter(s => s.st === "low").map((s, i) => (
          <Card key={i} style={{ borderColor: "var(--alert)" }}>
            <div className="row between center"><b>{s.n}</b><Chip warn>Low</Chip></div>
            <div className="h h-lg" style={{ color: "var(--alert)", margin: "6px 0" }}>{s.q} {s.u}</div>
            <div className="tiny">par level {s.par}</div>
            <Bar lvl={s.lvl} st={s.st} />
            <Btn pri sm style={{ marginTop: 12 }}>📦 Order now</Btn>
          </Card>
        ))}
      </div>
      <Divider />
      <div className="h h-md muted">Healthy stock</div>
      <div className="row wrap">
        {stock.filter(s => s.st === "ok").map((s, i) => (
          <Card key={i} className="grow" style={{ minWidth: 150 }}>
            <div className="row between center"><span className="small">{s.n}</span><Dot c="g" /></div>
            <div className="mono" style={{ marginTop: 4 }}>{s.q} {s.u}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
window.Inventory = Inventory;
Inventory.variants = ["A — Stock table", "B — Stock-in form", "C — Alert cards"];
Inventory.caps = [
  "Live levels vs par with quick manual adjust; usage auto-deducts from sales.",
  "Receiving / ingredient-input flow that updates stock and unit costs.",
  "Reorder alerts first, healthy stock collapsed below — phone friendly.",
];
