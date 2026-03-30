import {
  DEFAULT_QUERY_STALE_TIME_MS,
  HISTORICAL_QUERY_GC_TIME_MS,
  HISTORICAL_QUERY_STALE_TIME_MS,
} from '@/app/config/app-config';
import {
  MATCH_IN_PROGRESS_REFETCH_MS,
  MATCH_PRE_KICKOFF_REFETCH_MS,
} from '@/features/match/constants/match.constants';
import { fetchMatchDetails } from '@/features/match/api/match.api';
import type { MatchDetail } from '@/features/match/types/match.types';
import { isValidMatchEventId } from '@/utils/match/matchEventId.utils';
import { getMatchRefetchInterval } from '@/utils/match/matchStatus.utils';
import { queryKeys } from '@/lib/constants/query-keys';
import { useQuery } from '@tanstack/react-query';

export function useMatchDetailsQuery(eventId: string) {
  const trimmedEventId = eventId.trim();

  return useQuery({
    queryKey: queryKeys.match.detail(trimmedEventId),
    queryFn: ({ signal }) => fetchMatchDetails(trimmedEventId, signal),
    enabled: isValidMatchEventId(trimmedEventId),
    staleTime: (query) => {
      const detail = query.state.data as MatchDetail | null | undefined;
      return detail?.state === 'finished'
        ? HISTORICAL_QUERY_STALE_TIME_MS
        : DEFAULT_QUERY_STALE_TIME_MS;
    },
    refetchInterval: (query) => {
      const detail = query.state.data as MatchDetail | null | undefined;
      return getMatchRefetchInterval(detail?.state, {
        scheduledMs: MATCH_PRE_KICKOFF_REFETCH_MS,
        activeMs: MATCH_IN_PROGRESS_REFETCH_MS,
      });
    },
    gcTime: HISTORICAL_QUERY_GC_TIME_MS,
  });
}
