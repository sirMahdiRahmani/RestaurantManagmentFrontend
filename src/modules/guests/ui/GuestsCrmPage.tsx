import { useMemo, useState } from 'react'
import { Button, Card, EmptyState, Field, Input, KpiCard, Segmented, Skeleton } from '../../../shared/ui'
import { formatMoney } from '../../../shared/money'
import { useGuests } from '../application/useGuests'
import type { Guest, GuestTier } from '../domain/types'
import { GuestTable } from './GuestTable'
import { GuestProfile } from './GuestProfile'
import { OnboardingForm } from './OnboardingForm'
import styles from './GuestsCrmPage.module.css'

const tierOptions: Array<{ value: GuestTier | 'all'; label: string }> = [
  { value: 'all', label: 'All tiers' },
  { value: 'member', label: 'Member' },
  { value: 'silver', label: 'Silver' },
  { value: 'gold', label: 'Gold' },
  { value: 'platinum', label: 'Platinum' },
]

export function GuestsCrmPage() {
  const guestsQuery = useGuests()
  const [search, setSearch] = useState('')
  const [tier, setTier] = useState<GuestTier | 'all'>('all')
  const [selected, setSelected] = useState<Guest | null>(null)
  const [onboarding, setOnboarding] = useState(false)

  const guests = useMemo(() => guestsQuery.data ?? [], [guestsQuery.data])

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase()
    return guests.filter((guest) => {
      const matchesQuery =
        !query || guest.name.toLowerCase().includes(query) || guest.phone.toLowerCase().includes(query)
      const matchesTier = tier === 'all' || guest.tier === tier
      return matchesQuery && matchesTier
    })
  }, [guests, search, tier])

  const totalLifetimeSpend = useMemo(
    () => guests.reduce((sum, guest) => sum + guest.lifetimeSpend, 0),
    [guests],
  )
  const repeatGuests = useMemo(() => guests.filter((guest) => guest.visits > 1).length, [guests])

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Guests</h1>
          <p className={styles.subtitle}>Loyalty CRM — track visits, spend and tiers.</p>
        </div>
        <Button variant="primary" onClick={() => { setOnboarding(true) }}>
          New guest
        </Button>
      </header>

      <div className={styles.kpiRow}>
        <KpiCard label="Total guests" value={guests.length} />
        <KpiCard label="Repeat guests" value={repeatGuests} />
        <KpiCard label="Lifetime spend" value={formatMoney(totalLifetimeSpend)} />
      </div>

      <div className={styles.filters}>
        <Field label="Search guests">
          <Input
            value={search}
            onChange={(event) => { setSearch(event.target.value) }}
            placeholder="Search by name or phone…"
          />
        </Field>
        <Segmented options={tierOptions} value={tier} onChange={setTier} aria-label="Filter by tier" />
      </div>

      <Card>
        {guestsQuery.isLoading ? (
          <div className={styles.skeletonStack}>
            <Skeleton style={{ height: 44 }} />
            <Skeleton style={{ height: 44 }} />
            <Skeleton style={{ height: 44 }} />
          </div>
        ) : visible.length === 0 ? (
          <EmptyState
            title={search || tier !== 'all' ? 'No guests match your filters' : 'No guests yet'}
            description={search || tier !== 'all' ? 'Try a different search or tier.' : 'Onboard a guest to start tracking loyalty.'}
          />
        ) : (
          <GuestTable guests={visible} onSelect={setSelected} />
        )}
      </Card>

      {selected ? <GuestProfile guest={selected} onClose={() => { setSelected(null) }} /> : null}
      {onboarding ? <OnboardingForm onClose={() => { setOnboarding(false) }} /> : null}
    </div>
  )
}
