import { mapFixturesResponse } from '@/features/fixtures/api/fixtures.mappers';
import { fixturesResponseSchema } from '@/features/fixtures/api/fixtures.schemas';
import type { Fixture } from '@/features/fixtures/types/fixtures.types';
import { endpoints } from '@/lib/api/endpoints';
import { getJson } from '@/lib/api/http-client';

export async function fetchSeasonFixtures(
  leagueId: string,
  season: string,
  signal?: AbortSignal,
): Promise<Fixture[]> {
  const trimmedLeagueId = leagueId.trim();
  const trimmedSeason = season.trim();

  if (!trimmedLeagueId || !trimmedSeason) {
    return [];
  }

  const opts = signal !== undefined ? { signal } : undefined;
  const raw = await getJson(
    endpoints.eventsSeason(trimmedLeagueId, trimmedSeason),
    fixturesResponseSchema,
    opts,
  );

  return mapFixturesResponse([raw]);
}
