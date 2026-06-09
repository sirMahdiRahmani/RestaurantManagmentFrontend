import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Id } from '../../../shared/types'
import type { CreateGuestInput, UpdateGuestInput } from '../domain/types'
import { guestRepository } from './repositories'

export const guestsKey = ['guests'] as const
const guestKey = (id: Id) => ['guests', id] as const

export function useGuests() {
  return useQuery({
    queryKey: guestsKey,
    queryFn: () => guestRepository.list(),
  })
}

export function useGuest(id: Id) {
  return useQuery({
    queryKey: guestKey(id),
    queryFn: () => guestRepository.get(id),
    enabled: Boolean(id),
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
    onSuccess: (_data, { id }) => {
      void queryClient.invalidateQueries({ queryKey: guestsKey })
      void queryClient.invalidateQueries({ queryKey: guestKey(id) })
    },
  })
}

export function useDeleteGuest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: Id) => guestRepository.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: guestsKey })
    },
  })
}
