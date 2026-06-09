import { formatMoney } from '../../../shared/money'
import type { SalesDay } from '../domain/types'
import styles from './SalesBars.module.css'

interface SalesBarsProps {
  data: SalesDay[]
}

export function SalesBars({ data }: SalesBarsProps) {
  const max = Math.max(...data.map((d) => d.total), 1)

  return (
    <div className={styles.chart}>
      <div className={styles.bars}>
        {data.map((day) => {
          const heightPct = (day.total / max) * 100
          const label = day.date.slice(5) // MM-DD
          return (
            <div key={day.date} className={styles.barCol}>
              <span className={styles.barValue}>{formatMoney(day.total)}</span>
              <div className={styles.barTrack}>
                <div className={styles.bar} style={{ blockSize: `${heightPct}%` }} />
              </div>
              <span className={styles.barLabel}>{label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
