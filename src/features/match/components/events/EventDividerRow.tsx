import { cn } from '@/utils/cn';

import type { TimelineDividerItem } from '@/features/match/types/match-events.types';

type EventDividerRowProps = {
  item: TimelineDividerItem;
};

export function EventDividerRow({ item }: EventDividerRowProps) {
  const hasSupplementalValue = Boolean(item.score);
  const isKickoffDivider = item.dividerVariant === 'kickoff';

  return (
    <div className="flex w-full items-center">
      <span aria-hidden="true" className="h-0 min-w-0 flex-1 border-t border-app-border-base" />
      <div
        className={cn(
          'mx-[10px] flex shrink-0 items-center justify-center text-app-text-strong',
          hasSupplementalValue ? (isKickoffDivider ? 'gap-1' : 'gap-[10px]') : 'gap-0',
        )}
      >
        <span className="text-body-sm whitespace-nowrap">{item.label}</span>
        {hasSupplementalValue ? (
          <span className="text-body-sm whitespace-nowrap">
            {isKickoffDivider ? `- ${item.score}` : item.score}
          </span>
        ) : null}
      </div>
      <span aria-hidden="true" className="h-0 min-w-0 flex-1 border-t border-app-border-base" />
    </div>
  );
}
