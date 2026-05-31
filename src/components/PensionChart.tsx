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
import type { PensionYearResult } from '../types/pension';
import { formatMoney } from '../utils/formatMoney';

interface PensionChartProps {
  yearlyResults: PensionYearResult[];
}

type ViewMode = 'pot' | 'today';

export default function PensionChart({ yearlyResults }: PensionChartProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('pot');

  const data = yearlyResults.map((r) => ({
    age: r.age,
    pot: Math.round(r.potValue),
    today: Math.round(r.potValueTodayEquivalent),
  }));

  const dataKey = viewMode === 'pot' ? 'pot' : 'today';
  const colour = '#7c3aed';

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
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
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
            formatter={(value) => [formatMoney(Number(value)), viewMode === 'pot' ? 'Pot value' : "What it could buy today"]}
            labelFormatter={(label) => `Age ${label}`}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line
            type="monotone"
            dataKey={dataKey}
            name={viewMode === 'pot' ? 'Pot at retirement' : 'What it could buy today'}
            stroke={colour}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
