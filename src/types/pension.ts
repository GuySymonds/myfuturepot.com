export type PensionInputs = {
  startAge: number;
  retirementAge: number;
  monthlySalary: number;
  employeeContributionPercent: number;
  employerContributionPercent: number;
  annualPayRisePercent: number;
  annualEmployeeContributionIncreasePercentPoints: number;
  maxEmployeeContributionPercent: number;
  annualInvestmentGrowthPercent: number;
  annualFeePercent: number;
  annualPriceRisePercent: number;
  taxReliefEnabled: boolean;
};

export type PensionYearResult = {
  age: number;
  year: number;
  monthlySalary: number;
  employeeContributionPercent: number;
  employerContributionPercent: number;
  monthlyEmployeeContribution: number;
  monthlyEmployerContribution: number;
  monthlyTaxRelief: number;
  yearlyEmployeeContribution: number;
  yearlyEmployerContribution: number;
  yearlyTaxRelief: number;
  totalEmployeeContributions: number;
  totalEmployerContributions: number;
  totalTaxRelief: number;
  totalContributions: number;
  potValue: number;
  potValueTodayEquivalent: number;
  investmentGrowth: number;
};

export type PensionSummary = {
  yearlyResults: PensionYearResult[];
  estimatedPotAtRetirement: number;
  potTodayEquivalent: number;
  totalEmployeeContributions: number;
  totalEmployerContributions: number;
  totalTaxRelief: number;
  totalInvestmentGrowth: number;
  finalMonthlySalary: number;
  finalEmployeeContributionPercent: number;
};

export type WaitingComparisonResult = {
  startAge: number;
  potAtRetirement: number;
  potTodayEquivalent: number;
  differenceFromEarliest: number;
  differenceFromEarliestToday: number;
};

export type QuickGrowthInputs = {
  startAge: number;
  targetAge: number;
  annualGrowthPercent: number;
  annualFeePercent: number;
  annualPriceRisePercent: number;
};

export type QuickGrowthResult = {
  potAtTargetAge: number;
  whatItCouldBuyToday: number;
  growthMultiplier: number;
};
