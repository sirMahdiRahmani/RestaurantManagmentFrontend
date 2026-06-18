import { useMemo } from 'react'
import { useCategories, useFoods } from '../../menu'
import type { PublishedMenuSection } from '../domain/types'

export interface PublishedMenuResult {
  sections: PublishedMenuSection[]
  isLoading: boolean
}

/** Active, show-on-menu foods grouped by category in sortOrder — the live guest-facing projection. */
export function usePublishedMenu(): PublishedMenuResult {
  const categoriesQuery = useCategories()
  const foodsQuery = useFoods()

  const sections = useMemo(() => {
    const categories = [...(categoriesQuery.data ?? [])].sort((a, b) => a.sortOrder - b.sortOrder)
    const foods = (foodsQuery.data ?? []).filter((food) => food.isActive && food.showOnMenu)
    return categories
      .map((category) => ({ category, items: foods.filter((food) => food.categoryId === category.id) }))
      .filter((section) => section.items.length > 0)
  }, [categoriesQuery.data, foodsQuery.data])

  return { sections, isLoading: categoriesQuery.isLoading || foodsQuery.isLoading }
}
