import type { Id, PageQuery, PaginatedResult } from '../../../shared/types'
import type { CreateGuestInput, Guest, UpdateGuestInput } from './types'

export interface GuestRepository {
  list(query?: PageQuery): Promise<PaginatedResult<Guest>>
  get(id: Id): Promise<Guest>
  create(input: CreateGuestInput): Promise<Guest>
  update(id: Id, input: UpdateGuestInput): Promise<Guest>
  delete(id: Id): Promise<void>
}
