import { createId } from '../../../shared/lib/id'
import type { IngredientRepository } from '../domain/IngredientRepository'
import type { AdjustStockInput, CreateIngredientInput, Ingredient } from '../domain/types'

const now = '2026-05-01T09:00:00Z'

function ingredient(partial: Pick<Ingredient, 'id' | 'name' | 'unit' | 'onHandQty' | 'parLevel' | 'unitCost'>): Ingredient {
  return {
    ...partial,
    isLowStock: partial.onHandQty < partial.parLevel,
    createdAt: now,
    updatedAt: now,
  }
}

let ingredients: Ingredient[] = [
  ingredient({ id: 'ing_ribeye', name: 'Ribeye (raw)', unit: 'kg', onHandQty: 18, parLevel: 12, unitCost: 1850 }),
  ingredient({ id: 'ing_lamb', name: 'Lamb chops (raw)', unit: 'kg', onHandQty: 6, parLevel: 10, unitCost: 2100 }),
  ingredient({ id: 'ing_chicken', name: 'Chicken thigh', unit: 'kg', onHandQty: 22, parLevel: 15, unitCost: 760 }),
  ingredient({ id: 'ing_salmon', name: 'Salmon fillet', unit: 'kg', onHandQty: 4, parLevel: 8, unitCost: 1450 }),
  ingredient({ id: 'ing_spaghetti', name: 'Spaghetti', unit: 'kg', onHandQty: 30, parLevel: 10, unitCost: 220 }),
  ingredient({ id: 'ing_pancetta', name: 'Pancetta', unit: 'kg', onHandQty: 3, parLevel: 5, unitCost: 980 }),
  ingredient({ id: 'ing_lettuce', name: 'Romaine lettuce', unit: 'kg', onHandQty: 9, parLevel: 6, unitCost: 310 }),
  ingredient({ id: 'ing_tomato', name: 'Tomatoes', unit: 'kg', onHandQty: 5, parLevel: 7, unitCost: 280 }),
  ingredient({ id: 'ing_cream', name: 'Heavy cream', unit: 'l', onHandQty: 14, parLevel: 8, unitCost: 410 }),
  ingredient({ id: 'ing_mascarpone', name: 'Mascarpone', unit: 'kg', onHandQty: 2, parLevel: 4, unitCost: 1320 }),
]

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), 200))
}

export function createIngredientMemoryRepository(): IngredientRepository {
  return {
    async list(filter) {
      const filtered = filter?.lowStockOnly ? ingredients.filter((item) => item.isLowStock) : ingredients
      return delay([...filtered])
    },
    async create(input: CreateIngredientInput) {
      const timestamp = new Date().toISOString()
      const onHandQty = input.onHandQty ?? 0
      const parLevel = input.parLevel ?? 0
      const created: Ingredient = {
        id: createId('ing'),
        name: input.name,
        unit: input.unit,
        onHandQty,
        parLevel,
        unitCost: input.unitCost ?? 0,
        isLowStock: onHandQty < parLevel,
        createdAt: timestamp,
        updatedAt: timestamp,
      }
      ingredients = [...ingredients, created]
      return delay(created)
    },
    async adjust(id, input: AdjustStockInput) {
      const existing = ingredients.find((item) => item.id === id)
      if (!existing) throw new Error(`Ingredient ${id} not found`)
      const onHandQty = existing.onHandQty + input.delta
      const updated: Ingredient = {
        ...existing,
        onHandQty,
        isLowStock: onHandQty < existing.parLevel,
        updatedAt: new Date().toISOString(),
      }
      ingredients = ingredients.map((item) => (item.id === id ? updated : item))
      return delay(updated)
    },
  }
}
