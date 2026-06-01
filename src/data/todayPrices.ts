export type TodayPriceExample = {
  id: string;
  label: string;
  emoji: string;
  unitName: string;
  estimatedPrice: number;
  sourceLabel?: string;
  sourceUrl?: string;
  note?: string;
};

export const todayPriceExamples: TodayPriceExample[] = [
  {
    id: 'bread',
    label: 'Loaves of bread',
    emoji: '🍞',
    unitName: 'loaves',
    estimatedPrice: 1.45,
    sourceLabel: 'Example UK price',
    note: 'Based on an example price for a standard loaf. Prices vary.',
  },
  {
    id: 'concert',
    label: 'Concert tickets',
    emoji: '🎟️',
    unitName: 'tickets',
    estimatedPrice: 75,
    note: 'Ticket prices vary heavily by artist and venue.',
  },
  {
    id: 'phone',
    label: 'Smartphones',
    emoji: '📱',
    unitName: 'phones',
    estimatedPrice: 800,
    note: 'Approximate price for a new mid-to-high range phone.',
  },
  {
    id: 'driving-lesson',
    label: 'Driving lessons',
    emoji: '🚗',
    unitName: 'lessons',
    estimatedPrice: 38,
    note: 'Driving lesson prices vary by area and instructor.',
  },
  {
    id: 'rent',
    label: 'Months of rent',
    emoji: '🏠',
    unitName: 'months',
    estimatedPrice: 1200,
    note: 'Rent varies heavily by location and property size.',
  },
  {
    id: 'pint',
    label: 'Pints in a pub',
    emoji: '🍺',
    unitName: 'pints',
    estimatedPrice: 5.15,
    note: 'Pub prices vary a lot by location.',
  },
];
