/** unitPrice × qty */
export function lineTotal(unitPrice: number, qty: number): number {
  return unitPrice * qty
}

/** Σ lineTotal */
export function subtotal(lines: ReadonlyArray<{ unitPrice: number; qty: number }>): number {
  return lines.reduce((sum, l) => sum + lineTotal(l.unitPrice, l.qty), 0)
}

/** Math.round(sub × pct / 100) */
export function serviceAmount(sub: number, pct: number): number {
  return Math.round((sub * pct) / 100)
}

/** Math.round(sub × pct / 100) */
export function vatAmount(sub: number, pct: number): number {
  return Math.round((sub * pct) / 100)
}

/** subtotal + serviceAmount + vatAmount */
export function totalAmount(sub: number, servicePct: number, vatPct: number): number {
  return sub + serviceAmount(sub, servicePct) + vatAmount(sub, vatPct)
}
