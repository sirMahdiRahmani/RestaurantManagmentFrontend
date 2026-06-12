import { useQuery } from '@tanstack/react-query'
import { dashboardRepository } from './repositories'

const dashboardKey = ['analytics', 'dashboard'] as const

export function useDashboard() {
  return useQuery({
    queryKey: dashboardKey,
    queryFn: () => dashboardRepository.get(),
    staleTime: 30_000,
  })
}
