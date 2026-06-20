import { Card } from '../../../shared/ui'
import { Barline } from '../../../shared/ui'
import type { DaySales } from '../domain/metrics'
import styles from './DashboardPage.module.css'

export interface SalesBarsProps {
  sales: DaySales[]
}

export function SalesBars({ sales }: SalesBarsProps) {
  const labels = sales.map((day) => new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' }))
  return (
    <Card>
      <h2 className={styles.cardTitle}>Sales — last 7 days</h2>
      <Barline values={sales.map((day) => day.total)} labels={labels} />
    </Card>
  )
}
