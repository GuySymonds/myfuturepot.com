import type { EverydayItemExample } from '../data/todayPrices';
import { growLumpSum, netAnnualGrowthRate } from './compoundInterest';
import { toTodayEquivalent } from './inflation';

export type EverydayItemGrowthResult = {
  itemId: string;
  label: string;
  emoji: string;
  unitNameSingular: string;
  unitNamePlural: string;
  currentPrice: number;
  startAge: number;
  retirementAge: number;
  futureValueAtRetirement: number;
  todayEquivalentValue: number;
  equivalentItemCount: number;
};

export type EverydayItemGrowthInputs = {
  items: EverydayItemExample[];
  startAges: number[];
  retirementAge: number;
  annualInvestmentGrowthPercent: number;
  annualFeePercent: number;
  annualPriceRisePercent: number;
};

/**
 * For each item and each starting age, calculate what the cost of one item
 * could grow to by retirement, expressed as a count of equivalent items.
 *
 * Uses monthly compounding on the item's current price as a lump-sum investment.
 * The future value is then adjusted using the annual price rise to express it
 * in today's equivalent purchasing power.
 */
export function calculateEverydayItemGrowthExamples(
  inputs: EverydayItemGrowthInputs
): EverydayItemGrowthResult[] {
  const {
    items,
    startAges,
    retirementAge,
    annualInvestmentGrowthPercent,
    annualFeePercent,
    annualPriceRisePercent,
  } = inputs;

  const results: EverydayItemGrowthResult[] = [];

  for (const item of items) {
    for (const startAge of startAges) {
      const years = retirementAge - startAge;

      if (years <= 0) {
        results.push({
          itemId: item.id,
          label: item.label,
          emoji: item.emoji,
          unitNameSingular: item.unitNameSingular,
          unitNamePlural: item.unitNamePlural,
          currentPrice: item.currentPrice,
          startAge,
          retirementAge,
          futureValueAtRetirement: item.currentPrice,
          todayEquivalentValue: item.currentPrice,
          equivalentItemCount: 1,
        });
        continue;
      }

      const netRate = netAnnualGrowthRate(annualInvestmentGrowthPercent, annualFeePercent);
      const months = years * 12;
      const futureValue = growLumpSum(item.currentPrice, netRate, months);
      const todayEquiv = toTodayEquivalent(futureValue, annualPriceRisePercent, years);
      const equivalentCount = todayEquiv / item.currentPrice;

      results.push({
        itemId: item.id,
        label: item.label,
        emoji: item.emoji,
        unitNameSingular: item.unitNameSingular,
        unitNamePlural: item.unitNamePlural,
        currentPrice: item.currentPrice,
        startAge,
        retirementAge,
        futureValueAtRetirement: futureValue,
        todayEquivalentValue: todayEquiv,
        equivalentItemCount: equivalentCount,
      });
    }
  }

  return results;
}
