import { Avatar, Pill, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '../../../shared/ui'
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

const tierLabel: Record<GuestTier, string> = {
  member: 'Member',
  silver: 'Silver',
  gold: 'Gold',
  platinum: 'Platinum',
}

function formatLastSeen(value: string | null): string {
  if (!value) return 'Never'
  return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export interface GuestTableProps {
  guests: Guest[]
  onSelect: (guest: Guest) => void
}

export function GuestTable({ guests, onSelect }: GuestTableProps) {
  return (
    <Table aria-label="Guests">
      <TableHead>
        <TableRow>
          <TableHeaderCell scope="col">Guest</TableHeaderCell>
          <TableHeaderCell scope="col">Tier</TableHeaderCell>
          <TableHeaderCell scope="col">Visits</TableHeaderCell>
          <TableHeaderCell scope="col">Lifetime spend</TableHeaderCell>
          <TableHeaderCell scope="col">Last seen</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {guests.map((guest) => (
          <TableRow key={guest.id} className={styles.row} onClick={() => { onSelect(guest) }}>
            <TableCell>
              <div className={styles.guestCell}>
                <Avatar name={guest.name} />
                <div>
                  <div className={styles.guestName}>{guest.name}</div>
                  <div className={styles.guestPhone}>{guest.phone}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Pill tone={tierTone[guest.tier]}>{tierLabel[guest.tier]}</Pill>
            </TableCell>
            <TableCell className="num">{guest.visits}</TableCell>
            <TableCell className="num">{formatMoney(guest.lifetimeSpend)}</TableCell>
            <TableCell>{formatLastSeen(guest.lastSeenAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
