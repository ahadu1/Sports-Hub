import { cn } from '@/lib/utils/cn';

import type { MatchDetailsHeaderCardCounter } from '@/features/match/components/match-details-header.types';

type MatchHeaderCardCounterProps = {
  counter: MatchDetailsHeaderCardCounter;
};

export function MatchHeaderCardCounter({ counter }: MatchHeaderCardCounterProps) {
  return (
    <span
      aria-label={`${counter.color} cards: ${counter.value}`}
      className={cn(
        'app-match-card-counter',
        counter.color === 'red' ? 'app-match-card-counter--red' : 'app-match-card-counter--yellow',
      )}
    >
      {counter.value}
    </span>
  );
}
