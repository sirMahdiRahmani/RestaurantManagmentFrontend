import { apiClient } from '../../../shared/http'
import type { RecipeRepository } from '../domain/RecipeRepository'
import type { FoodDetail, UpsertRecipeLineInput } from '../domain/types'

/** Talks to the real backend's `/foods/:id/recipe` endpoints. DTO shapes match our domain types 1:1. */
export function createRecipeHttpRepository(): RecipeRepository {
  return {
    get(foodId) {
      return apiClient.get<FoodDetail>(`/foods/${foodId}/recipe`)
    },
    upsertLine(foodId, input: UpsertRecipeLineInput) {
      return apiClient.put<FoodDetail>(`/foods/${foodId}/recipe`, { ...input })
    },
    removeLine(foodId, ingredientId) {
      return apiClient.delete<FoodDetail>(`/foods/${foodId}/recipe/${ingredientId}`)
    },
  }
}
