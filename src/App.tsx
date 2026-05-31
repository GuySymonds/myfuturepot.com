import { useState, useMemo } from 'react';
import type { PensionInputs, QuickGrowthInputs, QuickGrowthResult } from './types/pension';
import { calculatePension } from './calculations/pensionCalculator';
import { growLumpSum, netAnnualGrowthRate } from './calculations/compoundInterest';
import { toTodayEquivalent } from './calculations/inflation';
import { formatMoney, formatPercent, formatMultiplier } from './utils/formatMoney';

import Hero from './components/Hero';
import Card from './components/Card';
import StatCard from './components/StatCard';
import InputPanel from './components/InputPanel';
import SliderInput from './components/SliderInput';
import PensionChart from './components/PensionChart';
import WaitingComparison from './components/WaitingComparison';
import YearByYearTable from './components/YearByYearTable';
import Disclaimer from './components/Disclaimer';
import HelpTip from './components/HelpTip';

import {
  TrendingUp,
  Wallet,
  Building2,
  Coins,
  BarChart2,
  Clock,
} from 'lucide-react';

const DEFAULT_INPUTS: PensionInputs = {
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

type NavSection = 'simulator' | 'quick' | 'waiting';

export default function App() {
  const [pensionInputs, setPensionInputs] = useState<PensionInputs>(DEFAULT_INPUTS);
  const [quickInputs, setQuickInputs] = useState<QuickGrowthInputs>(DEFAULT_QUICK);
  const [activeSection, setActiveSection] = useState<NavSection>('simulator');

  const pensionResult = useMemo(() => calculatePension(pensionInputs), [pensionInputs]);
  const quickResult = useMemo(() => calculateQuickGrowth(quickInputs), [quickInputs]);

  const navItems: { id: NavSection; label: string; icon: React.ReactNode }[] = [
    { id: 'simulator', label: 'Pension Simulator', icon: <BarChart2 size={16} /> },
    { id: 'quick', label: '£1 Growth Demo', icon: <TrendingUp size={16} /> },
    { id: 'waiting', label: 'Cost of Waiting', icon: <Clock size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Hero />

      {/* Navigation */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto py-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeSection === item.id
                  ? 'bg-violet-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 space-y-8">

        {/* Pension Simulator Section */}
        {activeSection === 'simulator' && (
          <>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-slate-800">Pension Pot Simulator</h2>
              <HelpTip text="Simulate how a pension pot could grow over time based on your salary, contributions, and investment assumptions." />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
              {/* Input panel */}
              <Card className="lg:sticky lg:top-20">
                <InputPanel inputs={pensionInputs} onChange={setPensionInputs} />
              </Card>

              {/* Results */}
              <div className="flex flex-col gap-6">
                {/* Key results */}
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

                {/* Chart */}
                <Card>
                  <h3 className="text-sm font-semibold text-slate-600 mb-4">
                    Pension pot by age
                  </h3>
                  <PensionChart yearlyResults={pensionResult.yearlyResults} />
                </Card>

                {/* Year by year table */}
                <Card>
                  <YearByYearTable yearlyResults={pensionResult.yearlyResults} />
                </Card>
              </div>
            </div>
          </>
        )}

        {/* Quick 1 Growth Demo */}
        {activeSection === 'quick' && (
          <>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-slate-800">Quick £1 Growth Demo</h2>
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
          </>
        )}

        {/* Cost of Waiting */}
        {activeSection === 'waiting' && (
          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
            <Card className="lg:sticky lg:top-20">
              <h3 className="text-sm font-semibold text-slate-600 mb-4">
                Assumptions (from Pension Simulator)
              </h3>
              <InputPanel inputs={pensionInputs} onChange={setPensionInputs} />
            </Card>

            <WaitingComparison inputs={pensionInputs} />
          </div>
        )}
      </main>

      <Disclaimer />
    </div>
  );
}
