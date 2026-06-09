import type { IconName } from '../../shared/ui'

export interface NavEntry {
  to: string
  label: string
  icon: IconName
  /** Marks modules implemented so far; the rest render a ComingSoonPage placeholder. */
  status: 'live' | 'planned'
}

export const navRegistry: NavEntry[] = [
  { to: '/menu', label: 'Menu', icon: 'dish', status: 'live' },
  { to: '/menu/categories', label: 'Categories', icon: 'layers', status: 'live' },
  { to: '/inventory', label: 'Inventory', icon: 'box', status: 'live' },
  { to: '/recipes', label: 'Recipes', icon: 'grid', status: 'live' },
  { to: '/billing', label: 'Billing', icon: 'receipt', status: 'live' },
  { to: '/guests', label: 'Guests', icon: 'user', status: 'live' },
  { to: '/public-menu', label: 'Public Menu', icon: 'monitor', status: 'live' },
  { to: '/analytics', label: 'Analytics', icon: 'search', status: 'live' },
]
