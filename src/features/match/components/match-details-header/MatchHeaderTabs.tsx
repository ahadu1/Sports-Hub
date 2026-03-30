import { cn } from '@/utils/cn';

import type { MatchDetailsHeaderUiMeta } from '@/features/match/components/match-details-header.types';

const HEADER_TABS = [
  { id: 'details', label: 'Details' },
  { id: 'odds', label: 'Odds' },
  { id: 'lineups', label: 'Lineups' },
  { id: 'events', label: 'Events' },
  { id: 'stats', label: 'Stats' },
  { id: 'standings', label: 'Standings' },
] as const satisfies ReadonlyArray<{
  id: MatchDetailsHeaderUiMeta['activeTab'];
  label: string;
}>;

type MatchHeaderTabsProps = {
  activeTab: MatchDetailsHeaderUiMeta['activeTab'];
  /** When false, the Events tab is omitted (e.g. a postponed match). */
  showEventsTab?: boolean;
};

export function MatchHeaderTabs({ activeTab, showEventsTab = true }: MatchHeaderTabsProps) {
  const tabs = showEventsTab ? HEADER_TABS : HEADER_TABS.filter((tab) => tab.id !== 'events');

  return (
    <div className="border-b border-app-border-base">
      <div className="overflow-x-auto px-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex min-w-max items-end gap-6 md:min-w-full md:justify-center">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;

            return (
              <button
                key={tab.id}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'text-body-md relative whitespace-nowrap pb-3 text-app-text-muted',
                  isActive &&
                    'text-app-text after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-app-brand-secondary after:content-[""]',
                )}
                type="button"
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
