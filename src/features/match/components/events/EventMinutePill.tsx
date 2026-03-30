import { cn } from '@/lib/utils/cn';

import type { MatchMinuteVariant } from '@/features/match/types/match-events.types';

type EventMinutePillProps = {
  minute: string;
  variant: MatchMinuteVariant;
};

export function EventMinutePill({ minute, variant }: EventMinutePillProps) {
  return (
    <span
      className={cn(
        'app-match-minute-pill',
        variant === 'active' ? 'app-match-minute-pill--active' : 'app-match-minute-pill--default',
      )}
    >
      {minute}
    </span>
  );
}
