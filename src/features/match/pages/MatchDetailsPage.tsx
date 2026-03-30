import { MatchDetailsHeader } from '@/features/match/components/MatchDetailsHeader';
import { MatchEventsSection } from '@/features/match/components/events/MatchEventsSection';
import type { MatchDetailsHeaderUiMeta } from '@/features/match/components/match-details-header.types';
import { useMatchDetailsQuery } from '@/features/match/hooks/useMatchDetailsQuery';
import { useMatchTimeline } from '@/features/match/hooks/useMatchTimeline';
import type { Fixture } from '@/features/fixtures/types/fixtures.types';
import { LoadingState } from '@/components/ui/LoadingState';
import { copy } from '@/lib/constants/copy';
import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';

function MatchDetailsHeaderState({ isLoading, message }: { isLoading: boolean; message: string }) {
  return (
    <section className="flex h-[198px] w-full max-w-[707px] items-center justify-center bg-[#1D1E2B] px-4 text-center">
      {isLoading ? (
        <LoadingState className="justify-center" label={message} />
      ) : (
        <p className="app-type-inter-14-20-normal text-app-text-muted">{message}</p>
      )}
    </section>
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
  const matchTimelineQuery = useMatchTimeline({ eventId: routeEventId, matchDetail });
  const isTimelineLoading = matchTimelineQuery.isLoading;
  const headerEvent = useMemo(() => {
    if (matchDetail) {
      return {
        idEvent: matchDetail.id,
        strLeague: matchDetail.leagueName,
        dateEvent: matchDetail.dateEvent,
        strHomeTeam: matchDetail.homeTeamName,
        strAwayTeam: matchDetail.awayTeamName,
        strHomeTeamBadge: matchDetail.homeTeamBadge,
        strAwayTeamBadge: matchDetail.awayTeamBadge,
        intHomeScore: matchDetail.homeScore,
        intAwayScore: matchDetail.awayScore,
        strStatus: matchDetail.status,
        matchState: matchDetail.state,
      };
    }

    if (selectedFixture && selectedFixture.eventId === routeEventId) {
      return {
        idEvent: selectedFixture.eventId,
        strLeague: selectedFixture.leagueName,
        dateEvent: selectedFixture.fixtureDate,
        strHomeTeam: selectedFixture.home.name,
        strAwayTeam: selectedFixture.away.name,
        strHomeTeamBadge: selectedFixture.home.badgeSrc,
        strAwayTeamBadge: selectedFixture.away.badgeSrc,
        intHomeScore: selectedFixture.homeScore ?? null,
        intAwayScore: selectedFixture.awayScore ?? null,
        strStatus: null,
        matchState: selectedFixture.state,
      };
    }

    return null;
  }, [matchDetail, routeEventId, selectedFixture]);
  const headerUiMeta = useMemo<MatchDetailsHeaderUiMeta>(
    () => ({
      activeTab: 'events',
      homeYellowCards: matchDetail?.summary.homeYellowCardDetails.length ?? 0,
      homeRedCards: matchDetail?.summary.homeRedCardDetails.length ?? 0,
      awayYellowCards: matchDetail?.summary.awayYellowCardDetails.length ?? 0,
      awayRedCards: matchDetail?.summary.awayRedCardDetails.length ?? 0,
    }),
    [matchDetail],
  );
  const headerStateMessage = matchDetailsQuery.isPending ? copy.loading : copy.inlineErrorMessage;

  return (
    <div className="flex justify-center">
      <div className="flex w-full max-w-[707px] flex-col gap-[16px]">
        {headerEvent ? (
          <MatchDetailsHeader event={headerEvent} uiMeta={headerUiMeta} />
        ) : (
          <MatchDetailsHeaderState
            isLoading={matchDetailsQuery.isPending}
            message={headerStateMessage}
          />
        )}
        <MatchEventsSection
          isError={matchTimelineQuery.isError}
          isLoading={isTimelineLoading}
          items={matchTimelineQuery.data ?? []}
        />
      </div>
    </div>
  );
}
