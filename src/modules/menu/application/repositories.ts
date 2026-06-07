import { createCategoryRepository, createFoodRepository } from '../infra'

/** Module-level singletons — application hooks depend only on the repository interfaces. */
export const categoryRepository = createCategoryRepository()
export const foodRepository = createFoodRepository()
