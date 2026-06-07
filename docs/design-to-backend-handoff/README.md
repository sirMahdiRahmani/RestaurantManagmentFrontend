# Handoff: Restaurant Management System (RestoOS) — Wireframes

## Overview
A back-office + customer-facing **restaurant management system**. Core jobs:
- Manage **foods**, **food categories**, and **recipes** (ingredients per food) so the system can calculate **food cost, margin, and live stock usage**.
- **Ingredient stock / inventory** with a receiving ("stock-in") input flow; usage auto-deducts as orders are billed.
- **Guest management** (loyalty CRM + phone onboarding).
- **Factor (invoice) printing** — thermal receipt + formal A4.
- **Live price menu** — in-house screen board, customer QR mobile menu with optional self-ordering, and a printable price list.

Primary users: owner/manager (admin), kitchen/inventory staff, front-of-house, accountant. Target devices: **desktop back-office + tablet/phone** for counter and customer-facing views. Navigation: classic left sidebar. Intended density: spacious/calm.

## About the Design Files
The files in this bundle are **design references created in HTML** — low-fidelity wireframes showing intended structure, layout, content, and flow. **They are not production code to copy directly.** The task is to **recreate these designs in the target codebase's existing environment** (React, Vue, SwiftUI, Flutter, etc.) using its established components, design system, and patterns. If no codebase/design system exists yet, pick the most appropriate stack and implement there.

The wireframe is a single-page React + Babel prototype (CDN, no build step) used purely to make the wireframes interactive and switchable. Do not treat its structure as the intended app architecture.

## Fidelity
**Low-fidelity (lofi).** These are wireframes: hand-drawn/sketch aesthetic, placeholder imagery (striped boxes), grayscale + one accent color. Use them as the source of truth for **layout, hierarchy, content, screen inventory, and flow** — NOT for final visual styling. Apply the target app's real design system for color, type, spacing, and components. Every screen offers **multiple distinct "approaches" (A/B/C/D)** — these are alternatives to choose between, not screens to all build. The team should pick a direction per screen before hi-fi.

## Screens / Views

Each screen lives in its own file under `js/screen-*.jsx` and exposes its approaches via a `.variants` array. Pick ONE approach per screen for production unless noted.

