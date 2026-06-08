import { config } from '../config'

/**
 * Thrown for any non-2xx response. The backend always replies with
 * `{ "error": "human-readable message" }` — we surface that message directly.
 */
export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

type Json = Record<string, unknown> | unknown[]

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: Json
  /** Platform-admin endpoints (e.g. /admin/restaurants) don't take a tenant header. */
  tenantScoped?: boolean
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, tenantScoped = true } = options

  const headers: Record<string, string> = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (tenantScoped && config.defaultRestaurantId) {
    headers['X-Restaurant-ID'] = config.defaultRestaurantId
  }

  const response = await fetch(`${config.apiBaseUrl}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (response.status === 204) return undefined as T

  const data: unknown = await response.json().catch(() => undefined)

  if (!response.ok) {
    const message =
      data && typeof data === 'object' && 'error' in data && typeof data.error === 'string'
        ? data.error
        : `Request to ${path} failed with status ${response.status}`
    throw new ApiError(response.status, message)
  }

  return data as T
}

/** Minimal REST client for the Go backend. Injects the tenant header and unwraps `{ error }` responses. */
export const apiClient = {
  get: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: Json, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'POST', body }),
  put: <T>(path: string, body?: Json, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'PUT', body }),
  delete: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'DELETE' }),
}
