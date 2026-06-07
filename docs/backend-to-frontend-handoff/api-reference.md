# API Reference

All routes are relative to the API base URL (e.g. `http://localhost:8080`).
Tenant-scoped routes require `X-Restaurant-ID: <uuid>` (see
[`README.md`](./README.md#authentication--tenancy)).

---

## Platform admin — `/admin/restaurants` *(not tenant-scoped)*

Manages restaurants on the platform — the screen an operator (not a
restaurant owner) uses to onboard/suspend tenants.

| Method | Path                       | Body                    | Returns                      |
|--------|----------------------------|-------------------------|------------------------------|
| POST   | `/admin/restaurants`       | `CreateRestaurantRequest` | `201` `Restaurant`         |
| GET    | `/admin/restaurants`       | —  *(paginated)*        | `200` `PaginatedResult<Restaurant>` |
| GET    | `/admin/restaurants/:id`   | —                       | `200` `Restaurant`           |
| PUT    | `/admin/restaurants/:id`   | `UpdateRestaurantRequest` | `200` `Restaurant`         |
| PATCH  | `/admin/restaurants/:id/status` | `SetStatusRequest` | `200` `Restaurant`           |

```ts
// CreateRestaurantRequest / UpdateRestaurantRequest
{ name: string; slug: string; address?: string; phone?: string; plan?: "standard" | "pro" | "enterprise" }

// SetStatusRequest
{ status: "active" | "suspended" }

// Restaurant
{
  id: string; name: string; slug: string; address: string; phone: string;
  status: "active" | "suspended"; plan: string;
  createdAt: string; updatedAt: string;
}
```

`slug` must be unique platform-wide and alphanumeric — `409` on collision.

---

## Categories — `/categories`

Simple, unpaged CRUD for menu categories.

| Method | Path              | Body                    | Returns                |
|--------|-------------------|-------------------------|------------------------|
| POST   | `/categories`     | `CreateCategoryRequest` | `201` `Category`       |
| GET    | `/categories`     | —                       | `200` `Category[]`     |
| GET    | `/categories/:id` | —                       | `200` `Category`       |
| PUT    | `/categories/:id` | `UpdateCategoryRequest` | `200` `Category`       |
| DELETE | `/categories/:id` | —                       | `204`                  |

```ts
// CreateCategoryRequest / UpdateCategoryRequest
{ name: string; emoji?: string; color?: string; sortOrder?: number }

// Category
{ id: string; name: string; emoji: string; color: string; sortOrder: number; createdAt: string; updatedAt: string }
```

`name` is unique per restaurant — `409` on collision.

---

## Ingredients — `/ingredients`

Inventory management. `onHandQty` and `unitCost` are **derived/managed**
fields — they only change via stock-in receipts, factor settlement, or the
`/adjust` endpoint, never via `PUT`.

| Method | Path                      | Body                     | Returns               |
|--------|---------------------------|--------------------------|-----------------------|
| POST   | `/ingredients`            | `CreateIngredientRequest`| `201` `Ingredient`    |
| GET    | `/ingredients`            | —                        | `200` `Ingredient[]`  |
| GET    | `/ingredients/low-stock`  | —                        | `200` `Ingredient[]`  |
| GET    | `/ingredients/:id`        | —                        | `200` `Ingredient`    |
| PUT    | `/ingredients/:id`        | `UpdateIngredientRequest`| `200` `Ingredient`    |
| DELETE | `/ingredients/:id`        | —                        | `204`                 |
| POST   | `/ingredients/:id/adjust` | `AdjustStockRequest`     | `200` `Ingredient`    |

```ts
// CreateIngredientRequest
{ name: string; unit: string; onHandQty?: number; parLevel?: number; unitCost?: number }

// UpdateIngredientRequest — note: no onHandQty/unitCost
{ name: string; unit: string; parLevel: number }

// AdjustStockRequest — manual +/- correction (stocktaking, spoilage/waste)
{ delta: number; reason?: string }

// Ingredient
{
  id: string; name: string; unit: string;
  onHandQty: number; parLevel: number; unitCost: number /* minor units */;
  isLowStock: boolean; // derived: onHandQty < parLevel — drives reorder alerts
  createdAt: string; updatedAt: string;
}
```

`name` is unique per restaurant — `409` on collision. `/low-stock` returns
exactly the ingredients where `isLowStock` is true (same shape, pre-filtered
server-side — handy for dashboard widgets).

---

## Foods — `/foods`

Menu items and their recipes (recipe lines are a child concept — see the
`/foods/:id/recipe` group). List/get without `/recipe` return the food alone;
the detail endpoint enriches it with live cost & margin.

| Method | Path                                  | Body                       | Returns             |
|--------|---------------------------------------|----------------------------|---------------------|
| POST   | `/foods`                               | `CreateFoodRequest`        | `201` `Food`        |
| GET    | `/foods`                               | —                          | `200` `Food[]`      |
| GET    | `/foods/:id`                           | —                          | `200` `Food`        |
| PUT    | `/foods/:id`                           | `UpdateFoodRequest`        | `200` `Food`        |
| DELETE | `/foods/:id`                           | —                          | `204`               |
| GET    | `/foods/:id/recipe`                    | —                          | `200` `FoodDetail`  |
| PUT    | `/foods/:id/recipe`                    | `UpsertRecipeLineRequest`  | `200` `FoodDetail`  |
| DELETE | `/foods/:id/recipe/:ingredientId`      | —                          | `200` `FoodDetail`  |

```ts
// CreateFoodRequest / UpdateFoodRequest
// price is in minor units; isActive/showOnMenu default to true on create
{
  categoryId: string; name: string; price: number;
  description?: string; photoUrl?: string;
  isActive?: boolean; showOnMenu?: boolean;
}

// UpsertRecipeLineRequest — adds or edits one ingredient line on the recipe
{ ingredientId: string; qtyPerPortion: number; unit: string }

// Food
{
  id: string; categoryId: string; name: string; price: number /* minor units */;
  description: string; photoUrl: string; isActive: boolean; showOnMenu: boolean;
  createdAt: string; updatedAt: string;
}

// FoodDetail — Food + enriched recipe + the "live cost & margin" summary
// the food-editor screen renders. Recomputed on every read from each
// ingredient's CURRENT weighted-average unit cost — never cached.
{
  ...Food,
  recipe: Array<{
    ingredientId: string; ingredientName: string;
    qtyPerPortion: number; unit: string;
    unitCost: number;  // ingredient's current weighted-average cost (minor units)
    lineCost: number;  // round(qtyPerPortion × unitCost), minor units
  }>;
  foodCost: number; // Σ lineCost
  margin: number;   // 1 − foodCost / price, in [0,1]; 0 when price is 0
}
```

`name` is unique per restaurant — `409` on collision. `PUT .../recipe`
upserts (create-or-replace) a single line by `ingredientId` —
`ON CONFLICT (food, ingredient)`.

---

## Stock-ins — `/stock-ins`

The "ingredient input / receiving" flow. Recording a receipt **immediately**
increases each line's ingredient on-hand quantity and recomputes its
weighted-average unit cost (which in turn changes affected foods'
`foodCost`/`margin` on next read). This is a one-shot create+apply — there is
no edit/delete; corrections go through `POST /ingredients/:id/adjust`.

| Method | Path             | Body                    | Returns                       |
|--------|------------------|-------------------------|-------------------------------|
| POST   | `/stock-ins`     | `CreateStockInRequest`  | `201` `StockIn`               |
| GET    | `/stock-ins`     | — *(paginated)*         | `200` `PaginatedResult<StockIn>` |
| GET    | `/stock-ins/:id` | —                       | `200` `StockIn`               |

```ts
// CreateStockInRequest
{
  supplier: string;
  occurredOn: string;       // date, RFC 3339
  invoiceNo?: string;
  lines: Array<{ ingredientId: string; qty: number; unit: string; unitCost: number }>;
}

// StockIn
{
  id: string; supplier: string; occurredOn: string; invoiceNo: string;
  grandTotal: number; // Σ lineTotal, minor units
  lines: Array<{
    ingredientId: string; qty: number; unit: string;
    unitCost: number; lineTotal: number; // round(unitCost × qty)
  }>;
  createdAt: string;
}
```

A receipt must have at least one line (`400` otherwise). Lines referencing
an unknown/foreign-tenant ingredient return `400`.

---

## Guests — `/guests`

Loyalty CRM. `visits`, `lifetimeSpend`, `lastSeenAt`, and `tier` are
**derived/managed** — they only change when a factor naming this guest is
settled (see [Factors](#factors--factors)); `PUT` only edits profile fields.

| Method | Path          | Body                  | Returns                     |
|--------|---------------|-----------------------|-----------------------------|
| POST   | `/guests`     | `CreateGuestRequest`  | `201` `Guest`               |
| GET    | `/guests`     | — *(paginated)*       | `200` `PaginatedResult<Guest>` |
| GET    | `/guests/:id` | —                     | `200` `Guest`               |
| PUT    | `/guests/:id` | `UpdateGuestRequest`  | `200` `Guest`               |
| DELETE | `/guests/:id` | —                     | `204`                       |

```ts
// CreateGuestRequest / UpdateGuestRequest
{ name: string; phone: string }

// Guest
{
  id: string; name: string; phone: string;
  tier: "member" | "silver" | "gold" | "platinum";
  visits: number; lifetimeSpend: number /* minor units */;
  lastSeenAt: string | null;
  createdAt: string; updatedAt: string;
}
```

`phone` is unique per restaurant — `409` on collision. **Tier** auto-promotes
by visit count on each settlement: `silver` at 5 visits, `gold` at 15,
`platinum` at 30 (provisional thresholds — see `guest.Service` for the rule).

---

## Factors — `/factors`

Orders/invoices — the "Billing / Factor" screen. Build an order against the
live menu (server resolves prices — clients only send `foodId` + `qty`),
review computed totals, then settle it for payment.

| Method | Path                | Body                  | Returns          |
|--------|---------------------|-----------------------|------------------|
| POST   | `/factors`          | `CreateFactorRequest` | `201` `Factor`   |
| GET    | `/factors`          | — *(paginated)*       | `200` `PaginatedResult<Factor>` |
| GET    | `/factors/:id`      | —                     | `200` `Factor`   |
| PUT    | `/factors/:id`      | `UpdateFactorRequest` | `200` `Factor`   |
| DELETE | `/factors/:id`      | —                     | `204`            |
| POST   | `/factors/:id/settle` | —                   | `200` `Factor`   |

```ts
// CreateFactorRequest / UpdateFactorRequest
// guestId is optional — walk-in tables have none. Clients send foodId + qty
// only; unitPrice is resolved server-side from the food's current price.
{
  tableId: string;
  guestId?: string | null;
  servicePct: number; // percentage, e.g. 10 for 10%
  vatPct: number;
  lines: Array<{ foodId: string; qty: number }>;
}

// Factor
{
  id: string; tableId: string; guestId: string | null;
  subtotal: number; servicePct: number; vatPct: number; total: number; // minor units
  status: "unpaid" | "paid";
  printedAt: string | null;
  lines: Array<{ id: string; foodId: string; qty: number; unitPrice: number; lineTotal: number }>;
  createdAt: string; updatedAt: string;
}
```

**Totals** (computed server-side, read-only on the response):

```
lineTotal = unitPrice × qty
subtotal  = Σ lineTotal
total     = subtotal + subtotal×servicePct% + subtotal×vatPct%
```

**Editing & deleting** (`PUT`/`DELETE`) are only allowed while
`status === "unpaid"` — both return `409` (`"factor is already settled"`)
once paid; an order's lines and totals are immutable history after that.

**Settlement** (`POST /factors/:id/settle`) is the terminal, one-way action
that:
1. Atomically flips `status` to `"paid"` and stamps `printedAt` (paying is
   what triggers printing the final receipt in this model) — `409` if it was
   already settled.
2. Depletes on-hand stock for every ingredient in each sold food's recipe by
   `qtyPerPortion × qty`.
3. If `guestId` is set, accrues one visit + `total` onto that guest's
   loyalty record (see [Guests](#guests--guests)).

A failed settlement mid-flight surfaces as "settled but stock/guest not yet
fully updated" rather than risking a double depletion on retry — if you see
this, treat the factor as settled and reconcile manually rather than
re-calling `/settle`.
