import type { Id, ISODateString } from '../../../shared/types'

export interface Ingredient {
  id: Id
  name: string
  unit: string
  onHandQty: number
  parLevel: number
  /** integer minor units, weighted-average — managed by the server, not directly editable */
  unitCost: number
  /** derived: onHandQty < parLevel */
  isLowStock: boolean
  createdAt: ISODateString
  updatedAt: ISODateString
}

export interface CreateIngredientInput {
  name: string
  unit: string
  onHandQty?: number
  parLevel?: number
  unitCost?: number
}

export interface UpdateIngredientInput {
  name: string
  unit: string
  parLevel: number
}

export interface AdjustStockInput {
  /** signed correction applied to onHandQty */
  delta: number
  reason?: string
}

export interface StockInLine {
  ingredientId: Id
  qty: number
  unit: string
  unitCost: number
  /** round(unitCost × qty) */
  lineTotal: number
}

export interface StockIn {
  id: Id
  supplier: string
  /** date-only, RFC 3339 at midnight UTC */
  occurredOn: ISODateString
  invoiceNo: string
  /** Σ lineTotal */
  grandTotal: number
  lines: StockInLine[]
  createdAt: ISODateString
}

export interface CreateStockInLineInput {
  ingredientId: Id
  qty: number
  unit: string
  unitCost: number
}

export interface CreateStockInInput {
  supplier: string
  occurredOn: ISODateString
  invoiceNo?: string
  /** at least one line */
  lines: CreateStockInLineInput[]
}
