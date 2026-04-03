import { cn } from '@/utils/cn';

import type { MatchDetailsHeaderUiMeta } from '@/features/match/components/match-details-header.types';

export const MATCH_HEADER_TABS = [
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
  onTabChange?: ((tab: MatchDetailsHeaderUiMeta['activeTab']) => void) | undefined;
};

export function MatchHeaderTabs({
  activeTab,
  showEventsTab = true,
  onTabChange,
}: MatchHeaderTabsProps) {
  const tabs = showEventsTab
    ? MATCH_HEADER_TABS
    : MATCH_HEADER_TABS.filter((tab) => tab.id !== 'events');

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
                onClick={() => onTabChange?.(tab.id)}
                className={cn(
                  'text-body-md relative whitespace-nowrap pb-3 text-app-text-muted transition hover:text-app-text focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-app-surface',
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
