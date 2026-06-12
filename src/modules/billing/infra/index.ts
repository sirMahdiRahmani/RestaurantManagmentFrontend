import { config } from '../../../shared/config'
import type { FactorRepository } from '../domain/FactorRepository'
import { createFactorHttpRepository } from './factorRepository.http'
import { createFactorMemoryRepository } from './factorRepository.memory'

export function createFactorRepository(): FactorRepository {
  return config.useMockRepos ? createFactorMemoryRepository() : createFactorHttpRepository()
}
