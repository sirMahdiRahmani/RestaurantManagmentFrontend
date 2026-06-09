import { apiClient } from '../../../shared/http'
import type { PageQuery, PaginatedResult } from '../../../shared/types'
import type { FactorRepository } from '../domain/FactorRepository'
import type { CreateFactorInput, Factor, UpdateFactorInput } from '../domain/types'

export function createFactorHttpRepository(): FactorRepository {
  return {
    list(query?: PageQuery) {
      const params = query ? `?page=${query.page ?? 1}&page_size=${query.page_size ?? 20}` : ''
      return apiClient.get<PaginatedResult<Factor>>(`/factors${params}`)
    },
    get(id) {
      return apiClient.get<Factor>(`/factors/${id}`)
    },
    create(input: CreateFactorInput) {
      return apiClient.post<Factor>('/factors', { ...input })
    },
    update(id, input: UpdateFactorInput) {
      return apiClient.put<Factor>(`/factors/${id}`, { ...input })
    },
    delete(id) {
      return apiClient.delete<void>(`/factors/${id}`)
    },
    settle(id) {
      return apiClient.post<Factor>(`/factors/${id}/settle`, {})
    },
  }
}
