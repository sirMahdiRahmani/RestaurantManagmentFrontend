// js/screen-categories.jsx
function Categories({ variant }) {
  const cats = [
    { n: "Grill", c: 14, em: "🔥" }, { n: "Pizza", c: 9, em: "🍕" }, { n: "Salad", c: 7, em: "🥗" },
    { n: "Rice & Sides", c: 11, em: "🍚" }, { n: "Drinks", c: 16, em: "🥤" }, { n: "Dessert", c: 8, em: "🍰" },
  ];

  // A — list with counts + reorder
  if (variant === 0) return (
    <div className="col" style={{ maxWidth: 640 }}>
      <div className="row between center"><div className="h h-md">Menu categories</div><Btn pri>＋ New category</Btn></div>
      <Anno>Simple ordered list — the drag handle sets the order they appear on the live menu.</Anno>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <table className="tbl">
          <tbody>
            {cats.map((c, i) => (
              <tr key={i}>
                <td style={{ width: 30 }} className="muted">⋮⋮</td>
                <td><div className="row center" style={{ gap: 10 }}><Ic>{c.em}</Ic><b>{c.n}</b></div></td>
                <td className="muted">{c.c} items</td>
                <td className="muted" style={{ textAlign: "right" }}>✎ &nbsp; ✕</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );

  // B — tiles
  return (
    <div className="col">
      <div className="row between center"><div className="h h-md">Menu categories</div><Btn pri>＋ New category</Btn></div>
      <Anno>Tile view — color/emoji per category carries through to the live menu sections.</Anno>
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))" }}>
        {cats.map((c, i) => (
          <Card key={i} style={{ textAlign: "center", padding: "22px 14px" }}>
            <div style={{ fontSize: 30 }}>{c.em}</div>
            <div className="h h-md" style={{ marginTop: 6 }}>{c.n}</div>
            <div className="tiny">{c.c} items</div>
          </Card>
        ))}
        <Card style={{ textAlign: "center", padding: "22px 14px", borderStyle: "dashed", display: "grid", placeItems: "center", color: "var(--ink-soft)" }}>
          <div>＋<br />New</div>
        </Card>
      </div>
    </div>
  );
}
window.Categories = Categories;
Categories.variants = ["A — Ordered list", "B — Tiles"];
Categories.caps = ["Drag-to-order list with item counts.", "Emoji/color tiles that map to live-menu sections."];
