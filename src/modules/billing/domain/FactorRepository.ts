import type { Id } from '../../../shared/types'
import type { CreateFactorInput, Factor, UpdateFactorInput } from './types'

export interface FactorRepository {
  list(): Promise<Factor[]>
  get(id: Id): Promise<Factor>
  create(input: CreateFactorInput): Promise<Factor>
  update(id: Id, input: UpdateFactorInput): Promise<Factor>
  remove(id: Id): Promise<void>
  /** Terminal, one-way: marks paid, depletes stock, accrues guest loyalty server-side. */
  settle(id: Id): Promise<Factor>
}
