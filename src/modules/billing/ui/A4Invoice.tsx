import type { Factor } from '../domain/types'
import { formatMoney } from '../../../shared/money'
import styles from './A4Invoice.module.css'

interface A4InvoiceProps {
  factor: Factor
  restaurantName?: string
}

export function A4Invoice({ factor, restaurantName = 'Saffron House Restaurant' }: A4InvoiceProps) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.restaurantName}>{restaurantName}</h1>
        <div className={styles.invoiceMeta}>
          <p>Invoice #: {factor.id.slice(-8).toUpperCase()}</p>
          <p>Table: {factor.tableId}</p>
          <p>Date: {new Date(factor.createdAt).toLocaleDateString()}</p>
          <p>Status: <strong>{factor.status === 'paid' ? 'PAID' : 'UNPAID'}</strong></p>
        </div>
      </header>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Item</th>
            <th className={styles.right}>Qty</th>
            <th className={styles.right}>Unit Price</th>
            <th className={styles.right}>Total</th>
          </tr>
        </thead>
        <tbody>
          {factor.lines.map((line) => (
            <tr key={line.id}>
              <td>{line.foodId}</td>
              <td className={styles.right}>{line.qty}</td>
              <td className={styles.right}>{formatMoney(line.unitPrice)}</td>
              <td className={styles.right}>{formatMoney(line.lineTotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.totals}>
        <div className={styles.totalsRow}><span>Subtotal</span><span>{formatMoney(factor.subtotal)}</span></div>
        <div className={styles.totalsRow}><span>Service ({factor.servicePct}%)</span><span>{formatMoney(Math.round(factor.subtotal * factor.servicePct / 100))}</span></div>
        <div className={styles.totalsRow}><span>VAT ({factor.vatPct}%)</span><span>{formatMoney(Math.round(factor.subtotal * factor.vatPct / 100))}</span></div>
        <div className={`${styles.totalsRow} ${styles.totalsFinal}`}><span>Total</span><span>{formatMoney(factor.total)}</span></div>
      </div>

      <footer className={styles.footer}>
        <p>Thank you for dining with us!</p>
        <div className={styles.signatureLine}>Signature: ___________________________</div>
      </footer>
    </div>
  )
}
