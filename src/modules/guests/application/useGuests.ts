import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Id } from '../../../shared/types'
import type { CreateGuestInput, UpdateGuestInput } from '../domain/types'
import { guestRepository } from './repositories'

export const guestsKey = ['guests'] as const

export function useGuests() {
  return useQuery({
    queryKey: guestsKey,
    queryFn: () => guestRepository.list(),
  })
}

export function useCreateGuest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateGuestInput) => guestRepository.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: guestsKey })
    },
  })
}

export function useUpdateGuest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: Id; input: UpdateGuestInput }) => guestRepository.update(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: guestsKey })
    },
  })
}

export function useRemoveGuest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: Id) => guestRepository.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: guestsKey })
    },
  })
}
