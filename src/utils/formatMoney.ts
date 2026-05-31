/**
 * Format a number as GBP currency.
 * Large numbers are abbreviated (K, M) for display purposes.
 */
export function formatMoney(amount: number, abbreviated = false): string {
  if (abbreviated) {
    if (Math.abs(amount) >= 1_000_000) {
      return `£${(amount / 1_000_000).toFixed(2)}m`;
    }
    if (Math.abs(amount) >= 1_000) {
      return `£${(amount / 1_000).toFixed(1)}k`;
    }
  }
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a number as a percentage string.
 */
export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format a multiplier, e.g. 3.45 → "3.45×"
 */
export function formatMultiplier(value: number): string {
  return `${value.toFixed(2)}×`;
}
