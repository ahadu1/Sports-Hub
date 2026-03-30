import { LIVE_FIXTURES_REFETCH_INTERVAL_MS } from '@/app/config/app-config';
import { fetchSeasonFixtures } from '@/features/fixtures/api/fixtures.api';
import type { Fixture } from '@/features/fixtures/types/fixtures.types';
import { queryKeys } from '@/lib/constants/query-keys';
import { useQuery } from '@tanstack/react-query';

export function useFixturesQuery(leagueId: string, season: string) {
  const trimmedLeagueId = leagueId.trim();
  const trimmedSeason = season.trim();

  return useQuery({
    queryKey: queryKeys.fixtures.list(trimmedLeagueId, trimmedSeason),
    queryFn: ({ signal }) => fetchSeasonFixtures(trimmedLeagueId, trimmedSeason, signal),
    enabled: trimmedLeagueId.length > 0 && trimmedSeason.length > 0,
    refetchInterval: (query) => {
      const data = query.state.data as Fixture[] | undefined;
      if (!Array.isArray(data)) return false;
      const hasLive = data.some(
        (fixture) => fixture.state === 'live' || fixture.state === 'halftime',
      );
      return hasLive ? LIVE_FIXTURES_REFETCH_INTERVAL_MS : false;
    },
  });
}
