import type { ComponentType, SVGProps } from 'react';
import { cn } from '@/lib/utils/cn';
import HeartIcon from '@/features/fixtures/assets/icon/icon-heart.svg?react';
import LiveIcon from '@/features/fixtures/assets/icon/icon-live.svg?react';

import type { FixturesFilterKey } from '../types/fixtures.types';

type FixturesFilterChipsProps = {
  chipCounts: Record<FixturesFilterKey, number>;
  selectedFilter: FixturesFilterKey;
  onSelectFilter: (filter: FixturesFilterKey) => void;
};

const FILTER_ITEMS: Array<{
  key: FixturesFilterKey;
  label: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
}> = [
  { key: 'all', label: 'All' },
  { key: 'live', label: 'Live', icon: LiveIcon },
  { key: 'favorites', label: 'Favorites', icon: HeartIcon },
];

export function FixturesFilterChips({
  chipCounts,
  selectedFilter,
  onSelectFilter,
}: FixturesFilterChipsProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {FILTER_ITEMS.map(({ key, label, icon: Icon }) => {
        const isActive = selectedFilter === key;

        return (
          <button
            key={key}
            type="button"
            aria-pressed={isActive}
            className={cn(
              'app-fixtures-filter-chip',
              isActive ? 'app-fixtures-filter-chip--active' : 'app-fixtures-filter-chip--inactive',
            )}
            onClick={() => onSelectFilter(key)}
          >
            {Icon ? <Icon aria-hidden="true" className="h-4 w-4 shrink-0" /> : null}
            <span className="app-type-inter-14-20-medium">{label}</span>
            <span
              className={cn(
                'app-fixtures-filter-count app-type-inter-12-16-semibold',
                isActive
                  ? 'app-fixtures-filter-count--active'
                  : 'app-fixtures-filter-count--inactive',
              )}
            >
              {chipCounts[key]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
