import { MAX_QUERY_RETRIES } from '@/app/config/app-config';
import { InlineErrorState } from '@/components/ui/InlineErrorState';
import { EventDividerRow } from './EventDividerRow';
import { EventTimelineRow } from './EventTimelineRow';

import { LoadingState } from '@/components/ui/LoadingState';
import { StatePanel } from '@/components/ui/StatePanel';
import type { TimelineItem } from '@/features/match/types/match-events.types';
import { copy } from '@/lib/constants/copy';

type MatchEventsSectionProps = {
  items: TimelineItem[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: (() => void) | undefined;
  retryAttempt?: number | undefined;
};

function MatchEventsState({
  message,
  isLoading = false,
  onRetry,
  retryAttempt,
}: {
  message: string;
  isLoading?: boolean;
  onRetry?: (() => void) | undefined;
  retryAttempt?: number | undefined;
}) {
  return (
    <StatePanel compact className="app-match-empty-state">
      {isLoading ? (
        <LoadingState className="justify-center" label={message} />
      ) : onRetry ? (
        <InlineErrorState
          title={copy.inlineErrorTitle}
          message={message}
          retryLabel={copy.retry}
          onRetry={onRetry}
          attempt={retryAttempt}
          maxAttempts={MAX_QUERY_RETRIES}
        />
      ) : (
        <p className="app-type-inter-14-20-normal text-app-text-muted">{message}</p>
      )}
    </StatePanel>
  );
}

export function MatchEventsSection({
  items,
  isLoading = false,
  isError = false,
  onRetry,
  retryAttempt,
}: MatchEventsSectionProps) {
  const hasItems = items.length > 0;

  return (
    <section
      aria-labelledby="match-events-title"
      className="app-match-surface flex w-full flex-col gap-4 rounded-lg p-4"
    >
      <h2 className="app-type-inter-14-20-medium text-app-text" id="match-events-title">
        {copy.timelineTitle}
      </h2>
      {hasItems ? (
        <div className="flex w-full flex-col gap-2">
          {items.map((item) =>
            item.kind === 'divider' ? (
              <EventDividerRow key={item.id} item={item} />
            ) : (
              <EventTimelineRow key={item.id} item={item} />
            ),
          )}
        </div>
      ) : isError ? (
        <MatchEventsState
          message={copy.inlineErrorMessage}
          onRetry={onRetry}
          retryAttempt={retryAttempt}
        />
      ) : isLoading ? (
        <MatchEventsState isLoading message={copy.loading} />
      ) : (
        <MatchEventsState message={copy.timelineEmptyMessage} />
      )}
    </section>
  );
}
