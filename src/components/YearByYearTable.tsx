import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { PensionYearResult } from '../types/pension';
import { formatMoney, formatPercent } from '../utils/formatMoney';

interface YearByYearTableProps {
  yearlyResults: PensionYearResult[];
}

export default function YearByYearTable({ yearlyResults }: YearByYearTableProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-violet-600 transition-colors"
        aria-expanded={open}
      >
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        Year-by-year breakdown
      </button>

      {open && (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600">
                <th className="text-left px-3 py-2 font-semibold whitespace-nowrap border-b border-slate-200">Age</th>
                <th className="text-right px-3 py-2 font-semibold whitespace-nowrap border-b border-slate-200">Monthly salary</th>
                <th className="text-right px-3 py-2 font-semibold whitespace-nowrap border-b border-slate-200">Your contrib %</th>
                <th className="text-right px-3 py-2 font-semibold whitespace-nowrap border-b border-slate-200">Your contrib / mo</th>
                <th className="text-right px-3 py-2 font-semibold whitespace-nowrap border-b border-slate-200">Employer / mo</th>
                <th className="text-right px-3 py-2 font-semibold whitespace-nowrap border-b border-slate-200">Tax relief / mo</th>
                <th className="text-right px-3 py-2 font-semibold whitespace-nowrap border-b border-slate-200">Pot value</th>
                <th className="text-right px-3 py-2 font-semibold whitespace-nowrap border-b border-slate-200">What it could buy today</th>
              </tr>
            </thead>
            <tbody>
              {yearlyResults.map((row, i) => (
                <tr
                  key={row.age}
                  className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}
                >
                  <td className="px-3 py-2 font-medium text-slate-700 whitespace-nowrap">{row.age}</td>
                  <td className="px-3 py-2 text-right whitespace-nowrap">{formatMoney(row.monthlySalary)}</td>
                  <td className="px-3 py-2 text-right whitespace-nowrap">{formatPercent(row.employeeContributionPercent)}</td>
                  <td className="px-3 py-2 text-right whitespace-nowrap">{formatMoney(row.monthlyEmployeeContribution)}</td>
                  <td className="px-3 py-2 text-right whitespace-nowrap">{formatMoney(row.monthlyEmployerContribution)}</td>
                  <td className="px-3 py-2 text-right whitespace-nowrap">{formatMoney(row.monthlyTaxRelief)}</td>
                  <td className="px-3 py-2 text-right font-semibold whitespace-nowrap text-violet-700">{formatMoney(row.potValue)}</td>
                  <td className="px-3 py-2 text-right whitespace-nowrap text-slate-600">{formatMoney(row.potValueTodayEquivalent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
