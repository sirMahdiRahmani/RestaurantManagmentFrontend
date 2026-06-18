import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Field, Input, Pill, Segmented, Skeleton } from '../../../shared/ui'
import { useCategories, useFoods } from '../../menu'
import type { Id } from '../../../shared/types'
import { config } from '../../../shared/config'
import { computeTotals, subtotalOf } from '../domain/totals'
import { addToCart, changeQty, removeFromCart, type CartLine } from '../domain/cart'
import { useCreateFactor, useSettleFactor } from '../application/useFactors'
import { ItemGrid } from './ItemGrid'
import { OrderPanel } from './OrderPanel'
import { TotalsBlock } from './TotalsBlock'
import { ReceiptPreview } from './ReceiptPreview'
import styles from './PosBuilderPage.module.css'

export function PosBuilderPage() {
  const navigate = useNavigate()
  const categoriesQuery = useCategories()
  const foodsQuery = useFoods()
  const [categoryId, setCategoryId] = useState<Id | 'all'>('all')
  const [tableId, setTableId] = useState('T1')
  const [lines, setLines] = useState<CartLine[]>([])
  const [heldFactorId, setHeldFactorId] = useState<Id | null>(null)
  const createFactor = useCreateFactor()
  const settleFactor = useSettleFactor()

  const foods = useMemo(() => foodsQuery.data ?? [], [foodsQuery.data])
  const categories = useMemo(() => categoriesQuery.data ?? [], [categoriesQuery.data])
  const visibleFoods = useMemo(
    () => (categoryId === 'all' ? foods : foods.filter((food) => food.categoryId === categoryId)),
    [foods, categoryId],
  )
  const foodsById = useMemo(() => new Map(foods.map((food) => [food.id, food])), [foods])

  const subtotal = useMemo(
    () =>
      subtotalOf(
        lines
          .map((line) => ({ unitPrice: foodsById.get(line.foodId)?.price ?? 0, qty: line.qty }))
          .filter((line) => line.unitPrice > 0),
      ),
    [lines, foodsById],
  )
  const totals = computeTotals(subtotal, config.tax.defaultServicePct, config.tax.defaultVatPct)

  const segmentedOptions = useMemo(
    () => [{ value: 'all' as const, label: 'All' }, ...categories.map((category) => ({ value: category.id, label: category.name }))],
    [categories],
  )

  function handleHold() {
    createFactor.mutate(
      {
        tableId,
        servicePct: config.tax.defaultServicePct,
        vatPct: config.tax.defaultVatPct,
        lines: lines.map((line) => ({ foodId: line.foodId, qty: line.qty })),
      },
      { onSuccess: (factor) => { setHeldFactorId(factor.id) } },
    )
  }

  function handlePrint() {
    if (heldFactorId) navigate(`/billing/factors/${heldFactorId}/print`)
  }

  function handleCharge() {
    if (heldFactorId) {
      settleFactor.mutate(heldFactorId, { onSuccess: () => { resetOrder() } })
      return
    }
    createFactor.mutate(
      {
        tableId,
        servicePct: config.tax.defaultServicePct,
        vatPct: config.tax.defaultVatPct,
        lines: lines.map((line) => ({ foodId: line.foodId, qty: line.qty })),
      },
      {
        onSuccess: (factor) => {
          settleFactor.mutate(factor.id, { onSuccess: () => { resetOrder() } })
        },
      },
    )
  }

  function resetOrder() {
    setLines([])
    setHeldFactorId(null)
  }

  const isLoading = categoriesQuery.isLoading || foodsQuery.isLoading

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>New order</h1>
          <p className={styles.subtitle}>Build the order, then print or charge.</p>
        </div>
        <div className={styles.headerActions}>
          {heldFactorId ? <Pill tone="warn">Held</Pill> : null}
          <Field label="Table">
            <Input value={tableId} onChange={(event) => { setTableId(event.target.value) }} style={{ width: 100 }} />
          </Field>
        </div>
      </header>

      <div className={styles.layout}>
        <div className={styles.builder}>
          {isLoading ? (
            <Skeleton style={{ height: 36, width: 280 }} />
          ) : (
            <Segmented options={segmentedOptions} value={categoryId} onChange={setCategoryId} aria-label="Filter by category" />
          )}
          <Card>
            {isLoading ? (
              <div className={styles.skeletonGrid}>
                <Skeleton style={{ height: 76 }} />
                <Skeleton style={{ height: 76 }} />
                <Skeleton style={{ height: 76 }} />
                <Skeleton style={{ height: 76 }} />
              </div>
            ) : (
              <ItemGrid foods={visibleFoods} onAdd={(food) => { setLines((current) => addToCart(current, food.id)) }} />
            )}
          </Card>
        </div>

        <div className={styles.orderColumn}>
          <Card className={styles.orderCard}>
            <h2 className={styles.orderTitle}>Order</h2>
            <OrderPanel
              lines={lines}
              foodsById={foodsById}
              onChangeQty={(foodId, delta) => { setLines((current) => changeQty(current, foodId, delta)) }}
              onRemove={(foodId) => { setLines((current) => removeFromCart(current, foodId)) }}
            />
            <TotalsBlock totals={totals} servicePct={config.tax.defaultServicePct} vatPct={config.tax.defaultVatPct} />
            <div className={styles.actions}>
              <Button onClick={handleHold} disabled={lines.length === 0 || createFactor.isPending}>
                Hold
              </Button>
              <Button onClick={handlePrint} disabled={!heldFactorId}>
                Print
              </Button>
              <Button
                variant="primary"
                onClick={handleCharge}
                disabled={lines.length === 0 || createFactor.isPending || settleFactor.isPending}
              >
                Charge
              </Button>
            </div>
          </Card>
          <Card>
            <ReceiptPreview tableId={tableId} lines={lines} foodsById={foodsById} totals={totals} />
          </Card>
        </div>
      </div>
    </div>
  )
}
