import { createGuestRepository } from '../infra'

/** Module-level singleton — application hooks depend only on the repository interface. */
export const guestRepository = createGuestRepository()
