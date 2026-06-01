import { TrendingUp } from 'lucide-react';
import { formatMoney } from '../utils/formatMoney';

interface HeroProps {
  costOfWaiting30?: number;
}

export default function Hero({ costOfWaiting30 }: HeroProps) {
  return (
    <header className="bg-gradient-to-br from-violet-600 to-indigo-700 text-white py-12 px-6 text-center">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="bg-white/20 rounded-xl p-2">
          <TrendingUp size={28} className="text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">MyFuturePot</h1>
      </div>
      <p className="text-violet-100 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
        See how today's choices could grow your future pension pot.
      </p>

      <div className="mt-8 mb-2">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">What if you wait?</h2>
        <p className="mt-3 text-violet-200 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          See how starting earlier or later could change your future pension pot.
        </p>
      </div>

      {costOfWaiting30 != null && costOfWaiting30 > 0 && (
        <div className="mt-6 inline-block bg-white/15 border border-white/25 rounded-2xl px-6 py-4 max-w-sm mx-auto">
          <p className="text-violet-100 text-sm font-medium mb-1">Based on the current assumptions</p>
          <p className="text-white text-xl sm:text-2xl font-bold leading-tight">
            Waiting until 30 could cost{' '}
            <span className="text-amber-300">{formatMoney(Math.round(costOfWaiting30))}</span>
            {' '}by retirement.
          </p>
        </div>
      )}

      <p className="mt-6 text-violet-300 text-xs max-w-xl mx-auto">
        An educational pension growth calculator — not financial advice.
      </p>
    </header>
  );
}

