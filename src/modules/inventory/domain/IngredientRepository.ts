import type { Id } from '../../../shared/types'
import type { AdjustStockInput, CreateIngredientInput, Ingredient } from './types'

export interface IngredientRepository {
  list(filter?: { lowStockOnly?: boolean }): Promise<Ingredient[]>
  create(input: CreateIngredientInput): Promise<Ingredient>
  adjust(id: Id, input: AdjustStockInput): Promise<Ingredient>
}
