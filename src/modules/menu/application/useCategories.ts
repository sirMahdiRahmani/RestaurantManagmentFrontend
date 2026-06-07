import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Id } from '../../../shared/types'
import type { CreateCategoryInput } from '../domain/types'
import { categoryRepository } from './repositories'

const categoriesKey = ['menu', 'categories'] as const

export function useCategories() {
  return useQuery({
    queryKey: categoriesKey,
    queryFn: () => categoryRepository.list(),
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateCategoryInput) => categoryRepository.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: categoriesKey })
    },
  })
}

export function useRenameCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, name }: { id: Id; name: string }) => categoryRepository.rename(id, name),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: categoriesKey })
    },
  })
}
