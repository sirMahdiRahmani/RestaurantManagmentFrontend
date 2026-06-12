import { useState } from 'react'
import { Skeleton } from '../../../shared/ui'
import { formatMoney } from '../../../shared/money'
import { usePublishedMenu } from '../application/usePublishedMenu'
import type { PublishedCategory } from '../domain/types'
import styles from './QrGuestMenu.module.css'

export function QrGuestMenu() {
  const menuQuery = usePublishedMenu()
  const menu = menuQuery.data
  const [selectedCat, setSelectedCat] = useState<string | null>(null)

  const categories = menu?.categories ?? []
  const activeCat: PublishedCategory | undefined =
    categories.find((c) => c.id === selectedCat) ?? categories[0]

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <h1 className={styles.restaurantName}>Saffron House</h1>
        <p className={styles.tagline}>Dine & Enjoy</p>
      </header>

      {menuQuery.isLoading ? (
        <div className={styles.skeletonStack}>
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} style={{ height: 80 }} />)}
        </div>
      ) : menu ? (
        <>
          <div className={styles.categoryPills}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`${styles.catPill} ${activeCat?.id === cat.id ? styles.catPillActive : ''}`}
                onClick={() => { setSelectedCat(cat.id) }}
              >
                {cat.emoji} {cat.name}
              </button>
            ))}
          </div>

          <div className={styles.itemList}>
            {(activeCat?.items ?? []).map((item) => (
              <div key={item.id} className={styles.itemRow}>
                <div className={styles.itemInfo}>
                  <span className={styles.itemName}>{item.name}</span>
                  {item.description ? <span className={styles.itemDesc}>{item.description}</span> : null}
                </div>
                <span className={styles.itemPrice}>{formatMoney(item.price)}</span>
              </div>
            ))}
          </div>
        </>
      ) : null}

      <footer className={styles.footer}>
        <p>Ask your server to place an order</p>
      </footer>
    </div>
  )
}
