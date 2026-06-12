import type { Id, ISODateString } from '../../../shared/types'

export type GuestTier = 'member' | 'silver' | 'gold' | 'platinum'

/** Auto-promotion thresholds: visits ≥ threshold → tier */
export const TIER_THRESHOLDS = {
  silver: 5,
  gold: 15,
  platinum: 30,
} as const

export interface Guest {
  id: Id
  name: string
  phone: string
  /** Derived — auto-promoted on factor settlement by visit count */
  tier: GuestTier
  /** Managed — incremented on each factor settlement */
  visits: number
  /** Managed — accrued on settlement, minor units */
  lifetimeSpend: number
  /** Managed — set to settlement time; null before first visit */
  lastSeenAt: ISODateString | null
  createdAt: ISODateString
  updatedAt: ISODateString
}

export interface CreateGuestInput {
  name: string
  phone: string
}

export type UpdateGuestInput = CreateGuestInput
