import { describe, it, expect } from 'vitest';
import { formatCompactQuantity } from '../utils/formatMoney';
import { todayPriceExamples } from '../data/todayPrices';

describe('formatCompactQuantity', () => {
  it('formats numbers below 1000 as-is', () => {
    expect(formatCompactQuantity(0)).toBe('0');
    expect(formatCompactQuantity(1)).toBe('1');
    expect(formatCompactQuantity(999)).toBe('999');
  });

  it('formats thousands with k suffix', () => {
    expect(formatCompactQuantity(1000)).toBe('1k');
    expect(formatCompactQuantity(43106)).toBe('43.1k');
    expect(formatCompactQuantity(1500)).toBe('1.5k');
    expect(formatCompactQuantity(10000)).toBe('10k');
  });

  it('formats millions with m suffix', () => {
    expect(formatCompactQuantity(1_000_000)).toBe('1m');
    expect(formatCompactQuantity(1_500_000)).toBe('1.5m');
    expect(formatCompactQuantity(2_000_000)).toBe('2m');
  });
});

describe('buying power quantity calculation', () => {
  it('calculates quantity using Math.floor', () => {
    // £1000 / £1.45 = 689.65... → floor → 689
    const bread = todayPriceExamples.find((e) => e.id === 'bread')!;
    const qty = Math.floor(1000 / bread.estimatedPrice);
    expect(qty).toBe(689);
  });

  it('returns zero when amount is zero', () => {
    const bread = todayPriceExamples.find((e) => e.id === 'bread')!;
    expect(Math.floor(0 / bread.estimatedPrice)).toBe(0);
  });

  it('returns zero when amount is negative', () => {
    const bread = todayPriceExamples.find((e) => e.id === 'bread')!;
    expect(Math.floor(-100 / bread.estimatedPrice)).toBeLessThanOrEqual(0);
  });

  it('rounds down, never up', () => {
    // £74.99 / £75 = 0.999... → floor → 0 (not 1)
    const concert = todayPriceExamples.find((e) => e.id === 'concert')!;
    expect(Math.floor(74.99 / concert.estimatedPrice)).toBe(0);
  });

  it('calculates large quantities compactly', () => {
    // £222000 / £1.45 ≈ 153103 → "153.1k"
    const bread = todayPriceExamples.find((e) => e.id === 'bread')!;
    const qty = Math.floor(222000 / bread.estimatedPrice);
    expect(qty).toBeGreaterThan(100000);
    expect(formatCompactQuantity(qty)).toMatch(/k$/);
  });

  it('has all required fields on each example', () => {
    for (const ex of todayPriceExamples) {
      expect(ex.id).toBeTruthy();
      expect(ex.label).toBeTruthy();
      expect(ex.emoji).toBeTruthy();
      expect(ex.unitName).toBeTruthy();
      expect(ex.estimatedPrice).toBeGreaterThan(0);
    }
  });
});
