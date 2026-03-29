import { MatchDetailsHeader } from '@/features/match/components/MatchDetailsHeader';
import { MatchEventsSection } from '@/features/match/components/events/MatchEventsSection';
import {
  mockMatchDetailsHeaderEvent,
  mockMatchDetailsHeaderUiMeta,
} from '@/features/match/mocks/matchDetailsHeader.mock';
import { mockMatchEventsApiTimeline } from '@/features/match/mocks/matchEvents.mock';
import { mapMatchEventsTimeline } from '@/features/match/utils/matchEvents.mapper';

export function MatchDetailsPage() {
  const timelineItems = mapMatchEventsTimeline(mockMatchEventsApiTimeline);

  return (
    <div className="flex justify-center">
      <div className="flex w-full max-w-[707px] flex-col gap-[16px]">
        <MatchDetailsHeader
          event={mockMatchDetailsHeaderEvent}
          uiMeta={mockMatchDetailsHeaderUiMeta}
        />
        <MatchEventsSection items={timelineItems} />
      </div>
    </div>
  );
}
