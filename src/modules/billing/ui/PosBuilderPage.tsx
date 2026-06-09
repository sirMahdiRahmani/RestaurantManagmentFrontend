import { useState } from 'react'
import { Button, Card, EmptyState, Field, Input, Pill, Skeleton } from '../../../shared/ui'
import { formatMoney } from '../../../shared/money'
import { config } from '../../../shared/config'
import { useFoods, useCategories } from '../../menu'
import type { DraftLine } from '../domain/types'
import { subtotal, serviceAmount, vatAmount, totalAmount } from '../domain/totals'
import { useCreateFactor, useSettleFactor } from '../application/useFactors'
import type { Factor } from '../domain/types'
import styles from './PosBuilderPage.module.css'

export function PosBuilderPage() {
  const [tableId, setTableId] = useState('Table 1')
  const [selectedCat, setSelectedCat] = useState<string | null>(null)
  const [draft, setDraft] = useState<DraftLine[]>([])
  const [settledFactor, setSettledFactor] = useState<Factor | null>(null)
  const [error, setError] = useState<string | null>(null)

  const categoriesQuery = useCategories()
  const foodsQuery = useFoods(selectedCat ?? undefined)
  const createFactor = useCreateFactor()
  const settleFactor = useSettleFactor()

  const categories = categoriesQuery.data ?? []
  const allFoods = (foodsQuery.data ?? []).filter((f) => f.isActive)

  const sub = subtotal(draft)
  const svc = serviceAmount(sub, config.tax.defaultServicePct)
  const vat = vatAmount(sub, config.tax.defaultVatPct)
  const total = totalAmount(sub, config.tax.defaultServicePct, config.tax.defaultVatPct)

  function addItem(food: { id: string; name: string; price: number }) {
    setDraft((prev) => {
      const existing = prev.find((l) => l.foodId === food.id)
      if (existing) {
        return prev.map((l) => l.foodId === food.id ? { ...l, qty: l.qty + 1 } : l)
      }
      return [...prev, { foodId: food.id, foodName: food.name, unitPrice: food.price, qty: 1 }]
    })
  }

  function setQty(foodId: string, qty: number) {
    if (qty <= 0) {
      setDraft((prev) => prev.filter((l) => l.foodId !== foodId))
    } else {
      setDraft((prev) => prev.map((l) => l.foodId === foodId ? { ...l, qty } : l))
    }
  }

  async function handleSettle() {
    if (draft.length === 0) return
    if (!tableId.trim()) { setError('Enter a table ID'); return }
    setError(null)
    try {
      const factor = await createFactor.mutateAsync({
        tableId: tableId.trim(),
        servicePct: config.tax.defaultServicePct,
        vatPct: config.tax.defaultVatPct,
        lines: draft.map((l) => ({ foodId: l.foodId, qty: l.qty })),
      })
      const settled = await settleFactor.mutateAsync(factor.id)
      setSettledFactor(settled)
      setDraft([])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Settlement failed')
    }
  }

  function handleNewOrder() {
    setSettledFactor(null)
    setTableId('Table 1')
    setDraft([])
    setError(null)
  }

  if (settledFactor) {
    return <Receipt factor={settledFactor} onNewOrder={handleNewOrder} />
  }

  const isPending = createFactor.isPending || settleFactor.isPending

  return (
    <div className={styles.page}>
      <div className={styles.picker}>
        <header className={styles.pickerHeader}>
          <h1 className={styles.title}>POS</h1>
          <Field label="Table">
            <Input
              value={tableId}
              onChange={(e) => { setTableId(e.target.value) }}
              placeholder="e.g. Table 1"
              style={{ width: 120 }}
            />
          </Field>
        </header>

        <div className={styles.categoryPills}>
          <button
            className={`${styles.catPill} ${selectedCat === null ? styles.catPillActive : ''}`}
            onClick={() => { setSelectedCat(null) }}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`${styles.catPill} ${selectedCat === cat.id ? styles.catPillActive : ''}`}
              onClick={() => { setSelectedCat(cat.id) }}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>

        {foodsQuery.isLoading ? (
          <div className={styles.gridSkeleton}>
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} style={{ height: 72 }} />)}
          </div>
        ) : allFoods.length === 0 ? (
          <EmptyState title="No items" description="No active items in this category." />
        ) : (
          <div className={styles.itemGrid}>
            {allFoods.map((food) => {
              const inOrder = draft.find((l) => l.foodId === food.id)
              return (
                <button
                  key={food.id}
                  className={`${styles.itemCard} ${inOrder ? styles.itemCardActive : ''}`}
                  onClick={() => { addItem(food) }}
                >
                  <span className={styles.itemName}>{food.name}</span>
                  <span className={styles.itemPrice}>{formatMoney(food.price)}</span>
                  {inOrder ? <span className={styles.itemBadge}>{inOrder.qty}</span> : null}
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className={styles.orderPanel}>
        <h2 className={styles.orderTitle}>Order · {tableId}</h2>

        {draft.length === 0 ? (
          <p className={styles.emptyOrder}>Tap items to add them to the order.</p>
        ) : (
          <div className={styles.orderLines}>
            {draft.map((line) => (
              <div key={line.foodId} className={styles.orderLine}>
                <span className={styles.orderLineName}>{line.foodName}</span>
                <div className={styles.qtyControls}>
                  <button className={styles.qtyBtn} onClick={() => { setQty(line.foodId, line.qty - 1) }}>−</button>
                  <span className={styles.qty}>{line.qty}</span>
                  <button className={styles.qtyBtn} onClick={() => { setQty(line.foodId, line.qty + 1) }}>+</button>
                </div>
                <span className={styles.lineTotal}>{formatMoney(line.unitPrice * line.qty)}</span>
              </div>
            ))}
          </div>
        )}

        <div className={styles.totals}>
          <div className={styles.totalsRow}>
            <span>Subtotal</span><span>{formatMoney(sub)}</span>
          </div>
          <div className={styles.totalsRow}>
            <span>Service ({config.tax.defaultServicePct}%)</span><span>{formatMoney(svc)}</span>
          </div>
          <div className={styles.totalsRow}>
            <span>VAT ({config.tax.defaultVatPct}%)</span><span>{formatMoney(vat)}</span>
          </div>
          <div className={`${styles.totalsRow} ${styles.totalsTotal}`}>
            <span>Total</span><span>{formatMoney(total)}</span>
          </div>
        </div>

        {error ? <p className={styles.errorMsg}>{error}</p> : null}

        <div className={styles.orderActions}>
          <Button variant="ghost" onClick={() => { setDraft([]) }} disabled={draft.length === 0 || isPending}>
            Clear
          </Button>
          <Button
            variant="primary"
            onClick={() => { void handleSettle() }}
            disabled={draft.length === 0 || isPending}
          >
            {isPending ? 'Processing…' : 'Settle'}
          </Button>
        </div>
      </div>
    </div>
  )
}

function Receipt({ factor, onNewOrder }: { factor: Factor; onNewOrder: () => void }) {
  return (
    <div className={styles.receiptWrap}>
      <Card>
        <div className={styles.receipt}>
          <div className={styles.receiptHeader}>
            <Pill tone="ok">Paid</Pill>
            <h2 className={styles.receiptTitle}>Receipt · {factor.tableId}</h2>
            <p className={styles.receiptMeta}>{new Date(factor.printedAt ?? factor.updatedAt).toLocaleString()}</p>
          </div>

          <div className={styles.receiptLines}>
            {factor.lines.map((line) => (
              <div key={line.id} className={styles.receiptLine}>
                <span>{line.qty}×</span>
                <span className={styles.receiptLineName}>{line.foodId}</span>
                <span>{formatMoney(line.lineTotal)}</span>
              </div>
            ))}
          </div>

          <div className={styles.receiptTotals}>
            <div className={styles.totalsRow}><span>Subtotal</span><span>{formatMoney(factor.subtotal)}</span></div>
            <div className={styles.totalsRow}><span>Service ({factor.servicePct}%)</span><span>{formatMoney(Math.round(factor.subtotal * factor.servicePct / 100))}</span></div>
            <div className={styles.totalsRow}><span>VAT ({factor.vatPct}%)</span><span>{formatMoney(Math.round(factor.subtotal * factor.vatPct / 100))}</span></div>
            <div className={`${styles.totalsRow} ${styles.totalsTotal}`}><span>Total</span><span>{formatMoney(factor.total)}</span></div>
          </div>

          <Button variant="primary" onClick={onNewOrder}>New order</Button>
        </div>
      </Card>
    </div>
  )
}
