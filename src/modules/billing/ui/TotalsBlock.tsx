import { formatMoney } from '../../../shared/money'
import type { FactorTotals } from '../domain/totals'
import styles from './PosBuilderPage.module.css'

export interface TotalsBlockProps {
  totals: FactorTotals
  servicePct: number
  vatPct: number
}

export function TotalsBlock({ totals, servicePct, vatPct }: TotalsBlockProps) {
  return (
    <dl className={styles.totals}>
      <div className={styles.totalRow}>
        <dt>Subtotal</dt>
        <dd>{formatMoney(totals.subtotal)}</dd>
      </div>
      <div className={styles.totalRow}>
        <dt>Service ({servicePct}%)</dt>
        <dd>{formatMoney(totals.serviceAmount)}</dd>
      </div>
      <div className={styles.totalRow}>
        <dt>VAT ({vatPct}%)</dt>
        <dd>{formatMoney(totals.vatAmount)}</dd>
      </div>
      <div className={[styles.totalRow, styles.totalRowGrand].join(' ')}>
        <dt>Total</dt>
        <dd>{formatMoney(totals.total)}</dd>
      </div>
    </dl>
  )
}
