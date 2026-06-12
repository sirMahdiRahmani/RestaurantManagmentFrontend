import type { DashboardRepository } from '../domain/DashboardRepository'
import type { DashboardData } from '../domain/types'

const MOCK_DATA: DashboardData = {
  kpis: {
    todaySales: 148500,
    openTables: 4,
    settledToday: 11,
    lowStockCount: 3,
  },
  salesSeries: [
    { date: '2026-06-03', total: 98000 },
    { date: '2026-06-04', total: 115000 },
    { date: '2026-06-05', total: 87500 },
    { date: '2026-06-06', total: 132000 },
    { date: '2026-06-07', total: 121000 },
    { date: '2026-06-08', total: 156000 },
    { date: '2026-06-09', total: 148500 },
  ],
  topSellers: [
    { foodId: 'food_ribeye', foodName: 'Ribeye Steak', qtySold: 24 },
    { foodId: 'food_carbonara', foodName: 'Spaghetti Carbonara', qtySold: 19 },
    { foodId: 'food_lamb_chops', foodName: 'Lamb Chops', qtySold: 16 },
    { foodId: 'food_tiramisu', foodName: 'Tiramisu', qtySold: 14 },
    { foodId: 'food_caesar', foodName: 'Caesar Salad', qtySold: 12 },
  ],
  activityFeed: [
    {
      id: 'evt_1',
      occurredAt: '2026-06-09T13:42:00Z',
      type: 'factor_settled',
      description: 'Table 7 settled',
      meta: '$48.00',
    },
    {
      id: 'evt_2',
      occurredAt: '2026-06-09T13:15:00Z',
      type: 'item_low_stock',
      description: 'Lamb chops below par',
      meta: '6 / 10 kg',
    },
    {
      id: 'evt_3',
      occurredAt: '2026-06-09T12:58:00Z',
      type: 'factor_settled',
      description: 'Table 2 settled',
      meta: '$32.50',
    },
    {
      id: 'evt_4',
      occurredAt: '2026-06-09T11:20:00Z',
      type: 'stock_received',
      description: 'Stock-in from Fresh Farms Co.',
      meta: '$210.00',
    },
    {
      id: 'evt_5',
      occurredAt: '2026-06-09T10:05:00Z',
      type: 'guest_registered',
      description: 'New guest: Ali Karimi',
      meta: 'Member',
    },
  ],
}

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), 200))
}

export function createDashboardMemoryRepository(): DashboardRepository {
  return {
    get() {
      return delay({ ...MOCK_DATA })
    },
  }
}
