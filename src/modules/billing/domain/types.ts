import type { Id, ISODateString } from '../../../shared/types'

export type FactorStatus = 'unpaid' | 'paid'

export interface FactorLine {
  id: Id
  foodId: Id
  qty: number
  /** captured at order time — integer minor units */
  unitPrice: number
  /** unitPrice × qty */
  lineTotal: number
}

export interface Factor {
  id: Id
  tableId: string
  guestId: Id | null
  /** Σ lineTotal */
  subtotal: number
  /** percentage value, e.g. 10 means 10% */
  servicePct: number
  vatPct: number
  /** subtotal + subtotal×servicePct% + subtotal×vatPct% */
  total: number
  status: FactorStatus
  printedAt: ISODateString | null
  lines: FactorLine[]
  createdAt: ISODateString
  updatedAt: ISODateString
}

export interface FactorLineInput {
  foodId: Id
  qty: number
}

export interface CreateFactorInput {
  tableId: string
  guestId?: Id | null
  servicePct: number
  vatPct: number
  /** at least one line */
  lines: FactorLineInput[]
}

export type UpdateFactorInput = CreateFactorInput
