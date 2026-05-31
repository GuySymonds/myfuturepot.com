export default function Disclaimer() {
  return (
    <footer className="bg-slate-800 text-slate-300 py-8 px-6 mt-12">
      <div className="max-w-4xl mx-auto text-center text-sm leading-relaxed space-y-2">
        <p className="font-semibold text-slate-200">Educational illustration — not financial advice</p>
        <p>
          MyFuturePot is an educational pension growth calculator. The figures shown are estimates
          based on user-selected assumptions and are not financial advice. Investment returns are not
          guaranteed, inflation varies over time, and actual pension outcomes may differ.
        </p>
        <p className="text-xs text-slate-400 mt-4">
          © Guy Symonds. All rights reserved. myfuturepot.com
        </p>
      </div>
    </footer>
  );
}
