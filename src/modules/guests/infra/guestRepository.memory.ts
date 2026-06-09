import { createId } from '../../../shared/lib/id'
import type { GuestRepository } from '../domain/GuestRepository'
import type { CreateGuestInput, Guest, GuestTier, UpdateGuestInput } from '../domain/types'

const now = '2026-05-01T09:00:00Z'

function deriveTier(visits: number): GuestTier {
  if (visits >= 30) return 'platinum'
  if (visits >= 15) return 'gold'
  if (visits >= 5) return 'silver'
  return 'member'
}

function guest(partial: Pick<Guest, 'id' | 'name' | 'phone' | 'visits' | 'lifetimeSpend'> & { lastSeenAt?: string }): Guest {
  return {
    ...partial,
    tier: deriveTier(partial.visits),
    lastSeenAt: partial.lastSeenAt ?? null,
    createdAt: now,
    updatedAt: now,
  }
}

let guests: Guest[] = [
  guest({ id: 'guest_ali', name: 'Ali Karimi', phone: '+98 912 100 0001', visits: 32, lifetimeSpend: 285000, lastSeenAt: '2026-06-08T19:30:00Z' }),
  guest({ id: 'guest_sara', name: 'Sara Hosseini', phone: '+98 912 100 0002', visits: 17, lifetimeSpend: 143000, lastSeenAt: '2026-06-07T13:15:00Z' }),
  guest({ id: 'guest_reza', name: 'Reza Ahmadi', phone: '+98 912 100 0003', visits: 8, lifetimeSpend: 62400, lastSeenAt: '2026-06-05T20:00:00Z' }),
  guest({ id: 'guest_maryam', name: 'Maryam Sadeghi', phone: '+98 912 100 0004', visits: 3, lifetimeSpend: 21500, lastSeenAt: '2026-06-01T12:45:00Z' }),
  guest({ id: 'guest_hossein', name: 'Hossein Moradi', phone: '+98 912 100 0005', visits: 1, lifetimeSpend: 7200, lastSeenAt: '2026-05-28T18:00:00Z' }),
]

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), 200))
}

export function createGuestMemoryRepository(): GuestRepository {
  return {
    async list(query) {
      const page = query?.page ?? 1
      const pageSize = query?.page_size ?? 20
      const start = (page - 1) * pageSize
      const items = guests.slice(start, start + pageSize)
      return delay({
        items: [...items],
        page,
        pageSize,
        totalItems: guests.length,
        totalPages: Math.ceil(guests.length / pageSize),
      })
    },
    async get(id) {
      const g = guests.find((item) => item.id === id)
      if (!g) throw new Error(`Guest ${id} not found`)
      return delay({ ...g })
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
      return delay({ ...created })
    },
    async update(id, input: UpdateGuestInput) {
      const existing = guests.find((item) => item.id === id)
      if (!existing) throw new Error(`Guest ${id} not found`)
      const updated: Guest = {
        ...existing,
        name: input.name,
        phone: input.phone,
        updatedAt: new Date().toISOString(),
      }
      guests = guests.map((item) => (item.id === id ? updated : item))
      return delay({ ...updated })
    },
    async delete(id) {
      guests = guests.filter((item) => item.id !== id)
      return delay(undefined)
    },
  }
}
