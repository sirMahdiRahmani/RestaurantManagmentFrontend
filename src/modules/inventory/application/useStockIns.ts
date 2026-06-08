import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { CreateStockInInput } from '../domain/types'
import { stockInRepository } from './repositories'
import { ingredientsKey } from './useIngredients'

const stockInsKey = (page: number) => ['inventory', 'stock-ins', page] as const

export function useStockIns(page = 1) {
  return useQuery({
    queryKey: stockInsKey(page),
    queryFn: () => stockInRepository.list(page),
  })
}

export function useReceiveStockIn() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateStockInInput) => stockInRepository.create(input),
    onSuccess: () => {
      // Receiving stock changes both the stock-in history and ingredient on-hand quantities/costs.
      void queryClient.invalidateQueries({ queryKey: ['inventory', 'stock-ins'] })
      void queryClient.invalidateQueries({ queryKey: ingredientsKey })
    },
  })
}
