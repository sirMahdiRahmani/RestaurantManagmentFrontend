import { config } from '../../../shared/config'
import type { IngredientRepository } from '../domain/IngredientRepository'
import type { StockInRepository } from '../domain/StockInRepository'
import { createIngredientMemoryRepository } from './ingredientRepository.memory'
import { createStockInMemoryRepository } from './stockInRepository.memory'
import { createIngredientHttpRepository } from './ingredientRepository.http'
import { createStockInHttpRepository } from './stockInRepository.http'

/** Picks the in-memory mock or the real HTTP backend based on `config.useMockRepos`. */
export function createIngredientRepository(): IngredientRepository {
  return config.useMockRepos ? createIngredientMemoryRepository() : createIngredientHttpRepository()
}

export function createStockInRepository(): StockInRepository {
  return config.useMockRepos ? createStockInMemoryRepository() : createStockInHttpRepository()
}
