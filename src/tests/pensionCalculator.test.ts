import { describe, it, expect } from 'vitest';
import { calculatePension } from '../calculations/pensionCalculator';
import type { PensionInputs } from '../types/pension';

const defaultInputs: PensionInputs = {
  startAge: 18,
  retirementAge: 60,
  monthlySalary: 1800,
  employeeContributionPercent: 5,
  employerContributionPercent: 3,
  annualPayRisePercent: 3,
  annualEmployeeContributionIncreasePercentPoints: 0.5,
  maxEmployeeContributionPercent: 12,
  annualInvestmentGrowthPercent: 5,
  annualFeePercent: 0.5,
  annualPriceRisePercent: 2.5,
  taxReliefEnabled: true,
};

describe('pensionCalculator', () => {
  it('returns an empty result when retirementAge <= startAge', () => {
    const result = calculatePension({ ...defaultInputs, startAge: 60, retirementAge: 60 });
    expect(result.estimatedPotAtRetirement).toBe(0);
    expect(result.yearlyResults).toHaveLength(0);
  });

  it('produces the correct number of yearly results', () => {
    const result = calculatePension(defaultInputs);
    const expectedYears = defaultInputs.retirementAge - defaultInputs.startAge;
    expect(result.yearlyResults).toHaveLength(expectedYears);
  });

  it('pot value is always growing (with positive net growth and contributions)', () => {
    const result = calculatePension(defaultInputs);
    for (let i = 1; i < result.yearlyResults.length; i++) {
      expect(result.yearlyResults[i].potValue).toBeGreaterThan(
        result.yearlyResults[i - 1].potValue
      );
    }
  });

  it('total employee contributions are positive', () => {
    const result = calculatePension(defaultInputs);
    expect(result.totalEmployeeContributions).toBeGreaterThan(0);
  });

  it('total employer contributions are positive', () => {
    const result = calculatePension(defaultInputs);
    expect(result.totalEmployerContributions).toBeGreaterThan(0);
  });

  it('tax relief is positive when enabled', () => {
    const result = calculatePension(defaultInputs);
    expect(result.totalTaxRelief).toBeGreaterThan(0);
  });

  it('tax relief is zero when disabled', () => {
    const result = calculatePension({ ...defaultInputs, taxReliefEnabled: false });
    expect(result.totalTaxRelief).toBe(0);
  });

  it('pot at retirement is greater when tax relief is enabled', () => {
    const withRelief = calculatePension(defaultInputs);
    const withoutRelief = calculatePension({ ...defaultInputs, taxReliefEnabled: false });
    expect(withRelief.estimatedPotAtRetirement).toBeGreaterThan(
      withoutRelief.estimatedPotAtRetirement
    );
  });

  describe('contribution percentage increases', () => {
    it('employee contribution increases each year until reaching the maximum', () => {
      const result = calculatePension({
        ...defaultInputs,
        annualEmployeeContributionIncreasePercentPoints: 1,
        maxEmployeeContributionPercent: 10,
        employeeContributionPercent: 5,
      });

      // Year 1: 5%, year 2: 6%, ... year 5: 10%, year 6: 10% (capped)
      expect(result.yearlyResults[0].employeeContributionPercent).toBeCloseTo(5, 5);
      expect(result.yearlyResults[1].employeeContributionPercent).toBeCloseTo(6, 5);
      expect(result.yearlyResults[4].employeeContributionPercent).toBeCloseTo(9, 5);
      expect(result.yearlyResults[5].employeeContributionPercent).toBeCloseTo(10, 5);
    });

    it('contribution is never above the maximum', () => {
      const result = calculatePension({
        ...defaultInputs,
        annualEmployeeContributionIncreasePercentPoints: 2,
        maxEmployeeContributionPercent: 8,
      });

      for (const year of result.yearlyResults) {
        expect(year.employeeContributionPercent).toBeLessThanOrEqual(8);
      }
    });

    it('contribution stays flat when increase is 0', () => {
      const result = calculatePension({
        ...defaultInputs,
        annualEmployeeContributionIncreasePercentPoints: 0,
        employeeContributionPercent: 5,
      });

      for (const year of result.yearlyResults) {
        expect(year.employeeContributionPercent).toBeCloseTo(5, 5);
      }
    });
  });

  it('investment growth is the difference between pot and total contributions', () => {
    const result = calculatePension(defaultInputs);
    const last = result.yearlyResults[result.yearlyResults.length - 1];
    const totalContribs =
      last.totalEmployeeContributions + last.totalEmployerContributions + last.totalTaxRelief;
    expect(result.totalInvestmentGrowth).toBeCloseTo(last.potValue - totalContribs, 0);
  });

  it('a larger employer contribution produces a bigger pot', () => {
    const base = calculatePension(defaultInputs);
    const bigger = calculatePension({ ...defaultInputs, employerContributionPercent: 10 });
    expect(bigger.estimatedPotAtRetirement).toBeGreaterThan(base.estimatedPotAtRetirement);
  });

  it('a higher investment growth produces a bigger pot', () => {
    const base = calculatePension(defaultInputs);
    const higher = calculatePension({ ...defaultInputs, annualInvestmentGrowthPercent: 8 });
    expect(higher.estimatedPotAtRetirement).toBeGreaterThan(base.estimatedPotAtRetirement);
  });

  it('a higher fee produces a smaller pot', () => {
    const base = calculatePension(defaultInputs);
    const higherFee = calculatePension({ ...defaultInputs, annualFeePercent: 2 });
    expect(higherFee.estimatedPotAtRetirement).toBeLessThan(base.estimatedPotAtRetirement);
  });
});
