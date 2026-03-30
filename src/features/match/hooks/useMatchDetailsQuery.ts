import {
  DEFAULT_QUERY_STALE_TIME_MS,
  HISTORICAL_QUERY_GC_TIME_MS,
  HISTORICAL_QUERY_STALE_TIME_MS,
} from '@/app/config/app-config';
import { fetchMatchDetails } from '@/features/match/api/match.api';
import type { MatchDetail } from '@/features/match/types/match.types';
import { isValidMatchEventId } from '@/features/match/utils/matchEventId.utils';
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
    gcTime: HISTORICAL_QUERY_GC_TIME_MS,
  });
}
