import { config } from '../../../shared/config'
import type { CategoryRepository } from '../domain/CategoryRepository'
import type { FoodRepository } from '../domain/FoodRepository'
import { createCategoryMemoryRepository } from './categoryRepository.memory'
import { createFoodMemoryRepository } from './foodRepository.memory'
import { createCategoryHttpRepository } from './categoryRepository.http'
import { createFoodHttpRepository } from './foodRepository.http'

/** Picks the in-memory mock or the real HTTP backend based on `config.useMockRepos`. */
export function createCategoryRepository(): CategoryRepository {
  return config.useMockRepos ? createCategoryMemoryRepository() : createCategoryHttpRepository()
}

export function createFoodRepository(): FoodRepository {
  return config.useMockRepos ? createFoodMemoryRepository() : createFoodHttpRepository()
}
