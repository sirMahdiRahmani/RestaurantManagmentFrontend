/** Typed mirror of `tokens.css` for places that need JS access (e.g. charts). */
export const theme = {
  color: {
    accent: '#3b5bdb',
    accent700: '#2f49b8',
    accent50: '#eef1fd',
    accent100: '#e0e6fb',
    ink: '#171a20',
    ink2: '#3d424c',
    muted: '#6b7280',
    faint: '#9aa1ac',
    page: '#eceef2',
    surface: '#fff',
    surface2: '#f7f8fa',
    line: '#e7e9ee',
    line2: '#eef0f3',
    ok: '#15803d',
    okBg: '#e7f3ec',
    warn: '#c2710c',
    warnBg: '#fbeede',
    danger: '#dc2626',
    dangerBg: '#fbe9e9',
  },
  radius: {
    lg: 16,
    md: 12,
    sm: 9,
  },
  space: {
    comfy: 20,
    compact: 12,
  },
  font: {
    sans: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
    mono: "'IBM Plex Mono', ui-monospace, monospace",
  },
} as const
