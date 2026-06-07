/** Id generator for in-memory mock repositories. */
export function createId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`
}
