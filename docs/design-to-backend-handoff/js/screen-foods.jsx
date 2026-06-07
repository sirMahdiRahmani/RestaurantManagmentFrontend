// js/screen-foods.jsx
function Foods({ variant }) {
  const items = [
    { n: "Chicken Kabab", c: "Grill", p: "86,000", cost: "31,000", st: "on", img: "dish" },
    { n: "Margherita Pizza", c: "Pizza", p: "120,000", cost: "44,000", st: "on", img: "dish" },
    { n: "Caesar Salad", c: "Salad", p: "65,000", cost: "22,000", st: "on", img: "dish" },
    { n: "Saffron Rice", c: "Sides", p: "40,000", cost: "12,000", st: "off", img: "dish" },
    { n: "Lemonade", c: "Drinks", p: "28,000", cost: "7,000", st: "on", img: "drink" },
    { n: "Baklava", c: "Dessert", p: "45,000", cost: "16,000", st: "on", img: "dish" },
  ];
  const toolbar = (
    <div className="row wrap center" style={{ gap: 10 }}>
      <Field placeholder="🔎 Search foods…" w={240} />
      <Chip on>All</Chip><Chip>Grill</Chip><Chip>Pizza</Chip><Chip>Drinks</Chip>
      <Btn pri style={{ marginLeft: "auto" }}>＋ Add food</Btn>
    </div>
  );

  // A — data table
  if (variant === 0) return (
    <div className="col">
      {toolbar}
      <Anno>Dense table for managers — price, cost, margin and live status at a glance. Click a row to edit.</Anno>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <table className="tbl">
          <thead><tr><th>Food</th><th>Category</th><th className="num">Price</th><th className="num">Cost</th><th className="num">Margin</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {items.map((it, i) => {
              const m = Math.round((1 - (+it.cost.replace(/,/g, "") / +it.p.replace(/,/g, ""))) * 100);
              return (
                <tr key={i}>
                  <td><div className="row center" style={{ gap: 10 }}><Ph w={36} h={36} label="" /><b>{it.n}</b></div></td>
                  <td className="muted">{it.c}</td>
                  <td className="num">₸ {it.p}</td>
                  <td className="num muted">₸ {it.cost}</td>
                  <td className="num"><Chip ok>{m}%</Chip></td>
                  <td>{it.st === "on" ? <span className="row center" style={{ gap: 6 }}><Dot c="g" />Active</span> : <span className="row center muted" style={{ gap: 6 }}><Dot />Hidden</span>}</td>
                  <td className="muted">✎ ⋯</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );

  // B — photo card grid
  if (variant === 1) return (
    <div className="col">
      {toolbar}
      <Anno>Visual catalog — photo-led cards, friendlier for menu curation & FOH staff.</Anno>
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))" }}>
        {items.map((it, i) => (
          <Card key={i} style={{ padding: 12 }}>
            <Ph h={110} label={it.img + " photo"} />
            <div className="row between center" style={{ marginTop: 10 }}>
              <b>{it.n}</b>
              {it.st === "on" ? <Dot c="g" /> : <Dot />}
            </div>
            <div className="tiny" style={{ margin: "2px 0 8px" }}>{it.c}</div>
            <div className="row between center">
              <span className="h h-md" style={{ color: "var(--accent)" }}>₸ {it.p}</span>
              <Btn sm gho>Edit</Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  // C — grouped by category (kanban-ish columns)
  const groups = { Grill: [items[0]], Pizza: [items[1]], Salad: [items[2]], Drinks: [items[4]] };
  return (
    <div className="col">
      {toolbar}
      <Anno>Grouped by category — see the whole menu structure; drag items between columns to recategorize.</Anno>
      <div className="row wrap" style={{ alignItems: "flex-start" }}>
        {Object.entries(groups).map(([g, list]) => (
          <Card key={g} className="grow" style={{ minWidth: 210, background: "#faf9f6" }}>
            <div className="row between center" style={{ marginBottom: 10 }}>
              <b className="h h-md">{g}</b><span className="tiny">{list.length}</span>
            </div>
            <div className="col">
              {list.map((it, i) => (
                <div key={i} className="sk" style={{ padding: 10, background: "#fff" }}>
                  <div className="row center" style={{ gap: 9 }}><Ph w={30} h={30} label="" /><b className="small grow">{it.n}</b></div>
                  <div className="tiny" style={{ marginTop: 6 }}>₸ {it.p} · cost ₸ {it.cost}</div>
                </div>
              ))}
              <Btn gho sm>＋ Add to {g}</Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
window.Foods = Foods;
Foods.variants = ["A — Data table", "B — Photo cards", "C — Grouped columns"];
Foods.caps = [
  "Spreadsheet-style list with price, cost, margin and status.",
  "Photo-first grid for menu curation and front-of-house.",
  "Category columns showing overall menu structure.",
];
