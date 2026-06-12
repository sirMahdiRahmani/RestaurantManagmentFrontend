import { Skeleton } from '../../../shared/ui'
import { formatMoney } from '../../../shared/money'
import { usePublishedMenu } from '../application/usePublishedMenu'
import styles from './MenuBoard.module.css'

export function MenuBoard() {
  const menuQuery = usePublishedMenu()
  const menu = menuQuery.data

  return (
    <div className={styles.board}>
      <header className={styles.boardHeader}>
        <h1 className={styles.boardTitle}>Saffron House</h1>
        <span className={styles.liveTag}>● Live</span>
      </header>

      {menuQuery.isLoading ? (
        <div className={styles.skeletonGrid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} style={{ height: 180, background: 'rgba(255,255,255,0.05)' }} />
          ))}
        </div>
      ) : menu ? (
        <div className={styles.categoriesGrid}>
          {menu.categories.map((cat) => (
            <div key={cat.id} className={styles.category}>
              <h2 className={styles.catTitle}>{cat.emoji} {cat.name}</h2>
              <div className={styles.items}>
                {cat.items.map((item) => (
                  <div key={item.id} className={styles.item}>
                    <span className={styles.itemName}>{item.name}</span>
                    <span className={styles.dots} />
                    <span className={styles.itemPrice}>{formatMoney(item.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <footer className={styles.boardFooter}>
        <span>Prices include tax where applicable</span>
      </footer>
    </div>
  )
}
