/**
 * Single point of contact with `import.meta.env`.
 * Nothing else in the app should read `import.meta.env` directly —
 * import `config` from `shared/config` instead.
 */

function readString(key: string, fallback: string): string {
  const raw = import.meta.env[key]
  return typeof raw === 'string' && raw.length > 0 ? raw : fallback
}

function readOptionalString(key: string): string | null {
  const raw = import.meta.env[key]
  return typeof raw === 'string' && raw.length > 0 ? raw : null
}

function readBoolean(key: string, fallback: boolean): boolean {
  const raw = import.meta.env[key]
  if (raw === 'true') return true
  if (raw === 'false') return false
  return fallback
}

function readNumber(key: string, fallback: number): number {
  const raw = import.meta.env[key]
  const parsed = typeof raw === 'string' ? Number(raw) : Number.NaN
  return Number.isFinite(parsed) ? parsed : fallback
}

export interface AppConfig {
  readonly apiBaseUrl: string
  readonly defaultRestaurantId: string | null
  readonly useMockRepos: boolean
  readonly tax: {
    readonly defaultVatPct: number
    readonly defaultServicePct: number
  }
}

export const config: AppConfig = Object.freeze({
  apiBaseUrl: readString('VITE_API_BASE_URL', 'http://localhost:8080'),
  defaultRestaurantId: readOptionalString('VITE_DEFAULT_RESTAURANT_ID'),
  useMockRepos: readBoolean('VITE_USE_MOCK_REPOS', true),
  tax: Object.freeze({
    defaultVatPct: readNumber('VITE_DEFAULT_VAT_PCT', 9),
    defaultServicePct: readNumber('VITE_DEFAULT_SERVICE_PCT', 10),
  }),
})
