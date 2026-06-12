import { apiClient } from '../../../shared/http'
import type { PublishedMenuRepository } from '../domain/PublishedMenuRepository'
import type { PublishedMenu } from '../domain/types'

export function createPublishedMenuHttpRepository(): PublishedMenuRepository {
  return {
    get() {
      return apiClient.get<PublishedMenu>('/menu/published')
    },
  }
}
