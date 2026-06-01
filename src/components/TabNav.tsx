import { TABS, type TabId } from '../data/tabs';

interface TabNavProps {
  activeTab: TabId;
  onChange: (id: TabId) => void;
}

export default function TabNav({ activeTab, onChange }: TabNavProps) {
  return (
    <nav
      role="tablist"
      aria-label="Main sections"
      className="flex gap-1 overflow-x-auto scrollbar-none py-1 px-1"
    >
      {TABS.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            onClick={() => onChange(tab.id)}
            className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-violet-400 ${
              isActive
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
