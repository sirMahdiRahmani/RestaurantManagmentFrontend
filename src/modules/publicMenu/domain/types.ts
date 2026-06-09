import type { Id, ISODateString } from '../../../shared/types'

export interface PublishedItem {
  id: Id
  name: string
  /** minor units */
  price: number
  description: string
  photoUrl: string
}

export interface PublishedCategory {
  id: Id
  name: string
  emoji: string
  color: string
  sortOrder: number
  items: PublishedItem[]
}

/** Read-only projection of active, show-on-menu foods grouped by category. */
export interface PublishedMenu {
  categories: PublishedCategory[]
  publishedAt: ISODateString
}
