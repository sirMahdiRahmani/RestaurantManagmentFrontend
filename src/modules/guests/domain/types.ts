import type { Id, ISODateString } from '../../../shared/types'

export type GuestTier = 'member' | 'silver' | 'gold' | 'platinum'

export interface Guest {
  id: Id
  name: string
  phone: string
  /** derived — auto-promotes on settlement by visit count */
  tier: GuestTier
  /** managed — incremented on settlement */
  visits: number
  /** managed — accrued on settlement, integer minor units */
  lifetimeSpend: number
  /** managed — set to settlement time */
  lastSeenAt: ISODateString | null
  createdAt: ISODateString
  updatedAt: ISODateString
}

export interface CreateGuestInput {
  name: string
  phone: string
}

export type UpdateGuestInput = CreateGuestInput
