import { config } from '../../../shared/config'
import type { CategoryRepository } from '../domain/CategoryRepository'
import type { FoodRepository } from '../domain/FoodRepository'
import { createCategoryMemoryRepository } from './categoryRepository.memory'
import { createFoodMemoryRepository } from './foodRepository.memory'

/**
 * Factories pick the memory implementation while `config.useMockRepos` is true.
 * `*.http.ts` implementations land in build-order step 9 and slot in here —
 * `config.apiBaseUrl` / `config.defaultRestaurantId` are already wired for that.
 */
export function createCategoryRepository(): CategoryRepository {
  if (config.useMockRepos) return createCategoryMemoryRepository()
  throw new Error('HTTP category repository is not implemented yet (build-order step 9)')
}

export function createFoodRepository(): FoodRepository {
  if (config.useMockRepos) return createFoodMemoryRepository()
  throw new Error('HTTP food repository is not implemented yet (build-order step 9)')
}
