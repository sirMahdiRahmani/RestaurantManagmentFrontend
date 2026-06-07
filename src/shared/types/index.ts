/** Cross-module primitive types shared by every module's domain layer. */

export type Id = string

/** RFC 3339 / ISO 8601 UTC timestamp, e.g. "2026-06-07T12:34:56Z". */
export type ISODateString = string

export type Quantity = number

export type Unit = string

export interface PaginatedResult<T> {
  items: T[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface ApiError {
  error: string
}

export interface PageQuery {
  page?: number
  page_size?: number
}
