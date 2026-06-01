export type TabId = 'waiting' | 'everyday' | 'build' | 'year-by-year' | 'assumptions';

export type Tab = {
  id: TabId;
  label: string;
};

export const TABS: Tab[] = [
  { id: 'waiting', label: 'Cost of Waiting' },
  { id: 'everyday', label: 'Everyday Choices' },
  { id: 'build', label: 'Build Your Pot' },
  { id: 'year-by-year', label: 'Year by Year' },
  { id: 'assumptions', label: 'Assumptions' },
];
