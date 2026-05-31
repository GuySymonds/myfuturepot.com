import { describe, it, expect } from 'vitest';
import { toTodayEquivalent, toFutureEquivalent } from '../calculations/inflation';

describe('inflation', () => {
  describe('toTodayEquivalent', () => {
    it('returns the same amount when price rise is 0', () => {
      expect(toTodayEquivalent(1000, 0, 10)).toBeCloseTo(1000, 5);
    });

    it('returns the same amount when years is 0', () => {
      expect(toTodayEquivalent(1000, 2.5, 0)).toBeCloseTo(1000, 5);
    });

    it('reduces value over time with 2.5% annual price rise over 10 years', () => {
      // 1000 / (1.025^10) ≈ 781.20
      const result = toTodayEquivalent(1000, 2.5, 10);
      expect(result).toBeCloseTo(781.2, 0);
    });

    it('reduces value over time with 5% annual price rise over 20 years', () => {
      // 10000 / (1.05^20) ≈ 3768.89
      const result = toTodayEquivalent(10000, 5, 20);
      expect(result).toBeCloseTo(3768.89, 0);
    });

    it('result is always less than the future amount for positive price rise', () => {
      expect(toTodayEquivalent(500, 3, 5)).toBeLessThan(500);
    });
  });

  describe('toFutureEquivalent', () => {
    it('returns the same amount when price rise is 0', () => {
      expect(toFutureEquivalent(1000, 0, 10)).toBeCloseTo(1000, 5);
    });

    it('returns the same amount when years is 0', () => {
      expect(toFutureEquivalent(1000, 2.5, 0)).toBeCloseTo(1000, 5);
    });

    it('is the inverse of toTodayEquivalent', () => {
      const original = 1000;
      const future = toFutureEquivalent(original, 2.5, 10);
      const backToToday = toTodayEquivalent(future, 2.5, 10);
      expect(backToToday).toBeCloseTo(original, 5);
    });

    it('increases value over time with 3% price rise over 5 years', () => {
      // 1000 * (1.03^5) ≈ 1159.27
      const result = toFutureEquivalent(1000, 3, 5);
      expect(result).toBeCloseTo(1159.27, 0);
    });
  });
});
