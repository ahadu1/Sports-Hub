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
        'app-type-inter-11-15-normal inline-flex h-[19px] w-[48px] shrink-0 items-center justify-center rounded-[100px] px-[8px] py-[2px] text-center',
        variant === 'active'
          ? 'border-[0.5px] border-[#26273B] bg-[#00FFA5] text-[#111827]'
          : 'bg-[#26273B] text-white',
      )}
    >
      {minute}
    </span>
  );
}
