export interface FactorTotals {
  subtotal: number
  serviceAmount: number
  vatAmount: number
  total: number
}

/** round(unitPrice × qty) — integer minor units. */
export function lineTotal(unitPrice: number, qty: number): number {
  return Math.round(unitPrice * qty)
}

/** Σ lineTotal across all order lines — integer minor units. */
export function subtotalOf(lines: Array<{ unitPrice: number; qty: number }>): number {
  return lines.reduce((sum, line) => sum + lineTotal(line.unitPrice, line.qty), 0)
}

/** subtotal + subtotal×servicePct% + subtotal×vatPct%, each leg rounded independently. */
export function computeTotals(subtotal: number, servicePct: number, vatPct: number): FactorTotals {
  const serviceAmount = Math.round((subtotal * servicePct) / 100)
  const vatAmount = Math.round((subtotal * vatPct) / 100)
  return { subtotal, serviceAmount, vatAmount, total: subtotal + serviceAmount + vatAmount }
}
