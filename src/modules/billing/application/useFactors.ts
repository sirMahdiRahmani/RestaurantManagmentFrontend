import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Id } from '../../../shared/types'
import type { CreateFactorInput } from '../domain/types'
import { factorRepository } from './repositories'

const factorsKey = ['billing', 'factors'] as const

export function useCreateFactor() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateFactorInput) => factorRepository.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: factorsKey })
    },
  })
}

export function useSettleFactor() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: Id) => factorRepository.settle(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: factorsKey })
      void queryClient.invalidateQueries({ queryKey: ['inventory', 'ingredients'] })
      void queryClient.invalidateQueries({ queryKey: ['guests'] })
    },
  })
}
