import type { Id, PageQuery, PaginatedResult } from '../../../shared/types'
import type { CreateFactorInput, Factor, UpdateFactorInput } from './types'

export interface FactorRepository {
  list(query?: PageQuery): Promise<PaginatedResult<Factor>>
  get(id: Id): Promise<Factor>
  create(input: CreateFactorInput): Promise<Factor>
  update(id: Id, input: UpdateFactorInput): Promise<Factor>
  delete(id: Id): Promise<void>
  settle(id: Id): Promise<Factor>
}
