import { beforeEach, describe, expect, it } from 'vitest'
import { createIngredientMemoryRepository } from './ingredientRepository.memory'

describe('ingredientRepository.memory', () => {
  let repository: ReturnType<typeof createIngredientMemoryRepository>

  beforeEach(() => {
    repository = createIngredientMemoryRepository()
  })

  it('lists ingredients with derived isLowStock flags', async () => {
    const ingredients = await repository.list()
    expect(ingredients.length).toBeGreaterThan(0)
    expect(ingredients.some((item) => item.isLowStock)).toBe(true)
    expect(ingredients.some((item) => !item.isLowStock)).toBe(true)
  })

  it('filters to low-stock ingredients only', async () => {
    const lowStock = await repository.list({ lowStockOnly: true })
    expect(lowStock.length).toBeGreaterThan(0)
    expect(lowStock.every((item) => item.isLowStock)).toBe(true)
  })

  it('adjusts on-hand quantity by the signed delta and recomputes isLowStock', async () => {
    const before = (await repository.list()).find((item) => item.id === 'ing_salmon')
    expect(before).toBeDefined()

    const after = await repository.adjust('ing_salmon', { delta: 10, reason: 'Manual correction' })

    expect(after.onHandQty).toBe((before?.onHandQty ?? 0) + 10)
    expect(after.isLowStock).toBe(after.onHandQty < after.parLevel)
  })
})
