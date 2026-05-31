/**
 * Calculate monthly compound growth rate from an annual net rate.
 * annualNetRate is in percentage points, e.g. 4.5 for 4.5%
 */
export function monthlyGrowthRate(annualNetRatePercent: number): number {
  return Math.pow(1 + annualNetRatePercent / 100, 1 / 12) - 1;
}

/**
 * Grow a starting amount over a number of months using monthly compounding.
 * No contributions — pure growth of a lump sum.
 */
export function growLumpSum(
  principal: number,
  annualNetRatePercent: number,
  months: number
): number {
  const rate = monthlyGrowthRate(annualNetRatePercent);
  return principal * Math.pow(1 + rate, months);
}

/**
 * Calculate the net annual growth rate after subtracting fees.
 */
export function netAnnualGrowthRate(
  annualGrowthPercent: number,
  annualFeePercent: number
): number {
  return annualGrowthPercent - annualFeePercent;
}
