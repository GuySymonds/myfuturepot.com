import { useState, useRef, useId } from 'react';
import { createPortal } from 'react-dom';
import type { PensionInputs } from '../types/pension';
import { calculateEverydayItemGrowthExamples } from '../calculations/everydayItemGrowth';
import { everydayItemExamples } from '../data/todayPrices';
import { formatMoney } from '../utils/formatMoney';
import { formatItemCount } from '../utils/formatMoney';
import HelpTip from './HelpTip';

const START_AGES = [18, 25, 30, 40];

const CARD_GRADIENTS = [
  'from-amber-50 to-orange-50 border-amber-200',
  'from-violet-50 to-purple-50 border-violet-200',
  'from-blue-50 to-indigo-50 border-blue-200',
  'from-emerald-50 to-teal-50 border-emerald-200',
  'from-rose-50 to-pink-50 border-rose-200',
  'from-sky-50 to-cyan-50 border-sky-200',
];

function TooltipCard({ text, children }: { text: string; children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const tooltipId = `ec-tooltip-${id.replace(/:/g, '')}`;

  function show() {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + 8 + window.scrollY,
        left: Math.min(rect.left + window.scrollX, window.innerWidth - 272),
      });
    }
    setVisible(true);
  }

  function hide() {
    setVisible(false);
  }

  return (
    <>
      <div
        ref={ref}
        aria-describedby={visible ? tooltipId : undefined}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        tabIndex={0}
        role="button"
        className="focus:outline-none focus:ring-2 focus:ring-violet-400 rounded-2xl"
      >
        {children}
      </div>
      {visible &&
        createPortal(
          <div
            id={tooltipId}
            role="tooltip"
            style={{
              position: 'fixed',
              top: pos.top - window.scrollY,
              left: pos.left,
              zIndex: 9999,
              maxWidth: 268,
            }}
            className="bg-slate-800 text-white text-xs rounded-lg px-3 py-2 shadow-lg pointer-events-none leading-relaxed"
          >
            {text}
          </div>,
          document.body
        )}
    </>
  );
}

interface EverydayChoicesSectionProps {
  inputs: PensionInputs;
}

export default function EverydayChoicesSection({ inputs }: EverydayChoicesSectionProps) {
  const results = calculateEverydayItemGrowthExamples({
    items: everydayItemExamples,
    startAges: START_AGES,
    retirementAge: inputs.retirementAge,
    annualInvestmentGrowthPercent: inputs.annualInvestmentGrowthPercent,
    annualFeePercent: inputs.annualFeePercent,
    annualPriceRisePercent: inputs.annualPriceRisePercent,
  });

  // Group results by item id
  const byItem = new Map<string, ReturnType<typeof calculateEverydayItemGrowthExamples>>();
  for (const result of results) {
    if (!byItem.has(result.itemId)) byItem.set(result.itemId, []);
    byItem.get(result.itemId)!.push(result);
  }

  const tooltipText =
    'This uses the selected growth, fee and price-rise assumptions. It compares the grown value with the current example price of this item.';

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-slate-800">What could one small choice become?</h2>
          <HelpTip text={tooltipText} />
        </div>
        <p className="text-slate-500 text-sm mt-1">
          Start with the cost of one item and see what it could grow into.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {everydayItemExamples.map((item, i) => {
          const itemResults = byItem.get(item.id) ?? [];
          const result18 = itemResults.find((r) => r.startAge === 18);
          const laterAges = START_AGES.filter((a) => a !== 18);
          const gradient = CARD_GRADIENTS[i % CARD_GRADIENTS.length];

          if (!result18) return null;

          const count18 = formatItemCount(result18.equivalentItemCount);
          const unit18 =
            result18.equivalentItemCount >= 1.95 ? item.unitNamePlural : item.unitNameSingular;

          return (
            <TooltipCard key={item.id} text={tooltipText}>
              <div
                className={`bg-gradient-to-br ${gradient} border rounded-2xl p-5 flex flex-col gap-3 hover:shadow-md transition-all duration-200 cursor-default`}
              >
                {/* Header */}
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{item.emoji}</div>
                  <div>
                    <div className="font-semibold text-slate-800 text-sm">{item.label}</div>
                    <div className="text-xs text-slate-500">{formatMoney(item.currentPrice)} today</div>
                  </div>
                </div>

                {/* Main message for age 18 */}
                <div className="bg-white/60 rounded-xl px-4 py-3">
                  <div className="text-xs text-slate-500 mb-0.5">Start at 18 →</div>
                  <div className="text-base font-bold text-slate-800 leading-snug">
                    could feel like about{' '}
                    <span className="text-violet-700">
                      {count18} {unit18}
                    </span>{' '}
                    at {inputs.retirementAge}
                  </div>
                </div>

                {/* Comparison rows for 25, 30, 40 */}
                <div className="flex flex-col gap-1">
                  {laterAges.map((age) => {
                    const r = itemResults.find((x) => x.startAge === age);
                    if (!r) return null;
                    const count = formatItemCount(r.equivalentItemCount);
                    const unit =
                      r.equivalentItemCount >= 1.95 ? item.unitNamePlural : item.unitNameSingular;
                    return (
                      <div
                        key={age}
                        className="flex justify-between items-center text-xs text-slate-600"
                      >
                        <span className="text-slate-500">Start at {age}:</span>
                        <span className="font-semibold">
                          ~{count} {unit}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </TooltipCard>
          );
        })}
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        These examples use rough current prices and the selected assumptions. Actual outcomes vary. This is not financial advice.
      </p>
    </div>
  );
}
