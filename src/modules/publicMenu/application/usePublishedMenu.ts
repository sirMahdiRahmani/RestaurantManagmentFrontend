import { useQuery } from '@tanstack/react-query'
import { publishedMenuRepository } from './repositories'

const publishedMenuKey = ['publicMenu', 'published'] as const

export function usePublishedMenu() {
  return useQuery({
    queryKey: publishedMenuKey,
    queryFn: () => publishedMenuRepository.get(),
    staleTime: 60_000,
  })
}
