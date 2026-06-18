import { describe, expect, it } from 'vitest'
import { computeTotals, lineTotal, subtotalOf } from './totals'

describe('lineTotal', () => {
  it('rounds unitPrice × qty', () => {
    expect(lineTotal(1250, 3)).toBe(3750)
    expect(lineTotal(999, 1)).toBe(999)
  })
})

describe('subtotalOf', () => {
  it('sums line totals', () => {
    const subtotal = subtotalOf([
      { unitPrice: 1000, qty: 2 },
      { unitPrice: 500, qty: 3 },
    ])
    expect(subtotal).toBe(3500)
  })

  it('returns 0 for no lines', () => {
    expect(subtotalOf([])).toBe(0)
  })
})

describe('computeTotals', () => {
  it('adds service and vat percentages on top of subtotal', () => {
    const totals = computeTotals(10000, 10, 9)
    expect(totals).toEqual({ subtotal: 10000, serviceAmount: 1000, vatAmount: 900, total: 11900 })
  })

  it('rounds each leg independently', () => {
    const totals = computeTotals(333, 10, 9)
    expect(totals.serviceAmount).toBe(33)
    expect(totals.vatAmount).toBe(30)
    expect(totals.total).toBe(333 + 33 + 30)
  })

  it('handles zero subtotal', () => {
    expect(computeTotals(0, 10, 9)).toEqual({ subtotal: 0, serviceAmount: 0, vatAmount: 0, total: 0 })
  })
})
