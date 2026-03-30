import { cn } from '@/utils/cn';

import type { MatchMinuteVariant } from '@/features/match/types/match-events.types';

type EventMinutePillProps = {
  minute: string;
  variant: MatchMinuteVariant;
};

export function EventMinutePill({ minute, variant }: EventMinutePillProps) {
  return (
    <span
      className={cn(
        'matchEventsSection__minutePill',
        variant === 'active'
          ? 'matchEventsSection__minutePill--active'
          : 'matchEventsSection__minutePill--default',
      )}
    >
      {minute}
    </span>
  );
}
