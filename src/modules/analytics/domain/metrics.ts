export interface FactorLike {
  createdAt: string
  total: number
  status: 'unpaid' | 'paid'
  lines: Array<{ foodId: string; qty: number }>
}

function isSameDay(isoA: string, isoB: string): boolean {
  return isoA.slice(0, 10) === isoB.slice(0, 10)
}

/** Σ total of paid factors settled on the same calendar day as `now`. */
export function todaySalesTotal(factors: FactorLike[], now: string): number {
  return factors
    .filter((factor) => factor.status === 'paid' && isSameDay(factor.createdAt, now))
    .reduce((sum, factor) => sum + factor.total, 0)
}

/** Paid factors count for the same calendar day as `now`. */
export function todayFactorsCount(factors: FactorLike[], now: string): number {
  return factors.filter((factor) => factor.status === 'paid' && isSameDay(factor.createdAt, now)).length
}

export interface DaySales {
  date: string
  total: number
}

/** Last `days` calendar days (oldest first) of paid sales totals, ending on `now`. */
export function salesByDay(factors: FactorLike[], now: string, days = 7): DaySales[] {
  const end = new Date(now)
  const result: DaySales[] = []
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const day = new Date(end)
    day.setUTCDate(end.getUTCDate() - offset)
    const date = day.toISOString().slice(0, 10)
    const total = factors
      .filter((factor) => factor.status === 'paid' && factor.createdAt.slice(0, 10) === date)
      .reduce((sum, factor) => sum + factor.total, 0)
    result.push({ date, total })
  }
  return result
}

export interface TopSeller {
  foodId: string
  qty: number
}

/** Foods ranked by total qty sold across paid factors, highest first. */
export function topSellers(factors: FactorLike[], limit = 5): TopSeller[] {
  const qtyByFood = new Map<string, number>()
  for (const factor of factors) {
    if (factor.status !== 'paid') continue
    for (const line of factor.lines) {
      qtyByFood.set(line.foodId, (qtyByFood.get(line.foodId) ?? 0) + line.qty)
    }
  }
  return [...qtyByFood.entries()]
    .map(([foodId, qty]) => ({ foodId, qty }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, limit)
}
