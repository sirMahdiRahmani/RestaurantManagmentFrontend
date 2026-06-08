import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, EmptyState, Field, Input, Pill, Skeleton } from '../../../shared/ui'
import { useAdjustStock, useIngredients } from '../application/useIngredients'
import type { Ingredient } from '../domain/types'
import { StockTable } from './StockTable'
import styles from './InventoryPage.module.css'

export function InventoryPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const ingredientsQuery = useIngredients()
  const adjustStock = useAdjustStock()
  const [pendingId, setPendingId] = useState<string | null>(null)

  const ingredients = useMemo(() => ingredientsQuery.data ?? [], [ingredientsQuery.data])
  const lowStockCount = useMemo(() => ingredients.filter((item) => item.isLowStock).length, [ingredients])

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase()
    return query ? ingredients.filter((item) => item.name.toLowerCase().includes(query)) : ingredients
  }, [ingredients, search])

  function handleAdjust(ingredient: Ingredient, delta: number) {
    setPendingId(ingredient.id)
    adjustStock.mutate(
      { id: ingredient.id, input: { delta, reason: delta > 0 ? 'Manual increase' : 'Manual correction' } },
      { onSettled: () => { setPendingId(null) } },
    )
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Inventory</h1>
          <p className={styles.subtitle}>Track stock levels against par and receive new deliveries.</p>
        </div>
        <div className={styles.headerActions}>
          {lowStockCount > 0 ? <Pill tone="warn">{lowStockCount} low on stock</Pill> : null}
          <Button variant="primary" onClick={() => { navigate('/inventory/stock-in') }}>
            Record stock-in
          </Button>
        </div>
      </header>

      <Field label="Search ingredients">
        <Input
          value={search}
          onChange={(event) => { setSearch(event.target.value) }}
          placeholder="Search by name…"
        />
      </Field>

      <Card>
        {ingredientsQuery.isLoading ? (
          <div className={styles.skeletonStack}>
            <Skeleton style={{ height: 44 }} />
            <Skeleton style={{ height: 44 }} />
            <Skeleton style={{ height: 44 }} />
            <Skeleton style={{ height: 44 }} />
          </div>
        ) : visible.length === 0 ? (
          <EmptyState
            title={search ? 'No ingredients match your search' : 'No ingredients yet'}
            description={search ? 'Try a different search term.' : 'Receive a delivery to start tracking stock.'}
          />
        ) : (
          <StockTable ingredients={visible} onAdjust={handleAdjust} pendingId={pendingId} />
        )}
      </Card>
    </div>
  )
}
