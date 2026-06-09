import type { DashboardRepository } from '../domain/DashboardRepository'

/** HTTP implementation placeholder — the backend aggregates endpoint is not yet defined. */
export function createDashboardHttpRepository(): DashboardRepository {
  return {
    get(): Promise<never> {
      return Promise.reject(new Error('Analytics HTTP endpoint not yet implemented'))
    },
  }
}
