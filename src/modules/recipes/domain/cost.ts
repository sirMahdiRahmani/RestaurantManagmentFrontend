import type { Id } from '../../../shared/types'

/** round(qtyPerPortion × unitCost) — integer minor units. */
export function lineCost(qtyPerPortion: number, unitCost: number): number {
  return Math.round(qtyPerPortion * unitCost)
}

/** Σ lineCost across all recipe lines — integer minor units. */
export function foodCost(lines: Array<{ qtyPerPortion: number; unitCost: number }>): number {
  return lines.reduce((sum, line) => sum + lineCost(line.qtyPerPortion, line.unitCost), 0)
}

/** 1 − (foodCost / price), clamped to [0, 1]; 0 when price is 0 to avoid division by zero. */
export function margin(price: number, cost: number): number {
  if (price <= 0) return 0
  return Math.min(1, Math.max(0, 1 - cost / price))
}

/** Share of a line's cost within the food's total cost, as a percentage in [0, 100]. */
export function percentageOfCost(lineCostValue: number, totalFoodCost: number): number {
  if (totalFoodCost <= 0) return 0
  return (lineCostValue / totalFoodCost) * 100
}

/** Projected ingredient consumption if `portionsSold` portions are made, keyed by ingredientId. */
export function projectedUsage(
  lines: Array<{ ingredientId: Id; qtyPerPortion: number }>,
  portionsSold: number,
): Record<Id, number> {
  const usage: Record<Id, number> = {}
  for (const line of lines) {
    usage[line.ingredientId] = (usage[line.ingredientId] ?? 0) + line.qtyPerPortion * portionsSold
  }
  return usage
}
