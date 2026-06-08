import type { PaginatedResult } from '../../../shared/types'
import type { CreateStockInInput, StockIn } from './types'

export interface StockInRepository {
  list(page?: number): Promise<PaginatedResult<StockIn>>
  create(input: CreateStockInInput): Promise<StockIn>
}
