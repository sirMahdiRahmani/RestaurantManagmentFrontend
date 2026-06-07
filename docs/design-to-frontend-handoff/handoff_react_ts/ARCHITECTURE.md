# ARCHITECTURE.md — modular, domain-driven React + TypeScript

## Stack (suggested; adjust to house standards)
- React 18 + TypeScript (strict), Vite.
- Routing: React Router (or TanStack Router).
- Server state: TanStack Query over repository interfaces. Local/UI state: component state + Zustand for cross-cutting (current order, auth).
- Styling: CSS Modules + CSS variables for tokens (or Tailwind with the tokens mapped into `theme.extend`). Pick one and stay consistent.
- Forms: React Hook Form + Zod (Zod schemas double as runtime validation AND inferred types).
- Tests: Vitest + React Testing Library. Domain logic tested as pure functions.

## Layering (per module)
Each feature module is a vertical slice with four layers. Dependencies point **inward** (ui → application → domain; infra implements domain ports):

```
domain/        entities, value objects, pure business logic, repository PORTS (interfaces). Zero React, zero fetch.
application/   use-cases / services / query hooks that orchestrate domain + repos.
infra/         repository implementations (HTTP, or in-memory mock), DTO↔domain mappers.
ui/            components, pages, hooks that call application layer.
index.ts       PUBLIC barrel — the ONLY thing other modules may import.
```

## Folder structure
```
src/
  app/
    routes.tsx               route table → pages from module barrels
    providers.tsx            QueryClient, Theme, Router, i18n/dir
    layout/                  AppShell, Sidebar, Topbar (consume nav registry)
  modules/
    menu/
      domain/                Food, Category, types, Food rules
      application/           useFoods, useCategories, foodService
      infra/                 foodRepository.http.ts, foodRepository.memory.ts, mappers
      ui/                    FoodsListPage, FoodCard, FoodTable, CategoryList…
      index.ts
    recipes/
      domain/                Recipe, RecipeLine, cost.ts (pure: cost/margin/usage)
      application/           useRecipe, recipeCalc selectors
      infra/
      ui/                    FoodEditorPage (two-panel), RecipeTable, AddIngredientRow, CostSummary
      index.ts
    inventory/
      domain/                Ingredient, StockLevel, StockIn, par-level rules, depletion.ts
      application/           useStock, useStockIn, receiveStockUseCase
      infra/
      ui/                    StockTablePage, StockInPage, LowStockCards, QuickAdjust
      index.ts
    guests/
      domain/                Guest, LoyaltyTier, tier rules
      application/           useGuests, useGuest
      infra/
      ui/                    GuestsCrmPage, GuestProfile, OnboardingForm
      index.ts
    billing/
      domain/                Factor, FactorLine, totals.ts (subtotal/service/vat/total), settings
      application/           useFactor, addLine/removeLine, settleFactorUseCase (→ triggers inventory depletion)
      infra/                 printAdapter (thermal + A4)
      ui/                    PosBuilderPage, OrderPanel, ItemGrid, ReceiptPreview, A4Invoice
      index.ts
    publicMenu/
      domain/                PublishedMenu projection
      application/           usePublishedMenu, publishMenuUseCase
      infra/
      ui/                    MenuBoard, QrGuestMenu, PrintablePriceList
      index.ts
    analytics/
      domain/                KPI/projection types
      application/           useDashboard
      ui/                    DashboardPage, KpiCard, SalesBars, TopSellers, ActivityFeed
      index.ts
  shared/
    ui/                      Button, Card, Pill/Badge, Table, Field/Input, Segmented, Modal, Drawer, EmptyState, Icon
    money/                   Money value object + formatToman()
    i18n/                    dir + string catalog (en now, fa-ready)
    tokens/                  tokens.css (CSS vars) + theme.ts (typed token object)
    lib/                     date, id, result/either helpers
    types/                   shared primitives (Id, ISODate, Quantity, Unit)
  test/                      setup, factories
```

## Cross-module rule
Module A may import only `modules/B` (its `index.ts`). Never `modules/B/infra/...`. Shared, reusable, dumb UR goes in `shared/ui`. Domain knowledge never leaks into `shared`.

