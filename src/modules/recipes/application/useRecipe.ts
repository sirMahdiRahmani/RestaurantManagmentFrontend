import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Id } from '../../../shared/types'
import type { UpsertRecipeLineInput } from '../domain/types'
import { recipeRepository } from './repositories'

const recipeKey = (foodId: Id) => ['recipes', 'food', foodId] as const

export function useRecipe(foodId: Id) {
  return useQuery({
    queryKey: recipeKey(foodId),
    queryFn: () => recipeRepository.get(foodId),
  })
}

export function useUpsertRecipeLine(foodId: Id) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: UpsertRecipeLineInput) => recipeRepository.upsertLine(foodId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: recipeKey(foodId) })
    },
  })
}

export function useRemoveRecipeLine(foodId: Id) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ingredientId: Id) => recipeRepository.removeLine(foodId, ingredientId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: recipeKey(foodId) })
    },
  })
}
