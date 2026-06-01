import type { PensionInputs } from '../types/pension';

/**
 * Default comparison assumptions used for the grey "Default example" line
 * on the pot-through-the-years chart.
 *
 * Key: annualEmployeeContributionIncreasePercentPoints is 0, so the
 * employee contribution stays fixed at 5% throughout.
 */
export const DEFAULT_COMPARISON_INPUTS: PensionInputs = {
  startAge: 18,
  retirementAge: 60,
  monthlySalary: 1800,
  employeeContributionPercent: 5,
  employerContributionPercent: 3,
  annualPayRisePercent: 3,
  annualEmployeeContributionIncreasePercentPoints: 0,
  maxEmployeeContributionPercent: 12,
  annualInvestmentGrowthPercent: 5,
  annualFeePercent: 0.5,
  annualPriceRisePercent: 2.5,
  taxReliefEnabled: true,
};
