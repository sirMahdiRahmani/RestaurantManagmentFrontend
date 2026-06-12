import type { Id, ISODateString } from '../../../shared/types'

export interface KpiSnapshot {
  /** minor units */
  todaySales: number
  openTables: number
  settledToday: number
  lowStockCount: number
}

export interface SalesDay {
  /** YYYY-MM-DD */
  date: string
  /** minor units */
  total: number
}

export interface TopSeller {
  foodId: Id
  foodName: string
  qtySold: number
}

export type ActivityEventType =
  | 'factor_settled'
  | 'stock_received'
  | 'guest_registered'
  | 'item_low_stock'

export interface ActivityEvent {
  id: Id
  occurredAt: ISODateString
  type: ActivityEventType
  description: string
  meta: string
}

export interface DashboardData {
  kpis: KpiSnapshot
  salesSeries: SalesDay[]
  topSellers: TopSeller[]
  activityFeed: ActivityEvent[]
}
