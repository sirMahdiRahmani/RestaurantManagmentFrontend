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

## Questions for the backend team / next agent

- Is there a real `PATCH` for partial updates anywhere, or is `PUT` always
  full-resource replace? (Affects whether `rename`-style helpers need a
  read-before-write round trip.)
- Any rate limiting / retry-after conventions we should respect in `apiClient`?

## Build order — what's next

Per `ARCHITECTURE.md`: **Inventory** is next (stock table, stock-in form,
low-stock rules, weighted-average unit cost — this is what `Recipes` will
later consume). Follow the same vertical-slice shape as `modules/menu`.
