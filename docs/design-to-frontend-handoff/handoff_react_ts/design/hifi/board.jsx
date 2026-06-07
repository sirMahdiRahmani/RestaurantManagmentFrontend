// hifi/board.jsx — lays out grouped, named frames for Figma import
const { Frame, HFDashboard, HFFoods, HFEditor, HFCategories, HFInventory, HFStockIn, HFGuests, HFFactor, HFInvoice, HFMenuBoard, HFQRMenu, HFOnboard } = window;

function Group({ n, title, count, children }) {
  return (
    <section className="group">
      <div className="group-h"><span className="n">{n}</span><h2>{title}</h2><span className="ln" /><span className="ct">{count}</span></div>
      <div className="frames">{children}</div>
    </section>
  );
}

function Board() {
  return (
    <div className="board">
      <header className="board-head">
        <div className="ey">Saffron House · RestoOS</div>
        <h1>Restaurant Management — Hi-Fi Screens</h1>
        <p>Final visual direction, one selected approach per screen. Each frame below is a self-contained, named artboard — import straight into Figma with the html.to.design plugin and every card, table and label arrives as an editable layer.</p>
        <div className="meta"><span>Clean SaaS</span><span>Indigo #3b5bdb</span><span>Plus Jakarta Sans</span><span>Currency: Toman</span><span>LTR · English</span><span>12 frames</span></div>
      </header>

      <Group n="1" title="Operate" count="dashboard · factor · guests">
        <Frame id="ab-dashboard" label="Dashboard" tag="1440×912"><HFDashboard /></Frame>
        <Frame id="ab-factor" label="Factor / Invoice — POS builder" tag="1440×912"><HFFactor /></Frame>
        <Frame id="ab-invoice" label="Factor — A4 print" tag="794 · doc" kind="doc"><HFInvoice /></Frame>
        <Frame id="ab-guests" label="Guests — Loyalty CRM" tag="1440×912"><HFGuests /></Frame>
      </Group>

      <Group n="2" title="Menu & Recipes" count="foods · recipe · categories">
        <Frame id="ab-foods" label="Foods & Menu" tag="1440×912"><HFFoods /></Frame>
        <Frame id="ab-editor" label="Add / Edit Food — recipe & usage" tag="1440×912"><HFEditor /></Frame>
        <Frame id="ab-categories" label="Categories" tag="1440×912"><HFCategories /></Frame>
      </Group>

      <Group n="3" title="Inventory" count="stock · receiving">
        <Frame id="ab-inventory" label="Ingredient Stock" tag="1440×912"><HFInventory /></Frame>
        <Frame id="ab-stockin" label="Stock-in — ingredient input" tag="1440×912"><HFStockIn /></Frame>
      </Group>

      <Group n="4" title="Public & Mobile" count="menu board · guest phone">
        <Frame id="ab-menuboard" label="Live Price Menu — screen board" tag="1440×912"><HFMenuBoard /></Frame>
        <Frame id="ab-qrmenu" label="Guest QR menu" tag="390 · mobile" kind="phone"><HFQRMenu /></Frame>
        <Frame id="ab-onboard" label="Guest onboarding" tag="390 · mobile" kind="phone"><HFOnboard /></Frame>
      </Group>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Board />);
