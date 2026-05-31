import type { PensionInputs, PensionYearResult, PensionSummary } from '../types/pension';
import { monthlyGrowthRate, netAnnualGrowthRate } from './compoundInterest';
import { toTodayEquivalent } from './inflation';

/**
 * Run a full pension pot simulation month by month.
 * Returns a year-by-year breakdown plus a summary.
 */
export function calculatePension(inputs: PensionInputs): PensionSummary {
  const {
    startAge,
    retirementAge,
    monthlySalary: initialMonthlySalary,
    employeeContributionPercent: initialEmployeeContrib,
    employerContributionPercent,
    annualPayRisePercent,
    annualEmployeeContributionIncreasePercentPoints,
    maxEmployeeContributionPercent,
    annualInvestmentGrowthPercent,
    annualFeePercent,
    annualPriceRisePercent,
    taxReliefEnabled,
  } = inputs;

  const totalYears = retirementAge - startAge;
  if (totalYears <= 0) {
    return emptyResult();
  }

  const annualNetRate = netAnnualGrowthRate(annualInvestmentGrowthPercent, annualFeePercent);
  const monthRate = monthlyGrowthRate(annualNetRate);

  let potValue = 0;
  let currentSalary = initialMonthlySalary;
  let currentEmployeeContrib = initialEmployeeContrib;

  let totalEmployeeContributions = 0;
  let totalEmployerContributions = 0;
  let totalTaxRelief = 0;

  const yearlyResults: PensionYearResult[] = [];

  for (let yearIndex = 0; yearIndex < totalYears; yearIndex++) {
    const age = startAge + yearIndex;
    const yearNumber = yearIndex + 1;

    let yearlyEmployeeContrib = 0;
    let yearlyEmployerContrib = 0;
    let yearlyTaxReliefAmount = 0;

    const monthlyEmployeeContrib = (currentSalary * currentEmployeeContrib) / 100;
    const monthlyEmployerContrib = (currentSalary * employerContributionPercent) / 100;
    const monthlyTaxRelief = taxReliefEnabled ? monthlyEmployeeContrib * 0.25 : 0;

    // Monthly compounding for 12 months
    for (let month = 0; month < 12; month++) {
      const totalMonthlyContribution =
        monthlyEmployeeContrib + monthlyEmployerContrib + monthlyTaxRelief;
      potValue += totalMonthlyContribution;
      potValue *= 1 + monthRate;

      yearlyEmployeeContrib += monthlyEmployeeContrib;
      yearlyEmployerContrib += monthlyEmployerContrib;
      yearlyTaxReliefAmount += monthlyTaxRelief;
    }

    totalEmployeeContributions += yearlyEmployeeContrib;
    totalEmployerContributions += yearlyEmployerContrib;
    totalTaxRelief += yearlyTaxReliefAmount;

    const totalContribs = totalEmployeeContributions + totalEmployerContributions + totalTaxRelief;
    const investmentGrowth = potValue - totalContribs;

    const yearsFromNow = yearNumber;
    const potToday = toTodayEquivalent(potValue, annualPriceRisePercent, yearsFromNow);

    yearlyResults.push({
      age,
      year: yearNumber,
      monthlySalary: currentSalary,
      employeeContributionPercent: currentEmployeeContrib,
      employerContributionPercent,
      monthlyEmployeeContribution: monthlyEmployeeContrib,
      monthlyEmployerContribution: monthlyEmployerContrib,
      monthlyTaxRelief,
      yearlyEmployeeContribution: yearlyEmployeeContrib,
      yearlyEmployerContribution: yearlyEmployerContrib,
      yearlyTaxRelief: yearlyTaxReliefAmount,
      totalEmployeeContributions,
      totalEmployerContributions,
      totalTaxRelief,
      totalContributions: totalContribs,
      potValue,
      potValueTodayEquivalent: potToday,
      investmentGrowth,
    });

    // End-of-year adjustments
    currentSalary = currentSalary * (1 + annualPayRisePercent / 100);
    currentEmployeeContrib = Math.min(
      currentEmployeeContrib + annualEmployeeContributionIncreasePercentPoints,
      maxEmployeeContributionPercent
    );
  }

  const lastYear = yearlyResults[yearlyResults.length - 1];
  const finalPot = lastYear?.potValue ?? 0;
  const finalPotToday = lastYear?.potValueTodayEquivalent ?? 0;
  const totalContribsFinal =
    totalEmployeeContributions + totalEmployerContributions + totalTaxRelief;

  return {
    yearlyResults,
    estimatedPotAtRetirement: finalPot,
    potTodayEquivalent: finalPotToday,
    totalEmployeeContributions,
    totalEmployerContributions,
    totalTaxRelief,
    totalInvestmentGrowth: finalPot - totalContribsFinal,
    finalMonthlySalary: lastYear?.monthlySalary ?? initialMonthlySalary,
    finalEmployeeContributionPercent: lastYear?.employeeContributionPercent ?? initialEmployeeContrib,
  };
}

function emptyResult(): PensionSummary {
  return {
    yearlyResults: [],
    estimatedPotAtRetirement: 0,
    potTodayEquivalent: 0,
    totalEmployeeContributions: 0,
    totalEmployerContributions: 0,
    totalTaxRelief: 0,
    totalInvestmentGrowth: 0,
    finalMonthlySalary: 0,
    finalEmployeeContributionPercent: 0,
  };
}
