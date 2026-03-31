import {
  DEFAULT_QUERY_STALE_TIME_MS,
  HISTORICAL_QUERY_GC_TIME_MS,
  HISTORICAL_QUERY_STALE_TIME_MS,
} from '@/app/config/app-config';
import { fetchMatchTimeline } from '@/features/match/api/matchTimeline.api';
import {
  MATCH_IN_PROGRESS_REFETCH_MS,
  MATCH_PRE_KICKOFF_REFETCH_MS,
} from '@/features/match/constants/match.constants';
import type { Fixture } from '@/features/fixtures/types/fixtures.types';
import type {
  MatchTimelineMapContext,
  MatchTimelineApiPayload,
  TimelineItem,
} from '@/features/match/types/match-events.types';
import type { MatchDetail } from '@/features/match/types/match.types';
import { isValidMatchEventId } from '@/utils/match/matchEventId.utils';
import { mapMatchEventsTimeline } from '@/utils/match/matchEvents.mapper';
import { getMatchRefetchInterval, getPreferredMatchState } from '@/utils/match/matchStatus.utils';
import { queryKeys } from '@/lib/constants/query-keys';
import { queryOptions, useQuery } from '@tanstack/react-query';

type UseMatchTimelineParams = {
  eventId: string;
  matchDetail?: MatchDetail | null | undefined;
  selectedFixture?: Fixture | undefined;
};

export type MatchTimelineQueryData = {
  items: TimelineItem[];
  hasNoEventData: boolean;
};

function getMatchTimelineMapContext(
  matchDetail?: MatchDetail | null | undefined,
  selectedFixture?: Fixture | undefined,
): MatchTimelineMapContext {
  const preferredMatchState = getPreferredMatchState(matchDetail?.state, selectedFixture?.state);

  if (matchDetail) {
    return {
      homeTeamId: matchDetail.homeTeamId,
      awayTeamId: matchDetail.awayTeamId,
      homeTeamName: matchDetail.homeTeamName,
      awayTeamName: matchDetail.awayTeamName,
      matchState: preferredMatchState ?? matchDetail.state,
      homeScore: matchDetail.homeScore ?? selectedFixture?.homeScore,
      awayScore: matchDetail.awayScore ?? selectedFixture?.awayScore,
      halftimeHomeScore: matchDetail.halftimeHomeScore,
      halftimeAwayScore: matchDetail.halftimeAwayScore,
      kickoffLabel:
        matchDetail.kickoff.localTimeLabel ??
        selectedFixture?.kickoff.localTimeLabel ??
        selectedFixture?.kickoffLabel,
    };
  }

  return {
    homeTeamId: selectedFixture?.home.id,
    awayTeamId: selectedFixture?.away.id,
    homeTeamName: selectedFixture?.home.name,
    awayTeamName: selectedFixture?.away.name,
    matchState: selectedFixture?.state,
    homeScore: selectedFixture?.homeScore,
    awayScore: selectedFixture?.awayScore,
    kickoffLabel: selectedFixture?.kickoffLabel,
  };
}

export function getMatchTimelineQueryOptions({
  eventId,
  matchDetail,
  selectedFixture,
}: UseMatchTimelineParams) {
  const trimmedEventId = eventId.trim();
  const hasValidEventId = isValidMatchEventId(trimmedEventId);
  const preferredMatchState = getPreferredMatchState(matchDetail?.state, selectedFixture?.state);
  const timelineContext = getMatchTimelineMapContext(matchDetail, selectedFixture);

  return queryOptions<
    Awaited<ReturnType<typeof fetchMatchTimeline>>,
    Error,
    MatchTimelineQueryData
  >({
    queryKey: queryKeys.match.timeline(trimmedEventId),
    queryFn: ({ signal }) => fetchMatchTimeline(trimmedEventId, signal),
    enabled: hasValidEventId && preferredMatchState !== 'Match Postponed',
    refetchInterval: getMatchRefetchInterval(preferredMatchState, {
      scheduledMs: MATCH_PRE_KICKOFF_REFETCH_MS,
      activeMs: MATCH_IN_PROGRESS_REFETCH_MS,
    }),
    staleTime:
      preferredMatchState === 'finished'
        ? HISTORICAL_QUERY_STALE_TIME_MS
        : DEFAULT_QUERY_STALE_TIME_MS,
    gcTime: HISTORICAL_QUERY_GC_TIME_MS,
    select: (raw: MatchTimelineApiPayload) => ({
      items: mapMatchEventsTimeline(raw, timelineContext),
      hasNoEventData: raw.message?.trim().toLowerCase() === 'no data found',
    }),
  });
}

export function useMatchTimeline(params: UseMatchTimelineParams) {
  return useQuery(getMatchTimelineQueryOptions(params));
}
