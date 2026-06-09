import { createId } from '../../../shared/lib/id'
import type { FactorRepository } from '../domain/FactorRepository'
import type { CreateFactorInput, Factor, FactorLine, UpdateFactorInput } from '../domain/types'
import { lineTotal as computeLineTotal, subtotal as computeSubtotal, totalAmount } from '../domain/totals'

// Mirrors seeded food prices from menu/infra/foodRepository.memory.ts
const MOCK_PRICES: Record<string, number> = {
  food_ribeye: 4900,
  food_lamb_chops: 5400,
  food_chicken_skewer: 2600,
  food_salmon: 3800,
  food_carbonara: 2200,
  food_pesto: 2000,
  food_lasagna: 2400,
  food_caesar: 1700,
  food_greek: 1600,
  food_tomato_soup: 1200,
  food_mushroom_soup: 1350,
  food_tiramisu: 1400,
  food_cheesecake: 1500,
  food_baklava: 1100,
  food_lemonade: 800,
  food_espresso: 600,
  food_iced_tea: 700,
}

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), 200))
}

function buildLines(inputLines: CreateFactorInput['lines']): FactorLine[] {
  return inputLines.map((l) => {
    const unitPrice = MOCK_PRICES[l.foodId] ?? 1000
    return {
      id: createId('fl'),
      foodId: l.foodId,
      qty: l.qty,
      unitPrice,
      lineTotal: computeLineTotal(unitPrice, l.qty),
    }
  })
}

let factors: Factor[] = []

export function createFactorMemoryRepository(): FactorRepository {
  return {
    async list() {
      return delay({
        items: [...factors],
        page: 1,
        pageSize: 50,
        totalItems: factors.length,
        totalPages: 1,
      })
    },
    async get(id) {
      const factor = factors.find((f) => f.id === id)
      if (!factor) throw new Error(`Factor ${id} not found`)
      return delay({ ...factor })
    },
    async create(input: CreateFactorInput) {
      const now = new Date().toISOString()
      const lines = buildLines(input.lines)
      const sub = computeSubtotal(lines)
      const total = totalAmount(sub, input.servicePct, input.vatPct)
      const factor: Factor = {
        id: createId('fac'),
        tableId: input.tableId,
        guestId: input.guestId ?? null,
        subtotal: sub,
        servicePct: input.servicePct,
        vatPct: input.vatPct,
        total,
        status: 'unpaid',
        printedAt: null,
        lines,
        createdAt: now,
        updatedAt: now,
      }
      factors = [...factors, factor]
      return delay({ ...factor })
    },
    async update(id, input: UpdateFactorInput) {
      const existing = factors.find((f) => f.id === id)
      if (!existing) throw new Error(`Factor ${id} not found`)
      if (existing.status === 'paid') throw new Error('Factor is already settled')
      const now = new Date().toISOString()
      const lines = buildLines(input.lines)
      const sub = computeSubtotal(lines)
      const total = totalAmount(sub, input.servicePct, input.vatPct)
      const updated: Factor = {
        ...existing,
        tableId: input.tableId,
        guestId: input.guestId ?? null,
        subtotal: sub,
        servicePct: input.servicePct,
        vatPct: input.vatPct,
        total,
        lines,
        updatedAt: now,
      }
      factors = factors.map((f) => (f.id === id ? updated : f))
      return delay({ ...updated })
    },
    async delete(id) {
      const factor = factors.find((f) => f.id === id)
      if (!factor) throw new Error(`Factor ${id} not found`)
      if (factor.status === 'paid') throw new Error('Factor is already settled')
      factors = factors.filter((f) => f.id !== id)
      return delay(undefined)
    },
    async settle(id) {
      const existing = factors.find((f) => f.id === id)
      if (!existing) throw new Error(`Factor ${id} not found`)
      if (existing.status === 'paid') throw new Error('Factor is already settled')
      const now = new Date().toISOString()
      const settled: Factor = {
        ...existing,
        status: 'paid',
        printedAt: now,
        updatedAt: now,
      }
      factors = factors.map((f) => (f.id === id ? settled : f))
      return delay({ ...settled })
    },
  }
}
