import type { ComponentType, SVGProps } from 'react';
import { HeartIcon, LiveIcon } from '@/components/icons';
import { cn } from '@/utils/cn';

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
    <div className="fixturesFilterChips">
      {FILTER_ITEMS.map(({ key, label, icon: Icon }) => {
        const isActive = selectedFilter === key;

        return (
          <button
            key={key}
            type="button"
            aria-pressed={isActive}
            className={cn(
              'fixturesFilterChips__chip',
              isActive
                ? 'fixturesFilterChips__chip--active'
                : 'fixturesFilterChips__chip--inactive',
            )}
            onClick={() => onSelectFilter(key)}
          >
            {Icon ? <Icon /> : null}
            <span className="text-body-md-medium">{label}</span>
            <span
              className={cn(
                'fixturesFilterChips__count text-body-sm-strong',
                isActive
                  ? 'fixturesFilterChips__count--active'
                  : 'fixturesFilterChips__count--inactive',
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
