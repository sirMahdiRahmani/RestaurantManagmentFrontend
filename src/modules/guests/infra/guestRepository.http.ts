import { apiClient } from '../../../shared/http'
import type { PaginatedResult } from '../../../shared/types'
import type { GuestRepository } from '../domain/GuestRepository'
import type { CreateGuestInput, Guest, UpdateGuestInput } from '../domain/types'

/** Talks to the real backend's `/guests` endpoints. `GET /guests` is paginated. */
export function createGuestHttpRepository(): GuestRepository {
  return {
    async list() {
      const result = await apiClient.get<PaginatedResult<Guest>>('/guests')
      return result.items
    },
    create(input: CreateGuestInput) {
      return apiClient.post<Guest>('/guests', { ...input })
    },
    update(id, input: UpdateGuestInput) {
      return apiClient.put<Guest>(`/guests/${id}`, { ...input })
    },
    async remove(id) {
      await apiClient.delete(`/guests/${id}`)
    },
    // The server already applied the accrual as part of factor settlement —
    // just fetch the guest's current state.
    recordVisit(id) {
      return apiClient.get<Guest>(`/guests/${id}`)
    },
  }
}
