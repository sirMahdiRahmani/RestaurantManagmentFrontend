import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Id } from '../../../shared/types'
import type { CreateFoodInput, UpdateFoodInput } from '../domain/types'
import { foodRepository } from './repositories'

const foodsKey = (categoryId?: Id) => ['menu', 'foods', categoryId ?? 'all'] as const

export function useFoods(categoryId?: Id) {
  return useQuery({
    queryKey: foodsKey(categoryId),
    queryFn: () => foodRepository.list(categoryId ? { categoryId } : undefined),
  })
}

export function useCreateFood() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateFoodInput) => foodRepository.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['menu', 'foods'] })
    },
  })
}

export function useUpdateFood() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: Id; input: UpdateFoodInput }) => foodRepository.update(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['menu', 'foods'] })
    },
  })
}
