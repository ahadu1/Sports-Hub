import { EventDividerRow } from './EventDividerRow';
import { EventTimelineRow } from './EventTimelineRow';

import type { TimelineItem } from '@/features/match/types/match-events.types';

type MatchEventsSectionProps = {
  items: TimelineItem[];
};

export function MatchEventsSection({ items }: MatchEventsSectionProps) {
  return (
    <section
      aria-labelledby="match-events-title"
      className="flex w-full flex-col gap-[16px] rounded-[8px] bg-[#1D1E2B] p-[16px]"
    >
      <h2 className="app-type-inter-14-20-medium text-white" id="match-events-title">
        Events
      </h2>
      <div className="flex w-full flex-col gap-[8px]">
        {items.map((item) =>
          item.kind === 'divider' ? (
            <EventDividerRow key={item.id} item={item} />
          ) : (
            <EventTimelineRow key={item.id} item={item} />
          ),
        )}
      </div>
    </section>
  );
}
