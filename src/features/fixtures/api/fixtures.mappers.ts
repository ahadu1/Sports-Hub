import type { fixturesResponseSchema } from '@/features/fixtures/api/fixtures.schemas';
import type { Fixture } from '@/features/fixtures/types/fixtures.types';
import {
  buildNormalizedKickoff,
  getKickoffPrimaryLabel,
  logKickoffDiscrepancy,
} from '@/lib/datetime/kickoff';
import { normalizeString, parseNumber } from '@/lib/normalize';
import { getMatchState } from '@/utils/match/matchStatus.utils';
import type { z } from 'zod';

type RawFixturesResponse = z.infer<typeof fixturesResponseSchema>;
type RawFixtureCollection = NonNullable<
  RawFixturesResponse['schedule'] | RawFixturesResponse['events']
>;
type RawFixtureEvent = NonNullable<RawFixtureCollection[number]>;

function getStatusAbbreviation(state: Fixture['state']): string | undefined {
  switch (state) {
    case 'Match Postponed':
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

function getPenaltyContextTags(
  rawStatus: string,
  homeScore: number | undefined,
  awayScore: number | undefined,
): Fixture['contextTags'] | undefined {
  if (rawStatus !== 'PEN' || homeScore === undefined || awayScore === undefined) {
    return undefined;
  }

  if (homeScore === awayScore) {
    return undefined;
  }

  return [
    {
      side: homeScore > awayScore ? 'home' : 'away',
      label: 'PEN',
    },
  ];
}

function mapFixture(event: RawFixtureEvent): Fixture | null {
  const eventId = normalizeString(event.idEvent);
  const leagueId = normalizeString(event.idLeague);
  const leagueName = normalizeString(event.strLeague);
  const homeTeamName = normalizeString(event.strHomeTeam);
  const awayTeamName = normalizeString(event.strAwayTeam);
  const kickoff = buildNormalizedKickoff({
    idEvent: event.idEvent,
    dateEvent: event.dateEvent,
    dateEventLocal: event.dateEventLocal,
    strTime: event.strTime,
    strTimeLocal: event.strTimeLocal,
    strTimestamp: event.strTimestamp,
  });
  logKickoffDiscrepancy(eventId, kickoff);

  if (!eventId || !leagueId || !leagueName || !homeTeamName || !awayTeamName) {
    return null;
  }

  const homeScore = parseNumber(event.intHomeScore) ?? undefined;
  const awayScore = parseNumber(event.intAwayScore) ?? undefined;
  const rawStatus = normalizeString(event.strStatus);
  const state = getMatchState({
    status: rawStatus,
    homeScore: homeScore ?? null,
    awayScore: awayScore ?? null,
  });
  const isFavorite = false;

  const kickoffLabel =
    state === 'scheduled' ? getKickoffPrimaryLabel(kickoff) : getStatusAbbreviation(state);

  const liveLabel =
    state === 'live' || state === 'halftime'
      ? state === 'halftime'
        ? 'HT'
        : rawStatus || 'LIVE'
      : undefined;
  const contextTags = getPenaltyContextTags(rawStatus, homeScore, awayScore);

  return {
    eventId,
    leagueId,
    leagueName,
    kickoff,
    state,
    visibleInFilters: mapVisibleInFilters(state, isFavorite),
    isFavorite,
    kickoffLabel: kickoffLabel ?? getKickoffPrimaryLabel(kickoff),
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
    ...(contextTags ? { contextTags } : {}),
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
    const leftInstant = left.kickoff.kickoffInstant?.getTime();
    const rightInstant = right.kickoff.kickoffInstant?.getTime();

    if (leftInstant !== undefined && rightInstant !== undefined) {
      return leftInstant - rightInstant;
    }

    if (leftInstant !== undefined) {
      return -1;
    }

    if (rightInstant !== undefined) {
      return 1;
    }

    const leftDayKey = left.kickoff.localDayKey ?? '';
    const rightDayKey = right.kickoff.localDayKey ?? '';
    if (leftDayKey !== rightDayKey) {
      return leftDayKey.localeCompare(rightDayKey);
    }

    return left.eventId.localeCompare(right.eventId);
  });
}
