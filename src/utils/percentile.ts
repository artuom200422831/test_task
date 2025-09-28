export function percentile(values: number[], p: number): number {
  if (values.length === 0) return NaN
  const sorted = [...values].sort((a, b) => a - b)
  if (p <= 0) return sorted[0]
  if (p >= 100) return sorted[sorted.length - 1]

  const rank = (p / 100) * (sorted.length - 1)
  const lower = Math.floor(rank)
  const upper = Math.ceil(rank)
  const frac = rank - lower
  if (upper === lower) return sorted[lower]
  return sorted[lower] + frac * (sorted[upper] - sorted[lower])
}