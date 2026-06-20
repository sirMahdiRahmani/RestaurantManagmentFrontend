import { useMemo } from 'react'
import { useFactors } from '../../billing'
import { useFoods } from '../../menu'
import { useIngredients } from '../../inventory'
import { salesByDay, todayFactorsCount, todaySalesTotal, topSellers } from '../domain/metrics'

export interface ActivityEntry {
  id: string
  time: string
  event: string
  meta: string
}

export function useDashboard() {
  const factorsQuery = useFactors()
  const foodsQuery = useFoods()
  const ingredientsQuery = useIngredients()

  const factors = useMemo(() => factorsQuery.data ?? [], [factorsQuery.data])
  const foods = useMemo(() => foodsQuery.data ?? [], [foodsQuery.data])
  const ingredients = useMemo(() => ingredientsQuery.data ?? [], [ingredientsQuery.data])
  const now = useMemo(() => new Date().toISOString(), [])

  const foodNameById = useMemo(() => new Map(foods.map((food) => [food.id, food.name])), [foods])

  const sales = useMemo(() => salesByDay(factors, now, 7), [factors, now])
  const sellers = useMemo(
    () => topSellers(factors).map((seller) => ({ ...seller, name: foodNameById.get(seller.foodId) ?? seller.foodId })),
    [factors, foodNameById],
  )
  const activity = useMemo<ActivityEntry[]>(
    () =>
      [...factors]
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
        .slice(0, 8)
        .map((factor) => ({
          id: factor.id,
          time: new Date(factor.updatedAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
          event: factor.status === 'paid' ? 'Factor settled' : 'Factor held',
          meta: `Table ${factor.tableId}`,
        })),
    [factors],
  )

  return {
    isLoading: factorsQuery.isLoading || foodsQuery.isLoading || ingredientsQuery.isLoading,
    todaySales: todaySalesTotal(factors, now),
    openTables: new Set(factors.filter((factor) => factor.status === 'unpaid').map((factor) => factor.tableId)).size,
    settledToday: todayFactorsCount(factors, now),
    lowStockCount: ingredients.filter((ingredient) => ingredient.isLowStock).length,
    sales,
    topSellers: sellers,
    activity,
  }
}
