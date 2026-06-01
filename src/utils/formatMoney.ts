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

/**
 * Format a large integer quantity compactly for buying-power display.
 * e.g. 43106 → "43k", 1500000 → "1.5m", 999 → "999"
 */
export function formatCompactQuantity(value: number): string {
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    return m % 1 === 0 ? `${m}m` : `${parseFloat(m.toFixed(1))}m`;
  }
  if (value >= 1_000) {
    const k = value / 1_000;
    return k % 1 === 0 ? `${k}k` : `${parseFloat(k.toFixed(1))}k`;
  }
  return String(value);
}

/**
 * Format a decimal item count for everyday item growth display.
 * Small counts (< 1000): one decimal place if not a whole number, e.g. 6.4, 47
 * Large counts (>= 1000): compact format, e.g. 1.2k, 12.5k
 */
export function formatItemCount(value: number): string {
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    return `${parseFloat(m.toFixed(1))}m`;
  }
  if (value >= 1_000) {
    const k = value / 1_000;
    return `${parseFloat(k.toFixed(1))}k`;
  }
  // Round to 1 decimal place for small numbers
  const rounded = Math.round(value * 10) / 10;
  return rounded % 1 === 0 ? String(Math.round(rounded)) : rounded.toFixed(1);
}