## Domain model (TypeScript — author in Zod, infer types)
```ts
// shared/types
type Id = string & { readonly brand: unique symbol };
type Toman = number; // integer
type Unit = 'g' | 'kg' | 'ml' | 'L' | 'pcs';

// menu/domain
interface Category { id: Id; name: string; color: string; sortOrder: number; }
interface Food {
  id: Id; name: string; categoryId: Id; price: Toman;
  description?: string; photoUrl?: string; isActive: boolean; showOnMenu: boolean;
  recipe: RecipeLine[];
}

// recipes/domain
interface RecipeLine { ingredientId: Id; qtyPerPortion: number; unit: Unit; }
// pure (cost.ts): unitCost comes from Inventory read model
function lineCost(line: RecipeLine, unitCost: Toman): Toman;
function recipeCost(lines: RecipeLine[], unitCosts: Record<Id, Toman>): Toman;
function margin(price: Toman, cost: Toman): number;            // 0..1
function projectedUsage(lines: RecipeLine[], portionsSold: number): Record<Id, number>;

// inventory/domain
interface Ingredient { id: Id; name: string; unit: Unit; unitCost: Toman; }
interface StockLevel { ingredientId: Id; onHand: number; parLevel: number; }
function isLow(s: StockLevel): boolean;                         // onHand < parLevel
interface StockIn { id: Id; supplier: string; date: ISODate; invoiceNo: string;
  lines: { ingredientId: Id; qty: number; unit: Unit; unitCost: Toman }[]; }
// depletion.ts (pure): apply settled factor → stock deltas + new weighted-avg unit costs

// guests/domain
type LoyaltyTier = 'New' | 'Silver' | 'Gold';
interface Guest { id: Id; name: string; phone: string; tier: LoyaltyTier;
  visits: number; lifetimeSpend: Toman; lastSeen: ISODate; }

// billing/domain
interface FactorSettings { servicePct: number; vatPct: number; }   // configurable
interface FactorLine { foodId: Id; qty: number; unitPrice: Toman; }
interface Factor { id: Id; tableId?: string; guestId?: Id; lines: FactorLine[];
  status: 'open' | 'held' | 'paid'; printedAt?: ISODate; }
// totals.ts (pure): subtotal → service → vat → total
```

## Key flows (cross-module use-cases)
- **Edit recipe → live cost/margin:** `recipes/ui/FoodEditorPage` reads ingredient unit costs from `inventory` (via barrel), runs `recipes/domain/cost.ts` selectors on every qty change. No math in components.
- **Settle factor → deplete stock:** `billing/application/settleFactorUseCase` computes totals, marks paid, then calls an `inventory` use-case with `(factor.lines × food.recipe)` to apply `depletion.ts`. Wire as an application-level orchestration (or domain event `FactorSettled` that inventory subscribes to) — keep modules decoupled.
- **Publish menu:** `publicMenu/publishMenuUseCase` projects active `Food`s (`showOnMenu`) + `Category` order into a read-only `PublishedMenu`; board/QR/print all render that projection so a price edit in Menu propagates.
- **Low stock → dashboard:** `analytics` reads `inventory` low-stock projection for the "Needs attention"/KPI.

## Data layer
Define a port per aggregate in `domain/`, e.g.:
```ts
interface FoodRepository {
  list(): Promise<Food[]>;
  get(id: Id): Promise<Food | null>;
  save(food: Food): Promise<void>;
}
```
Provide TWO implementations in `infra/`: `*.http.ts` (real API, DTO↔domain mappers) and `*.memory.ts` (seeded from `design`-derived fixtures) so the UI runs immediately. Select via a provider/env flag. `application/` hooks depend on the interface, never on a concrete impl.

## Tokens (source of truth — mirror into tokens.css + theme.ts)
```
--accent:#3b5bdb  --accent-700:#2f49b8  --accent-50:#eef1fd  --accent-100:#e0e6fb
--ink:#171a20  --ink-2:#3d424c  --muted:#6b7280  --faint:#9aa1ac
--page:#eceef2  --surface:#fff  --surface-2:#f7f8fa  --line:#e7e9ee  --line-2:#eef0f3
--ok:#15803d/--ok-bg:#e7f3ec   --warn:#c2710c/--warn-bg:#fbeede   --danger:#dc2626/--danger-bg:#fbe9e9
radius: lg 16 / md 12 / sm 9
shadow-sm: 0 1px 2px rgba(16,24,40,.06)
shadow:    0 1px 3px rgba(16,24,40,.07), 0 1px 2px rgba(16,24,40,.05)
shadow-md: 0 6px 16px rgba(16,24,40,.08), 0 2px 6px rgba(16,24,40,.05)
font sans: 'Plus Jakarta Sans'   font mono: 'IBM Plex Mono' (tabular nums for all money/qty)
spacing base 20px (comfy) / 12px (compact);  tables: 11.5px uppercase headers, 14px cells
```

## Build order (vertical slices — ship each runnable)
1. **Scaffold + shared:** Vite/TS strict, tokens, `shared/ui` (Button, Card, Pill, Table, Field, Icon), `shared/money`, AppShell (Sidebar + Topbar from a nav registry), router, QueryClient, in-memory repo wiring.
2. **Menu:** Categories + Foods list (table) + Food create/edit basics. Mock repo.
3. **Inventory:** Stock table + Stock-in form + low-stock rules. Establishes unit costs.
4. **Recipes:** Food editor two-panel + recipe table + cost/margin/usage (pure, tested). Consumes Inventory unit costs.
5. **Billing:** POS builder + receipt preview + A4 invoice + `settleFactorUseCase` → inventory depletion.
6. **Guests:** CRM table + profile + onboarding form.
7. **PublicMenu:** publish projection → board + QR menu + printable list.
8. **Analytics:** dashboard KPIs/feed over the projections.
9. **Swap infra:** implement `*.http.ts` against the real API; flip the provider flag.

Each step: domain types + tests first, then application hooks, then UI to match the design reference.
