import {
  DEFAULT_QUERY_STALE_TIME_MS,
  HISTORICAL_QUERY_GC_TIME_MS,
  HISTORICAL_QUERY_STALE_TIME_MS,
} from '@/app/config/app-config';
import { fetchMatchTimeline } from '@/features/match/api/matchTimeline.api';
import { MATCH_TIMELINE_LIVE_REFETCH_MS } from '@/features/match/constants/match.constants';
import type { Fixture } from '@/features/fixtures/types/fixtures.types';
import type {
  MatchTimelineMapContext,
  TimelineItem,
} from '@/features/match/types/match-events.types';
import type { MatchDetail } from '@/features/match/types/match.types';
import { isValidMatchEventId } from '@/features/match/utils/matchEventId.utils';
import { mapMatchEventsTimeline } from '@/features/match/utils/matchEvents.mapper';
import { isMatchLiveOrInProgress } from '@/features/match/utils/matchStatus.utils';
import { queryKeys } from '@/lib/constants/query-keys';
import { queryOptions, useQuery } from '@tanstack/react-query';

type UseMatchTimelineParams = {
  eventId: string;
  matchDetail?: MatchDetail | null | undefined;
  selectedFixture?: Fixture | undefined;
};

function formatKickoffLabel(
  rawTimeLocal: string | null | undefined,
  rawTime: string | null | undefined,
): string | undefined {
  const timeValue = rawTimeLocal?.trim() || rawTime?.trim() || '';
  const match = timeValue.match(/^(\d{2}:\d{2})/);

  return match?.[1];
}

function getMatchTimelineMapContext(
  matchDetail?: MatchDetail | null | undefined,
  selectedFixture?: Fixture | undefined,
): MatchTimelineMapContext {
  if (matchDetail) {
    return {
      homeTeamId: matchDetail.homeTeamId,
      awayTeamId: matchDetail.awayTeamId,
      homeTeamName: matchDetail.homeTeamName,
      awayTeamName: matchDetail.awayTeamName,
      matchState: matchDetail.state,
      homeScore: matchDetail.homeScore,
      awayScore: matchDetail.awayScore,
      halftimeHomeScore: matchDetail.halftimeHomeScore,
      halftimeAwayScore: matchDetail.halftimeAwayScore,
      kickoffLabel: formatKickoffLabel(matchDetail.kickoffTimeLocal, matchDetail.kickoffTime),
      highlightLatestEvent: matchDetail.state === 'live' || matchDetail.state === 'halftime',
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
    highlightLatestEvent:
      selectedFixture?.state === 'live' || selectedFixture?.state === 'halftime',
  };
}

export function getMatchTimelineQueryOptions({
  eventId,
  matchDetail,
  selectedFixture,
}: UseMatchTimelineParams) {
  const trimmedEventId = eventId.trim();
  const hasValidEventId = isValidMatchEventId(trimmedEventId);
  const isLive = isMatchLiveOrInProgress(matchDetail?.status);
  const timelineContext = getMatchTimelineMapContext(matchDetail, selectedFixture);

  return queryOptions<Awaited<ReturnType<typeof fetchMatchTimeline>>, Error, TimelineItem[]>({
    queryKey: queryKeys.match.timeline(trimmedEventId),
    queryFn: ({ signal }) => fetchMatchTimeline(trimmedEventId, signal),
    enabled: hasValidEventId,
    refetchInterval: isLive ? MATCH_TIMELINE_LIVE_REFETCH_MS : false,
    staleTime:
      matchDetail?.state === 'finished'
        ? HISTORICAL_QUERY_STALE_TIME_MS
        : DEFAULT_QUERY_STALE_TIME_MS,
    gcTime: HISTORICAL_QUERY_GC_TIME_MS,
    select: (raw) => mapMatchEventsTimeline(raw, timelineContext),
  });
}

export function useMatchTimeline(params: UseMatchTimelineParams) {
  return useQuery(getMatchTimelineQueryOptions(params));
}
