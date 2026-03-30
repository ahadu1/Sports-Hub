import { EventDividerRow } from './EventDividerRow';
import { EventTimelineRow } from './EventTimelineRow';

import { LoadingState } from '@/components/ui/LoadingState';
import type { TimelineItem } from '@/features/match/types/match-events.types';
import { copy } from '@/lib/constants/copy';

type MatchEventsSectionProps = {
  items: TimelineItem[];
  isLoading?: boolean;
  isError?: boolean;
};

function MatchEventsState({
  message,
  isLoading = false,
}: {
  message: string;
  isLoading?: boolean;
}) {
  return (
    <div className="flex min-h-[120px] items-center justify-center rounded-[8px] border border-[#292B41] px-4 text-center">
      {isLoading ? (
        <LoadingState className="justify-center" label={message} />
      ) : (
        <p className="app-type-inter-14-20-normal text-app-text-muted">{message}</p>
      )}
    </div>
  );
}

export function MatchEventsSection({
  items,
  isLoading = false,
  isError = false,
}: MatchEventsSectionProps) {
  const hasItems = items.length > 0;

  return (
    <section
      aria-labelledby="match-events-title"
      className="flex w-full flex-col gap-[16px] rounded-[8px] bg-[#1D1E2B] p-[16px]"
    >
      <h2 className="app-type-inter-14-20-medium text-white" id="match-events-title">
        Events
      </h2>
      {hasItems ? (
        <div className="flex w-full flex-col gap-[8px]">
          {items.map((item) =>
            item.kind === 'divider' ? (
              <EventDividerRow key={item.id} item={item} />
            ) : (
              <EventTimelineRow key={item.id} item={item} />
            ),
          )}
        </div>
      ) : isError ? (
        <MatchEventsState message={copy.inlineErrorMessage} />
      ) : isLoading ? (
        <MatchEventsState isLoading message={copy.loading} />
      ) : (
        <MatchEventsState message="No timeline events available." />
      )}
    </section>
  );
}
