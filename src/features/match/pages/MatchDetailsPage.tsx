import { MAX_QUERY_RETRIES } from '@/app/config/app-config';
import { ComingSoonCard } from '@/components/ui/ComingSoonCard';
import { InlineErrorState } from '@/components/ui/InlineErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { StatePanel } from '@/components/ui/StatePanel';
import type { Fixture } from '@/features/fixtures/types/fixtures.types';
import { MatchDetailsHeader } from '@/features/match/components/MatchDetailsHeader';
import { MatchEventsSection } from '@/features/match/components/events/MatchEventsSection';
import { MATCH_HEADER_TABS } from '@/features/match/components/match-details-header/MatchHeaderTabs';
import type { MatchDetailsHeaderUiMeta } from '@/features/match/components/match-details-header.types';
import { useMatchDetailsQuery } from '@/hooks/match/useMatchDetailsQuery';
import { useMatchTimeline } from '@/hooks/match/useMatchTimeline';
import {
  mapMatchDetailsHeaderEvent,
  mapMatchDetailsHeaderUiMeta,
} from '@/utils/match/matchDetailsPage.utils';
import { copy } from '@/lib/constants/copy';
import { useEffect, useMemo, useState } from 'react';
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
    <StatePanel className="h-[198px] w-full max-w-[707px] rounded-lg border border-app-border-base bg-app-surface">
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

function MatchTabPlaceholderCard({
  activeTab,
}: {
  activeTab: Exclude<MatchDetailsHeaderUiMeta['activeTab'], 'events'>;
}) {
  const title = MATCH_HEADER_TABS.find((tab) => tab.id === activeTab)?.label ?? 'Coming Soon';

  return <ComingSoonCard title={title} />;
}

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
  const timelineData = matchTimelineQuery.data;
  const isTimelineLoading = matchTimelineQuery.isLoading;
  const headerEvent = useMemo(
    () => mapMatchDetailsHeaderEvent(matchDetail, selectedFixture, routeEventId),
    [matchDetail, routeEventId, selectedFixture],
  );
  const headerUiMeta = useMemo(
    () => mapMatchDetailsHeaderUiMeta(matchDetail, timelineData?.items ?? [], selectedFixture),
    [matchDetail, selectedFixture, timelineData?.items],
  );
  const [activeTab, setActiveTab] = useState<MatchDetailsHeaderUiMeta['activeTab']>(
    headerUiMeta.activeTab,
  );
  const matchNotStartedYet = headerEvent?.matchState === 'scheduled';
  const showEventsTab = headerEvent?.matchState !== 'Match Postponed';

  useEffect(() => {
    setActiveTab(headerUiMeta.activeTab);
  }, [headerUiMeta.activeTab, routeEventId]);

  useEffect(() => {
    if (!showEventsTab && activeTab === 'events') {
      setActiveTab('details');
    }
  }, [activeTab, showEventsTab]);

  return (
    <div className="flex justify-center">
      <div className="flex w-full max-w-[707px] flex-col gap-4">
        {headerEvent ? (
          <MatchDetailsHeader
            event={headerEvent}
            uiMeta={{ ...headerUiMeta, activeTab }}
            onTabChange={setActiveTab}
          />
        ) : (
          <MatchDetailsHeaderState
            isLoading={matchDetailsQuery.isPending}
            onRetry={() => {
              void matchDetailsQuery.refetch();
            }}
            attempt={Math.max(1, matchDetailsQuery.failureCount)}
          />
        )}
        {activeTab === 'events' && showEventsTab ? (
          <MatchEventsSection
            isError={matchTimelineQuery.isError}
            isLoading={isTimelineLoading}
            items={timelineData?.items ?? []}
            hasNoEventData={timelineData?.hasNoEventData ?? false}
            matchNotStartedYet={matchNotStartedYet}
            onRetry={() => {
              void matchTimelineQuery.refetch();
            }}
            retryAttempt={Math.max(1, matchTimelineQuery.failureCount)}
          />
        ) : (
          <MatchTabPlaceholderCard activeTab={activeTab as Exclude<typeof activeTab, 'events'>} />
        )}
      </div>
    </div>
  );
}
