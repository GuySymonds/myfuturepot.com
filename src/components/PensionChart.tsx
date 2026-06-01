import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { PensionChartPoint } from '../types/pension';
import { formatMoney } from '../utils/formatMoney';
import HelpTip from './HelpTip';

interface PensionChartProps {
  chartData: PensionChartPoint[];
}

type ViewMode = 'pot' | 'today';

export default function PensionChart({ chartData }: PensionChartProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('pot');

  const currentKey = viewMode === 'pot' ? 'currentPotValue' : 'currentPotValueTodayEquivalent';
  const defaultKey = viewMode === 'pot' ? 'defaultPotValue' : 'defaultPotValueTodayEquivalent';
  const valueLabel = viewMode === 'pot' ? 'Pot at retirement' : 'What it could buy today';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => setViewMode('pot')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            viewMode === 'pot'
              ? 'bg-violet-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Pot at retirement
        </button>
        <button
          type="button"
          onClick={() => setViewMode('today')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            viewMode === 'today'
              ? 'bg-violet-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          What it could buy today
        </button>
        <HelpTip text="Default example uses the original assumptions with a fixed 5% employee contribution and no yearly contribution increase." />
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="age"
            tick={{ fontSize: 12 }}
            label={{ value: 'Age', position: 'insideBottomRight', offset: -4, fontSize: 12 }}
          />
          <YAxis
            tickFormatter={(v) => formatMoney(v, true)}
            tick={{ fontSize: 11 }}
            width={60}
          />
          <Tooltip
            formatter={(value, name) => [formatMoney(Number(value)), name as string]}
            labelFormatter={(label) => `Age ${label}`}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line
            type="monotone"
            dataKey={currentKey}
            name="Your scenario"
            stroke="#7c3aed"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4 }}
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey={defaultKey}
            name="Default example"
            stroke="#cbd5e1"
            strokeWidth={1.5}
            strokeDasharray="5 3"
            dot={false}
            activeDot={{ r: 3 }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>

      <p className="text-xs text-slate-400 leading-relaxed">
        {valueLabel} shown by age. &ldquo;Default example&rdquo; uses the original assumptions as a comparison — the same assumptions are shown on this chart unless you change them above.
      </p>
    </div>
  );
}

