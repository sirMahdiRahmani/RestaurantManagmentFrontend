import { describe, expect, it } from 'vitest'
import { Money, formatMoney } from './Money'

describe('Money', () => {
  it('formats minor units as currency', () => {
    expect(formatMoney(1250)).toBe('$12.50')
  })

  it('adds and subtracts without float drift', () => {
    const total = Money.fromMinor(1000).add(Money.fromMinor(250)).subtract(Money.fromMinor(50))
    expect(total.toMinor()).toBe(1200)
  })

  it('multiplies and rounds to the nearest minor unit', () => {
    expect(Money.fromMinor(1000).multiply(0.1).toMinor()).toBe(100)
    expect(Money.fromMinor(333).multiply(1 / 3).toMinor()).toBe(111)
  })

  it('rejects non-integer minor units', () => {
    expect(() => Money.fromMinor(12.5)).toThrow()
  })
})
