import { cn } from '@/lib/utils/cn';

import type { TimelineDividerItem } from '@/features/match/types/match-events.types';

type EventDividerRowProps = {
  item: TimelineDividerItem;
};

export function EventDividerRow({ item }: EventDividerRowProps) {
  const hasSupplementalValue = Boolean(item.score);
  const isKickoffDivider = item.dividerVariant === 'kickoff';

  return (
    <div className="flex w-full items-center">
      <span aria-hidden="true" className="app-match-divider h-0 min-w-0 flex-1 border-t" />
      <div
        className={cn(
          'mx-[10px] flex shrink-0 items-center justify-center text-app-text-strong',
          hasSupplementalValue ? (isKickoffDivider ? 'gap-1' : 'gap-[10px]') : 'gap-0',
        )}
      >
        <span className="app-type-inter-12-16-normal whitespace-nowrap">{item.label}</span>
        {hasSupplementalValue ? (
          <span className="app-type-inter-12-16-normal whitespace-nowrap">
            {isKickoffDivider ? `- ${item.score}` : item.score}
          </span>
        ) : null}
      </div>
      <span aria-hidden="true" className="app-match-divider h-0 min-w-0 flex-1 border-t" />
    </div>
  );
}
