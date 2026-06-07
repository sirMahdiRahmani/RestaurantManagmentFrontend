import { beforeEach, describe, expect, it } from 'vitest'
import { createFoodMemoryRepository } from './foodRepository.memory'

describe('foodRepository.memory', () => {
  let repository: ReturnType<typeof createFoodMemoryRepository>

  beforeEach(() => {
    repository = createFoodMemoryRepository()
  })

  it('lists all foods by default', async () => {
    const foods = await repository.list()
    expect(foods.length).toBeGreaterThan(0)
  })

  it('filters by categoryId', async () => {
    const foods = await repository.list({ categoryId: 'cat_grills' })
    expect(foods.length).toBeGreaterThan(0)
    expect(foods.every((food) => food.categoryId === 'cat_grills')).toBe(true)
  })

  it('creates a food and makes it listable', async () => {
    const created = await repository.create({ categoryId: 'cat_drinks', name: 'Mango Smoothie', price: 950 })
    const foods = await repository.list({ categoryId: 'cat_drinks' })
    expect(foods.some((food) => food.id === created.id && food.name === 'Mango Smoothie')).toBe(true)
  })

  it('updates an existing food', async () => {
    const updated = await repository.update('food_espresso', {
      categoryId: 'cat_drinks',
      name: 'Double Espresso',
      price: 750,
      isActive: true,
    })
    expect(updated.name).toBe('Double Espresso')
    expect(updated.price).toBe(750)
  })
})
