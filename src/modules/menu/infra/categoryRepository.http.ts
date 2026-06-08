import { apiClient } from '../../../shared/http'
import type { CategoryRepository } from '../domain/CategoryRepository'
import type { Category, CreateCategoryInput } from '../domain/types'

/** Talks to the real backend's `/categories` endpoints. DTO shapes match our domain types 1:1. */
export function createCategoryHttpRepository(): CategoryRepository {
  return {
    list() {
      return apiClient.get<Category[]>('/categories')
    },
    create(input: CreateCategoryInput) {
      return apiClient.post<Category>('/categories', { ...input })
    },
    async rename(id, name) {
      const current = await apiClient.get<Category>(`/categories/${id}`)
      return apiClient.put<Category>(`/categories/${id}`, { ...current, name })
    },
  }
}
