import { cn } from '@/lib/utils/cn';

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
};

export function MatchHeaderTabs({ activeTab }: MatchHeaderTabsProps) {
  return (
    <div className="app-match-divider border-b">
      <div className="overflow-x-auto px-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex min-w-max items-end gap-6 md:min-w-full md:justify-center">
          {HEADER_TABS.map((tab) => {
            const isActive = tab.id === activeTab;

            return (
              <button
                key={tab.id}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'app-type-inter-14-20-normal relative whitespace-nowrap pb-3 text-app-text-muted',
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
