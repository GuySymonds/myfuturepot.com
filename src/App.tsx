import { useState, useMemo } from 'react';
import type { PensionInputs, QuickGrowthInputs, QuickGrowthResult } from './types/pension';
import { calculatePension } from './calculations/pensionCalculator';
import { calculateWaitingComparison } from './calculations/waitingComparison';
import { growLumpSum, netAnnualGrowthRate } from './calculations/compoundInterest';
import { toTodayEquivalent } from './calculations/inflation';
import { buildChartData } from './utils/buildChartData';
import { formatMoney, formatPercent, formatMultiplier } from './utils/formatMoney';

import Hero from './components/Hero';
import Card from './components/Card';
import StatCard from './components/StatCard';
import AssumptionsPanel from './components/AssumptionsPanel';
import SliderInput from './components/SliderInput';
import PensionChart from './components/PensionChart';
import WaitingComparison from './components/WaitingComparison';
import EverydayChoicesSection from './components/EverydayChoicesSection';
import YearByYearTable from './components/YearByYearTable';
import Disclaimer from './components/Disclaimer';
import HelpTip from './components/HelpTip';
import TabNav from './components/TabNav';
import type { TabId } from './data/tabs';

import {
  TrendingUp,
  Wallet,
  Building2,
  Coins,
  BarChart2,
} from 'lucide-react';

