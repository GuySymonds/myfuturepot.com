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
import StatCard from './StatCard';
import HelpTip from './HelpTip';

interface WaitingComparisonProps {
  inputs: PensionInputs;
}

const COLOURS = ['#7c3aed', '#a78bfa', '#c4b5fd', '#ede9fe'];

export default function WaitingComparison({ inputs }: WaitingComparisonProps) {
  const results: WaitingComparisonResult[] = calculateWaitingComparison(inputs);

  const chartData = results.map((r) => ({
    age: `Start at ${r.startAge}`,
    pot: Math.round(r.potAtRetirement),
    today: Math.round(r.potTodayEquivalent),
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold text-slate-800">What if you wait?</h2>
        <HelpTip text="Shows the estimated pension pot at retirement for four different starting ages, using the same assumptions as the main calculator. Earlier is generally better, but everyone's situation is different." />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {results.map((result, i) => (
          <Card key={result.startAge} className="flex flex-col gap-2">
            <div className="text-sm font-semibold text-slate-500">Start at age {result.startAge}</div>
            <div className="text-2xl font-bold text-slate-800">
              {formatMoney(result.potAtRetirement)}
            </div>
            <div className="text-xs text-slate-500">
              {formatMoney(result.potTodayEquivalent)} in today's money
            </div>
            {i > 0 && result.differenceFromEarliest > 0 && (
              <div className="text-xs text-orange-600 font-medium mt-1">
                Waiting until {result.startAge} could mean around{' '}
                <span className="font-bold">{formatMoney(result.differenceFromEarliest)}</span> less
                by retirement
              </div>
            )}
            {i === 0 && (
              <div className="text-xs text-violet-600 font-medium mt-1">Earliest start</div>
            )}
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="text-sm font-semibold text-slate-600 mb-4">
          Pot at retirement by starting age
        </h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="age" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={(v) => formatMoney(v, true)} tick={{ fontSize: 11 }} width={60} />
            <Tooltip
              formatter={(value) => [formatMoney(Number(value)), 'Pot at retirement']}
            />
            <Bar dataKey="pot" radius={[6, 6, 0, 0]}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLOURS[index % COLOURS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {results.slice(1).map((result) => (
          <StatCard
            key={result.startAge}
            label={`Cost of waiting until ${result.startAge}`}
            value={formatMoney(result.differenceFromEarliest)}
            sub={`${formatMoney(result.differenceFromEarliestToday)} in today's money`}
            helpText={`Estimated difference in pot at retirement compared with starting at age 18, based on the current calculator assumptions.`}
          />
        ))}
      </div>
    </div>
  );
}
