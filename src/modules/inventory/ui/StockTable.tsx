import { Pill, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '../../../shared/ui'
import { formatMoney } from '../../../shared/money'
import type { Ingredient } from '../domain/types'
import styles from './InventoryPage.module.css'

export interface StockTableProps {
  ingredients: Ingredient[]
  onAdjust: (ingredient: Ingredient, delta: number) => void
  pendingId: string | null
}

export function StockTable({ ingredients, onAdjust, pendingId }: StockTableProps) {
  return (
    <Table aria-label="Ingredient stock levels">
      <TableHead>
        <TableRow>
          <TableHeaderCell scope="col">Ingredient</TableHeaderCell>
          <TableHeaderCell scope="col">On hand</TableHeaderCell>
          <TableHeaderCell scope="col">Par level</TableHeaderCell>
          <TableHeaderCell scope="col">Unit cost</TableHeaderCell>
          <TableHeaderCell scope="col">Status</TableHeaderCell>
          <TableHeaderCell scope="col">Quick adjust</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {ingredients.map((ingredient) => {
          const ratio = ingredient.parLevel > 0 ? ingredient.onHandQty / ingredient.parLevel : 1
          const fillColor = ingredient.isLowStock ? 'var(--danger)' : 'var(--ok)'
          const isPending = pendingId === ingredient.id

          return (
            <TableRow key={ingredient.id}>
              <TableCell>
                <span style={{ fontWeight: 600 }}>{ingredient.name}</span>
              </TableCell>
              <TableCell>
                <div className={styles.qtyCell}>
                  <span>
                    {ingredient.onHandQty} {ingredient.unit}
                  </span>
                  <span className={styles.levelBar} aria-hidden="true">
                    <span
                      className={styles.levelFill}
                      style={{ inlineSize: `${Math.min(100, Math.round(ratio * 100))}%`, background: fillColor }}
                    />
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {ingredient.parLevel} {ingredient.unit}
              </TableCell>
              <TableCell>{formatMoney(ingredient.unitCost)}</TableCell>
              <TableCell>
                <Pill tone={ingredient.isLowStock ? 'warn' : 'ok'}>
                  {ingredient.isLowStock ? 'Reorder' : 'OK'}
                </Pill>
              </TableCell>
              <TableCell>
                <span className={styles.adjustButtons}>
                  <button
                    type="button"
                    className={styles.adjustButton}
                    aria-label={`Decrease ${ingredient.name} by one ${ingredient.unit}`}
                    disabled={isPending}
                    onClick={() => { onAdjust(ingredient, -1) }}
                  >
                    −
                  </button>
                  <button
                    type="button"
                    className={styles.adjustButton}
                    aria-label={`Increase ${ingredient.name} by one ${ingredient.unit}`}
                    disabled={isPending}
                    onClick={() => { onAdjust(ingredient, 1) }}
                  >
                    +
                  </button>
                </span>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
