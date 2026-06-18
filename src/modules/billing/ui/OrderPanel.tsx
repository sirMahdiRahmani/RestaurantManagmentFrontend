import type { Food } from '../../menu'
import { Icon } from '../../../shared/ui'
import { formatMoney } from '../../../shared/money'
import { lineTotal } from '../domain/totals'
import type { CartLine } from '../domain/cart'
import styles from './PosBuilderPage.module.css'

export interface OrderPanelProps {
  lines: CartLine[]
  foodsById: Map<string, Food>
  onChangeQty: (foodId: string, delta: number) => void
  onRemove: (foodId: string) => void
}

export function OrderPanel({ lines, foodsById, onChangeQty, onRemove }: OrderPanelProps) {
  if (lines.length === 0) {
    return <p className={styles.emptyOrder}>Tap a dish to add it to the order.</p>
  }

  return (
    <ul className={styles.orderList}>
      {lines.map((line) => {
        const food = foodsById.get(line.foodId)
        if (!food) return null
        return (
          <li key={line.foodId} className={styles.orderLine}>
            <div className={styles.orderLineInfo}>
              <span className={styles.orderLineName}>{food.name}</span>
              <span className={styles.orderLineTotal}>{formatMoney(lineTotal(food.price, line.qty))}</span>
            </div>
            <div className={styles.orderLineActions}>
              <button type="button" aria-label={`Decrease ${food.name}`} onClick={() => { onChangeQty(line.foodId, -1) }}>
                <Icon name="minus" size={14} />
              </button>
              <span className={styles.orderLineQty}>{line.qty}</span>
              <button type="button" aria-label={`Increase ${food.name}`} onClick={() => { onChangeQty(line.foodId, 1) }}>
                <Icon name="plus" size={14} />
              </button>
              <button type="button" aria-label={`Remove ${food.name}`} onClick={() => { onRemove(line.foodId) }}>
                <Icon name="trash" size={14} />
              </button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
