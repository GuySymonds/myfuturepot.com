import { describe, it, expect } from 'vitest';
import { buildAssumptionsSummary } from '../components/AssumptionsPanel';
import type { PensionInputs } from '../types/pension';

const baseInputs: PensionInputs = {
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

describe('buildAssumptionsSummary', () => {
  it('includes monthly salary in the summary', () => {
    const summary = buildAssumptionsSummary(baseInputs);
    expect(summary).toContain('£1,800 monthly salary');
  });

  it('includes employee contribution in the summary', () => {
    const summary = buildAssumptionsSummary(baseInputs);
    expect(summary).toContain('5.0% employee');
  });

  it('includes employer contribution in the summary', () => {
    const summary = buildAssumptionsSummary(baseInputs);
    expect(summary).toContain('3.0% employer');
  });

  it('includes investment growth in the summary', () => {
    const summary = buildAssumptionsSummary(baseInputs);
    expect(summary).toContain('5.0% growth');
  });

  it('includes prices rising in the summary', () => {
    const summary = buildAssumptionsSummary(baseInputs);
    expect(summary).toContain('2.5% prices rising');
  });

  it('includes retirement age in the summary', () => {
    const summary = buildAssumptionsSummary(baseInputs);
    expect(summary).toContain('retire at 60');
  });

  it('updates correctly when salary changes', () => {
    const updated = { ...baseInputs, monthlySalary: 2500 };
    const summary = buildAssumptionsSummary(updated);
    expect(summary).toContain('£2,500 monthly salary');
  });

  it('updates correctly when retirement age changes', () => {
    const updated = { ...baseInputs, retirementAge: 65 };
    const summary = buildAssumptionsSummary(updated);
    expect(summary).toContain('retire at 65');
  });
});
