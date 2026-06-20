import { createFactorRepository } from '../infra'

/** Module-level singleton — application hooks depend only on the repository interface. */
export const factorRepository = createFactorRepository()
