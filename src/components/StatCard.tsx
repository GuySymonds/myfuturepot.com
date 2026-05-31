import type { ReactNode } from 'react';
import HelpTip from './HelpTip';

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  helpText?: string;
  highlight?: boolean;
  icon?: ReactNode;
}

export default function StatCard({
  label,
  value,
  sub,
  helpText,
  highlight = false,
  icon,
}: StatCardProps) {
  return (
    <div
      className={`rounded-2xl p-5 flex flex-col gap-1 ${
        highlight
          ? 'bg-violet-600 text-white'
          : 'bg-white border border-slate-100 shadow-sm'
      }`}
    >
      <div className="flex items-center gap-1 text-sm font-medium opacity-80">
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{label}</span>
        {helpText && (
          <span className={highlight ? '[&_button]:text-violet-200' : ''}>
            <HelpTip text={helpText} />
          </span>
        )}
      </div>
      <div className={`text-2xl sm:text-3xl font-bold tracking-tight ${highlight ? 'text-white' : 'text-slate-800'}`}>
        {value}
      </div>
      {sub && (
        <div className={`text-xs ${highlight ? 'text-violet-200' : 'text-slate-500'}`}>
          {sub}
        </div>
      )}
    </div>
  );
}
