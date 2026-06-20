import type { Id } from '../../../shared/types'
import type { CreateGuestInput, Guest, UpdateGuestInput } from './types'

export interface GuestRepository {
  list(): Promise<Guest[]>
  create(input: CreateGuestInput): Promise<Guest>
  update(id: Id, input: UpdateGuestInput): Promise<Guest>
  remove(id: Id): Promise<void>
  /**
   * Accrues one visit + `amount` onto the guest's loyalty record. The real
   * backend applies this automatically inside `POST /factors/:id/settle`,
   * so the HTTP implementation just refetches; the in-memory mock has no
   * backend to do that for it, so it applies the accrual itself.
   */
  recordVisit(id: Id, amount: number): Promise<Guest>
}
