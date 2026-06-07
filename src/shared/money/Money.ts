/**
 * Value object for amounts the API returns as integers in minor currency units
 * (e.g. 1250 = 12.50). Never do float arithmetic on money — operate on minor
 * units and format only at the edge.
 */
export class Money {
  readonly #minorUnits: number

  private constructor(minorUnits: number) {
    this.#minorUnits = minorUnits
  }

  static fromMinor(minorUnits: number): Money {
    if (!Number.isInteger(minorUnits)) {
      throw new Error(`Money.fromMinor expects an integer, got ${minorUnits}`)
    }
    return new Money(minorUnits)
  }

  static zero(): Money {
    return new Money(0)
  }

  toMinor(): number {
    return this.#minorUnits
  }

  add(other: Money): Money {
    return new Money(this.#minorUnits + other.#minorUnits)
  }

  subtract(other: Money): Money {
    return new Money(this.#minorUnits - other.#minorUnits)
  }

  multiply(factor: number): Money {
    return new Money(Math.round(this.#minorUnits * factor))
  }

  isZero(): boolean {
    return this.#minorUnits === 0
  }

  format(options?: { locale?: string; currency?: string }): string {
    return formatMoney(this.#minorUnits, options)
  }
}

export function formatMoney(
  minorUnits: number,
  options?: { locale?: string; currency?: string },
): string {
  const major = minorUnits / 100
  const formatter = new Intl.NumberFormat(options?.locale ?? 'en-US', {
    style: 'currency',
    currency: options?.currency ?? 'USD',
    currencyDisplay: 'narrowSymbol',
  })
  return formatter.format(major)
}
