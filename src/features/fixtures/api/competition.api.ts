import {
  type CompetitionOption,
  mapLeagueCurrentSeasonResponse,
  mapLeagueListResponse,
  mapLeagueLookupResponse,
  mapLeagueSeasonsResponse,
} from '@/features/fixtures/api/competition.mappers';
import {
  leagueLookupResponseSchema,
  leagueListResponseSchema,
  leagueSeasonsResponseSchema,
} from '@/features/fixtures/api/competition.schemas';
import { endpoints, legacyEndpoints } from '@/lib/api/endpoints';
import { getJsonWithLegacyFallback } from '@/lib/api/http-client';

async function fetchLeagueCurrentSeason(
  leagueId: string,
  signal?: AbortSignal,
): Promise<CompetitionOption[]> {
  const raw = await fetchLeagueLookup(leagueId, signal);
  return mapLeagueCurrentSeasonResponse(raw);
}

async function fetchLeagueLookup(leagueId: string, signal?: AbortSignal) {
  const opts = signal !== undefined ? { signal } : undefined;
  return getJsonWithLegacyFallback(
    endpoints.leagueById(leagueId),
    legacyEndpoints.leagueById(leagueId),
    leagueLookupResponseSchema,
    opts,
  );
}

export async function fetchLeagueOptionById(
  leagueId: string,
  signal?: AbortSignal,
): Promise<CompetitionOption | null> {
  const trimmedLeagueId = leagueId.trim();
  if (!trimmedLeagueId) {
    return null;
  }

  const raw = await fetchLeagueLookup(trimmedLeagueId, signal);
  return mapLeagueLookupResponse(raw);
}

export async function fetchLeagueOptions(signal?: AbortSignal): Promise<CompetitionOption[]> {
  const opts = signal !== undefined ? { signal } : undefined;
  const raw = await getJsonWithLegacyFallback(
    endpoints.allLeagues(),
    legacyEndpoints.allLeagues(),
    leagueListResponseSchema,
    opts,
  );
  return mapLeagueListResponse(raw);
}

export async function fetchLeagueSeasons(
  leagueId: string,
  signal?: AbortSignal,
): Promise<CompetitionOption[]> {
  const trimmedLeagueId = leagueId.trim();
  if (!trimmedLeagueId) {
    return [];
  }

  const raw = await getJsonWithLegacyFallback(
    endpoints.leagueSeasons(trimmedLeagueId),
    legacyEndpoints.leagueSeasons(trimmedLeagueId),
    leagueSeasonsResponseSchema,
    signal !== undefined ? { signal } : undefined,
  );
  const seasons = mapLeagueSeasonsResponse(raw);
  if (seasons.length > 0) {
    return seasons;
  }

  return fetchLeagueCurrentSeason(trimmedLeagueId, signal);
}
