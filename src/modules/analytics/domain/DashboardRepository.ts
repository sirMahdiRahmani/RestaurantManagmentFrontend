import type { DashboardData } from './types'

export interface DashboardRepository {
  get(): Promise<DashboardData>
}
