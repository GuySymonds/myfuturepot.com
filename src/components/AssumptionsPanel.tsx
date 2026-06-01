import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { PensionInputs } from '../types/pension';
import SliderInput from './SliderInput';
import HelpTip from './HelpTip';
import { formatMoney, formatPercent } from '../utils/formatMoney';

interface AssumptionsPanelProps {
  inputs: PensionInputs;
  onChange: (updated: PensionInputs) => void;
}

function buildSummary(inputs: PensionInputs): string {
  const parts = [
    `${formatMoney(inputs.monthlySalary)} monthly salary`,
    `${formatPercent(inputs.employeeContributionPercent)} employee`,
    `${formatPercent(inputs.employerContributionPercent)} employer`,
    `${formatPercent(inputs.annualInvestmentGrowthPercent)} growth`,
    `${formatPercent(inputs.annualPriceRisePercent)} prices rising`,
    `retire at ${inputs.retirementAge}`,
  ];
  return parts.join(' · ');
}

export function buildAssumptionsSummary(inputs: PensionInputs): string {
  return buildSummary(inputs);
}

export default function AssumptionsPanel({ inputs, onChange }: AssumptionsPanelProps) {
  const [open, setOpen] = useState(false);

  function set<K extends keyof PensionInputs>(key: K, value: PensionInputs[K]) {
    onChange({ ...inputs, [key]: value });
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
      {/* Header / trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="assumptions-panel-content"
        className="w-full flex items-center justify-between gap-3 px-6 py-4 text-left hover:bg-slate-50 rounded-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-violet-400"
      >
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-base font-semibold text-slate-800">Change the assumptions</span>
          {!open && (
            <span className="text-xs text-slate-500 truncate">
              {buildSummary(inputs)}
            </span>
          )}
          {!open && (
            <span className="text-xs text-slate-400 mt-0.5">
              Adjust salary, contributions, growth and prices to see how the results change.
            </span>
          )}
        </div>
        <span className="shrink-0 text-slate-400">
          {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </span>
      </button>

      {/* Expandable content */}
      {open && (
        <div
          id="assumptions-panel-content"
          className="px-6 pb-6 pt-2 border-t border-slate-100"
        >
          <p className="text-sm text-slate-500 mb-6">
            Adjust salary, contributions, growth and prices to see how the results change.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* A. Your starting point */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                A. Your starting point
              </h3>
              <SliderInput
                id="startAge"
                label="Start age"
                value={inputs.startAge}
                min={16}
                max={65}
                step={1}
                onChange={(v) => set('startAge', v)}
                helpText="The age at which you start contributing to your pension."
              />
              <SliderInput
                id="retirementAge"
                label="Retirement age"
                value={inputs.retirementAge}
                min={40}
                max={80}
                step={1}
                onChange={(v) => set('retirementAge', v)}
                helpText="The age at which you plan to stop working and start drawing from your pension."
              />
              <div className="flex flex-col gap-1.5">
                <label htmlFor="monthlySalary" className="text-sm font-medium text-slate-700 flex items-center">
                  Monthly salary
                  <HelpTip text="Your gross (before tax) monthly take-home pay. This is used to calculate how much goes into your pension each month." />
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-medium">£</span>
                  <input
                    id="monthlySalary"
                    type="number"
                    min={100}
                    max={50000}
                    step={50}
                    value={inputs.monthlySalary}
                    onChange={(e) => set('monthlySalary', Number(e.target.value))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                  />
                </div>
                <p className="text-xs text-slate-400">
                  ≈ {formatMoney(inputs.monthlySalary * 12)} per year
                </p>
              </div>
            </div>

            {/* B. Pension contributions */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                B. Pension contributions
              </h3>
              <SliderInput
                id="employeeContrib"
                label="Your contribution"
                value={inputs.employeeContributionPercent}
                min={0}
                max={30}
                step={0.5}
                onChange={(v) => set('employeeContributionPercent', v)}
                formatDisplay={(v) => formatPercent(v)}
                helpText="The percentage of your monthly salary you put into your pension each month."
              />
              <SliderInput
                id="employerContrib"
                label="Employer contribution"
                value={inputs.employerContributionPercent}
                min={0}
                max={20}
                step={0.5}
                onChange={(v) => set('employerContributionPercent', v)}
                formatDisplay={(v) => formatPercent(v)}
                helpText="The percentage of your monthly salary your employer adds to your pension. This is on top of your own contribution."
              />
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Tax relief
                </h4>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative inline-block">
                    <input
                      type="checkbox"
                      checked={inputs.taxReliefEnabled}
                      onChange={(e) => set('taxReliefEnabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer-checked:bg-violet-500 transition-colors peer-focus:ring-2 peer-focus:ring-violet-400" />
                    <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">Include basic rate tax relief</span>
                  <HelpTip text="When enabled, the government adds 25p for every £1 you contribute (turning £80 into £100), representing basic rate tax relief." />
                </label>
              </div>
            </div>

            {/* C. Changes over time */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                C. Changes over time
              </h3>
              <SliderInput
                id="annualPayRise"
                label="Annual pay rise"
                value={inputs.annualPayRisePercent}
                min={0}
                max={10}
                step={0.5}
                onChange={(v) => set('annualPayRisePercent', v)}
                formatDisplay={(v) => formatPercent(v)}
                helpText="How much your salary is expected to increase each year, on average."
              />
              <SliderInput
                id="contribIncrease"
                label="Employee contribution increase"
                value={inputs.annualEmployeeContributionIncreasePercentPoints}
                min={0}
                max={2}
                step={0.5}
                onChange={(v) => set('annualEmployeeContributionIncreasePercentPoints', v)}
                formatDisplay={(v) => `${v} pp`}
                helpText="How many percentage points your contribution rate increases each year. For example, 0.5 pp means going from 5% to 5.5% the next year."
              />
              <SliderInput
                id="maxContrib"
                label="Maximum employee contribution"
                value={inputs.maxEmployeeContributionPercent}
                min={0}
                max={50}
                step={0.5}
                onChange={(v) => set('maxEmployeeContributionPercent', v)}
                formatDisplay={(v) => formatPercent(v)}
                helpText="The contribution rate will not increase above this cap, regardless of annual increases."
              />
            </div>

            {/* D. Growth and prices */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                D. Growth and prices
              </h3>
              <SliderInput
                id="investmentGrowth"
                label="Annual investment growth"
                value={inputs.annualInvestmentGrowthPercent}
                min={0}
                max={15}
                step={0.5}
                onChange={(v) => set('annualInvestmentGrowthPercent', v)}
                formatDisplay={(v) => formatPercent(v)}
                helpText="The assumed annual growth rate of the pension fund. This is not guaranteed and is used for illustration only."
              />
              <SliderInput
                id="annualFee"
                label="Annual pension fee"
                value={inputs.annualFeePercent}
                min={0}
                max={3}
                step={0.1}
                onChange={(v) => set('annualFeePercent', v)}
                formatDisplay={(v) => formatPercent(v)}
                helpText="The annual management charge taken by the pension provider, reducing your effective growth rate."
              />
              <SliderInput
                id="priceRise"
                label="Annual price rise / inflation"
                value={inputs.annualPriceRisePercent}
                min={0}
                max={10}
                step={0.5}
                onChange={(v) => set('annualPriceRisePercent', v)}
                formatDisplay={(v) => formatPercent(v)}
                helpText="Prices usually rise over time. This estimate reduces the pension pot to show roughly what it may feel like compared with prices today."
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
