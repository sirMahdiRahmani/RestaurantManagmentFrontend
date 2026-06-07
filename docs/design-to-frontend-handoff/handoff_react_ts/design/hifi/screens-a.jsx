// hifi/screens-a.jsx — Dashboard, Foods, Recipe builder, Categories
const { Screen, Card, Btn, Pill, Field, Ph, Kpi, Bars, Barline, Icon, M } = window;

function HFDashboard() {
  const sellers = [["Chicken Kabab", "Grill", 42], ["Margherita Pizza", "Pizza", 38], ["Lemonade", "Drinks", 51], ["Caesar Salad", "Salad", 29], ["Saffron Rice", "Sides", 24]];
  const act = [["12:48", "Factor #2041 printed", "Table 7 · 86,000"], ["12:31", "Stock-in received", "Tomato 18kg · Supplier A"], ["12:20", "New guest onboarded", "M. Karimi · loyalty"], ["11:58", "Low-stock alert", "Mozzarella · 1.2kg left"]];
  return (
    <Screen active="dashboard" title="Dashboard" sub="Saturday, 7 June 2026 · lunch service"
      actions={<><Btn ic="print" gho>Daily report</Btn><Btn ic="plus" pri>New factor</Btn></>}>
      <div className="row">
        <Kpi lab="Today's sales" val="1.84M" unit="Toman" up="12%" sub="vs yesterday" />
        <Kpi lab="Open tables" val="14 / 22" sub="8 free" />
        <Kpi lab="Factors printed" val="96" sub="today" />
        <Kpi lab="Low-stock items" val="5" sub="needs restock" />
      </div>
      <div className="row" style={{ alignItems: "stretch" }}>
        <Card className="grow" style={{ minWidth: 0 }}>
          <div className="card-h"><h3>Sales — last 7 days</h3><span className="pill">This week</span></div>
          <div className="card-p"><Bars data={[{ l: "Mon", v: 8 }, { l: "Tue", v: 11 }, { l: "Wed", v: 9 }, { l: "Thu", v: 14 }, { l: "Fri", v: 19, hi: true }, { l: "Sat", v: 22, hi: true }, { l: "Sun", v: 16 }]} /></div>
        </Card>
        <Card style={{ width: 360, flex: "0 0 360px" }}>
          <div className="card-h"><h3>Top sellers</h3><span className="pill on">Today</span></div>
          <div className="card-p col" style={{ gap: 14 }}>
            {sellers.map((s, i) => <div className="row vc" key={i} style={{ gap: 12 }}>
              <Ph w={36} h={36} label="" /><div className="grow"><div style={{ fontWeight: 600, fontSize: 14 }}>{s[0]}</div><div style={{ fontSize: 12, color: "var(--faint)" }}>{s[1]}</div></div><b className="tnum" style={{ fontSize: 14 }}>{s[2]}<span style={{ color: "var(--faint)", fontWeight: 500, fontSize: 12 }}> sold</span></b>
            </div>)}
          </div>
        </Card>
      </div>
      <Card>
        <div className="card-h"><h3>Recent activity</h3><Btn sm gho>View all</Btn></div>
        <table className="tbl"><tbody>
          {act.map((a, i) => <tr key={i}><td className="mono" style={{ width: 80, color: "var(--faint)" }}>{a[0]}</td><td style={{ fontWeight: 600, color: "var(--ink)" }}>{a[1]}</td><td style={{ color: "var(--muted)", textAlign: "right" }}>{a[2]}</td></tr>)}
        </tbody></table>
      </Card>
    </Screen>
  );
}

function HFFoods() {
  const items = [["Chicken Kabab", "Grill", "86,000", "31,000", 64, "Active"], ["Margherita Pizza", "Pizza", "120,000", "44,000", 63, "Active"], ["Caesar Salad", "Salad", "65,000", "22,000", 66, "Active"], ["Saffron Rice", "Sides", "40,000", "12,000", 70, "Hidden"], ["Lemonade", "Drinks", "28,000", "7,000", 75, "Active"], ["Baklava", "Dessert", "45,000", "16,000", 64, "Active"]];
  return (
    <Screen active="foods" title="Foods & Menu" sub="86 items · 6 categories" search="Search foods…"
      actions={<Btn ic="plus" pri>Add food</Btn>}>
      <div className="row vc wrap" style={{ gap: 8 }}>
        <span className="pill on">All</span><span className="pill">Grill</span><span className="pill">Pizza</span><span className="pill">Salad</span><span className="pill">Drinks</span><span className="pill">Dessert</span>
      </div>
      <Card>
        <table className="tbl">
          <thead><tr><th>Food</th><th>Category</th><th className="num">Price (Toman)</th><th className="num">Cost</th><th className="num">Margin</th><th>Status</th><th></th></tr></thead>
          <tbody>{items.map((it, i) => <tr key={i}>
            <td><div className="row vc" style={{ gap: 12 }}><Ph w={38} h={38} label="" /><b style={{ color: "var(--ink)" }}>{it[0]}</b></div></td>
            <td>{it[1]}</td><td className="num"><M v={it[2]} /></td><td className="num" style={{ color: "var(--muted)" }}>{it[3]}</td>
            <td className="num"><Pill ok>{it[4]}%</Pill></td>
            <td>{it[5] === "Active" ? <span className="row vc" style={{ gap: 7 }}><span className="dot ok" />Active</span> : <span className="row vc" style={{ gap: 7, color: "var(--faint)" }}><span className="dot" style={{ background: "var(--faint)" }} />Hidden</span>}</td>
            <td style={{ textAlign: "right", color: "var(--faint)" }}>•••</td>
          </tr>)}</tbody>
        </table>
      </Card>
    </Screen>
  );
}

