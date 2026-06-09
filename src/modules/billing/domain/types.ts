import type { Id, ISODateString } from '../../../shared/types'

export type FactorStatus = 'unpaid' | 'paid'

export interface FactorLine {
  id: Id
  foodId: Id
  qty: number
  /** minor units — captured at order time, immune to later price changes */
  unitPrice: number
  /** unitPrice × qty */
  lineTotal: number
}

export interface Factor {
  id: Id
  tableId: string
  guestId: Id | null
  /** Σ lineTotal, minor units */
  subtotal: number
  /** e.g. 10 means 10% */
  servicePct: number
  vatPct: number
  /** subtotal + service + vat, minor units */
  total: number
  status: FactorStatus
  printedAt: ISODateString | null
  lines: FactorLine[]
  createdAt: ISODateString
  updatedAt: ISODateString
}

export interface CreateFactorLineInput {
  foodId: Id
  qty: number
}

export interface CreateFactorInput {
  tableId: string
  guestId?: Id | null
  servicePct: number
  vatPct: number
  lines: CreateFactorLineInput[]
}

export type UpdateFactorInput = CreateFactorInput

/** Local draft kept in React state before the factor is created/submitted. */
export interface DraftLine {
  foodId: Id
  foodName: string
  /** minor units */
  unitPrice: number
  qty: number
}
