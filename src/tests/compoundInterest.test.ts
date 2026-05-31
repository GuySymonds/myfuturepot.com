import { describe, it, expect } from 'vitest';
import {
  monthlyGrowthRate,
  growLumpSum,
  netAnnualGrowthRate,
} from '../calculations/compoundInterest';

describe('compoundInterest', () => {
  describe('monthlyGrowthRate', () => {
    it('returns 0 for 0% annual rate', () => {
      expect(monthlyGrowthRate(0)).toBe(0);
    });

    it('calculates the correct monthly rate for 12% annual', () => {
      // (1.12)^(1/12) - 1 ≈ 0.009489
      const rate = monthlyGrowthRate(12);
      expect(rate).toBeCloseTo(0.009489, 4);
    });

    it('calculates the correct monthly rate for 5% annual', () => {
      // (1.05)^(1/12) - 1 ≈ 0.004074
      const rate = monthlyGrowthRate(5);
      expect(rate).toBeCloseTo(0.004074, 4);
    });

    it('is positive for positive rates', () => {
      expect(monthlyGrowthRate(5)).toBeGreaterThan(0);
    });
  });

  describe('growLumpSum', () => {
    it('returns principal when rate is 0', () => {
      expect(growLumpSum(1000, 0, 12)).toBeCloseTo(1000, 2);
    });

    it('returns principal when months is 0', () => {
      expect(growLumpSum(1000, 5, 0)).toBeCloseTo(1000, 2);
    });

    it('grows £1 at 5% net for 12 months to approximately £1.05', () => {
      const result = growLumpSum(1, 5, 12);
      expect(result).toBeCloseTo(1.05, 2);
    });

    it('grows £100 at 10% for 10 years (120 months) to approximately £259.37', () => {
      const result = growLumpSum(100, 10, 120);
      expect(result).toBeCloseTo(259.37, 0);
    });
  });

  describe('netAnnualGrowthRate', () => {
    it('subtracts fee from growth', () => {
      expect(netAnnualGrowthRate(5, 0.5)).toBeCloseTo(4.5, 5);
    });

    it('returns 0 when growth equals fee', () => {
      expect(netAnnualGrowthRate(3, 3)).toBeCloseTo(0, 5);
    });

    it('can be negative if fee exceeds growth', () => {
      expect(netAnnualGrowthRate(2, 3)).toBeCloseTo(-1, 5);
    });
  });
});
