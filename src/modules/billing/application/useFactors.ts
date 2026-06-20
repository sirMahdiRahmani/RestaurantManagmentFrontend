import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Id } from '../../../shared/types'
import type { CreateFactorInput, UpdateFactorInput } from '../domain/types'
import { factorRepository } from './repositories'

export const factorsKey = ['billing', 'factors'] as const
export const factorKey = (id: Id) => ['billing', 'factor', id] as const

export function useFactors() {
  return useQuery({
    queryKey: factorsKey,
    queryFn: () => factorRepository.list(),
  })
}

export function useFactor(id: Id | null) {
  return useQuery({
    queryKey: factorKey(id ?? 'none'),
    queryFn: () => factorRepository.get(id as Id),
    enabled: id !== null,
  })
}

export function useCreateFactor() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateFactorInput) => factorRepository.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: factorsKey })
    },
  })
}

export function useUpdateFactor() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: Id; input: UpdateFactorInput }) => factorRepository.update(id, input),
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
      void queryClient.invalidateQueries({ queryKey: ['guests'] })
    },
  })
}
