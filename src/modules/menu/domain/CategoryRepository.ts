import type { Id } from '../../../shared/types'
import type { Category, CreateCategoryInput } from './types'

export interface CategoryRepository {
  list(): Promise<Category[]>
  create(input: CreateCategoryInput): Promise<Category>
  rename(id: Id, name: string): Promise<Category>
}
