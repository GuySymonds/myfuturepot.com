import { describe, it, expect } from 'vitest';
import { calculateEverydayItemGrowthExamples } from '../calculations/everydayItemGrowth';
import { everydayItemExamples } from '../data/todayPrices';
import { formatItemCount } from '../utils/formatMoney';

const defaultInputs = {
  items: everydayItemExamples,
  startAges: [18, 25, 30, 40],
  retirementAge: 60,
  annualInvestmentGrowthPercent: 5,
  annualFeePercent: 0.5,
  annualPriceRisePercent: 2.5,
};

describe('calculateEverydayItemGrowthExamples', () => {
  it('calculates growth from one item price', () => {
    const results = calculateEverydayItemGrowthExamples(defaultInputs);
    const pint18 = results.find((r) => r.itemId === 'pint' && r.startAge === 18);
    expect(pint18).toBeDefined();
    expect(pint18!.futureValueAtRetirement).toBeGreaterThan(pint18!.currentPrice);
    expect(pint18!.equivalentItemCount).toBeGreaterThan(1);
  });

  it('returns results for all four start ages 18, 25, 30 and 40', () => {
    const results = calculateEverydayItemGrowthExamples(defaultInputs);
    const pintResults = results.filter((r) => r.itemId === 'pint');
    const ages = pintResults.map((r) => r.startAge);
    expect(ages).toContain(18);
    expect(ages).toContain(25);
    expect(ages).toContain(30);
    expect(ages).toContain(40);
  });

  it('earlier start ages produce a higher equivalent item count', () => {
    const results = calculateEverydayItemGrowthExamples(defaultInputs);
    const pint18 = results.find((r) => r.itemId === 'pint' && r.startAge === 18)!;
    const pint25 = results.find((r) => r.itemId === 'pint' && r.startAge === 25)!;
    const pint40 = results.find((r) => r.itemId === 'pint' && r.startAge === 40)!;
    expect(pint18.equivalentItemCount).toBeGreaterThan(pint25.equivalentItemCount);
    expect(pint25.equivalentItemCount).toBeGreaterThan(pint40.equivalentItemCount);
  });

  it('uses monthly compounding — result differs from annual compounding', () => {
    // Monthly compounding should produce a slightly higher result than annual
    const results = calculateEverydayItemGrowthExamples(defaultInputs);
    const pint18 = results.find((r) => r.itemId === 'pint' && r.startAge === 18)!;
    // Net rate 4.5% over 42 years, monthly compounding
    const years = 60 - 18;
    const annualCompound = 5.15 * Math.pow(1 + 4.5 / 100, years);
    // Monthly should be slightly more
    expect(pint18.futureValueAtRetirement).toBeGreaterThan(annualCompound);
  });

  it('adjusts using annual price rise to get todayEquivalentValue', () => {
    const results = calculateEverydayItemGrowthExamples(defaultInputs);
    const pint18 = results.find((r) => r.itemId === 'pint' && r.startAge === 18)!;
    // Today equivalent must be less than future value
    expect(pint18.todayEquivalentValue).toBeLessThan(pint18.futureValueAtRetirement);
  });

  it('equivalentItemCount equals todayEquivalentValue / currentPrice', () => {
    const results = calculateEverydayItemGrowthExamples(defaultInputs);
    for (const r of results) {
      expect(r.equivalentItemCount).toBeCloseTo(r.todayEquivalentValue / r.currentPrice, 5);
    }
  });

  it('result has expected shape with all required fields', () => {
    const results = calculateEverydayItemGrowthExamples(defaultInputs);
    const first = results[0];
    expect(first).toHaveProperty('itemId');
    expect(first).toHaveProperty('label');
    expect(first).toHaveProperty('emoji');
    expect(first).toHaveProperty('unitNameSingular');
    expect(first).toHaveProperty('unitNamePlural');
    expect(first).toHaveProperty('currentPrice');
    expect(first).toHaveProperty('startAge');
    expect(first).toHaveProperty('retirementAge');
    expect(first).toHaveProperty('futureValueAtRetirement');
    expect(first).toHaveProperty('todayEquivalentValue');
    expect(first).toHaveProperty('equivalentItemCount');
  });

  it('returns one result per item per start age', () => {
    const results = calculateEverydayItemGrowthExamples(defaultInputs);
    expect(results).toHaveLength(
      defaultInputs.items.length * defaultInputs.startAges.length
    );
  });

  it('produces equivalentItemCount of 1 when start age equals retirement age', () => {
    const results = calculateEverydayItemGrowthExamples({
      ...defaultInputs,
      startAges: [60],
      retirementAge: 60,
    });
    for (const r of results) {
      expect(r.equivalentItemCount).toBe(1);
    }
  });
});

describe('formatItemCount', () => {
  it('formats small numbers to one decimal place', () => {
    expect(formatItemCount(6.4)).toBe('6.4');
    expect(formatItemCount(6.0)).toBe('6');
    expect(formatItemCount(47)).toBe('47');
  });

  it('formats thousands with one decimal k', () => {
    expect(formatItemCount(1200)).toBe('1.2k');
    expect(formatItemCount(12500)).toBe('12.5k');
    expect(formatItemCount(1000)).toBe('1k');
  });

  it('formats millions with one decimal m', () => {
    expect(formatItemCount(1_200_000)).toBe('1.2m');
  });

  it('does not duplicate unit labels in item results', () => {
    const results = calculateEverydayItemGrowthExamples(defaultInputs);
    for (const r of results) {
      // unitNameSingular and unitNamePlural should not contain the other's text
      expect(r.unitNamePlural).not.toBe(r.unitNameSingular);
      // The label should not duplicate the unit name
      const countStr = formatItemCount(r.equivalentItemCount);
      const unit = r.equivalentItemCount >= 1.95 ? r.unitNamePlural : r.unitNameSingular;
      const fullText = `${countStr} ${unit}`;
      // Should not contain duplicate words like "loaves loaves"
      const words = fullText.toLowerCase().split(' ');
      for (let i = 1; i < words.length; i++) {
        expect(words[i]).not.toBe(words[i - 1]);
      }
    }
  });
});
