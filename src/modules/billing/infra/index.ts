import { config } from '../../../shared/config'
import type { FactorRepository } from '../domain/FactorRepository'
import { createFactorMemoryRepository } from './factorRepository.memory'
import { createFactorHttpRepository } from './factorRepository.http'

/** Picks the in-memory mock or the real HTTP backend based on `config.useMockRepos`. */
export function createFactorRepository(): FactorRepository {
  return config.useMockRepos ? createFactorMemoryRepository() : createFactorHttpRepository()
}
