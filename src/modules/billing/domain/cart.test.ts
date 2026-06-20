import { describe, expect, it } from 'vitest'
import { addToCart, changeQty, removeFromCart } from './cart'

describe('addToCart', () => {
  it('adds a new line at qty 1', () => {
    expect(addToCart([], 'food_a')).toEqual([{ foodId: 'food_a', qty: 1 }])
  })

  it('increments qty when the food is already in the cart', () => {
    const lines = addToCart([{ foodId: 'food_a', qty: 1 }], 'food_a')
    expect(lines).toEqual([{ foodId: 'food_a', qty: 2 }])
  })
})

describe('changeQty', () => {
  it('removes the line once qty reaches 0', () => {
    const lines = changeQty([{ foodId: 'food_a', qty: 1 }], 'food_a', -1)
    expect(lines).toEqual([])
  })

  it('increments qty', () => {
    const lines = changeQty([{ foodId: 'food_a', qty: 1 }], 'food_a', 1)
    expect(lines).toEqual([{ foodId: 'food_a', qty: 2 }])
  })
})

describe('removeFromCart', () => {
  it('drops the matching line', () => {
    expect(removeFromCart([{ foodId: 'food_a', qty: 2 }], 'food_a')).toEqual([])
  })
})
