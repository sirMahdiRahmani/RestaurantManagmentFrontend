// js/screen-dashboard.jsx
function Dashboard({ variant }) {
  const stats = [
    { label: "Today's sales", value: "₸ 1.84M", sub: "▲ 12% vs yesterday", accent: true },
    { label: "Open tables", value: "14 / 22", sub: "8 free" },
    { label: "Factors printed", value: "96", sub: "today" },
    { label: "Low-stock items", value: "5", sub: "needs restock" },
  ];
  const popular = [
    { n: "Chicken Kabab", c: 42 }, { n: "Margherita Pizza", c: 38 },
    { n: "Caesar Salad", c: 29 }, { n: "Saffron Rice", c: 24 }, { n: "Lemonade", c: 51 },
  ];
  const activity = [
    ["12:48", "Factor #2041 printed", "Table 7 · ₸ 86,000"],
    ["12:31", "Stock-in received", "Tomato 18kg · Supplier A"],
    ["12:20", "New guest onboarded", "M. Karimi · loyalty"],
    ["11:58", "Low stock alert", "Mozzarella · 1.2kg left"],
  ];

  // A — stat cards + activity
  if (variant === 0) return (
    <div className="col">
      <div className="row wrap">{stats.map((s, i) => <Stat key={i} {...s} />)}</div>
      <Anno>Calm overview — 4 KPIs, one chart, a live activity feed. Good default for managers.</Anno>
      <div className="row wrap" style={{ alignItems: "stretch" }}>
        <Card className="grow" style={{ minWidth: 320 }}>
          <Block title="Sales — last 7 days" action={<Btn sm gho>Week ▾</Btn>}>
            <Bars data={[{ l: "M", v: 8 }, { l: "T", v: 11 }, { l: "W", v: 9 }, { l: "T", v: 14 }, { l: "F", v: 19, hi: true }, { l: "S", v: 22, hi: true }, { l: "S", v: 16 }]} />
          </Block>
        </Card>
        <Card style={{ minWidth: 280, flex: 1 }}>
          <Block title="Top sellers">
            <div className="col" style={{ gap: 10 }}>
              {popular.map((p, i) => (
                <div key={i} className="row center" style={{ gap: 10 }}>
                  <Ph w={34} h={34} label="" style={{ flex: "0 0 34px" }} />
                  <span className="grow">{p.n}</span>
                  <span className="mono small">{p.c} sold</span>
                </div>
              ))}
            </div>
          </Block>
        </Card>
      </div>
      <Card>
        <Block title="Recent activity" action={<Btn sm gho>View all</Btn>}>
          <table className="tbl">
            <tbody>
              {activity.map((a, i) => (
                <tr key={i}><td className="mono small muted" style={{ width: 70 }}>{a[0]}</td><td>{a[1]}</td><td className="muted small">{a[2]}</td></tr>
              ))}
            </tbody>
          </table>
        </Block>
      </Card>
    </div>
  );

  // B — two-column: main metrics + right rail
  if (variant === 1) return (
    <div className="row wrap" style={{ alignItems: "flex-start" }}>
      <div className="col grow" style={{ minWidth: 360 }}>
        <Anno>Work-focused: big revenue panel up top, a tasks/alerts rail on the right.</Anno>
        <Card>
          <div className="row between center">
            <div>
              <div className="tiny">Revenue today</div>
              <div className="h h-xl" style={{ fontSize: 40, color: "var(--accent)" }}>₸ 1,840,000</div>
              <div className="small muted">312 covers · avg ₸ 59,000 / table</div>
            </div>
            <Ph w={130} h={90} label="trend sparkline" />
          </div>
        </Card>
        <div className="row wrap">
          <Stat label="Tables open" value="14" />
          <Stat label="Avg wait" value="9m" />
          <Stat label="Refunds" value="2" />
        </div>
        <Card>
          <Block title="Sales by category">
            <Bars data={[{ l: "Grill", v: 22, hi: true }, { l: "Pizza", v: 17 }, { l: "Salad", v: 9 }, { l: "Drinks", v: 14 }, { l: "Dessert", v: 6 }]} />
          </Block>
        </Card>
      </div>
      <div className="col" style={{ width: 300 }}>
        <Card>
          <Block title="Needs attention">
            <div className="col" style={{ gap: 10 }}>
              <div className="row center" style={{ gap: 8 }}><Dot c="r" /><span className="grow small">Mozzarella low — 1.2kg</span><Btn sm>Order</Btn></div>
              <div className="row center" style={{ gap: 8 }}><Dot c="r" /><span className="grow small">Saffron low — 30g</span><Btn sm>Order</Btn></div>
              <div className="row center" style={{ gap: 8 }}><Dot c="y" /><span className="grow small">Table 12 waiting 18m</span></div>
              <div className="row center" style={{ gap: 8 }}><Dot c="y" /><span className="grow small">3 factors unpaid</span></div>
            </div>
          </Block>
        </Card>
        <Card>
          <Block title="Quick actions">
            <div className="col" style={{ gap: 9 }}>
              <Btn pri>＋ New factor</Btn>
              <Btn>＋ Add food</Btn>
              <Btn>📦 Stock-in</Btn>
              <Btn>☺ New guest</Btn>
            </div>
          </Block>
        </Card>
      </div>
    </div>
  );

  // C — big action tiles (tablet-friendly)
  return (
    <div className="col">
      <Anno>Tile-first home — large touch targets for a tablet at the counter. Numbers are secondary.</Anno>
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))" }}>
        {[
          { ic: "🧾", t: "New Factor", s: "Start an order" },
          { ic: "📋", t: "Open Tables", s: "14 active" },
          { ic: "🍲", t: "Menu", s: "86 items" },
          { ic: "📦", t: "Stock-in", s: "5 low" },
          { ic: "☺", t: "Guests", s: "1,204" },
          { ic: "◳", t: "Live Menu", s: "published" },
        ].map((x, i) => (
          <Card key={i} style={{ textAlign: "center", padding: "26px 16px", cursor: "pointer" }}>
            <div style={{ fontSize: 34, marginBottom: 8 }}>{x.ic}</div>
            <div className="h h-md">{x.t}</div>
            <div className="tiny" style={{ marginTop: 4 }}>{x.s}</div>
          </Card>
        ))}
      </div>
      <Card>
        <div className="row between center wrap" style={{ gap: 12 }}>
          <div><span className="tiny">TODAY</span><div className="h h-lg">₸ 1.84M · 96 factors · 312 covers</div></div>
          <Btn gho>See full report →</Btn>
        </div>
      </Card>
    </div>
  );
}
window.Dashboard = Dashboard;
Dashboard.variants = ["A — Stat cards + feed", "B — Two-column work view", "C — Action tiles"];
Dashboard.caps = [
  "KPIs across the top, trend chart, top sellers, live activity feed.",
  "Revenue hero with an attention/alerts rail and quick actions.",
  "Big touch tiles for a counter tablet; metrics take a back seat.",
];
