import { STATIC_QUERY_GC_TIME_MS, STATIC_QUERY_STALE_TIME_MS } from '@/app/config/app-config';
import { fetchLeagueSeasons } from '@/features/fixtures/api/competition.api';
import { queryKeys } from '@/lib/constants/query-keys';
import { useQuery } from '@tanstack/react-query';

export function useLeagueSeasons(leagueId: string) {
  const trimmedLeagueId = leagueId.trim();

  return useQuery({
    queryKey: queryKeys.fixtures.seasons(trimmedLeagueId),
    queryFn: ({ signal }) => fetchLeagueSeasons(trimmedLeagueId, signal),
    enabled: trimmedLeagueId.length > 0,
    staleTime: STATIC_QUERY_STALE_TIME_MS,
    gcTime: STATIC_QUERY_GC_TIME_MS,
  });
}
