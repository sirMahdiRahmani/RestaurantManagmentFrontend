import type { TopSeller } from '../domain/types'
import styles from './TopSellers.module.css'

interface TopSellersProps {
  sellers: TopSeller[]
}

export function TopSellers({ sellers }: TopSellersProps) {
  const max = Math.max(...sellers.map((s) => s.qtySold), 1)

  return (
    <div className={styles.list}>
      {sellers.map((seller, i) => (
        <div key={seller.foodId} className={styles.row}>
          <span className={styles.rank}>{i + 1}</span>
          <div className={styles.info}>
            <span className={styles.name}>{seller.foodName}</span>
            <div className={styles.bar} style={{ inlineSize: `${(seller.qtySold / max) * 100}%` }} />
          </div>
          <span className={styles.qty}>{seller.qtySold} sold</span>
        </div>
      ))}
    </div>
  )
}
