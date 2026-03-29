import EventCornerSvg from '@/features/match/assets/icons/events/event-corner.svg';
import EventGoalSvg from '@/features/match/assets/icons/events/event-goal.svg';
import EventInjurySvg from '@/features/match/assets/icons/events/event-injury.svg';
import EventOffThePostSvg from '@/features/match/assets/icons/events/event-off-the-post.svg';
import EventRedCardSvg from '@/features/match/assets/icons/events/event-red-card.svg';
import EventSubstitutionSvg from '@/features/match/assets/icons/events/event-substitution.svg';
import EventYellowCardSvg from '@/features/match/assets/icons/events/event-yellow-card.svg';
import { cn } from '@/lib/utils/cn';

import type { MatchEventType } from '@/features/match/types/match-events.types';

type EventIconProps = {
  eventType: MatchEventType;
  className?: string;
};

const EVENT_ICON_COMPONENTS = {
  goal: EventGoalSvg,
  'off-the-post': EventOffThePostSvg,
  substitution: EventSubstitutionSvg,
  'yellow-card': EventYellowCardSvg,
  'red-card': EventRedCardSvg,
  injury: EventInjurySvg,
  corner: EventCornerSvg,
} as const satisfies Record<MatchEventType, string>;

export function EventIcon({ eventType, className }: EventIconProps) {
  const iconSrc = EVENT_ICON_COMPONENTS[eventType];

  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex h-[12px] w-[12px] shrink-0 items-center justify-center',
        className,
      )}
    >
      <img alt="" className="h-[12px] w-[12px] shrink-0 object-contain" src={iconSrc} />
    </span>
  );
}
