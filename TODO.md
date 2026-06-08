# TODO / Notes for upcoming work

## API connectivity (just landed)

- `shared/http/apiClient.ts` — thin `fetch` wrapper: reads `config.apiBaseUrl`,
  injects `X-Restaurant-ID` (unless `tenantScoped: false`, e.g. `/admin/restaurants`),
  unwraps `{ error }` responses into `ApiError`.
- `modules/menu/infra/{category,food}Repository.http.ts` — real implementations of
  the menu repository ports, wired into `modules/menu/infra/index.ts` behind
  `config.useMockRepos`.
- To try it against a running backend: set `VITE_USE_MOCK_REPOS=false` and
  `VITE_API_BASE_URL` / `VITE_DEFAULT_RESTAURANT_ID` in `.env`, then `npm run dev`.

## To verify once a real backend instance is reachable

- [ ] Confirm `Category`/`Food` JSON field names match exactly (camelCase assumed
      from `types.ts` — no mapper layer was added since the shapes line up 1:1;
      if the live API differs, add field mapping in the `*.http.ts` files, not
      in domain code).
- [ ] Confirm `rename()` round-trip: there's no `PATCH`, so `categoryRepository.http.ts`
      does a `GET` then a full `PUT` to change just the name. Check the backend
      accepts a full `UpdateCategoryRequest` body for `PUT /categories/:id` —
      if it instead requires only changed fields, simplify accordingly.
- [ ] Decide how `defaultRestaurantId` gets set in real usage (currently a single
      env-configured tenant). If the app needs multi-tenant switching at runtime,
      that becomes an auth/session concern, not a `config` concern — flag this
      before building Inventory if login/tenant-switching is in scope.

## Inventory module (just landed)

- `modules/inventory` — full vertical slice mirroring `modules/menu`:
  `IngredientRepository` / `StockInRepository` ports, memory + http infra,
  TanStack Query hooks, and two pages — `InventoryPage` (stock table with
  ±1 quick-adjust, low-stock pill, search) and `StockInPage` (dynamic line
  items, live grand-total preview, posts a `CreateStockInInput`).
- Routed at `/inventory` and `/inventory/stock-in`; nav entry flipped to `live`.
- The in-memory `stockInRepository.memory.ts` deliberately does **not**
  recompute ingredient on-hand qty / weighted-average cost on receive — that
  math is server-owned (see comment in the file). Don't replicate it client-side.
- `vite.config.ts` now pins `VITE_USE_MOCK_REPOS=true` for the test environment
  specifically, so `npm run test` / `make check` stay green regardless of
  whatever `.env` points at locally (e.g. a live backend for manual testing).

## Questions for the backend team / next agent

- Is there a real `PATCH` for partial updates anywhere, or is `PUT` always
  full-resource replace? (Affects whether `rename`-style helpers need a
  read-before-write round trip — same question now applies to
  `UpdateIngredientRequest` if/when an ingredient-edit UI is built.)
- Any rate limiting / retry-after conventions we should respect in `apiClient`?
- Confirm `POST /ingredients/:id/adjust` and `POST /stock-ins` response shapes
  match `Ingredient` / `StockIn` exactly once a live backend is reachable —
  no mapper layer was added since `types.ts` shapes line up 1:1 with our domain
  types; if the live API differs, map in the `*.http.ts` files, not domain code.

## Recipes module (just landed)

- `modules/recipes` — vertical slice: `RecipeRepository` port (`get`/`upsertLine`/
  `removeLine` against `/foods/:id/recipe`), memory + http infra, `useRecipe`/
  `useUpsertRecipeLine`/`useRemoveRecipeLine` hooks, and two pages —
  `RecipesPage` (pick a dish) and `FoodEditorPage` (cost summary + recipe table
  + add-ingredient row, all driven by the live `FoodDetail`).
- `domain/cost.ts` — pure, unit-tested functions: `lineCost`, `foodCost`,
  `margin`, `percentageOfCost`, `projectedUsage` (10 tests in `cost.test.ts`).
  These mirror what the backend computes server-side on every read; the UI
  never does this math inline.
- Routed at `/recipes` and `/recipes/:foodId`; nav entry flipped to `live`.
- **Barrel additions**: exported `useFoods` from `modules/menu` and
  `useIngredients` from `modules/inventory` — Recipes needs both lists
  (food picker, ingredient picker) and barrel-only cross-module imports mean
  the hook has to be part of the public surface, not deep-imported.
- The in-memory `recipeRepository.memory.ts` keeps small seeded "food shells"
  + recipe-line snapshots (ingredient name/cost) in sync with the Menu/
  Inventory mocks by hand — see the comment at the top of that file for why
  (avoids instantiating another module's repository inside this module's infra).

## Questions for the backend team / next agent

- Confirm `PUT /foods/:id/recipe` upserts by `ingredientId` (create-or-replace,
  `ON CONFLICT`) and that the response is the *full* refreshed `FoodDetail`
  (we assume this — no separate "line updated" shape).
- Is there a real `PATCH` for partial updates anywhere, or is `PUT` always
  full-resource replace?
- Any rate limiting / retry-after conventions we should respect in `apiClient`?

## Build order — what's next

Per `ARCHITECTURE.md`: **Billing** is next (POS builder, receipt preview,
A4 invoice, `settleFactorUseCase` → inventory depletion orchestration — pure
totals math goes in `billing/domain/totals.ts`, mirroring `recipes/domain/cost.ts`).
Follow the same vertical-slice shape as the existing modules.
