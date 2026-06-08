import type { Id } from '../../../shared/types'

export interface RecipeLine {
  ingredientId: Id
  ingredientName: string
  qtyPerPortion: number
  unit: string
  /** ingredient's current weighted-average cost, integer minor units */
  unitCost: number
  /** round(qtyPerPortion × unitCost), integer minor units */
  lineCost: number
}

/** A food enriched with its recipe and live cost/margin — recomputed on every read. */
export interface FoodDetail {
  id: Id
  categoryId: Id
  name: string
  price: number
  description: string
  photoUrl: string
  isActive: boolean
  showOnMenu: boolean
  createdAt: string
  updatedAt: string
  recipe: RecipeLine[]
  /** Σ lineCost, integer minor units */
  foodCost: number
  /** 1 − foodCost / price, in [0,1]; 0 when price is 0 */
  margin: number
}

export interface UpsertRecipeLineInput {
  ingredientId: Id
  qtyPerPortion: number
  unit: string
}
