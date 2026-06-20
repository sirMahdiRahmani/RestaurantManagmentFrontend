import type { Food } from '../../menu'
import { formatMoney } from '../../../shared/money'
import { lineTotal, type FactorTotals } from '../domain/totals'
import type { CartLine } from '../domain/cart'
import styles from './PosBuilderPage.module.css'

export interface ReceiptPreviewProps {
  tableId: string
  lines: CartLine[]
  foodsById: Map<string, Food>
  totals: FactorTotals
}

/** Live thermal-receipt-style preview of the current order. */
export function ReceiptPreview({ tableId, lines, foodsById, totals }: ReceiptPreviewProps) {
  return (
    <div className={styles.receipt}>
      <div className={styles.receiptHeader}>
        <strong>RestoOS</strong>
        <span>Table {tableId || '—'}</span>
      </div>
      <div className={styles.receiptDivider} />
      {lines.length === 0 ? (
        <p className={styles.receiptEmpty}>No items yet</p>
      ) : (
        <ul className={styles.receiptLines}>
          {lines.map((line) => {
            const food = foodsById.get(line.foodId)
            if (!food) return null
            return (
              <li key={line.foodId} className={styles.receiptLine}>
                <span>
                  {line.qty}× {food.name}
                </span>
                <span>{formatMoney(lineTotal(food.price, line.qty))}</span>
              </li>
            )
          })}
        </ul>
      )}
      <div className={styles.receiptDivider} />
      <div className={styles.receiptLine}>
        <span>Total</span>
        <strong>{formatMoney(totals.total)}</strong>
      </div>
    </div>
  )
}
