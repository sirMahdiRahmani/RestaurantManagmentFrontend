import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../config', () => ({
  config: { apiBaseUrl: 'http://api.test', defaultRestaurantId: 'rest_123' },
}))

const { apiClient, ApiError } = await import('./apiClient')

function jsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('apiClient', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('builds the URL from the configured base and injects the tenant header', async () => {
    const fetchMock = vi.mocked(fetch)
    fetchMock.mockResolvedValueOnce(jsonResponse(200, [{ id: 'cat_1', name: 'Grills' }]))

    await apiClient.get('/categories')

    const call = fetchMock.mock.calls[0]
    expect(call?.[0]).toBe('http://api.test/categories')
    const headers = call?.[1]?.headers as Record<string, string>
    expect(headers['X-Restaurant-ID']).toBe('rest_123')
  })

  it('omits the tenant header for platform-admin requests', async () => {
    const fetchMock = vi.mocked(fetch)
    fetchMock.mockResolvedValueOnce(jsonResponse(200, []))

    await apiClient.get('/admin/restaurants', { tenantScoped: false })

    const call = fetchMock.mock.calls[0]
    const headers = call?.[1]?.headers as Record<string, string>
    expect(headers['X-Restaurant-ID']).toBeUndefined()
  })

  it('serializes the body and sets Content-Type for writes', async () => {
    const fetchMock = vi.mocked(fetch)
    fetchMock.mockResolvedValueOnce(jsonResponse(201, { id: 'cat_2', name: 'Pasta' }))

    await apiClient.post('/categories', { name: 'Pasta' })

    const call = fetchMock.mock.calls[0]
    expect(call?.[1]?.body).toBe(JSON.stringify({ name: 'Pasta' }))
    const headers = call?.[1]?.headers as Record<string, string>
    expect(headers['Content-Type']).toBe('application/json')
  })

  it('returns undefined for 204 No Content', async () => {
    const fetchMock = vi.mocked(fetch)
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }))

    await expect(apiClient.delete('/categories/cat_1')).resolves.toBeUndefined()
  })

  it('throws ApiError with the backend message on non-2xx responses', async () => {
    const fetchMock = vi.mocked(fetch)
    fetchMock.mockResolvedValueOnce(jsonResponse(409, { error: 'category name already exists' }))

    await expect(apiClient.post('/categories', { name: 'Grills' })).rejects.toMatchObject(
      new ApiError(409, 'category name already exists'),
    )
  })
})
