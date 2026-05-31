/**
 * Adjust a future amount to today's money equivalent,
 * accounting for prices rising over time.
 *
 * @param futureAmount - The amount in future money
 * @param annualPriceRisePercent - Annual price rise rate in percentage points
 * @param years - Number of years in the future
 */
export function toTodayEquivalent(
  futureAmount: number,
  annualPriceRisePercent: number,
  years: number
): number {
  if (annualPriceRisePercent === 0 || years === 0) return futureAmount;
  const divisor = Math.pow(1 + annualPriceRisePercent / 100, years);
  return futureAmount / divisor;
}

/**
 * Adjust a today's amount to a future equivalent,
 * accounting for prices rising over time.
 */
export function toFutureEquivalent(
  todayAmount: number,
  annualPriceRisePercent: number,
  years: number
): number {
  if (annualPriceRisePercent === 0 || years === 0) return todayAmount;
  return todayAmount * Math.pow(1 + annualPriceRisePercent / 100, years);
}
