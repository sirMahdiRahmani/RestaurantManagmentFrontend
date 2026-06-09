import type { PublishedMenuRepository } from '../domain/PublishedMenuRepository'
import type { PublishedMenu } from '../domain/types'

// Mirrors active+showOnMenu foods from menu/infra/foodRepository.memory.ts
const PUBLISHED_MENU: PublishedMenu = {
  publishedAt: '2026-06-09T00:00:00Z',
  categories: [
    {
      id: 'cat_grills',
      name: 'Grills',
      emoji: '🔥',
      color: '#e05c00',
      sortOrder: 1,
      items: [
        { id: 'food_ribeye', name: 'Ribeye Steak', price: 4900, description: 'Char-grilled ribeye with herb butter.', photoUrl: '' },
        { id: 'food_lamb_chops', name: 'Lamb Chops', price: 5400, description: '', photoUrl: '' },
        { id: 'food_chicken_skewer', name: 'Chicken Skewer', price: 2600, description: '', photoUrl: '' },
      ],
    },
    {
      id: 'cat_pasta',
      name: 'Pasta',
      emoji: '🍝',
      color: '#c2710c',
      sortOrder: 2,
      items: [
        { id: 'food_carbonara', name: 'Spaghetti Carbonara', price: 2200, description: '', photoUrl: '' },
        { id: 'food_pesto', name: 'Penne al Pesto', price: 2000, description: '', photoUrl: '' },
        { id: 'food_lasagna', name: 'Beef Lasagna', price: 2400, description: '', photoUrl: '' },
      ],
    },
    {
      id: 'cat_salads',
      name: 'Salads',
      emoji: '🥗',
      color: '#15803d',
      sortOrder: 3,
      items: [
        { id: 'food_caesar', name: 'Caesar Salad', price: 1700, description: '', photoUrl: '' },
        { id: 'food_greek', name: 'Greek Salad', price: 1600, description: '', photoUrl: '' },
      ],
    },
    {
      id: 'cat_soups',
      name: 'Soups',
      emoji: '🍲',
      color: '#0e7490',
      sortOrder: 4,
      items: [
        { id: 'food_tomato_soup', name: 'Tomato Basil Soup', price: 1200, description: '', photoUrl: '' },
        { id: 'food_mushroom_soup', name: 'Wild Mushroom Soup', price: 1350, description: '', photoUrl: '' },
      ],
    },
    {
      id: 'cat_desserts',
      name: 'Desserts',
      emoji: '🍰',
      color: '#7c3aed',
      sortOrder: 5,
      items: [
        { id: 'food_tiramisu', name: 'Tiramisu', price: 1400, description: '', photoUrl: '' },
        { id: 'food_cheesecake', name: 'New York Cheesecake', price: 1500, description: '', photoUrl: '' },
      ],
    },
    {
      id: 'cat_drinks',
      name: 'Drinks',
      emoji: '🥤',
      color: '#1d4ed8',
      sortOrder: 6,
      items: [
        { id: 'food_lemonade', name: 'Fresh Lemonade', price: 800, description: '', photoUrl: '' },
        { id: 'food_espresso', name: 'Espresso', price: 600, description: '', photoUrl: '' },
        { id: 'food_iced_tea', name: 'Iced Tea', price: 700, description: '', photoUrl: '' },
      ],
    },
  ],
}

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), 200))
}

export function createPublishedMenuMemoryRepository(): PublishedMenuRepository {
  return {
    get() {
      return delay({ ...PUBLISHED_MENU })
    },
  }
}
