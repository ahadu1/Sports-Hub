import { STATIC_QUERY_GC_TIME_MS, STATIC_QUERY_STALE_TIME_MS } from '@/app/config/app-config';
import { fetchLeagueOptions } from '@/features/fixtures/api/competition.api';
import { queryKeys } from '@/lib/constants/query-keys';
import { useQuery } from '@tanstack/react-query';

export function useLeagueOptions() {
  return useQuery({
    queryKey: queryKeys.fixtures.leagues(),
    queryFn: ({ signal }) => fetchLeagueOptions(signal),
    staleTime: STATIC_QUERY_STALE_TIME_MS,
    gcTime: STATIC_QUERY_GC_TIME_MS,
  });
}