### 1. Dashboard — `js/screen-dashboard.jsx`
**Purpose:** Manager's at-a-glance overview. **Approaches:**
- **A — Stat cards + feed:** 4 KPI cards (Today's sales, Open tables, Factors printed, Low-stock items), a 7-day sales bar chart, a Top-sellers list, and a Recent-activity table.
- **B — Two-column work view:** Large revenue hero + secondary KPIs + sales-by-category chart on the left; a "Needs attention" alert rail (low stock, waiting tables, unpaid factors) and Quick actions on the right.
- **C — Action tiles:** Big touch tiles (New Factor, Open Tables, Menu, Stock-in, Guests, Live Menu) for a counter tablet; a single summary strip at the bottom.

### 2. Foods & Menu — `js/screen-foods.jsx`
**Purpose:** Browse/manage menu items. Shared toolbar: search + category chips + "Add food". **Approaches:**
- **A — Data table:** columns Food (thumb + name), Category, Price, Cost, Margin (%), Status (active/hidden), row actions. Margin computed from price/cost.
- **B — Photo cards:** image-led grid, price, status dot, edit.
- **C — Grouped columns:** kanban-style columns per category; cards draggable between columns to recategorize.

### 3. Add / Edit Food (RECIPE / USAGE ENGINE) — `js/screen-food-editor.jsx` ⭐ key screen
**Purpose:** Edit a food and its **recipe** (ingredients consumed per portion). This drives food cost, margin, and stock depletion. Recipe row = `{ ingredient, qtyPerPortion, unit, unitCost, lineCost }`; total cost = Σ lineCost; margin = 1 − cost/price. **Approaches:**
- **A — Two-panel:** Food details (photo, name, category, price, description, active/show-on-menu toggles) on the left with a "Live cost & margin" summary card; recipe table + add-ingredient row on the right.
- **B — Stepped form:** 3-step wizard (1 Details · 2 Recipe · 3 Pricing & menu) — best for staff onboarding.
- **C — Spreadsheet sheet:** dense editable grid; each line shows %-of-cost and current stock-left; footer totals + margin. For cost engineers.
- **D — Recipe drawer:** simple detail page; "Edit recipe" slides a drawer over it (mobile-friendly).

Add-ingredient control: searchable ingredient field + qty + unit selector + "Add to recipe". Editing any qty recalculates cost/margin/usage live.

### 4. Categories — `js/screen-categories.jsx`
**Purpose:** Manage menu categories (order maps to live-menu sections). **Approaches:** A — drag-to-order list with item counts; B — emoji/color tiles.

### 5. Ingredient Stock — `js/screen-inventory.jsx`
**Purpose:** Inventory levels + receiving. **Approaches:**
- **A — Stock table:** ingredient, on-hand qty+unit, level-vs-par bar, status (OK/Reorder), quick −/+ manual adjust. Usage auto-deducts from sales.
- **B — Stock-in form:** the **ingredient input / receiving** flow — supplier, date, invoice #, line items (ingredient, qty, unit, unit cost, total), grand total; a side panel previews the effect on stock and notes that new unit costs recompute affected recipes.
- **C — Alert cards:** low-stock items first (with Order now), healthy stock collapsed below — phone-friendly.

### 6. Guests — `js/screen-guests.jsx`
**Purpose:** Loyalty CRM + onboarding. **Approaches:**
- **A — CRM table:** guest (avatar+name), phone, visits, lifetime spend, loyalty tier, last seen.
- **B — Profile detail:** master list + selected guest profile (stats, recent factors/history).
- **C — Onboarding capture:** phone-based signup (waiter-assisted or QR self-signup) shown in a phone frame; captures mobile + name + consent → loyalty code.

### 7. Factor / Invoice — `js/screen-factor.jsx`
**Purpose:** Build an order and print the bill ("factor"). **Approaches:**
- **A — POS builder + receipt:** category chips → item grid → editable order lines (qty −/+, remove); a **live thermal-receipt preview** (header, lines, subtotal, service %, VAT %, total, QR) updates as you build; "Print factor" button.
- **B — A4 invoice:** formal document — business header with reg/VAT IDs, bill-to + table, itemized table, subtotal/service/VAT/total, signature block; PDF/Email/Print actions.

### 8. Live Price Menu — `js/screen-menu.jsx`
**Purpose:** Customer-facing menu, published from Foods. **Approaches:**
- **A — Menu board (TV):** dark big-screen board, categories in columns, prices pulled from Foods (a price edit updates here); Live status + publish + copy-link.
- **B — QR mobile menu:** what a guest sees after scanning a table QR — hero, category chips, item rows with photos, optional self-order ("View order"). Settings panel shows link, per-table QR, self-ordering toggle.
- **C — Printable list:** clean A4/A5 price list (dotted leaders) generated from the same data.

## Interactions & Behavior
- **Left sidebar nav** switches screens; the active item is highlighted; a count badge shows # of approaches.
- **Approach tabs** (top-right of each screen) switch between A/B/C/D layouts. In production, only the chosen approach ships.
- **Recipe editing** recalculates cost, margin, %-of-cost, and projected stock usage live on every qty change.
- **Stock** decreases automatically when a factor is billed (recipe × qty sold); manual ±/stock-in adjust on top. Low-stock when on-hand < par → reorder alerts surface on Dashboard and Inventory.
- **Factor** total = subtotal + service% + VAT%; receipt/A4 reflect live order lines.
- **Live menu** is read-only public output derived from Foods + Categories; publishing pushes current prices.
- **Guest onboarding** ties future factors to a guest for history and loyalty.
- Responsive: back-office is desktop-first with table→card collapse on narrow widths; customer menu, onboarding, and alert views are phone-first (shown in phone frames at 300px screen width).

## State Management (suggested domain model)
- **Food**: id, name, categoryId, price, description, photo, isActive, showOnMenu, recipe[].
- **RecipeLine**: ingredientId, qtyPerPortion, unit, (derived) unitCost, lineCost.
- **Category**: id, name, emoji/color, sortOrder.
- **Ingredient**: id, name, unit, onHandQty, parLevel, unitCost (updated by stock-in, weighted avg).
- **StockIn**: id, supplier, date, invoiceNo, lines[{ingredientId, qty, unit, unitCost}].
- **Guest**: id, name, phone, tier, visits, lifetimeSpend, lastSeen.
- **Factor**: id, tableId, guestId?, lines[{foodId, qty, price}], subtotal, servicePct, vatPct, total, status(paid/unpaid), printedAt.
- Derived: foodCost = Σ lineCost; margin = 1 − foodCost/price; stock depletion on factor settle.

## Design Tokens (wireframe values — REPLACE with your design system for hi-fi)
- **Accent:** `#3b5bdb` (tweakable; alt swatches `#0f766e`, `#b45309`, `#7c3aed`, `#be123c`).
- **Ink:** `#2b2b2f`; **Ink-soft:** `#6b6b73`; **Paper bg:** `#f7f6f3`; **Panel:** `#ffffff`.
- **Status:** ok `#2f7d4f`, alert/low `#c2410c`, warn `#d4a017`.
- **Type (placeholder):** sketch uses Patrick Hand / Kalam (display) + Inconsolata (mono/data). These are wireframe fonts — swap for the product's real type. Min body ~13px, data tables ~15px.
- **Spacing:** base gap 20px (comfy) / 12px (compact).
- **Radius/shadow:** intentionally hand-drawn/irregular in "sketch" mode; "clean" mode uses ~6–8px radii. Not prescriptive for production.

## Tweaks (prototype-only controls)
The wireframe has a Tweaks panel: **style** (sketch ↔ clean), **density** (comfy ↔ compact), **annotations** on/off, and **accent color**. These are exploration aids, not product features.

## Open questions to resolve before hi-fi
- **Localization / RTL:** "factor" + mupra.ir reference suggest a Persian/Farsi market. Wireframes are LTR English — confirm if RTL + Farsi is needed.
- **Currency:** prototype uses a placeholder symbol (₸). Confirm real currency/format (e.g. تومان / ریال) and tax rules (service %, VAT %).
- **Which approach** to take forward per screen.

## Assets
No real assets yet. All imagery is **striped placeholder boxes** labeled with intent (e.g. "dish photo", "hero / restaurant photo", "table-tent QR card"). Icons are simple text/emoji glyphs in the wireframe — replace with the codebase's icon set. Provide real dish photography and the restaurant logo for hi-fi.

## Files
- `Wireframes.html` — entry point; loads React/Babel (CDN), styles (all wireframe CSS lives here in a `<style>` block), and the screen modules.
- `js/app.jsx` — shell: sidebar nav registry, approach-tab switching, tweaks wiring, localStorage persistence of current screen/approach.
- `js/ui.jsx` — shared wireframe primitives (Card, Btn, Field, Ph placeholder, Chip, Stat, Bars chart, Phone frame, etc.).
- `js/screen-dashboard.jsx`, `js/screen-foods.jsx`, `js/screen-food-editor.jsx`, `js/screen-categories.jsx`, `js/screen-inventory.jsx`, `js/screen-guests.jsx`, `js/screen-factor.jsx`, `js/screen-menu.jsx` — one file per screen; each exports `window.<Screen>` with `.variants` (approach labels) and `.caps` (approach descriptions).
- `tweaks-panel.jsx` — prototype tweak-panel scaffold (ignore for production).

**To view the wireframes:** open `Wireframes.html` in a browser. Use the left sidebar to switch screens and the top-right "Approaches" tabs to compare layouts.