function HFEditor() {
  const recipe = [["Chicken breast", "180", "g", "1,200/kg", "216", 10], ["Yogurt marinade", "40", "g", "600/kg", "24", 1], ["Saffron", "0.2", "g", "9,000/g", "1,800", 87], ["Onion", "30", "g", "300/kg", "9", 1], ["Cooking oil", "15", "ml", "800/L", "12", 1]];
  return (
    <Screen active="editor" title="Add / Edit Food" sub="Chicken Kabab · Grill"
      actions={<><Btn gho>Cancel</Btn><Btn pri>Save food</Btn></>}>
      <div className="row" style={{ alignItems: "flex-start" }}>
        {/* left: details + cost */}
        <div className="col" style={{ width: 360, flex: "0 0 360px" }}>
          <Card className="card-p col" style={{ gap: 16 }}>
            <Ph h={150} label="dish photo · drag to upload" />
            <Field label="Name" value="Chicken Kabab" />
            <div className="row" style={{ gap: 12 }}><Field label="Category" value="Grill" /><Field label="Price" value="86,000" suffix="Toman" /></div>
            <Field label="Menu description" value="Char-grilled chicken, saffron & yogurt marinade." area />
            <div className="row vc" style={{ gap: 8 }}><Pill on>Active</Pill><Pill>Show on live menu</Pill></div>
          </Card>
          <Card className="card-p" style={{ background: "var(--surface-2)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>Live cost & margin</div>
            <div className="col" style={{ gap: 10, fontSize: 14 }}>
              <div className="row between vc"><span style={{ color: "var(--muted)" }}>Ingredient cost</span><b className="tnum">2,061</b></div>
              <div className="row between vc"><span style={{ color: "var(--muted)" }}>Sell price</span><span className="tnum">86,000</span></div>
              <div className="row between vc"><span style={{ color: "var(--muted)" }}>Waste buffer 6%</span><span className="tnum" style={{ color: "var(--muted)" }}>124</span></div>
              <hr className="div" />
              <div className="row between vc"><b>Gross margin</b><Pill ok>97.4%</Pill></div>
            </div>
          </Card>
        </div>
        {/* right: recipe */}
        <div className="col grow" style={{ minWidth: 0 }}>
          <Card>
            <div className="card-h"><div><h3>Recipe — per portion</h3><div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 3 }}>Each ingredient is drawn from stock every time this food is sold.</div></div><Pill ok>97% margin</Pill></div>
            <table className="tbl">
              <thead><tr><th>Ingredient</th><th className="num">Qty</th><th>Unit</th><th className="num">Unit cost</th><th className="num">Line cost</th><th className="num">% of cost</th><th></th></tr></thead>
              <tbody>{recipe.map((r, i) => <tr key={i}>
                <td><b style={{ color: "var(--ink)" }}>{r[0]}</b></td><td className="num tnum">{r[1]}</td><td style={{ color: "var(--muted)" }}>{r[2]}</td>
                <td className="num" style={{ color: "var(--muted)" }}>{r[3]}</td><td className="num tnum">{r[4]}</td>
                <td className="num"><Pill warn={r[5] > 50}>{r[5]}%</Pill></td>
                <td style={{ textAlign: "right", color: "var(--faint)" }}>✕</td>
              </tr>)}</tbody>
              <tfoot><tr><td colSpan={4} style={{ borderTop: "1px solid var(--line)", fontWeight: 700, color: "var(--ink)" }}>Total / portion</td><td className="num tnum" style={{ borderTop: "1px solid var(--line)", fontWeight: 800 }}>2,061</td><td className="num" style={{ borderTop: "1px solid var(--line)", fontWeight: 700 }}>100%</td><td style={{ borderTop: "1px solid var(--line)" }}></td></tr></tfoot>
            </table>
          </Card>
          <Card className="card-p">
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Add ingredient</div>
            <div className="row vc wrap" style={{ gap: 10 }}>
              <Field ph="Search ingredient…" w={230} />
              <Field ph="qty" w={90} />
              <div className="input" style={{ width: 90, justifyContent: "space-between" }}><span>g</span><span style={{ color: "var(--faint)" }}>▾</span></div>
              <Btn ic="plus" pri>Add to recipe</Btn>
            </div>
          </Card>
        </div>
      </div>
    </Screen>
  );
}

function HFCategories() {
  const cats = [["Grill", 14, "var(--accent)"], ["Pizza", 9, "#c2710c"], ["Salad", 7, "#15803d"], ["Rice & Sides", 11, "#7c3aed"], ["Drinks", 16, "#0891b2"], ["Dessert", 8, "#db2777"]];
  return (
    <Screen active="categories" title="Categories" sub="Order sets how sections appear on the live menu"
      actions={<Btn ic="plus" pri>New category</Btn>}>
      <Card style={{ maxWidth: 720 }}>
        <table className="tbl"><tbody>
          {cats.map((c, i) => <tr key={i}>
            <td style={{ width: 40, color: "var(--faint)", cursor: "grab" }}>⠿</td>
            <td><div className="row vc" style={{ gap: 12 }}><span style={{ width: 30, height: 30, borderRadius: 8, background: c[2], opacity: .15, display: "inline-block" }} /><b style={{ color: "var(--ink)", marginLeft: -38, paddingLeft: 8 }}>{c[0]}</b></div></td>
            <td style={{ color: "var(--muted)" }}>{c[1]} items</td>
            <td style={{ textAlign: "right", color: "var(--faint)" }}>Edit&nbsp;&nbsp;✕</td>
          </tr>)}
        </tbody></table>
      </Card>
    </Screen>
  );
}

Object.assign(window, { HFDashboard, HFFoods, HFEditor, HFCategories });
