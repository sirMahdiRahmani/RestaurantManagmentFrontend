import type { Id } from '../../../shared/types'
import type { CreateFoodInput, Food, UpdateFoodInput } from './types'

export interface FoodRepository {
  list(filter?: { categoryId?: Id }): Promise<Food[]>
  create(input: CreateFoodInput): Promise<Food>
  update(id: Id, input: UpdateFoodInput): Promise<Food>
}
