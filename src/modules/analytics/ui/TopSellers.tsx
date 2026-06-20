import { Card, EmptyState } from '../../../shared/ui'
import styles from './DashboardPage.module.css'

export interface TopSellersProps {
  sellers: Array<{ foodId: string; name: string; qty: number }>
}

export function TopSellers({ sellers }: TopSellersProps) {
  return (
    <Card>
      <h2 className={styles.cardTitle}>Top sellers</h2>
      {sellers.length === 0 ? (
        <EmptyState title="No sales yet" />
      ) : (
        <ul className={styles.sellerList}>
          {sellers.map((seller, index) => (
            <li key={seller.foodId} className={styles.sellerRow}>
              <span className={styles.sellerThumb} aria-hidden="true">
                {index + 1}
              </span>
              <span className={styles.sellerName}>{seller.name}</span>
              <span className={styles.sellerQty}>{seller.qty} sold</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
