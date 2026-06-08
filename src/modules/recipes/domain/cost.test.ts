import { describe, expect, it } from 'vitest'
import { foodCost, lineCost, margin, percentageOfCost, projectedUsage } from './cost'

describe('lineCost', () => {
  it('multiplies quantity by unit cost and rounds to the nearest minor unit', () => {
    expect(lineCost(2, 150)).toBe(300)
    expect(lineCost(0.3, 1000)).toBe(300)
    expect(lineCost(1 / 3, 100)).toBe(33)
  })
})

describe('foodCost', () => {
  it('sums the rounded line costs', () => {
    expect(
      foodCost([
        { qtyPerPortion: 2, unitCost: 150 },
        { qtyPerPortion: 0.5, unitCost: 200 },
      ]),
    ).toBe(400)
  })

  it('returns 0 for an empty recipe', () => {
    expect(foodCost([])).toBe(0)
  })
})

describe('margin', () => {
  it('computes 1 − cost/price', () => {
    expect(margin(1000, 400)).toBeCloseTo(0.6)
  })

  it('returns 0 when price is 0 to avoid division by zero', () => {
    expect(margin(0, 400)).toBe(0)
  })

  it('clamps to [0, 1] for costs that exceed price', () => {
    expect(margin(100, 250)).toBe(0)
  })
})

describe('percentageOfCost', () => {
  it('expresses a line cost as a percentage of total food cost', () => {
    expect(percentageOfCost(250, 1000)).toBe(25)
  })

  it('returns 0 when total food cost is 0', () => {
    expect(percentageOfCost(0, 0)).toBe(0)
  })
})

describe('projectedUsage', () => {
  it('multiplies qty per portion by portions sold, keyed by ingredient', () => {
    expect(
      projectedUsage(
        [
          { ingredientId: 'ing_a', qtyPerPortion: 0.2 },
          { ingredientId: 'ing_b', qtyPerPortion: 0.05 },
        ],
        100,
      ),
    ).toEqual({ ing_a: 20, ing_b: 5 })
  })

  it('merges duplicate ingredient lines', () => {
    expect(
      projectedUsage(
        [
          { ingredientId: 'ing_a', qtyPerPortion: 0.2 },
          { ingredientId: 'ing_a', qtyPerPortion: 0.1 },
        ],
        10,
      ),
    ).toEqual({ ing_a: 3 })
  })
})
