import type { Id } from '../../../shared/types'
import type { FoodDetail, UpsertRecipeLineInput } from './types'

export interface RecipeRepository {
  get(foodId: Id): Promise<FoodDetail>
  upsertLine(foodId: Id, input: UpsertRecipeLineInput): Promise<FoodDetail>
  removeLine(foodId: Id, ingredientId: Id): Promise<FoodDetail>
}
