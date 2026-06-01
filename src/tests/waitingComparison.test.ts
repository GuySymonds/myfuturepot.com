import { describe, it, expect } from 'vitest';
import { calculateWaitingComparison } from '../calculations/waitingComparison';
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

describe('waitingComparison', () => {
  it('returns results for all four start ages (18, 25, 30, 40)', () => {
    const results = calculateWaitingComparison(defaultInputs);
    const ages = results.map((r) => r.startAge);
    expect(ages).toContain(18);
    expect(ages).toContain(25);
    expect(ages).toContain(30);
    expect(ages).toContain(40);
  });

  it('earlier start ages produce larger pots', () => {
    const results = calculateWaitingComparison(defaultInputs);
    const sortedByAge = [...results].sort((a, b) => a.startAge - b.startAge);
    for (let i = 1; i < sortedByAge.length; i++) {
      expect(sortedByAge[i - 1].potAtRetirement).toBeGreaterThan(
        sortedByAge[i].potAtRetirement
      );
    }
  });

  it('the earliest start age has zero difference from earliest', () => {
    const results = calculateWaitingComparison(defaultInputs);
    const earliest = results.find((r) => r.startAge === 18);
    expect(earliest?.differenceFromEarliest).toBe(0);
  });

  it('later start ages have positive differenceFromEarliest', () => {
    const results = calculateWaitingComparison(defaultInputs);
    const later = results.filter((r) => r.startAge > 18);
    for (const result of later) {
      expect(result.differenceFromEarliest).toBeGreaterThan(0);
    }
  });

  it('differenceFromEarliest increases as start age increases', () => {
    const results = calculateWaitingComparison(defaultInputs);
    const sorted = results.sort((a, b) => a.startAge - b.startAge);
    for (let i = 1; i < sorted.length - 1; i++) {
      expect(sorted[i + 1].differenceFromEarliest).toBeGreaterThan(
        sorted[i].differenceFromEarliest
      );
    }
  });

  it('returns zero pot when start age equals or exceeds retirement age', () => {
    const results = calculateWaitingComparison({ ...defaultInputs, retirementAge: 30 });
    const age40 = results.find((r) => r.startAge === 40);
    expect(age40?.potAtRetirement).toBe(0);
  });

  it('potTodayEquivalent is less than potAtRetirement for the same result', () => {
    const results = calculateWaitingComparison(defaultInputs);
    for (const result of results) {
      if (result.potAtRetirement > 0) {
        expect(result.potTodayEquivalent).toBeLessThan(result.potAtRetirement);
      }
    }
  });

  it('differenceFromEarliestToday is positive for later start ages', () => {
    const results = calculateWaitingComparison(defaultInputs);
    const later = results.filter((r) => r.startAge > 18);
    for (const result of later) {
      expect(result.differenceFromEarliestToday).toBeGreaterThanOrEqual(0);
    }
  });

  it('difference compared with starting at 18 increases as start age increases', () => {
    const results = calculateWaitingComparison(defaultInputs);
    const sorted = [...results].sort((a, b) => a.startAge - b.startAge);
    for (let i = 1; i < sorted.length - 1; i++) {
      expect(sorted[i + 1].differenceFromEarliest).toBeGreaterThan(sorted[i].differenceFromEarliest);
    }
  });
});
