import { config } from '../../../shared/config'
import type { GuestRepository } from '../domain/GuestRepository'
import { createGuestMemoryRepository } from './guestRepository.memory'
import { createGuestHttpRepository } from './guestRepository.http'

/** Picks the in-memory mock or the real HTTP backend based on `config.useMockRepos`. */
export function createGuestRepository(): GuestRepository {
  return config.useMockRepos ? createGuestMemoryRepository() : createGuestHttpRepository()
}
