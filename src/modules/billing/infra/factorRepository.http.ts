import { apiClient } from '../../../shared/http'
import type { PaginatedResult } from '../../../shared/types'
import type { FactorRepository } from '../domain/FactorRepository'
import type { CreateFactorInput, Factor, UpdateFactorInput } from '../domain/types'

/** Talks to the real backend's `/factors` endpoints. `GET /factors` is paginated. */
export function createFactorHttpRepository(): FactorRepository {
  return {
    async list() {
      const result = await apiClient.get<PaginatedResult<Factor>>('/factors')
      return result.items
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
    async remove(id) {
      await apiClient.delete(`/factors/${id}`)
    },
    settle(id) {
      return apiClient.post<Factor>(`/factors/${id}/settle`)
    },
  }
}
