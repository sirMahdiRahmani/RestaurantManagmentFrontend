# RestoOS — Frontend Handoff

This bundle is the contract for the React + TypeScript team building against
the RestoOS API. It mirrors the screens described in
`docs/design_handoff_restaurant_system/README.md` (Dashboard, Foods, Food editor +
recipe, Categories, Inventory/stock-in, Guests, Factor/billing, Live menu,
plus a platform-admin restaurant-management view).

- **[`api-reference.md`](./api-reference.md)** — every endpoint, its request/
  response JSON shapes, and the business rules behind derived fields
- **[`types.ts`](./types.ts)** — TypeScript types for every DTO, ready to
  copy into a shared `api/types.ts` module

## Base conventions

### Authentication / tenancy

There is no auth layer yet. Every **tenant-scoped** request must carry:

```
X-Restaurant-ID: <uuid>
```

identifying which restaurant the request applies to. Missing or malformed
headers return `400`. The **platform-admin** endpoints (`/admin/restaurants`,
for managing restaurants themselves) do *not* use this header — they operate
across the whole platform.

> When real authentication lands, this header will be replaced by a
> JWT-derived tenant claim — the request/response shapes below won't change.

### Money

All monetary amounts are **integers in minor currency units** (e.g. cents) —
never floats. A value of `1250` means `12.50` in the restaurant's currency.
Format/parse on the frontend; don't do arithmetic with floating point.

> The real currency and tax-rate rules (`servicePct` / `vatPct`) are still
> open questions inherited from the product brief — treat them as
> provisional.

### Pagination

Endpoints that list a potentially-large collection accept query parameters:

```
GET /foo?page=1&page_size=20
```

- `page` — 1-based, defaults to `1`
- `page_size` — defaults to `20`, capped at `100`

...and respond with an envelope:

```json
{
  "items": [ /* … */ ],
  "page": 1,
  "pageSize": 20,
  "totalItems": 57,
  "totalPages": 3
}
```

(See `PaginatedResult<T>` in `types.ts`.) Endpoints whose collections are
inherently small and unpaged (categories, a food's recipe, low-stock
ingredients) just return a plain array.

### Errors

Every error is a JSON envelope with a single human-readable message:

```json
{ "error": "food not found" }
```

The HTTP status code tells you how to react:

| Status | Meaning                                              |
|--------|------------------------------------------------------|
| `400`  | Validation failure / malformed input — show inline   |
| `404`  | The resource (or its tenant scope) doesn't exist     |
| `409`  | Conflict — duplicate name/phone/slug, already settled |
| `500`  | Unexpected server error — show a generic retry message |

### Dates & times

All timestamps are RFC 3339 / ISO 8601 strings in UTC
(`"2026-06-07T12:34:56Z"`). `occurredOn` (stock-in date) is a date-only value
serialized the same way at midnight UTC.

## Domain map

| Domain          | Frontend screens it powers                          | Endpoint prefix      |
|-----------------|------------------------------------------------------|----------------------|
| `platformadmin` | Platform restaurant management (not a tenant screen) | `/admin/restaurants` |
| `category`      | Categories                                            | `/categories`        |
| `ingredient`    | Inventory, low-stock alerts, manual adjustments       | `/ingredients`       |
| `food`          | Foods, Food editor + recipe + live cost/margin, Live menu | `/foods`        |
| `stockin`       | Inventory → "ingredient input" / receiving            | `/stock-ins`         |
| `guest`         | Guests (loyalty CRM)                                  | `/guests`            |
| `factor`        | Billing / Factor — build order, settle                | `/factors`           |
