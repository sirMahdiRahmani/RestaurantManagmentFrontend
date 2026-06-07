# SCREENS.md — screen-by-screen build spec

Each screen: **domain** · **reads/writes** · **components** · **states**. Match the visual in `design/Restaurant System — Hi-Fi.html`. Build the listed components into the module's `ui/`; reuse `shared/ui` primitives (Button, Card, Pill, Table, Field, Icon) everywhere.

---

## 1. Dashboard — `analytics`
Read-only projections over billing/inventory/guests.
- **Reads:** today's sales total, open tables, factors printed, low-stock count; 7-day sales series; top sellers (qty by food); recent activity feed.
- **Components:** `DashboardPage`, `KpiCard` ×4, `SalesBars` (7-day bar chart), `TopSellers` (list w/ thumb + count), `ActivityFeed` (time · event · meta table).
- **States:** loading skeletons per card; empty feed; the low-stock KPI links to Inventory filtered to low.

## 2. Factor / Invoice — POS builder — `billing`
- **Reads:** active foods grouped by category. **Writes:** current `Factor` (open).
- **Components:** `PosBuilderPage`, category `Segmented`/pills, `ItemGrid` (tap to add), `OrderPanel` (qty ±, remove line), `TotalsBlock` (subtotal/service/vat/total from `totals.ts`), `ReceiptPreview` (live thermal layout), Print + Hold actions.
- **Behavior:** totals recompute on every line change; `servicePct`/`vatPct` from `FactorSettings`. Print → `printAdapter`. Settle → `settleFactorUseCase` (marks paid, triggers inventory depletion).
- **States:** empty order; held order; guest attached vs walk-in.

## 3. Factor — A4 print — `billing`
- **Component:** `A4Invoice` — print document (`@media print`, A4). Business header + reg/VAT IDs (from settings), bill-to (guest), itemized table, totals, signature line. PDF/Email/Print actions.

## 4. Guests — Loyalty CRM — `guests`
- **Reads:** guest list (name, phone, visits, lifetimeSpend, tier, lastSeen) + summary KPIs. Search by name/phone; filter by tier.
- **Components:** `GuestsCrmPage`, `KpiCard` row, `GuestTable` (avatar, tier `Pill`), search, tier filter pills. Row → `GuestProfile` (stats + recent factors). `OnboardingForm` (see #12).
- **States:** empty/no-results; tier filter active.

## 5. Foods & Menu — `menu`
- **Reads:** foods with derived cost & margin (margin from `recipes/domain`); category filter. **Writes:** none here (edit via #6).
- **Components:** `FoodsListPage`, category filter pills, `FoodTable` (thumb, name, category, price, cost, margin `Pill`, active/hidden status, row menu). "Add food" → editor.
- **States:** loading; empty category; hidden vs active styling.

## 6. Add / Edit Food — recipe & usage — `recipes` (+ `menu` for details) ⭐
- **Reads:** the food + ingredient unit costs (from `inventory`). **Writes:** food details + `recipe` lines.
- **Components:** `FoodEditorPage` (two-panel). Left: photo upload, name, category, price, description, Active/Show-on-menu toggles, `CostSummary` card (ingredient cost / price / waste buffer / **gross margin**). Right: `RecipeTable` (ingredient, qty, unit, unit cost, line cost, %-of-cost, remove) with totals footer; `AddIngredientRow` (searchable ingredient + qty + unit + add).
- **Behavior:** every qty edit re-runs `recipes/domain/cost.ts` → line cost, total, %-of-cost, margin, projected usage update live. All math pure + tested. Save validates with Zod.
- **States:** new vs edit; ingredient low-stock indicator on a line; invalid (qty ≤ 0).

## 7. Categories — `menu`
- **Reads/Writes:** categories (name, color, sortOrder).
- **Components:** `CategoryList` — drag-to-reorder rows (sortOrder = live-menu section order), color swatch, item count, edit/delete; "New category".
- **States:** reordering; delete-with-items confirm.

## 8. Ingredient Stock — `inventory`
- **Reads:** ingredients + stock levels vs par. **Writes:** quick manual adjust (±).
- **Components:** `StockTablePage`, search, low-count `Pill`, `StockTable` (name + par, on-hand qty, level-vs-par bar, status `Pill` OK/Reorder, `QuickAdjust` ±). "Stock-in" → #9.
- **Behavior:** `isLow` drives status + dashboard alert. Usage auto-deducts via factor settle (#2).
- **States:** low rows emphasized; empty search.

## 9. Stock-in — ingredient input — `inventory`
- **Reads:** ingredients (for line search). **Writes:** new `StockIn` → applies stock deltas + recomputes weighted-avg unit costs.
- **Components:** `StockInPage`, header fields (supplier, date, invoice #), `ReceivedLines` table (ingredient, qty, unit, unit cost, total) + add-line, totals footer, "Effect on stock" side panel (before→after), Save draft / Receive.
- **Behavior:** on Receive → `receiveStockUseCase`; new unit costs propagate to every recipe using those ingredients (recompute affected food costs).
- **States:** draft; empty lines; duplicate-ingredient merge.

## 10. Live Price Menu — screen board — `publicMenu`
- **Reads:** `PublishedMenu` projection (active, show-on-menu foods by category order).
- **Components:** `MenuBoard` — dark full-screen board, two-column category sections, live/auto-synced badge, publish + copy-link.
- **Behavior:** read-only projection; price edit in Menu propagates after publish.

## 11. Guest QR menu (mobile) — `publicMenu`
- **Component:** `QrGuestMenu` (390px) — hero, category pills, item rows (photo, name, desc, price, add), sticky "View order" bar. Optional self-order writes to a `Factor` for the table.
- **States:** category switch; cart count.

## 12. Guest onboarding (mobile) — `guests`
- **Component:** `OnboardingForm` (390px) — brand, phone + name fields, SMS consent checkbox, "Get my code" → verify step. Waiter-assisted or QR self-signup. Creates `Guest`, enrolls loyalty.
- **States:** validation (phone format), code-sent/verify.

---

### Shared `shared/ui` inventory (build first)
`Button` (primary/ghost/sm), `Card` (+ header), `Pill`/`Badge` (ok/warn/danger/on), `Table` (uppercase headers, hover, tabular-num `.num`), `Field`/`Input` (+ label, area, suffix), `Segmented`, `Icon` (line set: grid, receipt, user, dish, edit, layers, box, monitor, search, plus, print, bell), `Avatar`, `Bar`/`Barline`, `EmptyState`, `Modal`, `Drawer`, `Skeleton`. All money/qty render through `shared/money` with tabular numerals.
