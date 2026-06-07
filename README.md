# RestoOS — Restaurant Management Frontend

A multi-tenant restaurant management system frontend (React + TypeScript) covering
Menu, Recipes, Inventory, Guests (loyalty CRM), Billing (POS/Factor), PublicMenu
(live price board / guest QR menu), and Analytics.

> **Status:** scaffolded with the shared infrastructure and the **Menu** module
> implemented end-to-end against in-memory mock repositories. The remaining
> modules are routed to a placeholder pending their turn in the build order.

## Tech stack

- **Vite** + **React 18** + **TypeScript** (strict, no `any`)
- **React Router** for routing
- **TanStack Query** for server state over repository interfaces
- **React Hook Form** + **Zod** for forms and validation
- **CSS Modules** with CSS-variable design tokens
- **Vitest** + **Testing Library** for tests

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Create your local env file (gitignored)
cp .env.example .env

# 3. Start the dev server (http://localhost:5173)
npm run dev
```

## Scripts

| Command              | What it does                                  |
| -------------------- | --------------------------------------------- |
| `npm run dev`        | Start the Vite dev server                     |
| `npm run build`      | Type-check (`tsc -b`) and build for production |
| `npm run preview`    | Preview the production build locally          |
| `npm run lint`       | Run ESLint                                     |
| `npm run test`       | Run the Vitest suite once                     |
| `npm run test:watch` | Run Vitest in watch mode                       |

A `Makefile` wraps the common flows — `make install`, `make dev`, `make build`,
`make test`, `make lint`, and `make check` (lint + build + test). Run `make help`
to list targets.

## Environment

Configuration lives in `.env` (copy from `.env.example`). All variables are read
**once** in `src/shared/config/env.ts`, which exports a frozen, typed `config`
object — import that anywhere instead of touching `import.meta.env` directly.

| Variable                     | Default                 | Purpose                                            |
| ---------------------------- | ----------------------- | -------------------------------------------------- |
| `VITE_API_BASE_URL`          | `http://localhost:8080` | Backend API base URL                               |
| `VITE_DEFAULT_RESTAURANT_ID` | _(empty)_               | Default tenant for the `X-Restaurant-ID` header    |
| `VITE_USE_MOCK_REPOS`        | `true`                  | Use in-memory mock repositories instead of HTTP    |
| `VITE_DEFAULT_VAT_PCT`       | `9`                     | Default VAT percentage for billing                 |
| `VITE_DEFAULT_SERVICE_PCT`   | `10`                    | Default service-charge percentage for billing      |

## Architecture

Modular, domain-driven design. Each feature module is a vertical slice with four
layers and a single public barrel:

```
src/
  app/            # routes, providers, layout (AppShell / Sidebar / Topbar)
  modules/
    menu/         # ← implemented end-to-end
      domain/       # entities + repository port interfaces (no React, no fetch)
      application/  # TanStack Query hooks over the repository interfaces
      infra/        # repository implementations (*.memory.ts now, *.http.ts later)
      ui/           # pages + components
      index.ts      # public barrel — the only entry other modules may import
    inventory/ recipes/ billing/ guests/ publicMenu/ analytics/  # planned
  shared/
    config/       # typed env/config (single source of truth)
    tokens/       # design tokens (CSS vars + typed theme)
    ui/           # reusable presentational components
    money/        # Money value object (integer minor units)
    types/        # shared primitive types
    lib/          # small helpers
```

**Conventions**

- **Repository pattern.** `domain/` defines port interfaces; `infra/` provides
  both `*.memory.ts` (mock) and `*.http.ts` (real) implementations. `application/`
  hooks depend only on the interface. Toggle via `VITE_USE_MOCK_REPOS`.
- **Pure domain math.** Money/cost/totals computed in pure, unit-tested functions —
  never inside components.
- **Money as integers.** Amounts are integer minor units (e.g. `1250` = `12.50`);
  format only at the edge via `shared/money`.
- **Barrel-only cross-module imports.** Import `modules/<name>`, never its internals.
- **i18n / RTL-ready.** Logical CSS properties (`margin-inline`, `inset-inline`)
  and a `dir` attribute; ships LTR/English.

## Testing

Tests live next to the code they cover (`*.test.ts` / `*.test.tsx`) and run under
Vitest with the jsdom environment:

```bash
npm run test          # or: make test
npm run test:watch    # watch mode
```

Current coverage includes the `Money` value object, the Menu in-memory repository
CRUD, and a `MenuPage` render/filter integration test.
