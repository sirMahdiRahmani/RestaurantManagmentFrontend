// js/screen-food-editor.jsx
function FoodEditor({ variant }) {
  // recipe rows: ingredient, qty, unit, unit cost, line cost
  const recipe = [
    ["Chicken breast", "180", "g", "1,200/kg", "216"],
    ["Yogurt marinade", "40", "g", "600/kg", "24"],
    ["Saffron", "0.2", "g", "9,000/g", "1,800"],
    ["Onion", "30", "g", "300/kg", "9"],
    ["Cooking oil", "15", "ml", "800/L", "12"],
  ];
  const totalCost = "2,061";
  const RecipeRows = ({ compact }) => (
    <table className="tbl">
      <thead><tr><th>Ingredient</th><th className="num">Qty / portion</th>{!compact && <th>Unit</th>}<th className="num">Unit cost</th><th className="num">Line cost</th><th></th></tr></thead>
      <tbody>
        {recipe.map((r, i) => (
          <tr key={i}>
            <td><div className="row center" style={{ gap: 8 }}><Ic>◦</Ic>{r[0]}</div></td>
            <td className="num">{r[1]}{compact ? " " + r[2] : ""}</td>
            {!compact && <td className="muted">{r[2]}</td>}
            <td className="num muted">₸ {r[3]}</td>
            <td className="num">₸ {r[4]}</td>
            <td className="muted">✕</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
  const AddRow = (
    <div className="row wrap center" style={{ gap: 8 }}>
      <Field placeholder="＋ Search ingredient…" w={200} />
      <Field placeholder="qty" w={70} />
      <div className="inp" style={{ width: 80 }}>g ▾</div>
      <Btn>Add to recipe</Btn>
    </div>
  );
  const CostSummary = (
    <Card style={{ background: "#faf9f6" }}>
      <Block title="Live cost & margin">
        <div className="col" style={{ gap: 8 }}>
          <div className="row between center" style={{ gap: 12 }}><span className="muted" style={{ flex: 1 }}>Ingredient cost / portion</span><b className="mono" style={{ whiteSpace: "nowrap" }}>₸ {totalCost}</b></div>
          <div className="row between center" style={{ gap: 12 }}><span className="muted" style={{ flex: 1 }}>Sell price</span><span className="mono" style={{ whiteSpace: "nowrap" }}>₸ 86,000</span></div>
          <div className="row between center" style={{ gap: 12 }}><span className="muted" style={{ flex: 1 }}>Waste buffer 6%</span><span className="mono" style={{ whiteSpace: "nowrap" }}>₸ 124</span></div>
          <Divider />
          <div className="row between center"><b>Gross margin</b><Chip ok>97.4%</Chip></div>
          <Anno>Edit any quantity → cost, margin & projected stock usage recalc instantly.</Anno>
        </div>
      </Block>
    </Card>
  );

  // A — two-panel: details left, recipe right
  if (variant === 0) return (
    <div className="row wrap" style={{ alignItems: "flex-start" }}>
      <div className="col" style={{ width: 320 }}>
        <Card>
          <Block title="Food details">
            <Ph h={120} label="dish photo · drag to upload" />
            <Field label="Name" value="Chicken Kabab" />
            <div className="row"><Field label="Category" value="Grill" /><Field label="Price" value="86,000" suffix="₸" /></div>
            <Field label="Description" placeholder="Short menu description…" area />
            <div className="row center" style={{ gap: 10 }}><Chip on>Active</Chip><Chip>Show on live menu</Chip></div>
          </Block>
        </Card>
        {CostSummary}
      </div>
      <div className="col grow" style={{ minWidth: 360 }}>
        <Anno>Recipe lives beside the details — the usage engine. Each row = ingredient drawn from stock per portion sold.</Anno>
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: 16 }}><div className="h h-md">Recipe — per portion</div></div>
          <RecipeRows />
        </Card>
        <Card>{AddRow}</Card>
        <div className="row" style={{ justifyContent: "flex-end", gap: 10 }}><Btn gho>Cancel</Btn><Btn pri>Save food</Btn></div>
      </div>
    </div>
  );

  // B — stepped single column
  if (variant === 1) {
    const steps = ["1 · Details", "2 · Recipe", "3 · Pricing & menu"];
    return (
      <div className="col" style={{ maxWidth: 720, margin: "0 auto" }}>
        <div className="row center" style={{ gap: 0 }}>
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              <Chip on={i === 1}>{s}</Chip>
              {i < 2 && <div style={{ flex: 1, height: 2, background: "repeating-linear-gradient(90deg,#bbb 0 6px,transparent 6px 12px)" }} />}
            </React.Fragment>
          ))}
        </div>
        <Anno>Guided steps — best for staff onboarding or first-time setup; one decision at a time.</Anno>
        <Card>
          <Block title="Step 2 — Build the recipe">
            <div className="small muted">Add every ingredient consumed per portion. This is what drives stock usage & food cost.</div>
            <RecipeRows />
            <Divider />
            {AddRow}
          </Block>
        </Card>
        {CostSummary}
        <div className="row between"><Btn gho>← Back</Btn><Btn pri>Continue → Pricing</Btn></div>
      </div>
    );
  }

  // C — spreadsheet usage grid (cost-engineering focus)
  if (variant === 2) return (
    <div className="col">
      <div className="row between center wrap" style={{ gap: 12 }}>
        <div><span className="tiny">EDITING</span><div className="h h-lg">Chicken Kabab · recipe sheet</div></div>
        <div className="row center" style={{ gap: 10 }}><Field label="Portions/batch" value="1" w={120} /><Btn pri>Save</Btn></div>
      </div>
      <Anno>Spreadsheet mode for cost engineers — every line shows %-of-cost; sortable, dense, fast keyboard entry.</Anno>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <table className="tbl">
          <thead><tr><th>Ingredient</th><th className="num">Qty</th><th>Unit</th><th className="num">Unit cost</th><th className="num">Line ₸</th><th className="num">% of cost</th><th>Stock left</th></tr></thead>
          <tbody>
            {recipe.map((r, i) => (
              <tr key={i}>
                <td>{r[0]}</td><td className="num">{r[1]}</td><td className="muted">{r[2]}</td>
                <td className="num muted">₸ {r[3]}</td><td className="num">₸ {r[4]}</td>
                <td className="num"><Chip>{Math.round(+r[4].replace(/,/g, "") / 2061 * 100)}%</Chip></td>
                <td><span className="row center" style={{ gap: 6 }}><Dot c={i === 2 ? "r" : "g"} /><span className="small muted">{i === 2 ? "30g — low" : "OK"}</span></span></td>
              </tr>
            ))}
            <tr><td className="muted" colSpan={7}>＋ new line…</td></tr>
          </tbody>
          <tfoot><tr style={{ borderTop: "2px solid var(--line)" }}><td><b>Total / portion</b></td><td colSpan={3}></td><td className="num"><b>₸ {totalCost}</b></td><td className="num"><b>100%</b></td><td><Chip ok>97% margin</Chip></td></tr></tfoot>
        </table>
      </Card>
    </div>
  );

  // D — details with recipe in a side drawer
  return (
    <div style={{ position: "relative" }}>
      <Anno>Detail page stays simple; tapping “Edit recipe” slides a drawer over it — keeps the form uncluttered on mobile.</Anno>
      <div className="row wrap" style={{ alignItems: "flex-start", opacity: .55 }}>
        <Card style={{ width: 300 }}>
          <Ph h={110} label="dish photo" />
          <Field label="Name" value="Chicken Kabab" />
          <div className="row"><Field label="Category" value="Grill" /><Field label="Price" value="86,000" /></div>
        </Card>
        <Card className="grow" style={{ minWidth: 280 }}>
          <div className="row between center"><div className="h h-md">Recipe</div><Btn pri sm>Edit recipe →</Btn></div>
          <div className="small muted" style={{ marginTop: 8 }}>5 ingredients · ₸ {totalCost} cost · 97% margin</div>
        </Card>
      </div>
      {/* drawer */}
      <Card style={{ position: "absolute", top: 0, right: 0, width: "min(460px,92%)", height: "100%", boxShadow: "-8px 0 24px rgba(0,0,0,.12)", overflow: "auto" }}>
        <div className="row between center"><div className="h h-md">Edit recipe — drawer</div><Ic>✕</Ic></div>
        <Divider />
        <RecipeRows compact />
        <Divider />
        {AddRow}
        <Divider />
        <div className="row between center"><span className="muted">Cost / portion</span><b className="mono">₸ {totalCost}</b></div>
        <div className="row" style={{ justifyContent: "flex-end", gap: 10, marginTop: 12 }}><Btn gho>Discard</Btn><Btn pri>Apply</Btn></div>
      </Card>
    </div>
  );
}
window.FoodEditor = FoodEditor;
FoodEditor.variants = ["A — Two-panel", "B — Stepped form", "C — Spreadsheet sheet", "D — Recipe drawer"];
FoodEditor.caps = [
  "Details on the left, live recipe + cost/margin engine on the right.",
  "Guided 3-step wizard — friendly for onboarding new staff.",
  "Dense cost-engineering sheet with %-of-cost and stock-left per line.",
  "Simple detail page; recipe editing slides in as a drawer (mobile-friendly).",
];
