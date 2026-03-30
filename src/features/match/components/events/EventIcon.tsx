import type { ComponentType, SVGProps } from 'react';
import EventCornerSvg from '@/features/match/assets/icons/events/event-corner.svg?react';
import EventGoalSvg from '@/features/match/assets/icons/events/event-goal.svg?react';
import EventInjurySvg from '@/features/match/assets/icons/events/event-injury.svg?react';
import EventOffThePostSvg from '@/features/match/assets/icons/events/event-off-the-post.svg?react';
import EventRedCardSvg from '@/features/match/assets/icons/events/event-red-card.svg?react';
import EventSubstitutionSvg from '@/features/match/assets/icons/events/event-substitution.svg?react';
import EventYellowCardSvg from '@/features/match/assets/icons/events/event-yellow-card.svg?react';
import { cn } from '@/utils/cn';

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
} as const satisfies Record<MatchEventType, ComponentType<SVGProps<SVGSVGElement>>>;

export function EventIcon({ eventType, className }: EventIconProps) {
  const Icon = EVENT_ICON_COMPONENTS[eventType];

  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex h-[12px] w-[12px] shrink-0 items-center justify-center',
        className,
      )}
    >
      <Icon aria-hidden="true" className="h-[12px] w-[12px] shrink-0" />
    </span>
  );
}
