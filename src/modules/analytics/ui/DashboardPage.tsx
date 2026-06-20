import { useNavigate } from 'react-router-dom'
import { KpiCard, Skeleton } from '../../../shared/ui'
import { formatMoney } from '../../../shared/money'
import { useDashboard } from '../application/useDashboard'
import { SalesBars } from './SalesBars'
import { TopSellers } from './TopSellers'
import { ActivityFeed } from './ActivityFeed'
import styles from './DashboardPage.module.css'

export function DashboardPage() {
  const navigate = useNavigate()
  const dashboard = useDashboard()

  if (dashboard.isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.kpiRow}>
          <Skeleton style={{ height: 96 }} />
          <Skeleton style={{ height: 96 }} />
          <Skeleton style={{ height: 96 }} />
          <Skeleton style={{ height: 96 }} />
        </div>
        <Skeleton style={{ height: 220 }} />
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Today's performance across billing, inventory and guests.</p>
      </header>

      <div className={styles.kpiRow}>
        <KpiCard label="Today's sales" value={formatMoney(dashboard.todaySales)} />
        <KpiCard label="Open tables" value={dashboard.openTables} />
        <KpiCard label="Factors settled today" value={dashboard.settledToday} />
        <KpiCard
          label="Low stock"
          value={dashboard.lowStockCount}
          hint={dashboard.lowStockCount > 0 ? 'View in Inventory →' : 'All ingredients above par'}
          onClick={() => { navigate('/inventory') }}
        />
      </div>

      <SalesBars sales={dashboard.sales} />

      <div className={styles.bottomRow}>
        <TopSellers sellers={dashboard.topSellers} />
        <ActivityFeed activity={dashboard.activity} />
      </div>
    </div>
  )
}
