import { describe, expect, it } from 'vitest'
import { salesByDay, todayFactorsCount, todaySalesTotal, topSellers, type FactorLike } from './metrics'

const now = '2026-06-18T12:00:00Z'

const factors: FactorLike[] = [
  { createdAt: '2026-06-18T09:00:00Z', total: 1000, status: 'paid', lines: [{ foodId: 'a', qty: 2 }] },
  { createdAt: '2026-06-18T10:00:00Z', total: 500, status: 'unpaid', lines: [{ foodId: 'b', qty: 1 }] },
  { createdAt: '2026-06-17T10:00:00Z', total: 2000, status: 'paid', lines: [{ foodId: 'a', qty: 1 }, { foodId: 'b', qty: 3 }] },
]

describe('todaySalesTotal', () => {
  it('sums only paid factors created today', () => {
    expect(todaySalesTotal(factors, now)).toBe(1000)
  })
})

describe('todayFactorsCount', () => {
  it('counts only paid factors created today', () => {
    expect(todayFactorsCount(factors, now)).toBe(1)
  })
})

describe('salesByDay', () => {
  it('returns the requested number of days ending on now, oldest first', () => {
    const days = salesByDay(factors, now, 3)
    expect(days).toHaveLength(3)
    expect(days[2]!.date).toBe('2026-06-18')
    expect(days[2]!.total).toBe(1000)
    expect(days[1]!.date).toBe('2026-06-17')
    expect(days[1]!.total).toBe(2000)
    expect(days[0]!.total).toBe(0)
  })
})

describe('topSellers', () => {
  it('ranks foods by qty sold across paid factors', () => {
    expect(topSellers(factors)).toEqual([
      { foodId: 'a', qty: 3 },
      { foodId: 'b', qty: 3 },
    ])
  })

  it('respects the limit', () => {
    expect(topSellers(factors, 1)).toHaveLength(1)
  })
})
