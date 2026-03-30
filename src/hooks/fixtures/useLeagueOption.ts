import { STATIC_QUERY_GC_TIME_MS, STATIC_QUERY_STALE_TIME_MS } from '@/app/config/app-config';
import { fetchLeagueOptionById } from '@/features/fixtures/api/competition.api';
import { queryKeys } from '@/lib/constants/query-keys';
import { useQuery } from '@tanstack/react-query';

export function useLeagueOption(leagueId: string) {
  const trimmedLeagueId = leagueId.trim();

  return useQuery({
    queryKey: queryKeys.fixtures.league(trimmedLeagueId),
    queryFn: ({ signal }) => fetchLeagueOptionById(trimmedLeagueId, signal),
    enabled: trimmedLeagueId.length > 0,
    staleTime: STATIC_QUERY_STALE_TIME_MS,
    gcTime: STATIC_QUERY_GC_TIME_MS,
  });
}
