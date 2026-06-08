import { apiClient } from '../../../shared/http'
import type { IngredientRepository } from '../domain/IngredientRepository'
import type { AdjustStockInput, CreateIngredientInput, Ingredient } from '../domain/types'

/** Talks to the real backend's `/ingredients` endpoints. DTO shapes match our domain types 1:1. */
export function createIngredientHttpRepository(): IngredientRepository {
  return {
    list(filter) {
      return apiClient.get<Ingredient[]>(filter?.lowStockOnly ? '/ingredients/low-stock' : '/ingredients')
    },
    create(input: CreateIngredientInput) {
      return apiClient.post<Ingredient>('/ingredients', { ...input })
    },
    adjust(id, input: AdjustStockInput) {
      return apiClient.post<Ingredient>(`/ingredients/${id}/adjust`, { ...input })
    },
  }
}
