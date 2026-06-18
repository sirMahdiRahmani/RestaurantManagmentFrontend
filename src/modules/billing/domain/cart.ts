export interface CartLine {
  foodId: string
  qty: number
}

export function addToCart(lines: CartLine[], foodId: string): CartLine[] {
  const existing = lines.find((line) => line.foodId === foodId)
  if (existing) {
    return lines.map((line) => (line.foodId === foodId ? { ...line, qty: line.qty + 1 } : line))
  }
  return [...lines, { foodId, qty: 1 }]
}

export function changeQty(lines: CartLine[], foodId: string, delta: number): CartLine[] {
  return lines
    .map((line) => (line.foodId === foodId ? { ...line, qty: line.qty + delta } : line))
    .filter((line) => line.qty > 0)
}

export function removeFromCart(lines: CartLine[], foodId: string): CartLine[] {
  return lines.filter((line) => line.foodId !== foodId)
}
