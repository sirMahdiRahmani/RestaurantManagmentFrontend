import { apiClient } from '../../../shared/http'
import type { PaginatedResult } from '../../../shared/types'
import type { StockInRepository } from '../domain/StockInRepository'
import type { CreateStockInInput, StockIn } from '../domain/types'

/** Talks to the real backend's `/stock-ins` endpoints. DTO shapes match our domain types 1:1. */
export function createStockInHttpRepository(): StockInRepository {
  return {
    list(page = 1) {
      return apiClient.get<PaginatedResult<StockIn>>(`/stock-ins?page=${page}`)
    },
    create(input: CreateStockInInput) {
      return apiClient.post<StockIn>('/stock-ins', { ...input })
    },
  }
}
