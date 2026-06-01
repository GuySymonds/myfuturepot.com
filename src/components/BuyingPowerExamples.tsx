import { useState, useRef, useId } from 'react';
import { createPortal } from 'react-dom';
import { todayPriceExamples } from '../data/todayPrices';
import { formatCompactQuantity } from '../utils/formatMoney';
import { formatMoney } from '../utils/formatMoney';

export type BuyingPowerExamplesProps = {
  amountTodayEquivalent: number;
};

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
  const tooltipId = `bp-tooltip-${id.replace(/:/g, '')}`;

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

export default function BuyingPowerExamples({ amountTodayEquivalent }: BuyingPowerExamplesProps) {
  if (amountTodayEquivalent <= 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">What could that buy today?</h2>
        <p className="text-slate-500 text-sm mt-1">
          To make the number easier to picture, here are some rough examples using current prices.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {todayPriceExamples.map((example, i) => {
          const quantity = Math.floor(amountTodayEquivalent / example.estimatedPrice);
          const displayQty = formatCompactQuantity(quantity);
          const gradient = CARD_GRADIENTS[i % CARD_GRADIENTS.length];
          const tooltipText = `Calculated as ${formatMoney(Math.round(amountTodayEquivalent))} divided by an example price of ${formatMoney(example.estimatedPrice)}. ${example.note ?? ''}`.trim();

          return (
            <TooltipCard key={example.id} text={tooltipText}>
              <div
                className={`bg-gradient-to-br ${gradient} border rounded-2xl p-4 flex flex-col items-center gap-2 hover:scale-105 hover:shadow-md transition-all duration-200 cursor-default`}
              >
                <div className="text-4xl">{example.emoji}</div>
                <div className="text-xl font-bold text-slate-800 leading-tight text-center">
                  About {displayQty}
                </div>
                <div className="text-xs text-slate-600 text-center leading-snug">
                  {example.unitName}
                  <br />
                  <span className="text-slate-500">{example.label.toLowerCase()}</span>
                </div>
              </div>
            </TooltipCard>
          );
        })}
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        These examples use rough current prices to make the pension value easier to picture. Actual prices vary.
      </p>
    </div>
  );
}
