import type { GuestTier } from './types'

/** Provisional auto-promotion thresholds by lifetime visit count. */
export function tierForVisits(visits: number): GuestTier {
  if (visits >= 30) return 'platinum'
  if (visits >= 15) return 'gold'
  if (visits >= 5) return 'silver'
  return 'member'
}
