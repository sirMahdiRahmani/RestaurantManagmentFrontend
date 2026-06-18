import { createId } from '../../../shared/lib/id'
import type { GuestRepository } from '../domain/GuestRepository'
import { tierForVisits } from '../domain/tier'
import type { CreateGuestInput, Guest, UpdateGuestInput } from '../domain/types'

const now = '2026-05-01T09:00:00Z'

function guest(partial: Pick<Guest, 'id' | 'name' | 'phone' | 'visits' | 'lifetimeSpend' | 'lastSeenAt'>): Guest {
  return {
    ...partial,
    tier: tierForVisits(partial.visits),
    createdAt: now,
    updatedAt: now,
  }
}

let guests: Guest[] = [
  guest({ id: 'guest_amelia', name: 'Amelia Stone', phone: '+1 555 0101', visits: 32, lifetimeSpend: 184200, lastSeenAt: '2026-06-15T19:20:00Z' }),
  guest({ id: 'guest_omar', name: 'Omar Reyes', phone: '+1 555 0142', visits: 18, lifetimeSpend: 96400, lastSeenAt: '2026-06-12T13:05:00Z' }),
  guest({ id: 'guest_priya', name: 'Priya Nair', phone: '+1 555 0177', visits: 9, lifetimeSpend: 41200, lastSeenAt: '2026-06-10T20:40:00Z' }),
  guest({ id: 'guest_diego', name: 'Diego Marin', phone: '+1 555 0193', visits: 2, lifetimeSpend: 8600, lastSeenAt: '2026-05-28T18:15:00Z' }),
  guest({ id: 'guest_lena', name: 'Lena Kovac', phone: '+1 555 0228', visits: 0, lifetimeSpend: 0, lastSeenAt: null }),
]

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), 180))
}

function findOrThrow(id: string): Guest {
  const found = guests.find((item) => item.id === id)
  if (!found) throw new Error(`Guest ${id} not found`)
  return found
}

export function createGuestMemoryRepository(): GuestRepository {
  return {
    async list() {
      return delay([...guests].sort((a, b) => b.lifetimeSpend - a.lifetimeSpend))
    },
    async create(input: CreateGuestInput) {
      const timestamp = new Date().toISOString()
      const created: Guest = {
        id: createId('guest'),
        name: input.name,
        phone: input.phone,
        tier: 'member',
        visits: 0,
        lifetimeSpend: 0,
        lastSeenAt: null,
        createdAt: timestamp,
        updatedAt: timestamp,
      }
      guests = [...guests, created]
      return delay(created)
    },
    async update(id, input: UpdateGuestInput) {
      const existing = findOrThrow(id)
      const updated: Guest = { ...existing, name: input.name, phone: input.phone, updatedAt: new Date().toISOString() }
      guests = guests.map((item) => (item.id === id ? updated : item))
      return delay(updated)
    },
    async remove(id) {
      guests = guests.filter((item) => item.id !== id)
      return delay(undefined)
    },
    async recordVisit(id, amount) {
      const existing = findOrThrow(id)
      const visits = existing.visits + 1
      const updated: Guest = {
        ...existing,
        visits,
        lifetimeSpend: existing.lifetimeSpend + amount,
        lastSeenAt: new Date().toISOString(),
        tier: tierForVisits(visits),
        updatedAt: new Date().toISOString(),
      }
      guests = guests.map((item) => (item.id === id ? updated : item))
      return delay(updated)
    },
  }
}
