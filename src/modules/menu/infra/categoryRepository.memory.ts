import { createId } from '../../../shared/lib/id'
import type { CategoryRepository } from '../domain/CategoryRepository'
import type { Category, CreateCategoryInput } from '../domain/types'

const now = '2026-05-01T09:00:00Z'

let categories: Category[] = [
  { id: 'cat_grills', name: 'Grills', emoji: '🔥', color: '#dc2626', sortOrder: 1, createdAt: now, updatedAt: now },
  { id: 'cat_pasta', name: 'Pasta', emoji: '🍝', color: '#c2710c', sortOrder: 2, createdAt: now, updatedAt: now },
  { id: 'cat_salads', name: 'Salads', emoji: '🥗', color: '#15803d', sortOrder: 3, createdAt: now, updatedAt: now },
  { id: 'cat_soups', name: 'Soups', emoji: '🥣', color: '#3b5bdb', sortOrder: 4, createdAt: now, updatedAt: now },
  { id: 'cat_desserts', name: 'Desserts', emoji: '🍰', color: '#9333ea', sortOrder: 5, createdAt: now, updatedAt: now },
  { id: 'cat_drinks', name: 'Drinks', emoji: '🥤', color: '#0891b2', sortOrder: 6, createdAt: now, updatedAt: now },
]

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), 180))
}

export function createCategoryMemoryRepository(): CategoryRepository {
  return {
    async list() {
      return delay([...categories].sort((a, b) => a.sortOrder - b.sortOrder))
    },
    async create(input: CreateCategoryInput) {
      const timestamp = new Date().toISOString()
      const category: Category = {
        id: createId('cat'),
        name: input.name,
        emoji: input.emoji ?? '🍽️',
        color: input.color ?? '#3b5bdb',
        sortOrder: input.sortOrder ?? categories.length + 1,
        createdAt: timestamp,
        updatedAt: timestamp,
      }
      categories = [...categories, category]
      return delay(category)
    },
    async rename(id, name) {
      const existing = categories.find((category) => category.id === id)
      if (!existing) throw new Error(`Category ${id} not found`)
      const updated: Category = { ...existing, name, updatedAt: new Date().toISOString() }
      categories = categories.map((category) => (category.id === id ? updated : category))
      return delay(updated)
    },
  }
}
