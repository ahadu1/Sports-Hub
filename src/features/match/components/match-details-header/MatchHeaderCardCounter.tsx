import { cn } from '@/utils/cn';

import type { MatchDetailsHeaderCardCounter } from '@/features/match/components/match-details-header.types';

type MatchHeaderCardCounterProps = {
  counter: MatchDetailsHeaderCardCounter;
};

export function MatchHeaderCardCounter({ counter }: MatchHeaderCardCounterProps) {
  return (
    <span
      aria-label={`${counter.color} cards: ${counter.value}`}
      className={cn(
        'matchDetailsHeader__cardCounter',
        counter.color === 'red'
          ? 'matchDetailsHeader__cardCounter--red'
          : 'matchDetailsHeader__cardCounter--yellow',
      )}
    >
      {counter.value}
    </span>
  );
}
