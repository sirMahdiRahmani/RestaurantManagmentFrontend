import { config } from '../../../shared/config'
import type { GuestRepository } from '../domain/GuestRepository'
import { createGuestHttpRepository } from './guestRepository.http'
import { createGuestMemoryRepository } from './guestRepository.memory'

export function createGuestRepository(): GuestRepository {
  return config.useMockRepos ? createGuestMemoryRepository() : createGuestHttpRepository()
}
