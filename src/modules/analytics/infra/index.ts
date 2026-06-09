import { config } from '../../../shared/config'
import type { DashboardRepository } from '../domain/DashboardRepository'
import { createDashboardHttpRepository } from './dashboardRepository.http'
import { createDashboardMemoryRepository } from './dashboardRepository.memory'

export function createDashboardRepository(): DashboardRepository {
  return config.useMockRepos ? createDashboardMemoryRepository() : createDashboardHttpRepository()
}
