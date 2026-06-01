import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { PensionInputs, WaitingComparisonResult } from '../types/pension';
import { calculateWaitingComparison } from '../calculations/waitingComparison';
import { formatMoney } from '../utils/formatMoney';
import Card from './Card';
import HelpTip from './HelpTip';

interface WaitingComparisonProps {
  inputs: PensionInputs;
}

type ChartMode = 'pot' | 'today';

const COLOURS = ['#7c3aed', '#a78bfa', '#c4b5fd', '#ede9fe'];
const BASELINE_AGE = 18;

export default function WaitingComparison({ inputs }: WaitingComparisonProps) {
  const [chartMode, setChartMode] = useState<ChartMode>('pot');
  const results: WaitingComparisonResult[] = calculateWaitingComparison(inputs);

  const chartData = results.map((r) => ({
    age: `Start at ${r.startAge}`,
    pot: Math.round(r.potAtRetirement),
    today: Math.round(r.potTodayEquivalent),
  }));

  const chartKey = chartMode === 'pot' ? 'pot' : 'today';

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-bold text-slate-800">Cost of waiting</h2>
        <HelpTip text="Shows the estimated pension pot at retirement for four different starting ages, using the same assumptions. Starting earlier gives more time for the pot to grow." />
      </div>

      {/* Comparison cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {results.map((result, i) => {
          const isBaseline = result.startAge === BASELINE_AGE;
          return (
            <div
              key={result.startAge}
              className={`rounded-2xl p-5 flex flex-col gap-2 border ${
                isBaseline
                  ? 'bg-violet-600 text-white border-violet-500 shadow-md'
                  : 'bg-white border-slate-100 shadow-sm'
              }`}
            >
              <div className={`text-sm font-bold ${isBaseline ? 'text-violet-100' : 'text-slate-500'}`}>
                Start at {result.startAge}
                {isBaseline && <span className="ml-2 text-violet-200 font-normal text-xs">baseline</span>}
              </div>

              <div>
                <div className={`text-xs font-medium mb-0.5 ${isBaseline ? 'text-violet-200' : 'text-slate-400'}`}>
                  Pot at retirement
                </div>
                <div className={`text-2xl font-bold tracking-tight ${isBaseline ? 'text-white' : 'text-slate-800'}`}>
                  {formatMoney(result.potAtRetirement)}
                </div>
              </div>

              <div>
                <div className={`text-xs font-medium mb-0.5 ${isBaseline ? 'text-violet-200' : 'text-slate-400'}`}>
                  What it could buy today
                </div>
                <div className={`text-base font-semibold ${isBaseline ? 'text-violet-100' : 'text-slate-600'}`}>
                  {formatMoney(result.potTodayEquivalent)}
                </div>
              </div>

              {i > 0 && result.differenceFromEarliest > 0 && (
                <div className="mt-1 pt-2 border-t border-slate-100">
                  <div className="text-xs text-slate-400 mb-0.5">Compared with starting at {BASELINE_AGE}</div>
                  <div className="text-sm font-bold text-orange-600">
                    −{formatMoney(result.differenceFromEarliest)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bar chart */}
      <Card>
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <h3 className="text-sm font-semibold text-slate-600 mr-2">
            Starting age comparison
          </h3>
          <button
            type="button"
            onClick={() => setChartMode('pot')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              chartMode === 'pot'
                ? 'bg-violet-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Pot at retirement
          </button>
          <button
            type="button"
            onClick={() => setChartMode('today')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              chartMode === 'today'
                ? 'bg-violet-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            What it could buy today
          </button>
          <HelpTip text="Starting earlier gives money more time to grow. This comparison uses the same assumptions for each starting age." />
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="age" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={(v) => formatMoney(v, true)} tick={{ fontSize: 11 }} width={60} />
            <Tooltip
              formatter={(value) => [
                formatMoney(Number(value)),
                chartMode === 'pot' ? 'Pot at retirement' : 'What it could buy today',
              ]}
            />
            <Bar dataKey={chartKey} radius={[6, 6, 0, 0]}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLOURS[index % COLOURS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

