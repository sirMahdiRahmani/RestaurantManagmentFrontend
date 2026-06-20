import type { Category, Food } from '../../menu'

export interface PublishedMenuSection {
  category: Category
  items: Food[]
}
