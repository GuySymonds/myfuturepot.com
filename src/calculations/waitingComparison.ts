import type { PensionInputs, WaitingComparisonResult } from '../types/pension';
import { calculatePension } from './pensionCalculator';

const COMPARISON_START_AGES = [18, 25, 30, 40];

/**
 * Compare the pension outcome for different starting ages,
 * using the same assumptions as the main simulator.
 */
export function calculateWaitingComparison(
  baseInputs: PensionInputs
): WaitingComparisonResult[] {
  const results: WaitingComparisonResult[] = [];

  for (const startAge of COMPARISON_START_AGES) {
    if (startAge >= baseInputs.retirementAge) {
      results.push({
        startAge,
        potAtRetirement: 0,
        potTodayEquivalent: 0,
        differenceFromEarliest: 0,
        differenceFromEarliestToday: 0,
      });
      continue;
    }

    const inputs: PensionInputs = { ...baseInputs, startAge };
    const summary = calculatePension(inputs);

    results.push({
      startAge,
      potAtRetirement: summary.estimatedPotAtRetirement,
      potTodayEquivalent: summary.potTodayEquivalent,
      differenceFromEarliest: 0,
      differenceFromEarliestToday: 0,
    });
  }

  // Fill in differences relative to the earliest start age result
  const earliest = results.find((r) => r.startAge === COMPARISON_START_AGES[0]);
  if (earliest) {
    for (const result of results) {
      result.differenceFromEarliest = earliest.potAtRetirement - result.potAtRetirement;
      result.differenceFromEarliestToday = earliest.potTodayEquivalent - result.potTodayEquivalent;
    }
  }

  return results;
}
