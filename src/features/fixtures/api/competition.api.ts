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
import { shouldFallbackToLegacyApi } from '@/lib/api/errors';
import { endpoints, legacyEndpoints } from '@/lib/api/endpoints';
import { getJson } from '@/lib/api/http-client';

async function fetchLeagueCurrentSeason(
  leagueId: string,
  signal?: AbortSignal,
): Promise<CompetitionOption[]> {
  const raw = await fetchLeagueLookup(leagueId, signal);
  return mapLeagueCurrentSeasonResponse(raw);
}

async function fetchLeagueLookup(leagueId: string, signal?: AbortSignal) {
  const opts = signal !== undefined ? { signal } : undefined;

  try {
    return await getJson(endpoints.leagueById(leagueId), leagueLookupResponseSchema, opts);
  } catch (error) {
    if (!shouldFallbackToLegacyApi(error)) {
      throw error;
    }

    return await getJson(legacyEndpoints.leagueById(leagueId), leagueLookupResponseSchema, {
      ...opts,
      apiVersion: 'v1',
    });
  }
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

  try {
    const raw = await getJson(endpoints.allLeagues(), leagueListResponseSchema, opts);
    return mapLeagueListResponse(raw);
  } catch (error) {
    if (!shouldFallbackToLegacyApi(error)) {
      throw error;
    }

    const raw = await getJson(legacyEndpoints.allLeagues(), leagueListResponseSchema, {
      ...opts,
      apiVersion: 'v1',
    });
    return mapLeagueListResponse(raw);
  }
}

export async function fetchLeagueSeasons(
  leagueId: string,
  signal?: AbortSignal,
): Promise<CompetitionOption[]> {
  const trimmedLeagueId = leagueId.trim();
  if (!trimmedLeagueId) {
    return [];
  }

  const opts = signal !== undefined ? { signal } : undefined;

  try {
    const raw = await getJson(
      endpoints.leagueSeasons(trimmedLeagueId),
      leagueSeasonsResponseSchema,
      opts,
    );
    const seasons = mapLeagueSeasonsResponse(raw);
    if (seasons.length > 0) {
      return seasons;
    }

    return fetchLeagueCurrentSeason(trimmedLeagueId, signal);
  } catch (error) {
    if (!shouldFallbackToLegacyApi(error)) {
      throw error;
    }

    const raw = await getJson(
      legacyEndpoints.leagueSeasons(trimmedLeagueId),
      leagueSeasonsResponseSchema,
      {
        ...opts,
        apiVersion: 'v1',
      },
    );
    const seasons = mapLeagueSeasonsResponse(raw);
    if (seasons.length > 0) {
      return seasons;
    }

    return fetchLeagueCurrentSeason(trimmedLeagueId, signal);
  }
}
