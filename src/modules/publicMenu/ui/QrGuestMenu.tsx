import { useMemo, useState } from 'react'
import { Button, Modal, Pill, Segmented, Skeleton } from '../../../shared/ui'
import { formatMoney } from '../../../shared/money'
import { useCreateFactor } from '../../billing'
import { config } from '../../../shared/config'
import type { Id } from '../../../shared/types'
import { usePublishedMenu } from '../application/usePublishedMenu'
import styles from './QrGuestMenu.module.css'

interface CartLine {
  foodId: Id
  qty: number
}

export function QrGuestMenu({ tableId = 'T1' }: { tableId?: string }) {
  const { sections, isLoading } = usePublishedMenu()
  const [activeCategoryId, setActiveCategoryId] = useState<Id | 'all'>('all')
  const [cart, setCart] = useState<CartLine[]>([])
  const [reviewing, setReviewing] = useState(false)
  const [sent, setSent] = useState(false)
  const createFactor = useCreateFactor()

  const foodsById = useMemo(() => {
    const map = new Map<Id, { name: string; price: number }>()
    for (const section of sections) for (const item of section.items) map.set(item.id, item)
    return map
  }, [sections])

  const visibleSections = useMemo(
    () => (activeCategoryId === 'all' ? sections : sections.filter((section) => section.category.id === activeCategoryId)),
    [sections, activeCategoryId],
  )

  const cartCount = cart.reduce((sum, line) => sum + line.qty, 0)
  const cartTotal = cart.reduce((sum, line) => sum + (foodsById.get(line.foodId)?.price ?? 0) * line.qty, 0)

  function addToCart(foodId: Id) {
    setCart((current) => {
      const existing = current.find((line) => line.foodId === foodId)
      if (existing) return current.map((line) => (line.foodId === foodId ? { ...line, qty: line.qty + 1 } : line))
      return [...current, { foodId, qty: 1 }]
    })
  }

  function handleSend() {
    createFactor.mutate(
      {
        tableId,
        servicePct: config.tax.defaultServicePct,
        vatPct: config.tax.defaultVatPct,
        lines: cart.map((line) => ({ foodId: line.foodId, qty: line.qty })),
      },
      {
        onSuccess: () => {
          setSent(true)
          setCart([])
        },
      },
    )
  }

  return (
    <div className={styles.frame}>
      <div className={styles.hero}>
        <span className={styles.heroBrand}>RestoOS</span>
        <span className={styles.heroTable}>Table {tableId}</span>
      </div>

      {isLoading ? (
        <Skeleton style={{ height: 36, margin: 16 }} />
      ) : (
        <div className={styles.pills}>
          <Segmented
            options={[{ value: 'all' as const, label: 'All' }, ...sections.map((section) => ({ value: section.category.id, label: section.category.name }))]}
            value={activeCategoryId}
            onChange={setActiveCategoryId}
            aria-label="Filter by category"
          />
        </div>
      )}

      <div className={styles.items}>
        {visibleSections.map((section) => (
          <section key={section.category.id} className={styles.section}>
            <h2 className={styles.sectionTitle}>{section.category.name}</h2>
            {section.items.map((food) => (
              <div key={food.id} className={styles.itemRow}>
                <div className={styles.itemInfo}>
                  <span className={styles.itemName}>{food.name}</span>
                  {food.description ? <span className={styles.itemDescription}>{food.description}</span> : null}
                  <span className={styles.itemPrice}>{formatMoney(food.price)}</span>
                </div>
                <Button onClick={() => { addToCart(food.id) }}>Add</Button>
              </div>
            ))}
          </section>
        ))}
      </div>

      {cartCount > 0 ? (
        <button type="button" className={styles.viewOrderBar} onClick={() => { setReviewing(true) }}>
          <Pill tone="accent">{cartCount}</Pill>
          View order
          <span className={styles.viewOrderTotal}>{formatMoney(cartTotal)}</span>
        </button>
      ) : null}

      {reviewing ? (
        <Modal title="Your order" onClose={() => { setReviewing(false) }}>
          <ul className={styles.reviewList}>
            {cart.map((line) => {
              const food = foodsById.get(line.foodId)
              if (!food) return null
              return (
                <li key={line.foodId} className={styles.reviewLine}>
                  <span>{line.qty}× {food.name}</span>
                  <span>{formatMoney(food.price * line.qty)}</span>
                </li>
              )
            })}
          </ul>
          {sent ? (
            <p className={styles.sentNote}>Sent to the kitchen — thank you!</p>
          ) : (
            <Button variant="primary" onClick={handleSend} disabled={createFactor.isPending}>
              {createFactor.isPending ? 'Sending…' : 'Send to kitchen'}
            </Button>
          )}
        </Modal>
      ) : null}
    </div>
  )
}
