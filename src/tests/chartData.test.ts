import { describe, it, expect } from 'vitest';
import { buildChartData } from '../utils/buildChartData';
import { DEFAULT_COMPARISON_INPUTS } from '../calculations/defaultComparison';
import { calculatePension } from '../calculations/pensionCalculator';
import type { PensionInputs } from '../types/pension';

const defaultCurrentInputs: PensionInputs = {
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

describe('DEFAULT_COMPARISON_INPUTS', () => {
  it('has zero contribution increase', () => {
    expect(DEFAULT_COMPARISON_INPUTS.annualEmployeeContributionIncreasePercentPoints).toBe(0);
  });

  it('starts at age 18', () => {
    expect(DEFAULT_COMPARISON_INPUTS.startAge).toBe(18);
  });

  it('retires at age 60', () => {
    expect(DEFAULT_COMPARISON_INPUTS.retirementAge).toBe(60);
  });

  it('keeps employee contribution fixed at 5% throughout', () => {
    const result = calculatePension(DEFAULT_COMPARISON_INPUTS);
    for (const year of result.yearlyResults) {
      expect(year.employeeContributionPercent).toBeCloseTo(5, 5);
    }
  });
});

describe('buildChartData', () => {
  it('returns an array of chart points', () => {
    const data = buildChartData(defaultCurrentInputs);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  it('each point has an age field', () => {
    const data = buildChartData(defaultCurrentInputs);
    for (const point of data) {
      expect(typeof point.age).toBe('number');
    }
  });

  it('each point has currentPotValue and defaultPotValue fields', () => {
    const data = buildChartData(defaultCurrentInputs);
    for (const point of data) {
      expect('currentPotValue' in point).toBe(true);
      expect('defaultPotValue' in point).toBe(true);
    }
  });

  it('each point has today-equivalent fields', () => {
    const data = buildChartData(defaultCurrentInputs);
    for (const point of data) {
      expect('currentPotValueTodayEquivalent' in point).toBe(true);
      expect('defaultPotValueTodayEquivalent' in point).toBe(true);
    }
  });

  it('ages are in ascending order', () => {
    const data = buildChartData(defaultCurrentInputs);
    for (let i = 1; i < data.length; i++) {
      expect(data[i].age).toBeGreaterThan(data[i - 1].age);
    }
  });

  it('covers the full range from current start to current retirement', () => {
    const data = buildChartData(defaultCurrentInputs);
    const ages = data.map((d) => d.age);
    expect(ages).toContain(defaultCurrentInputs.startAge);
    expect(ages[ages.length - 1]).toBeLessThan(defaultCurrentInputs.retirementAge);
  });

  it('default values are present at ages 18–59', () => {
    const data = buildChartData(defaultCurrentInputs);
    const age30 = data.find((d) => d.age === 30);
    expect(age30?.defaultPotValue).toBeGreaterThan(0);
    expect(age30?.defaultPotValueTodayEquivalent).toBeGreaterThan(0);
  });

  it('default comparison inputs are not mutated by chart data construction', () => {
    const originalIncrease = DEFAULT_COMPARISON_INPUTS.annualEmployeeContributionIncreasePercentPoints;
    buildChartData({ ...defaultCurrentInputs, annualEmployeeContributionIncreasePercentPoints: 2 });
    expect(DEFAULT_COMPARISON_INPUTS.annualEmployeeContributionIncreasePercentPoints).toBe(originalIncrease);
  });

  it('current values are null before the current start age when start age > 18', () => {
    const inputs: PensionInputs = { ...defaultCurrentInputs, startAge: 25 };
    const data = buildChartData(inputs);
    const age20 = data.find((d) => d.age === 20);
    // age 20 is before start age 25, so current values should be null
    expect(age20?.currentPotValue).toBeNull();
    expect(age20?.defaultPotValue).toBeGreaterThan(0);
  });

  it('chart mode selects correct fields', () => {
    const data = buildChartData(defaultCurrentInputs);
    const point = data.find((d) => d.age === 40);
    if (!point) return;
    // Pot mode: use currentPotValue / defaultPotValue
    expect(point.currentPotValue).not.toBeNull();
    expect(point.defaultPotValue).not.toBeNull();
    // Today mode: use currentPotValueTodayEquivalent / defaultPotValueTodayEquivalent
    expect(point.currentPotValueTodayEquivalent).not.toBeNull();
    expect(point.defaultPotValueTodayEquivalent).not.toBeNull();
    // Today values should be less than pot values (inflation-adjusted)
    expect(point.currentPotValueTodayEquivalent!).toBeLessThan(point.currentPotValue!);
    expect(point.defaultPotValueTodayEquivalent!).toBeLessThan(point.defaultPotValue!);
  });
});
