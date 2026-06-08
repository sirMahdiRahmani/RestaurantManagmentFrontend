import { createId } from '../../../shared/lib/id'
import type { PaginatedResult } from '../../../shared/types'
import type { StockInRepository } from '../domain/StockInRepository'
import type { CreateStockInInput, StockIn, StockInLine } from '../domain/types'

const PAGE_SIZE = 10

let stockIns: StockIn[] = [
  {
    id: 'stockin_seed_1',
    supplier: 'Fresh Farms Co.',
    occurredOn: '2026-04-28T00:00:00Z',
    invoiceNo: 'INV-1042',
    grandTotal: 33300,
    lines: [
      { ingredientId: 'ing_ribeye', qty: 10, unit: 'kg', unitCost: 1800, lineTotal: 18000 },
      { ingredientId: 'ing_lamb', qty: 5, unit: 'kg', unitCost: 2050, lineTotal: 10250 },
      { ingredientId: 'ing_tomato', qty: 18, unit: 'kg', unitCost: 250, lineTotal: 4500 },
      { ingredientId: 'ing_lettuce', qty: 1.6, unit: 'kg', unitCost: 343.75, lineTotal: 550 },
    ],
    createdAt: '2026-04-28T08:15:00Z',
  },
]

function lineTotal(line: { qty: number; unitCost: number }): number {
  return Math.round(line.qty * line.unitCost)
}

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), 220))
}

/**
 * In the real backend, recording a stock-in immediately raises ingredient
 * on-hand quantities and recomputes their weighted-average unit cost — that's
 * server-owned math we don't replicate here. The mock just stores the record.
 */
export function createStockInMemoryRepository(): StockInRepository {
  return {
    async list(page = 1) {
      const start = (page - 1) * PAGE_SIZE
      const items = [...stockIns]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(start, start + PAGE_SIZE)
      const result: PaginatedResult<StockIn> = {
        items,
        page,
        pageSize: PAGE_SIZE,
        totalItems: stockIns.length,
        totalPages: Math.max(1, Math.ceil(stockIns.length / PAGE_SIZE)),
      }
      return delay(result)
    },
    async create(input: CreateStockInInput) {
      const lines: StockInLine[] = input.lines.map((line) => ({
        ingredientId: line.ingredientId,
        qty: line.qty,
        unit: line.unit,
        unitCost: line.unitCost,
        lineTotal: lineTotal(line),
      }))
      const created: StockIn = {
        id: createId('stockin'),
        supplier: input.supplier,
        occurredOn: input.occurredOn,
        invoiceNo: input.invoiceNo ?? '',
        grandTotal: lines.reduce((sum, line) => sum + line.lineTotal, 0),
        lines,
        createdAt: new Date().toISOString(),
      }
      stockIns = [...stockIns, created]
      return delay(created)
    },
  }
}
