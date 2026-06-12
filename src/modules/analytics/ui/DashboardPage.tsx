import { useNavigate } from 'react-router-dom'
import { Card, Skeleton } from '../../../shared/ui'
import { formatMoney } from '../../../shared/money'
import { useDashboard } from '../application/useDashboard'
import { KpiCard } from './KpiCard'
import { SalesBars } from './SalesBars'
import { TopSellers } from './TopSellers'
import { ActivityFeed } from './ActivityFeed'
import styles from './DashboardPage.module.css'

export function DashboardPage() {
  const navigate = useNavigate()
  const { data, isLoading } = useDashboard()

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Live overview of sales, stock, and guest activity.</p>
      </header>

      <div className={styles.kpiRow}>
        {isLoading ? (
          <>
            <Skeleton style={{ height: 88 }} />
            <Skeleton style={{ height: 88 }} />
            <Skeleton style={{ height: 88 }} />
            <Skeleton style={{ height: 88 }} />
          </>
        ) : data ? (
          <>
            <KpiCard
              label="Today's sales"
              value={formatMoney(data.kpis.todaySales)}
              sub={`${data.kpis.settledToday} orders`}
              tone="ok"
            />
            <KpiCard
              label="Open tables"
              value={String(data.kpis.openTables)}
            />
            <KpiCard
              label="Orders settled"
              value={String(data.kpis.settledToday)}
              sub="today"
            />
            <KpiCard
              label="Low stock"
              value={String(data.kpis.lowStockCount)}
              sub={data.kpis.lowStockCount > 0 ? 'needs reorder' : 'all OK'}
              tone={data.kpis.lowStockCount > 0 ? 'warn' : 'neutral'}
              onClick={data.kpis.lowStockCount > 0 ? () => { navigate('/inventory') } : undefined}
            />
          </>
        ) : null}
      </div>

      <Card>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>7-day sales</h2>
        </div>
        {isLoading ? (
          <Skeleton style={{ height: 160 }} />
        ) : data ? (
          <SalesBars data={data.salesSeries} />
        ) : null}
      </Card>

      <div className={styles.bottomRow}>
        <Card>
          <h2 className={styles.sectionTitle}>Top sellers</h2>
          {isLoading ? (
            <div className={styles.skeletonStack}>
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} style={{ height: 36 }} />)}
            </div>
          ) : data ? (
            <TopSellers sellers={data.topSellers} />
          ) : null}
        </Card>

        <Card>
          <h2 className={styles.sectionTitle}>Recent activity</h2>
          {isLoading ? (
            <div className={styles.skeletonStack}>
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} style={{ height: 44 }} />)}
            </div>
          ) : data ? (
            <ActivityFeed events={data.activityFeed} />
          ) : null}
        </Card>
      </div>
    </div>
  )
}
