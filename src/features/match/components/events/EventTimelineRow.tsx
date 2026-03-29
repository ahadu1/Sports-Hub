import { EventHalfRow } from './EventHalfRow';
import { EventMinutePill } from './EventMinutePill';

import type { TimelineEventItem } from '@/features/match/types/match-events.types';

type EventTimelineRowProps = {
  item: TimelineEventItem;
};

export function EventTimelineRow({ item }: EventTimelineRowProps) {
  return (
    <div className="grid w-full grid-cols-[minmax(0,1fr)_48px_minmax(0,1fr)] items-center gap-x-[4px]">
      <EventHalfRow content={item.home} side="home" />
      <div className="flex items-center justify-center">
        <EventMinutePill minute={item.minute} variant={item.minuteVariant} />
      </div>
      <EventHalfRow content={item.away} side="away" />
    </div>
  );
}
