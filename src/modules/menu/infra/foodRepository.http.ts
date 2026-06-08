import { apiClient } from '../../../shared/http'
import type { FoodRepository } from '../domain/FoodRepository'
import type { CreateFoodInput, Food, UpdateFoodInput } from '../domain/types'
import type { Id } from '../../../shared/types'

/** Talks to the real backend's `/foods` endpoints. DTO shapes match our domain types 1:1. */
export function createFoodHttpRepository(): FoodRepository {
  return {
    async list(filter?: { categoryId?: Id }) {
      const all = await apiClient.get<Food[]>('/foods')
      return filter?.categoryId ? all.filter((food) => food.categoryId === filter.categoryId) : all
    },
    create(input: CreateFoodInput) {
      return apiClient.post<Food>('/foods', { ...input })
    },
    update(id, input: UpdateFoodInput) {
      return apiClient.put<Food>(`/foods/${id}`, { ...input })
    },
  }
}
