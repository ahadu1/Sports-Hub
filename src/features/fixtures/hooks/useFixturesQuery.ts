import { LIVE_FIXTURES_REFETCH_INTERVAL_MS } from '@/app/config/app-config';
import { fetchFixtures } from '@/features/fixtures/api/fixtures.api';
import { queryKeys } from '@/lib/constants/query-keys';
import { useQuery } from '@tanstack/react-query';

export function useFixturesQuery() {
  return useQuery({
    queryKey: queryKeys.fixtures.list(),
    queryFn: ({ signal }) => fetchFixtures(signal),
    refetchInterval: LIVE_FIXTURES_REFETCH_INTERVAL_MS,
  });
}
