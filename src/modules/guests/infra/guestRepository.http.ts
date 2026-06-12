import { apiClient } from '../../../shared/http'
import type { PageQuery, PaginatedResult } from '../../../shared/types'
import type { GuestRepository } from '../domain/GuestRepository'
import type { CreateGuestInput, Guest, UpdateGuestInput } from '../domain/types'

export function createGuestHttpRepository(): GuestRepository {
  return {
    list(query?: PageQuery) {
      const params = query ? `?page=${query.page ?? 1}&page_size=${query.page_size ?? 20}` : ''
      return apiClient.get<PaginatedResult<Guest>>(`/guests${params}`)
    },
    get(id) {
      return apiClient.get<Guest>(`/guests/${id}`)
    },
    create(input: CreateGuestInput) {
      return apiClient.post<Guest>('/guests', { ...input })
    },
    update(id, input: UpdateGuestInput) {
      return apiClient.put<Guest>(`/guests/${id}`, { ...input })
    },
    delete(id) {
      return apiClient.delete<void>(`/guests/${id}`)
    },
  }
}
