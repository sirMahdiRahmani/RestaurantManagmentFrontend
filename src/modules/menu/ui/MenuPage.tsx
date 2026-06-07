import { useMemo, useState } from 'react'
import { Card, EmptyState, Skeleton } from '../../../shared/ui'
import type { Id } from '../../../shared/types'
import type { Category } from '../domain/types'
import { useCategories } from '../application/useCategories'
import { useFoods } from '../application/useFoods'
import { CategoryFilterPills } from './CategoryFilterPills'
import { FoodTable } from './FoodTable'
import styles from './MenuPage.module.css'

export function MenuPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<Id | null>(null)
  const categoriesQuery = useCategories()
  const foodsQuery = useFoods(selectedCategoryId ?? undefined)

  const categories = categoriesQuery.data ?? []
  const foods = foodsQuery.data ?? []

  const categoriesById = useMemo(() => {
    const map = new Map<string, Category>()
    for (const category of categoriesQuery.data ?? []) map.set(category.id, category)
    return map
  }, [categoriesQuery.data])

  const isLoading = categoriesQuery.isLoading || foodsQuery.isLoading

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Menu</h1>
          <p className={styles.subtitle}>Browse and manage the dishes guests can order.</p>
        </div>
      </header>

      {categoriesQuery.isLoading ? (
        <Skeleton style={{ height: 36, width: 280 }} />
      ) : (
        <CategoryFilterPills
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelect={setSelectedCategoryId}
        />
      )}

      <Card>
        {isLoading ? (
          <div className={styles.skeletonStack}>
            <Skeleton style={{ height: 44 }} />
            <Skeleton style={{ height: 44 }} />
            <Skeleton style={{ height: 44 }} />
            <Skeleton style={{ height: 44 }} />
          </div>
        ) : foods.length === 0 ? (
          <EmptyState
            title="No dishes in this category yet"
            description="Add a dish to this category to see it appear on the menu and the public board."
          />
        ) : (
          <FoodTable foods={foods} categoriesById={categoriesById} />
        )}
      </Card>
    </div>
  )
}
