import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Id } from '../../../shared/types'
import type { AdjustStockInput, CreateIngredientInput } from '../domain/types'
import { ingredientRepository } from './repositories'

export const ingredientsKey = ['inventory', 'ingredients'] as const

export function useIngredients() {
  return useQuery({
    queryKey: ingredientsKey,
    queryFn: () => ingredientRepository.list(),
  })
}

export function useCreateIngredient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateIngredientInput) => ingredientRepository.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ingredientsKey })
    },
  })
}

export function useAdjustStock() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: Id; input: AdjustStockInput }) => ingredientRepository.adjust(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ingredientsKey })
    },
  })
}
