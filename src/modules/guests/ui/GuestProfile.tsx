import { Avatar, Modal, Pill } from '../../../shared/ui'
import type { PillTone } from '../../../shared/ui'
import { formatMoney } from '../../../shared/money'
import type { Guest, GuestTier } from '../domain/types'
import styles from './GuestsCrmPage.module.css'

const tierTone: Record<GuestTier, PillTone> = {
  member: 'neutral',
  silver: 'accent',
  gold: 'warn',
  platinum: 'ok',
}

export interface GuestProfileProps {
  guest: Guest
  onClose: () => void
}

export function GuestProfile({ guest, onClose }: GuestProfileProps) {
  return (
    <Modal title="Guest profile" onClose={onClose}>
      <div className={styles.profileHeader}>
        <Avatar name={guest.name} size={48} />
        <div>
          <div className={styles.profileName}>{guest.name}</div>
          <div className={styles.guestPhone}>{guest.phone}</div>
        </div>
        <Pill tone={tierTone[guest.tier]}>{guest.tier}</Pill>
      </div>
      <div className={styles.profileStats}>
        <div>
          <div className={styles.statLabel}>Visits</div>
          <div className={styles.statValue}>{guest.visits}</div>
        </div>
        <div>
          <div className={styles.statLabel}>Lifetime spend</div>
          <div className={styles.statValue}>{formatMoney(guest.lifetimeSpend)}</div>
        </div>
        <div>
          <div className={styles.statLabel}>Last seen</div>
          <div className={styles.statValue}>
            {guest.lastSeenAt ? new Date(guest.lastSeenAt).toLocaleDateString() : 'Never'}
          </div>
        </div>
      </div>
    </Modal>
  )
}
