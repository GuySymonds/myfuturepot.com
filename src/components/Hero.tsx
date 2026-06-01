import { TrendingUp } from 'lucide-react';

export default function Hero() {
  return (
    <header className="bg-gradient-to-br from-violet-600 to-indigo-700 text-white py-10 px-6 text-center">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="bg-white/20 rounded-xl p-2">
          <TrendingUp size={28} className="text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">MyFuturePot</h1>
      </div>
      <p className="text-violet-100 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
        See how today's choices could grow your future pension pot.
      </p>
      <p className="mt-3 text-violet-300 text-xs max-w-xl mx-auto">
        An educational pension growth calculator — not financial advice.
      </p>
    </header>
  );
}

