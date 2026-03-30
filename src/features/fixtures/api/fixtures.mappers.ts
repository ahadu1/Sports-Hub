import type { fixturesResponseSchema } from '@/features/fixtures/api/fixtures.schemas';
import type { Fixture } from '@/features/fixtures/types/fixtures.types';
import { getMatchState } from '@/features/match/utils/matchStatus.utils';
import type { z } from 'zod';

type RawFixturesResponse = z.infer<typeof fixturesResponseSchema>;
type RawFixtureCollection = NonNullable<
  RawFixturesResponse['schedule'] | RawFixturesResponse['events']
>;
type RawFixtureEvent = NonNullable<RawFixtureCollection[number]>;

function normalizeString(value: string | null | undefined): string {
  return value?.trim() ?? '';
}

function parseScore(value: string | number | null | undefined): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function formatKickoffLabel(
  rawTimeLocal: string | null | undefined,
  rawTime: string | null | undefined,
): string {
  const timeValue = rawTimeLocal?.trim() || rawTime?.trim() || '';
  const match = timeValue.match(/^(\d{2}:\d{2})/);
  return match?.[1] ?? '';
}

function getStatusAbbreviation(state: Fixture['state']): string | undefined {
  switch (state) {
    case 'postponed':
      return 'PST';
    case 'canceled':
      return 'CANC';
    case 'suspended':
      return 'SUSP';
    case 'abandoned':
      return 'ABD';
    case 'awarded':
      return 'AWD';
    default:
      return undefined;
  }
}

function mapVisibleInFilters(
  state: Fixture['state'],
  isFavorite: boolean,
): Fixture['visibleInFilters'] {
  const filters: Fixture['visibleInFilters'] = ['all'];

  if (state === 'live' || state === 'halftime') {
    filters.push('live');
  }

  if (isFavorite) {
    filters.push('favorites');
  }

  return filters;
}

function mapFixture(event: RawFixtureEvent): Fixture | null {
  const eventId = normalizeString(event.idEvent);
  const leagueId = normalizeString(event.idLeague);
  const leagueName = normalizeString(event.strLeague);
  const fixtureDate = normalizeString(event.dateEventLocal) || normalizeString(event.dateEvent);
  const homeTeamName = normalizeString(event.strHomeTeam);
  const awayTeamName = normalizeString(event.strAwayTeam);

  if (!eventId || !leagueId || !leagueName || !fixtureDate || !homeTeamName || !awayTeamName) {
    return null;
  }

  const homeScore = parseScore(event.intHomeScore);
  const awayScore = parseScore(event.intAwayScore);
  const rawStatus = normalizeString(event.strStatus);
  const state = getMatchState({
    status: rawStatus,
    homeScore: homeScore ?? null,
    awayScore: awayScore ?? null,
  });
  const isFavorite = false;

  const kickoffLabel =
    state === 'scheduled'
      ? formatKickoffLabel(event.strTimeLocal, event.strTime)
      : getStatusAbbreviation(state);

  const liveLabel =
    state === 'live' || state === 'halftime'
      ? state === 'halftime'
        ? 'HT'
        : rawStatus || 'LIVE'
      : undefined;

  return {
    eventId,
    leagueId,
    leagueName,
    fixtureDate,
    state,
    visibleInFilters: mapVisibleInFilters(state, isFavorite),
    isFavorite,
    ...(kickoffLabel ? { kickoffLabel } : {}),
    ...(liveLabel ? { liveLabel } : {}),
    home: {
      id: normalizeString(event.idHomeTeam) || homeTeamName,
      name: homeTeamName,
      badgeSrc: normalizeString(event.strHomeTeamBadge),
    },
    away: {
      id: normalizeString(event.idAwayTeam) || awayTeamName,
      name: awayTeamName,
      badgeSrc: normalizeString(event.strAwayTeamBadge),
    },
    ...(homeScore !== undefined ? { homeScore } : {}),
    ...(awayScore !== undefined ? { awayScore } : {}),
  };
}

export function mapFixturesResponse(rawResponses: RawFixturesResponse[]): Fixture[] {
  const fixtures = rawResponses.flatMap((raw) =>
    (raw.schedule ?? raw.events ?? [])
      .map((event) => mapFixture(event))
      .filter((event): event is Fixture => event !== null),
  );

  const dedupedFixtures = Array.from(
    new Map(fixtures.map((fixture) => [fixture.eventId, fixture])).values(),
  );

  return dedupedFixtures.sort((left, right) => {
    const leftDateTime = `${left.fixtureDate}T${left.kickoffLabel ?? '00:00'}`;
    const rightDateTime = `${right.fixtureDate}T${right.kickoffLabel ?? '00:00'}`;
    return leftDateTime.localeCompare(rightDateTime);
  });
}
