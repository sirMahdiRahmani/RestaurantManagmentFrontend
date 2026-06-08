import { Card, Pill } from '../../../shared/ui'
import { formatMoney } from '../../../shared/money'
import styles from './CostSummary.module.css'

export interface CostSummaryProps {
  price: number
  foodCost: number
  margin: number
}

export function CostSummary({ price, foodCost, margin }: CostSummaryProps) {
  const marginPct = Math.round(margin * 100)
  const tone = marginPct >= 60 ? 'ok' : marginPct >= 40 ? 'warn' : 'danger'

  return (
    <Card>
      <div className={styles.summary}>
        <div className={styles.stat}>
          <span className={styles.label}>Menu price</span>
          <span className={styles.value}>{formatMoney(price)}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>Food cost</span>
          <span className={styles.value}>{formatMoney(foodCost)}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>Margin</span>
          <span className={styles.value}>
            <Pill tone={tone}>{marginPct}%</Pill>
          </span>
        </div>
      </div>
    </Card>
  )
}
