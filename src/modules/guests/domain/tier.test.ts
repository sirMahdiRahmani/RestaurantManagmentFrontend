import { describe, expect, it } from 'vitest'
import { tierForVisits } from './tier'

describe('tierForVisits', () => {
  it('starts at member', () => {
    expect(tierForVisits(0)).toBe('member')
    expect(tierForVisits(4)).toBe('member')
  })

  it('promotes to silver at 5 visits', () => {
    expect(tierForVisits(5)).toBe('silver')
    expect(tierForVisits(14)).toBe('silver')
  })

  it('promotes to gold at 15 visits', () => {
    expect(tierForVisits(15)).toBe('gold')
    expect(tierForVisits(29)).toBe('gold')
  })

  it('promotes to platinum at 30 visits', () => {
    expect(tierForVisits(30)).toBe('platinum')
    expect(tierForVisits(100)).toBe('platinum')
  })
})
