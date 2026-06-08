import { createIngredientRepository, createStockInRepository } from '../infra'

/** Module-level singletons — application hooks depend only on the repository interfaces. */
export const ingredientRepository = createIngredientRepository()
export const stockInRepository = createStockInRepository()
