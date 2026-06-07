import { createId } from '../../../shared/lib/id'
import type { FoodRepository } from '../domain/FoodRepository'
import type { CreateFoodInput, Food, UpdateFoodInput } from '../domain/types'

const now = '2026-05-01T09:00:00Z'

function food(partial: Omit<Food, 'createdAt' | 'updatedAt' | 'description' | 'photoUrl' | 'showOnMenu'> & {
  description?: string
  photoUrl?: string
  showOnMenu?: boolean
}): Food {
  return {
    description: '',
    photoUrl: '',
    showOnMenu: true,
    createdAt: now,
    updatedAt: now,
    ...partial,
  }
}

let foods: Food[] = [
  food({ id: 'food_ribeye', categoryId: 'cat_grills', name: 'Ribeye Steak', price: 4900, isActive: true, description: 'Char-grilled ribeye with herb butter.' }),
  food({ id: 'food_lamb_chops', categoryId: 'cat_grills', name: 'Lamb Chops', price: 5400, isActive: true }),
  food({ id: 'food_chicken_skewer', categoryId: 'cat_grills', name: 'Chicken Skewer', price: 2600, isActive: true }),
  food({ id: 'food_salmon', categoryId: 'cat_grills', name: 'Grilled Salmon', price: 3800, isActive: false, showOnMenu: false }),
  food({ id: 'food_carbonara', categoryId: 'cat_pasta', name: 'Spaghetti Carbonara', price: 2200, isActive: true }),
  food({ id: 'food_pesto', categoryId: 'cat_pasta', name: 'Penne al Pesto', price: 2000, isActive: true }),
  food({ id: 'food_lasagna', categoryId: 'cat_pasta', name: 'Beef Lasagna', price: 2400, isActive: true }),
  food({ id: 'food_caesar', categoryId: 'cat_salads', name: 'Caesar Salad', price: 1700, isActive: true }),
  food({ id: 'food_greek', categoryId: 'cat_salads', name: 'Greek Salad', price: 1600, isActive: true }),
  food({ id: 'food_tomato_soup', categoryId: 'cat_soups', name: 'Tomato Basil Soup', price: 1200, isActive: true }),
  food({ id: 'food_mushroom_soup', categoryId: 'cat_soups', name: 'Wild Mushroom Soup', price: 1350, isActive: true }),
  food({ id: 'food_tiramisu', categoryId: 'cat_desserts', name: 'Tiramisu', price: 1400, isActive: true }),
  food({ id: 'food_cheesecake', categoryId: 'cat_desserts', name: 'New York Cheesecake', price: 1500, isActive: true }),
  food({ id: 'food_baklava', categoryId: 'cat_desserts', name: 'Baklava', price: 1100, isActive: false, showOnMenu: false }),
  food({ id: 'food_lemonade', categoryId: 'cat_drinks', name: 'Fresh Lemonade', price: 800, isActive: true }),
  food({ id: 'food_espresso', categoryId: 'cat_drinks', name: 'Espresso', price: 600, isActive: true }),
  food({ id: 'food_iced_tea', categoryId: 'cat_drinks', name: 'Iced Tea', price: 700, isActive: true }),
]

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), 220))
}

export function createFoodMemoryRepository(): FoodRepository {
  return {
    async list(filter) {
      const filtered = filter?.categoryId
        ? foods.filter((item) => item.categoryId === filter.categoryId)
        : foods
      return delay([...filtered])
    },
    async create(input: CreateFoodInput) {
      const timestamp = new Date().toISOString()
      const created: Food = {
        id: createId('food'),
        categoryId: input.categoryId,
        name: input.name,
        price: input.price,
        description: input.description ?? '',
        photoUrl: input.photoUrl ?? '',
        isActive: input.isActive ?? true,
        showOnMenu: input.showOnMenu ?? true,
        createdAt: timestamp,
        updatedAt: timestamp,
      }
      foods = [...foods, created]
      return delay(created)
    },
    async update(id, input: UpdateFoodInput) {
      const existing = foods.find((item) => item.id === id)
      if (!existing) throw new Error(`Food ${id} not found`)
      const updated: Food = {
        ...existing,
        categoryId: input.categoryId,
        name: input.name,
        price: input.price,
        description: input.description ?? existing.description,
        photoUrl: input.photoUrl ?? existing.photoUrl,
        isActive: input.isActive,
        showOnMenu: input.showOnMenu ?? existing.showOnMenu,
        updatedAt: new Date().toISOString(),
      }
      foods = foods.map((item) => (item.id === id ? updated : item))
      return delay(updated)
    },
  }
}
