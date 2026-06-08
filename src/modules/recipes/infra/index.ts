import { config } from '../../../shared/config'
import type { RecipeRepository } from '../domain/RecipeRepository'
import { createRecipeMemoryRepository } from './recipeRepository.memory'
import { createRecipeHttpRepository } from './recipeRepository.http'

/** Picks the in-memory mock or the real HTTP backend based on `config.useMockRepos`. */
export function createRecipeRepository(): RecipeRepository {
  return config.useMockRepos ? createRecipeMemoryRepository() : createRecipeHttpRepository()
}
