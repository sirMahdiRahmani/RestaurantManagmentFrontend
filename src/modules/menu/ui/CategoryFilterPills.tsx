import type { Id } from '../../../shared/types'
import type { Category } from '../domain/types'
import styles from './CategoryFilterPills.module.css'

export interface CategoryFilterPillsProps {
  categories: Category[]
  selectedCategoryId: Id | null
  onSelect: (categoryId: Id | null) => void
}

export function CategoryFilterPills({ categories, selectedCategoryId, onSelect }: CategoryFilterPillsProps) {
  return (
    <div className={styles.row} role="group" aria-label="Filter by category">
      <button
        type="button"
        className={[styles.pill, selectedCategoryId === null ? styles.active : ''].join(' ')}
        aria-pressed={selectedCategoryId === null}
        onClick={() => onSelect(null)}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          className={[styles.pill, selectedCategoryId === category.id ? styles.active : ''].join(' ')}
          aria-pressed={selectedCategoryId === category.id}
          onClick={() => onSelect(category.id)}
        >
          <span aria-hidden="true">{category.emoji}</span>
          {category.name}
        </button>
      ))}
    </div>
  )
}
