import { createId } from '../../../shared/lib/id'
import { foodRepository } from '../../menu'
import { guestRepository } from '../../guests'
import type { FactorRepository } from '../domain/FactorRepository'
import { computeTotals, lineTotal, subtotalOf } from '../domain/totals'
import type { CreateFactorInput, Factor, FactorLine, UpdateFactorInput } from '../domain/types'

let factors: Factor[] = []

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), 180))
}

function findOrThrow(id: string): Factor {
  const found = factors.find((factor) => factor.id === id)
  if (!found) throw new Error(`Factor ${id} not found`)
  return found
}

async function resolveLines(input: CreateFactorInput): Promise<FactorLine[]> {
  const foods = await foodRepository.list()
  return input.lines.map((line) => {
    const food = foods.find((item) => item.id === line.foodId)
    if (!food) throw new Error(`Food ${line.foodId} not found`)
    return { id: createId('fline'), foodId: food.id, qty: line.qty, unitPrice: food.price, lineTotal: lineTotal(food.price, line.qty) }
  })
}

function buildFactor(id: string, input: CreateFactorInput, lines: FactorLine[], existing?: Factor): Factor {
  const subtotal = subtotalOf(lines)
  const totals = computeTotals(subtotal, input.servicePct, input.vatPct)
  const timestamp = new Date().toISOString()
  return {
    id,
    tableId: input.tableId,
    guestId: input.guestId ?? null,
    subtotal: totals.subtotal,
    servicePct: input.servicePct,
    vatPct: input.vatPct,
    total: totals.total,
    status: existing?.status ?? 'unpaid',
    printedAt: existing?.printedAt ?? null,
    lines,
    createdAt: existing?.createdAt ?? timestamp,
    updatedAt: timestamp,
  }
}

export function createFactorMemoryRepository(): FactorRepository {
  return {
    async list() {
      return delay([...factors].sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
    },
    async get(id) {
      return delay(findOrThrow(id))
    },
    async create(input: CreateFactorInput) {
      const lines = await resolveLines(input)
      const created = buildFactor(createId('factor'), input, lines)
      factors = [...factors, created]
      return delay(created)
    },
    async update(id, input: UpdateFactorInput) {
      const existing = findOrThrow(id)
      if (existing.status === 'paid') throw new Error('factor is already settled')
      const lines = await resolveLines(input)
      const updated = buildFactor(id, input, lines, existing)
      factors = factors.map((factor) => (factor.id === id ? updated : factor))
      return delay(updated)
    },
    async remove(id) {
      const existing = findOrThrow(id)
      if (existing.status === 'paid') throw new Error('factor is already settled')
      factors = factors.filter((factor) => factor.id !== id)
      return delay(undefined)
    },
    async settle(id) {
      const existing = findOrThrow(id)
      if (existing.status === 'paid') throw new Error('factor is already settled')
      const settled: Factor = { ...existing, status: 'paid', updatedAt: new Date().toISOString() }
      factors = factors.map((factor) => (factor.id === id ? settled : factor))
      if (settled.guestId) {
        await guestRepository.recordVisit(settled.guestId, settled.total)
      }
      return delay(settled)
    },
  }
}
