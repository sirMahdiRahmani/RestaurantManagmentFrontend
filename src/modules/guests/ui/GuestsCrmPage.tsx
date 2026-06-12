import { useMemo, useState } from 'react'
import { Button, Card, EmptyState, Field, Input, Pill, Skeleton, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '../../../shared/ui'
import { formatMoney } from '../../../shared/money'
import { useGuests, useCreateGuest } from '../application/useGuests'
import type { GuestTier } from '../domain/types'
import styles from './GuestsCrmPage.module.css'

const TIER_TONE: Record<GuestTier, 'ok' | 'warn' | 'neutral' | 'accent'> = {
  member: 'neutral',
  silver: 'accent',
  gold: 'warn',
  platinum: 'ok',
}

const TIERS: Array<{ value: GuestTier | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'member', label: 'Member' },
  { value: 'silver', label: 'Silver' },
  { value: 'gold', label: 'Gold' },
  { value: 'platinum', label: 'Platinum' },
]

export function GuestsCrmPage() {
  const [search, setSearch] = useState('')
  const [tierFilter, setTierFilter] = useState<GuestTier | 'all'>('all')
  const [showForm, setShowForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const guestsQuery = useGuests()
  const createGuest = useCreateGuest()

  const guests = guestsQuery.data?.items ?? []

  const visible = useMemo(() => {
    let result = guests
    if (tierFilter !== 'all') result = result.filter((g) => g.tier === tierFilter)
    const q = search.trim().toLowerCase()
    if (q) result = result.filter((g) => g.name.toLowerCase().includes(q) || g.phone.includes(q))
    return result
  }, [guests, tierFilter, search])

  const tierCounts = useMemo(() => {
    const counts: Record<GuestTier, number> = { member: 0, silver: 0, gold: 0, platinum: 0 }
    for (const g of guests) counts[g.tier]++
    return counts
  }, [guests])

  async function handleCreate() {
    if (!newName.trim()) { setFormError('Name is required'); return }
    if (!newPhone.trim()) { setFormError('Phone is required'); return }
    setFormError(null)
    try {
      await createGuest.mutateAsync({ name: newName.trim(), phone: newPhone.trim() })
      setNewName('')
      setNewPhone('')
      setShowForm(false)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to create guest')
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Guests</h1>
          <p className={styles.subtitle}>Loyalty CRM — {guests.length} registered guests</p>
        </div>
        <Button variant="primary" onClick={() => { setShowForm((v) => !v) }}>
          {showForm ? 'Cancel' : '+ Add guest'}
        </Button>
      </header>

      {showForm ? (
        <Card>
          <div className={styles.addForm}>
            <h3 className={styles.formTitle}>Register new guest</h3>
            <div className={styles.formFields}>
              <Field label="Full name" error={undefined}>
                <Input value={newName} onChange={(e) => { setNewName(e.target.value) }} placeholder="e.g. Ali Karimi" />
              </Field>
              <Field label="Phone" error={undefined}>
                <Input value={newPhone} onChange={(e) => { setNewPhone(e.target.value) }} placeholder="+98 912 …" />
              </Field>
            </div>
            {formError ? <p className={styles.formError}>{formError}</p> : null}
            <div className={styles.formActions}>
              <Button variant="secondary" onClick={() => { setShowForm(false) }}>Cancel</Button>
              <Button variant="primary" onClick={() => { void handleCreate() }} disabled={createGuest.isPending}>
                {createGuest.isPending ? 'Saving…' : 'Register'}
              </Button>
            </div>
          </div>
        </Card>
      ) : null}

      <div className={styles.kpiRow}>
        {Object.entries(tierCounts).map(([tier, count]) => (
          <Card key={tier}>
            <div className={styles.kpiCard}>
              <span className={styles.kpiLabel}>{tier.charAt(0).toUpperCase() + tier.slice(1)}</span>
              <span className={styles.kpiValue}>{count}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className={styles.filters}>
        <Field label="Search guests">
          <Input value={search} onChange={(e) => { setSearch(e.target.value) }} placeholder="Name or phone…" />
        </Field>
        <div className={styles.tierPills}>
          {TIERS.map((t) => (
            <button
              key={t.value}
              className={`${styles.tierPill} ${tierFilter === t.value ? styles.tierPillActive : ''}`}
              onClick={() => { setTierFilter(t.value) }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <Card>
        {guestsQuery.isLoading ? (
          <div className={styles.skeletonStack}>
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} style={{ height: 44 }} />)}
          </div>
        ) : visible.length === 0 ? (
          <EmptyState
            title={search || tierFilter !== 'all' ? 'No guests match your filters' : 'No guests yet'}
            description={search || tierFilter !== 'all' ? 'Try adjusting your search or filter.' : 'Register your first guest to start tracking loyalty.'}
          />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Phone</TableHeaderCell>
                <TableHeaderCell>Tier</TableHeaderCell>
                <TableHeaderCell>Visits</TableHeaderCell>
                <TableHeaderCell>Lifetime Spend</TableHeaderCell>
                <TableHeaderCell>Last Seen</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visible.map((guest) => (
                <TableRow key={guest.id}>
                  <TableCell>{guest.name}</TableCell>
                  <TableCell>{guest.phone}</TableCell>
                  <TableCell>
                    <Pill tone={TIER_TONE[guest.tier]}>{guest.tier.charAt(0).toUpperCase() + guest.tier.slice(1)}</Pill>
                  </TableCell>
                  <TableCell className="num">{guest.visits}</TableCell>
                  <TableCell className="num">{formatMoney(guest.lifetimeSpend)}</TableCell>
                  <TableCell>
                    {guest.lastSeenAt ? new Date(guest.lastSeenAt).toLocaleDateString() : '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
}
