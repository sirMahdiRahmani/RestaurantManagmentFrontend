// js/screen-guests.jsx
function Guests({ variant }) {
  const guests = [
    { n: "M. Karimi", ph: "0912 •••• 41", v: "38", spend: "4.2M", tier: "Gold", last: "2d ago" },
    { n: "S. Ahmadi", ph: "0935 •••• 09", v: "12", spend: "980k", tier: "Silver", last: "1w ago" },
    { n: "R. Tehrani", ph: "0901 •••• 77", v: "3", spend: "210k", tier: "New", last: "today" },
    { n: "L. Nouri", ph: "0938 •••• 22", v: "61", spend: "7.9M", tier: "Gold", last: "3d ago" },
  ];

  // A — guest table / CRM
  if (variant === 0) return (
    <div className="col">
      <div className="row between center wrap" style={{ gap: 10 }}>
        <Field placeholder="🔎 Search by name or phone…" w={260} />
        <div className="row center" style={{ gap: 8 }}><Chip on>All</Chip><Chip>Gold</Chip><Chip>New</Chip><Btn pri>＋ Add guest</Btn></div>
      </div>
      <Anno>CRM table — loyalty tier, visit count and lifetime spend; row opens the full profile & order history.</Anno>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <table className="tbl">
          <thead><tr><th>Guest</th><th>Phone</th><th className="num">Visits</th><th className="num">Lifetime spend</th><th>Tier</th><th>Last seen</th></tr></thead>
          <tbody>
            {guests.map((g, i) => (
              <tr key={i}>
                <td><div className="row center" style={{ gap: 10 }}><div className="sk" style={{ width: 32, height: 32, borderRadius: "50%", display: "grid", placeItems: "center", fontFamily: "var(--hand-bold)" }}>{g.n[0]}</div><b>{g.n}</b></div></td>
                <td className="mono small muted">{g.ph}</td>
                <td className="num">{g.v}</td>
                <td className="num">₸ {g.spend}</td>
                <td>{g.tier === "Gold" ? <Chip on>Gold</Chip> : g.tier === "New" ? <Chip>New</Chip> : <Chip>Silver</Chip>}</td>
                <td className="muted small">{g.last}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );

  // B — profile-focused (master/detail)
  if (variant === 1) return (
    <div className="row wrap" style={{ alignItems: "flex-start" }}>
      <Card style={{ width: 230, padding: 0, overflow: "hidden" }}>
        {guests.map((g, i) => (
          <div key={i} className="row center" style={{ gap: 10, padding: 12, borderBottom: "1.5px dashed #d8d5cd", background: i === 0 ? "var(--accent-soft)" : "transparent" }}>
            <div className="sk" style={{ width: 30, height: 30, borderRadius: "50%", display: "grid", placeItems: "center" }}>{g.n[0]}</div>
            <div><b className="small">{g.n}</b><div className="tiny">{g.tier} · {g.v} visits</div></div>
          </div>
        ))}
      </Card>
      <div className="col grow" style={{ minWidth: 320 }}>
        <Anno>Master–detail — pick a guest, see their profile, preferences and full factor history on the right.</Anno>
        <Card>
          <div className="row center" style={{ gap: 14 }}>
            <div className="sk" style={{ width: 56, height: 56, borderRadius: "50%", display: "grid", placeItems: "center", fontFamily: "var(--hand-bold)", fontSize: 22 }}>M</div>
            <div className="grow"><div className="h h-lg">M. Karimi</div><div className="tiny">0912 •••• 41 · joined Jan 2025</div></div>
            <Chip on>Gold</Chip>
          </div>
          <div className="row" style={{ marginTop: 14 }}><Stat label="Visits" value="38" /><Stat label="Lifetime" value="₸ 4.2M" accent /><Stat label="Avg ticket" value="₸ 110k" /></div>
        </Card>
        <Card>
          <Block title="Recent factors" action={<Btn sm gho>All</Btn>}>
            <table className="tbl">
              <tbody>
                <tr><td className="mono small muted">#2041</td><td>2 Kabab · Salad · 2 drinks</td><td className="num">₸ 286,000</td><td className="muted small">2d ago</td></tr>
                <tr><td className="mono small muted">#1996</td><td>Pizza · Lemonade</td><td className="num">₸ 148,000</td><td className="muted small">1w ago</td></tr>
              </tbody>
            </table>
          </Block>
        </Card>
      </div>
    </div>
  );

  // C — onboarding capture (mobile)
  return (
    <div className="row wrap" style={{ alignItems: "flex-start", gap: 30 }}>
      <div className="col" style={{ maxWidth: 360 }}>
        <Anno>Guest onboarding — the capture flow. A waiter or a QR self-signup collects phone + name to start loyalty.</Anno>
        <Card>
          <Block title="Why onboard guests?">
            <ul className="small" style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
              <li>Phone-based loyalty & points</li>
              <li>Tie factors to a guest for history</li>
              <li>SMS the live menu / promos</li>
              <li>Reorder “the usual” fast</li>
            </ul>
          </Block>
        </Card>
      </div>
      <Phone label="self sign-up / waiter capture">
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
          <div className="sk" style={{ width: 40, height: 40, margin: "6px auto", display: "grid", placeItems: "center" }}>R</div>
          <div className="h h-md" style={{ textAlign: "center" }}>Join RestoOS rewards</div>
          <div className="tiny" style={{ textAlign: "center" }}>Earn points on every visit</div>
          <Field label="Mobile number" value="0912 345 6789" />
          <Field label="Name" placeholder="Your name" />
          <div className="row center" style={{ gap: 8 }}><Ic>✓</Ic><span className="tiny">Agree to receive menu & offers</span></div>
          <Btn pri style={{ justifyContent: "center" }}>Get my code</Btn>
          <div className="tiny" style={{ textAlign: "center" }}>Verify with the SMS code →</div>
        </div>
      </Phone>
    </div>
  );
}
window.Guests = Guests;
Guests.variants = ["A — CRM table", "B — Profile detail", "C — Onboarding capture"];
Guests.caps = [
  "Loyalty CRM list with tier, visits and lifetime spend.",
  "Master–detail profile with preferences and factor history.",
  "Phone-based onboarding — waiter or QR self-signup for loyalty.",
];
