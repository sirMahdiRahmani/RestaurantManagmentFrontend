import { useState } from 'react'
import { Button, EmptyState, Pill, Skeleton } from '../../../shared/ui'
import { formatMoney } from '../../../shared/money'
import { usePublishedMenu } from '../application/usePublishedMenu'
import styles from './MenuBoard.module.css'

export function MenuBoard() {
  const { sections, isLoading } = usePublishedMenu()
  const [publishedAt, setPublishedAt] = useState<string | null>(null)

  async function handleCopyLink() {
    await navigator.clipboard.writeText(`${window.location.origin}/public-menu`).catch(() => undefined)
  }

  return (
    <div className={styles.board}>
      <header className={styles.header}>
        <div className={styles.brand}>RestoOS</div>
        <div className={styles.headerRight}>
          <Pill tone="ok">● Live · auto-synced</Pill>
          <Button variant="ghost" onClick={() => { void handleCopyLink() }}>
            Copy link
          </Button>
          <Button variant="primary" onClick={() => { setPublishedAt(new Date().toLocaleTimeString()) }}>
            Publish
          </Button>
        </div>
      </header>
      {publishedAt ? <p className={styles.publishedNote}>Published at {publishedAt}</p> : null}

      {isLoading ? (
        <div className={styles.skeletonGrid}>
          <Skeleton style={{ height: 220 }} />
          <Skeleton style={{ height: 220 }} />
        </div>
      ) : sections.length === 0 ? (
        <EmptyState title="Nothing on the board yet" description="Mark foods active and show-on-menu to publish them here." />
      ) : (
        <div className={styles.columns}>
          {sections.map((section) => (
            <section key={section.category.id} className={styles.section}>
              <h2 className={styles.sectionTitle} style={{ color: section.category.color }}>
                {section.category.emoji} {section.category.name}
              </h2>
              <ul className={styles.itemList}>
                {section.items.map((food) => (
                  <li key={food.id} className={styles.item}>
                    <span className={styles.itemName}>{food.name}</span>
                    <span className={styles.itemDots} aria-hidden="true" />
                    <span className={styles.itemPrice}>{formatMoney(food.price)}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
