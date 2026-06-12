import { config } from '../../../shared/config'
import type { PublishedMenuRepository } from '../domain/PublishedMenuRepository'
import { createPublishedMenuHttpRepository } from './publishedMenuRepository.http'
import { createPublishedMenuMemoryRepository } from './publishedMenuRepository.memory'

export function createPublishedMenuRepository(): PublishedMenuRepository {
  return config.useMockRepos ? createPublishedMenuMemoryRepository() : createPublishedMenuHttpRepository()
}
