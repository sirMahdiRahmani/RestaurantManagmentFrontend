import { useNavigate } from 'react-router-dom'
import { Button, Card, Skeleton } from '../../../shared/ui'
import { usePublishedMenu } from '../application/usePublishedMenu'
import styles from './PublicMenuPage.module.css'

export function PublicMenuPage() {
  const navigate = useNavigate()
  const menuQuery = usePublishedMenu()
  const menu = menuQuery.data
  const totalItems = menu?.categories.reduce((sum, cat) => sum + cat.items.length, 0) ?? 0

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Public Menu</h1>
          <p className={styles.subtitle}>
            Share your live menu with guests — board display or QR scan.
          </p>
        </div>
      </header>

      <div className={styles.cards}>
        <Card>
          <div className={styles.optionCard}>
            <div className={styles.optionIcon}>📺</div>
            <div className={styles.optionContent}>
              <h2 className={styles.optionTitle}>Menu Board</h2>
              <p className={styles.optionDesc}>
                Full-screen display for a TV or monitor. Shows all active items grouped by category.
              </p>
              {menuQuery.isLoading ? (
                <Skeleton style={{ height: 16, width: 120 }} />
              ) : (
                <p className={styles.optionMeta}>{totalItems} items · {menu?.categories.length ?? 0} categories</p>
              )}
            </div>
            <Button variant="primary" onClick={() => { navigate('/public-menu/board') }}>
              Open board
            </Button>
          </div>
        </Card>

        <Card>
          <div className={styles.optionCard}>
            <div className={styles.optionIcon}>📱</div>
            <div className={styles.optionContent}>
              <h2 className={styles.optionTitle}>QR Guest Menu</h2>
              <p className={styles.optionDesc}>
                Mobile-friendly menu for guests to scan at the table. Optimised for 390 px screens.
              </p>
              {menuQuery.isLoading ? (
                <Skeleton style={{ height: 16, width: 120 }} />
              ) : (
                <p className={styles.optionMeta}>Published {menu ? new Date(menu.publishedAt).toLocaleDateString() : '—'}</p>
              )}
            </div>
            <Button variant="primary" onClick={() => { navigate('/public-menu/qr') }}>
              Open QR menu
            </Button>
          </div>
        </Card>
      </div>

      {!menuQuery.isLoading && menu ? (
        <Card>
          <div className={styles.preview}>
            <h3 className={styles.previewTitle}>Menu preview</h3>
            <div className={styles.previewCategories}>
              {menu.categories.map((cat) => (
                <div key={cat.id} className={styles.previewCat}>
                  <span className={styles.previewCatName}>{cat.emoji} {cat.name}</span>
                  <span className={styles.previewCatCount}>{cat.items.length} items</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  )
}
