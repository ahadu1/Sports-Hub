import { MAX_QUERY_RETRIES } from '@/app/config/app-config';
import { InlineErrorState } from '@/components/ui/InlineErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { StatePanel } from '@/components/ui/StatePanel';
import type { Fixture } from '@/features/fixtures/types/fixtures.types';
import { MatchDetailsHeader } from '@/features/match/components/MatchDetailsHeader';
import { MatchEventsSection } from '@/features/match/components/events/MatchEventsSection';
import { useMatchDetailsQuery } from '@/features/match/hooks/useMatchDetailsQuery';
import { useMatchTimeline } from '@/features/match/hooks/useMatchTimeline';
import {
  mapMatchDetailsHeaderEvent,
  mapMatchDetailsHeaderUiMeta,
} from '@/features/match/utils/matchDetailsPage.utils';
import { copy } from '@/lib/constants/copy';
import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';

function MatchDetailsHeaderState({
  isLoading,
  onRetry,
  attempt,
}: {
  isLoading: boolean;
  onRetry: () => void;
  attempt: number;
}) {
  return (
    <StatePanel className="app-match-header-state">
      {isLoading ? (
        <LoadingState className="justify-center" label={copy.loading} />
      ) : (
        <InlineErrorState
          title={copy.inlineErrorTitle}
          message={copy.matchUnavailableMessage}
          retryLabel={copy.retry}
          onRetry={onRetry}
          attempt={attempt}
          maxAttempts={MAX_QUERY_RETRIES}
        />
      )}
    </StatePanel>
  );
}

type MatchDetailsRouteState = {
  fixture?: Fixture;
};

export function MatchDetailsPage() {
  const { eventId = '' } = useParams<{ eventId: string }>();
  const routeEventId = eventId.trim();
  const location = useLocation();
  const routeState = location.state as MatchDetailsRouteState | null;
  const selectedFixture = routeState?.fixture;
  const matchDetailsQuery = useMatchDetailsQuery(routeEventId);
  const matchDetail = matchDetailsQuery.data;
  const matchTimelineQuery = useMatchTimeline({
    eventId: routeEventId,
    matchDetail,
    selectedFixture,
  });
  const isTimelineLoading = matchTimelineQuery.isLoading;
  const headerEvent = useMemo(
    () => mapMatchDetailsHeaderEvent(matchDetail, selectedFixture, routeEventId),
    [matchDetail, routeEventId, selectedFixture],
  );
  const headerUiMeta = useMemo(() => mapMatchDetailsHeaderUiMeta(matchDetail), [matchDetail]);

  return (
    <div className="flex justify-center">
      <div className="flex w-full max-w-[707px] flex-col gap-[16px]">
        {headerEvent ? (
          <MatchDetailsHeader event={headerEvent} uiMeta={headerUiMeta} />
        ) : (
          <MatchDetailsHeaderState
            isLoading={matchDetailsQuery.isPending}
            onRetry={() => {
              void matchDetailsQuery.refetch();
            }}
            attempt={Math.max(1, matchDetailsQuery.failureCount)}
          />
        )}
        <MatchEventsSection
          isError={matchTimelineQuery.isError}
          isLoading={isTimelineLoading}
          items={matchTimelineQuery.data ?? []}
          onRetry={() => {
            void matchTimelineQuery.refetch();
          }}
          retryAttempt={Math.max(1, matchTimelineQuery.failureCount)}
        />
      </div>
    </div>
  );
}