const DEFAULT_INPUTS: PensionInputs = {
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

const DEFAULT_QUICK: QuickGrowthInputs = {
  startAge: 18,
  targetAge: 60,
  annualGrowthPercent: 5,
  annualFeePercent: 0.5,
  annualPriceRisePercent: 2.5,
};

function calculateQuickGrowth(inputs: QuickGrowthInputs): QuickGrowthResult {
  const { startAge, targetAge, annualGrowthPercent, annualFeePercent, annualPriceRisePercent } =
    inputs;
  const years = targetAge - startAge;
  if (years <= 0) return { potAtTargetAge: 1, whatItCouldBuyToday: 1, growthMultiplier: 1 };

  const netRate = netAnnualGrowthRate(annualGrowthPercent, annualFeePercent);
  const pot = growLumpSum(1, netRate, years * 12);
  const today = toTodayEquivalent(pot, annualPriceRisePercent, years);
  return {
    potAtTargetAge: pot,
    whatItCouldBuyToday: today,
    growthMultiplier: pot,
  };
}

export default function App() {
  const [pensionInputs, setPensionInputs] = useState<PensionInputs>(DEFAULT_INPUTS);
  const [quickInputs, setQuickInputs] = useState<QuickGrowthInputs>(DEFAULT_QUICK);
  const [activeTab, setActiveTab] = useState<TabId>('waiting');

  const pensionResult = useMemo(() => calculatePension(pensionInputs), [pensionInputs]);
  const quickResult = useMemo(() => calculateQuickGrowth(quickInputs), [quickInputs]);
  const chartData = useMemo(() => buildChartData(pensionInputs), [pensionInputs]);

  const costOfWaiting30 = useMemo(() => {
    const results = calculateWaitingComparison(pensionInputs);
    return results.find((r) => r.startAge === 30)?.differenceFromEarliest ?? 0;
  }, [pensionInputs]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <Hero />

      {/* Tab navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto w-full px-4">
          <TabNav activeTab={activeTab} onChange={setActiveTab} />
        </div>
      </div>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">

        {/* Tab: Cost of Waiting */}
        {activeTab === 'waiting' && (
          <div
            id="tabpanel-waiting"
            role="tabpanel"
            aria-labelledby="tab-waiting"
            className="space-y-8"
          >
            {/* Main heading and cost-of-waiting message (shown once) */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold text-slate-800">What if you wait?</h2>
                <HelpTip text="Shows the estimated pension pot at retirement for four different starting ages, using the same assumptions. Starting earlier gives more time for the pot to grow." />
              </div>
              <p className="text-slate-500 text-sm mb-4">
                See how starting earlier or later could change your future pension pot.
              </p>
              {costOfWaiting30 > 0 && (
                <div className="inline-block bg-violet-50 border border-violet-200 rounded-2xl px-5 py-3">
                  <p className="text-violet-700 text-lg sm:text-xl font-bold leading-tight">
                    Waiting until 30 could cost{' '}
                    <span className="text-amber-600">{formatMoney(Math.round(costOfWaiting30))}</span>
                    {' '}by retirement.
                  </p>
                  <p className="text-violet-500 text-xs mt-1">Using the current assumptions</p>
                </div>
              )}
            </div>

            {/* Compact "Change assumptions" collapsible */}
            <AssumptionsPanel inputs={pensionInputs} onChange={setPensionInputs} />

            {/* Comparison cards and chart */}
            <WaitingComparison inputs={pensionInputs} />
          </div>
        )}

        {/* Tab: Everyday Choices */}
        {activeTab === 'everyday' && (
          <div
            id="tabpanel-everyday"
            role="tabpanel"
            aria-labelledby="tab-everyday"
          >
            <EverydayChoicesSection inputs={pensionInputs} />
          </div>
        )}

        {/* Tab: Build Your Pot */}
        {activeTab === 'build' && (
          <div
            id="tabpanel-build"
            role="tabpanel"
            aria-labelledby="tab-build"
            className="space-y-8"
          >
            {/* Pot chart */}
            <Card>
              <h3 className="text-sm font-semibold text-slate-600 mb-4">
                Pension pot by age
              </h3>
              <PensionChart chartData={chartData} />
            </Card>

            {/* Result summary cards */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-slate-800">Your pension estimate</h2>
                <HelpTip text="Based on the assumptions set in the Assumptions tab. These are estimates for illustration only — not a guaranteed outcome." />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatCard
                  label="Pot at retirement"
                  value={formatMoney(pensionResult.estimatedPotAtRetirement)}
                  sub={`At age ${pensionInputs.retirementAge}`}
                  helpText="The estimated total value of the pension pot at the chosen retirement age. This is based on the selected assumptions and is not a guaranteed figure."
                  highlight
                  icon={<TrendingUp size={15} />}
                />
                <StatCard
                  label="What it could buy today"
                  value={formatMoney(pensionResult.potTodayEquivalent)}
                  sub="After prices rising over time"
                  helpText="A rough guide to what the pot might feel like in today's money, after accounting for prices rising over time. The pot number shows what might be in the pension at that age — this figure gives a sense of today's equivalent."
                  icon={<Coins size={15} />}
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard
                  label="Your contributions"
                  value={formatMoney(pensionResult.totalEmployeeContributions, true)}
                  helpText="The total amount you put in across all years."
                  icon={<Wallet size={14} />}
                />
                <StatCard
                  label="Employer contributions"
                  value={formatMoney(pensionResult.totalEmployerContributions, true)}
                  helpText="The total amount your employer contributes across all years."
                  icon={<Building2 size={14} />}
                />
                <StatCard
                  label="Tax relief"
                  value={formatMoney(pensionResult.totalTaxRelief, true)}
                  helpText="Estimated basic rate tax relief added over time. The government contributes 25p for every £1 you put in."
                  icon={<Coins size={14} />}
                />
                <StatCard
                  label="Investment growth"
                  value={formatMoney(pensionResult.totalInvestmentGrowth, true)}
                  helpText="The estimated gain from investment growth after fees, above and beyond total contributions and tax relief."
                  icon={<TrendingUp size={14} />}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <StatCard
                  label="Final monthly salary"
                  value={formatMoney(pensionResult.finalMonthlySalary)}
                  helpText="Your estimated monthly salary in the final year before retirement, after annual pay rises."
                />
                <StatCard
                  label="Final contribution rate"
                  value={formatPercent(pensionResult.finalEmployeeContributionPercent)}
                  helpText="Your employee contribution percentage in the final year, after annual increases and any cap."
                />
              </div>
            </div>

            {/* £1 growth demo */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-slate-800">£1 growth demo</h2>
                <HelpTip text="See what £1 invested at a chosen age could grow to by a target age, after fees and prices rising over time." />
              </div>
              <p className="text-slate-500 text-sm">
                See how £1 invested today could grow over time — useful for understanding the effect of
                fees, investment growth, and prices rising over time.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
                <Card>
                  <div className="flex flex-col gap-4">
                    <SliderInput
                      id="qStartAge"
                      label="Start age"
                      value={quickInputs.startAge}
                      min={16}
                      max={65}
                      step={1}
                      onChange={(v) => setQuickInputs((p) => ({ ...p, startAge: v }))}
                      helpText="The age at which the £1 is first invested."
                    />
                    <SliderInput
                      id="qTargetAge"
                      label="Target age"
                      value={quickInputs.targetAge}
                      min={20}
                      max={90}
                      step={1}
                      onChange={(v) => setQuickInputs((p) => ({ ...p, targetAge: v }))}
                      helpText="The age at which you want to see how much the £1 has grown to."
                    />
                    <SliderInput
                      id="qGrowth"
                      label="Investment growth"
                      value={quickInputs.annualGrowthPercent}
                      min={0}
                      max={15}
                      step={0.5}
                      onChange={(v) => setQuickInputs((p) => ({ ...p, annualGrowthPercent: v }))}
                      formatDisplay={(v) => formatPercent(v)}
                      helpText="Assumed annual investment return. This is for illustration only — returns are not guaranteed."
                    />
                    <SliderInput
                      id="qFee"
                      label="Annual pension fee"
                      value={quickInputs.annualFeePercent}
                      min={0}
                      max={3}
                      step={0.1}
                      onChange={(v) => setQuickInputs((p) => ({ ...p, annualFeePercent: v }))}
                      formatDisplay={(v) => formatPercent(v)}
                      helpText="The annual management charge, which reduces the effective growth rate each year."
                    />
                    <SliderInput
                      id="qPriceRise"
                      label="Prices rising each year"
                      value={quickInputs.annualPriceRisePercent}
                      min={0}
                      max={10}
                      step={0.5}
                      onChange={(v) => setQuickInputs((p) => ({ ...p, annualPriceRisePercent: v }))}
                      formatDisplay={(v) => formatPercent(v)}
                      helpText="Used to estimate what the future value might feel like in today's money."
                    />
                  </div>
                </Card>

                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard
                      label="Pot at target age"
                      value={`£${quickResult.potAtTargetAge.toFixed(2)}`}
                      sub={`At age ${quickInputs.targetAge}`}
                      helpText="What £1 could grow to by the target age, based on the selected growth rate and fees."
                      highlight
                      icon={<TrendingUp size={15} />}
                    />
                    <StatCard
                      label="What it could buy today"
                      value={`£${quickResult.whatItCouldBuyToday.toFixed(2)}`}
                      sub="After prices rising over time"
                      helpText="A rough guide to what that future pot might feel like in today's money, after accounting for prices rising over time."
                      icon={<Coins size={15} />}
                    />
                    <StatCard
                      label="Growth multiplier"
                      value={formatMultiplier(quickResult.growthMultiplier)}
                      sub={`Over ${quickInputs.targetAge - quickInputs.startAge} years`}
                      helpText="How many times larger the pot is compared to the original £1 invested."
                      icon={<BarChart2 size={15} />}
                    />
                  </div>

                  <Card>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      <span className="font-semibold text-slate-800">How to read these numbers:</span>{' '}
                      The pot number shows what might be in the pension at that age. The &ldquo;what it
                      could buy today&rdquo; number gives a rough idea of how that might feel after
                      prices have risen over time.
                    </p>
                    <p className="text-sm text-slate-500 mt-3 leading-relaxed">
                      Over <strong>{quickInputs.targetAge - quickInputs.startAge} years</strong>, £1
                      invested at {formatPercent(quickInputs.annualGrowthPercent)} growth with a{' '}
                      {formatPercent(quickInputs.annualFeePercent)} annual fee could become{' '}
                      <strong>£{quickResult.potAtTargetAge.toFixed(2)}</strong> — that is{' '}
                      <strong>{formatMultiplier(quickResult.growthMultiplier)}</strong> your starting
                      amount.
                    </p>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Year by Year */}
        {activeTab === 'year-by-year' && (
          <div
            id="tabpanel-year-by-year"
            role="tabpanel"
            aria-labelledby="tab-year-by-year"
          >
            <Card>
              <YearByYearTable yearlyResults={pensionResult.yearlyResults} />
            </Card>
          </div>
        )}

        {/* Tab: Assumptions */}
        {activeTab === 'assumptions' && (
          <div
            id="tabpanel-assumptions"
            role="tabpanel"
            aria-labelledby="tab-assumptions"
          >
            <AssumptionsPanel inputs={pensionInputs} onChange={setPensionInputs} alwaysOpen />
          </div>
        )}

      </main>

      <Disclaimer />
    </div>
  );
}
