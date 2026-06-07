import type { Id, ISODateString } from '../../../shared/types'

export interface Category {
  id: Id
  name: string
  emoji: string
  color: string
  sortOrder: number
  createdAt: ISODateString
  updatedAt: ISODateString
}

export interface CreateCategoryInput {
  name: string
  emoji?: string
  color?: string
  sortOrder?: number
}

export interface Food {
  id: Id
  categoryId: Id
  name: string
  /** integer minor units */
  price: number
  description: string
  photoUrl: string
  isActive: boolean
  showOnMenu: boolean
  createdAt: ISODateString
  updatedAt: ISODateString
}

export interface CreateFoodInput {
  categoryId: Id
  name: string
  price: number
  description?: string
  photoUrl?: string
  isActive?: boolean
  showOnMenu?: boolean
}

export interface UpdateFoodInput {
  categoryId: Id
  name: string
  price: number
  description?: string
  photoUrl?: string
  isActive: boolean
  showOnMenu?: boolean
}
