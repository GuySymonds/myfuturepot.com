# MyFuturePot

**See how today's choices could grow your future pension pot.**

MyFuturePot is an educational pension growth calculator that helps people understand how pension pots can grow over time. The main audience is young people learning about pensions, but the site is also useful for adults comparing jobs and employer pension contributions.

🌐 [myfuturepot.com](https://myfuturepot.com)

---

## Features

- **Pension Pot Simulator** — model how a pension pot could grow based on salary, contributions, pay rises, and investment assumptions
- **Quick £1 Growth Demo** — see how £1 invested today could grow over time with monthly compounding
- **Cost of Waiting** — compare starting ages (18, 25, 30, 40) side by side
- **Year-by-year breakdown** — collapsible table showing age, salary, contributions, and pot value
- **Interactive charts** — toggle between pot value and today's equivalent
- **Tooltips** — plain-English explanations for every input and output
- **Mobile-friendly** — designed for phone screens first, works well on desktop too

## Tech stack

- [React](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Recharts](https://recharts.org)
- [lucide-react](https://lucide.dev)
- [Vitest](https://vitest.dev)

## Getting started

```bash
npm install
npm run dev
```

## Running tests

```bash
npm test
```

Tests cover:

- Monthly compound growth
- Inflation / price-rise adjustment
- Pension pot calculation
- Contribution percentage increases
- Maximum contribution cap
- Cost of waiting comparison

## Building for production

```bash
npm run build
```

---

## Disclaimer

MyFuturePot is an educational pension growth calculator. The figures shown are estimates based on user-selected assumptions and are not financial advice. Investment returns are not guaranteed, inflation varies over time, and actual pension outcomes may differ.

---

## Licence

This project is publicly visible but not open source.

Copyright © Guy Symonds. All rights reserved.

You may view the source code for learning and review, but you may not copy, modify, distribute, host, reuse, or use it commercially without written permission.

The MyFuturePot name, domain, branding, copy, visual identity and design assets are not licensed for reuse.
