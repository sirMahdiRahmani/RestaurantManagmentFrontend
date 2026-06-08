import { foodCost, lineCost, margin } from '../domain/cost'
import type { RecipeRepository } from '../domain/RecipeRepository'
import type { FoodDetail, RecipeLine, UpsertRecipeLineInput } from '../domain/types'

const now = '2026-05-01T09:00:00Z'

/**
 * The mock stands in for a backend join across Food, Ingredient, and recipe
 * lines — so each seed shell carries the bits of its Food it needs (name,
 * price, ...) plus a snapshot of each line's ingredient name/unitCost. A real
 * read recomputes these from live ingredient costs; here we just keep the
 * snapshot in sync with `inventory/infra/ingredientRepository.memory.ts`.
 */
interface FoodShell {
  id: string
  categoryId: string
  name: string
  price: number
  description: string
  photoUrl: string
  isActive: boolean
  showOnMenu: boolean
}

const foodShells: Record<string, FoodShell> = {
  food_ribeye: {
    id: 'food_ribeye',
    categoryId: 'cat_grills',
    name: 'Ribeye Steak',
    price: 4900,
    description: 'Char-grilled ribeye with herb butter.',
    photoUrl: '',
    isActive: true,
    showOnMenu: true,
  },
  food_carbonara: {
    id: 'food_carbonara',
    categoryId: 'cat_pasta',
    name: 'Spaghetti Carbonara',
    price: 2200,
    description: '',
    photoUrl: '',
    isActive: true,
    showOnMenu: true,
  },
  food_caesar: {
    id: 'food_caesar',
    categoryId: 'cat_salads',
    name: 'Caesar Salad',
    price: 1700,
    description: '',
    photoUrl: '',
    isActive: true,
    showOnMenu: true,
  },
}

interface LineSeed {
  ingredientId: string
  ingredientName: string
  qtyPerPortion: number
  unit: string
  unitCost: number
}

let recipeLines: Record<string, LineSeed[]> = {
  food_ribeye: [{ ingredientId: 'ing_ribeye', ingredientName: 'Ribeye (raw)', qtyPerPortion: 0.32, unit: 'kg', unitCost: 1850 }],
  food_carbonara: [
    { ingredientId: 'ing_spaghetti', ingredientName: 'Spaghetti', qtyPerPortion: 0.12, unit: 'kg', unitCost: 220 },
    { ingredientId: 'ing_pancetta', ingredientName: 'Pancetta', qtyPerPortion: 0.05, unit: 'kg', unitCost: 980 },
    { ingredientId: 'ing_cream', ingredientName: 'Heavy cream', qtyPerPortion: 0.08, unit: 'l', unitCost: 410 },
  ],
  food_caesar: [
    { ingredientId: 'ing_lettuce', ingredientName: 'Romaine lettuce', qtyPerPortion: 0.15, unit: 'kg', unitCost: 310 },
  ],
}

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), 200))
}

function toDetail(foodId: string): FoodDetail {
  const shell = foodShells[foodId]
  if (!shell) throw new Error(`Food ${foodId} not found`)

  const lines: RecipeLine[] = (recipeLines[foodId] ?? []).map((line) => ({
    ingredientId: line.ingredientId,
    ingredientName: line.ingredientName,
    qtyPerPortion: line.qtyPerPortion,
    unit: line.unit,
    unitCost: line.unitCost,
    lineCost: lineCost(line.qtyPerPortion, line.unitCost),
  }))
  const cost = foodCost(lines)

  return {
    ...shell,
    createdAt: now,
    updatedAt: now,
    recipe: lines,
    foodCost: cost,
    margin: margin(shell.price, cost),
  }
}

export function createRecipeMemoryRepository(): RecipeRepository {
  return {
    async get(foodId) {
      return delay(toDetail(foodId))
    },
    async upsertLine(foodId, input: UpsertRecipeLineInput) {
      if (!foodShells[foodId]) throw new Error(`Food ${foodId} not found`)
      const existing = recipeLines[foodId] ?? []
      const withoutLine = existing.filter((line) => line.ingredientId !== input.ingredientId)
      const previous = existing.find((line) => line.ingredientId === input.ingredientId)
      recipeLines = {
        ...recipeLines,
        [foodId]: [
          ...withoutLine,
          {
            ingredientId: input.ingredientId,
            // Real backend resolves ingredientName/unitCost server-side; the mock
            // only knows them for ingredients it has already seen on this food.
            ingredientName: previous?.ingredientName ?? input.ingredientId,
            qtyPerPortion: input.qtyPerPortion,
            unit: input.unit,
            unitCost: previous?.unitCost ?? 0,
          },
        ],
      }
      return delay(toDetail(foodId))
    },
    async removeLine(foodId, ingredientId) {
      if (!foodShells[foodId]) throw new Error(`Food ${foodId} not found`)
      recipeLines = {
        ...recipeLines,
        [foodId]: (recipeLines[foodId] ?? []).filter((line) => line.ingredientId !== ingredientId),
      }
      return delay(toDetail(foodId))
    },
  }
}
