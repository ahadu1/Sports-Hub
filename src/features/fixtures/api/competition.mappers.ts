import type {
  leagueLookupResponseSchema,
  leagueListResponseSchema,
  leagueSeasonsResponseSchema,
} from '@/features/fixtures/api/competition.schemas';
import type { z } from 'zod';

type RawLeagueLookupResponse = z.infer<typeof leagueLookupResponseSchema>;
type RawLeagueListResponse = z.infer<typeof leagueListResponseSchema>;
type RawLeagueSeasonsResponse = z.infer<typeof leagueSeasonsResponseSchema>;

export type CompetitionOption = {
  id: string;
  label: string;
};

function normalizeString(value: string | null | undefined): string {
  return value?.trim() ?? '';
}

function isUsableLeagueLabel(label: string): boolean {
  return !normalizeString(label).startsWith('_');
}

function getSeasonSortValue(value: string): number {
  const match = value.match(/(\d{4})/);
  return match ? Number(match[1]) : Number.MIN_SAFE_INTEGER;
}

export function mapLeagueListResponse(raw: RawLeagueListResponse): CompetitionOption[] {
  return (raw.all ?? raw.leagues ?? [])
    .map((league) => ({
      id: normalizeString(league.idLeague),
      label: normalizeString(league.strLeague),
      sport: normalizeString(league.strSport),
    }))
    .filter(
      (league) =>
        league.id &&
        league.label &&
        isUsableLeagueLabel(league.label) &&
        league.sport.toLowerCase() === 'soccer',
    )
    .map(({ id, label }) => ({ id, label }));
}

export function mapLeagueSeasonsResponse(raw: RawLeagueSeasonsResponse): CompetitionOption[] {
  const rawSeasons = [
    ...(raw.list ?? []),
    ...(raw.seasons ?? []).map((season) =>
      typeof season === 'string' ? { strSeason: season } : season,
    ),
  ];

  return Array.from(
    new Map(
      rawSeasons
        .map((season) => normalizeString(season.strSeason))
        .filter(Boolean)
        .sort((left, right) => {
          const delta = getSeasonSortValue(right) - getSeasonSortValue(left);
          return delta !== 0 ? delta : right.localeCompare(left);
        })
        .map((season) => [season, { id: season, label: season }] as const),
    ).values(),
  );
}

export function mapLeagueCurrentSeasonResponse(raw: RawLeagueLookupResponse): CompetitionOption[] {
  const league = raw.lookup?.[0] ?? raw.leagues?.[0];
  const currentSeason = normalizeString(league?.strCurrentSeason);

  if (!currentSeason) {
    return [];
  }

  return [{ id: currentSeason, label: currentSeason }];
}
