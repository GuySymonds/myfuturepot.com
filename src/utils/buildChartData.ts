import type { PensionInputs, PensionChartPoint } from '../types/pension';
import { calculatePension } from '../calculations/pensionCalculator';
import { DEFAULT_COMPARISON_INPUTS } from '../calculations/defaultComparison';

/**
 * Build a merged array of PensionChartPoint covering all ages from
 * the earliest start age to the latest retirement age, for both the
 * current scenario and the fixed default comparison.
 */
export function buildChartData(currentInputs: PensionInputs): PensionChartPoint[] {
  const currentResult = calculatePension(currentInputs);
  const defaultResult = calculatePension(DEFAULT_COMPARISON_INPUTS);

  // Build lookup maps: age → values
  const currentMap = new Map<number, { pot: number; today: number }>();
  for (const row of currentResult.yearlyResults) {
    currentMap.set(row.age, {
      pot: Math.round(row.potValue),
      today: Math.round(row.potValueTodayEquivalent),
    });
  }

  const defaultMap = new Map<number, { pot: number; today: number }>();
  for (const row of defaultResult.yearlyResults) {
    defaultMap.set(row.age, {
      pot: Math.round(row.potValue),
      today: Math.round(row.potValueTodayEquivalent),
    });
  }

  // Determine full age range
  const minAge = Math.min(currentInputs.startAge, DEFAULT_COMPARISON_INPUTS.startAge);
  const maxAge = Math.max(currentInputs.retirementAge, DEFAULT_COMPARISON_INPUTS.retirementAge);

  const points: PensionChartPoint[] = [];
  for (let age = minAge; age < maxAge; age++) {
    const c = currentMap.get(age) ?? null;
    const d = defaultMap.get(age) ?? null;
    points.push({
      age,
      currentPotValue: c ? c.pot : null,
      currentPotValueTodayEquivalent: c ? c.today : null,
      defaultPotValue: d ? d.pot : null,
      defaultPotValueTodayEquivalent: d ? d.today : null,
    });
  }

  return points;
}
