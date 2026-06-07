# CLAUDE.md — RestoOS (Saffron House) build spec

> Paste this whole folder into your repo (or open it in Claude Code) and tell Claude:
> **"Read CLAUDE.md and ARCHITECTURE.md, open the design reference, then implement the domains in the order given."**
> The `*.html` / `*.jsx` files are a **visual reference only** (a React+Babel prototype with no build step). Do not lift their code — rebuild properly per ARCHITECTURE.md.

## Product
A restaurant management system. Bounded contexts:
- **Menu** — foods, categories.
- **Recipes** — ingredients-per-food; computes food cost, margin, projected stock usage. (Depends on Menu + Inventory read models.)
- **Inventory** — ingredients, stock levels vs par, stock-in/receiving; usage auto-deducts on billing.
- **Guests** — loyalty CRM + onboarding.
- **Billing** — factor (invoice): POS order builder, thermal receipt + A4 print.
- **PublicMenu** — live price board, guest QR menu (+ self-order), printable price list.
- **Analytics** — dashboard KPIs/feed (read-only projections over the above).

Primary users: owner/manager (admin), kitchen/inventory, front-of-house, accountant. Desktop back-office + tablet/phone for counter & guest-facing.

## Locale & money (decide early — wired through everything)
- Currency: **Toman**. Centralize formatting in `shared/money` (`Money` value object; never format inline). Prices are integers (Toman), no decimals in UI.
- Tax: service 10%, VAT 9% — make these **configurable** (`Billing` settings), not hardcoded.
- Direction: ships **LTR/English**; design RTL/Farsi-ready — use logical CSS props (`margin-inline`, `padding-inline`, `inset-inline`) and a `dir` on `<html>`. No hard `left/right`.

## Visual reference
Open `design/Restaurant System — Hi-Fi.html` in a browser. It's a board of 12 named frames — one **selected** approach per screen (the chosen final direction). Build to these. Design tokens are listed in ARCHITECTURE.md → Tokens; treat them as the source of truth and wire them as CSS variables / a theme object.

## What "done" means per screen — see SCREENS.md
Each screen entry lists its domain, the data it reads/writes, components to build, and states (loading/empty/error/low-stock/etc.).

## Non-negotiables
- TypeScript strict. No `any`. Domain types live in each module's `domain/`, not in components.
- Modular + domain-driven: feature modules own their `domain` / `application` / `infra` / `ui`. Cross-module access only through a module's public `index.ts` (barrel) — never deep-import another module's internals.
- Data layer behind interfaces (repository pattern) so the UI is decoupled from API/transport. Provide a mock/in-memory adapter so the UI runs before a backend exists.
- The recipe **cost/margin/usage** math is domain logic (pure functions in `recipes/domain`), unit-tested — never computed in a component.
- Accessibility: real semantics, focus states, 44px min hit targets on touch surfaces, color-contrast AA.
