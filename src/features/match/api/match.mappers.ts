import type {
  matchDetailResponseSchema,
  teamLookupResponseSchema,
} from '@/features/match/api/match.schemas';
import type { MatchDetail } from '@/features/match/types/match.types';
import { buildNormalizedKickoff, logKickoffDiscrepancy } from '@/lib/datetime/kickoff';
import { normalizeString, parseNumber } from '@/lib/normalize';
import { getMatchState } from '@/utils/match/matchStatus.utils';
import type { z } from 'zod';

type RawMatchDetailResponse = z.infer<typeof matchDetailResponseSchema>;
type RawMatchLookupCollection = NonNullable<
  RawMatchDetailResponse['lookup'] | RawMatchDetailResponse['events']
>;
type RawMatchDetailEvent = NonNullable<RawMatchLookupCollection[number]>;
type RawTeamLookupResponse = z.infer<typeof teamLookupResponseSchema>;
type RawTeamLookupCollection = NonNullable<
  RawTeamLookupResponse['search'] | RawTeamLookupResponse['teams']
>;
type RawTeamLookupTeam = NonNullable<RawTeamLookupCollection[number]>;

type MatchTeamLookups = {
  homeTeam?: RawTeamLookupResponse | null | undefined;
  awayTeam?: RawTeamLookupResponse | null | undefined;
};

function getOptionalScoreField(
  event: RawMatchDetailEvent,
  fieldNames: readonly string[],
): number | null | undefined {
  const eventRecord = event as RawMatchDetailEvent & Record<string, unknown>;

  for (const fieldName of fieldNames) {
    const parsedValue = parseNumber(eventRecord[fieldName] as string | number | null | undefined);

    if (parsedValue !== null) {
      return parsedValue;
    }
  }

  return undefined;
}

function splitSummaryEntries(value: string | null | undefined): string[] {
  const normalized = value?.replace(/\r/g, '\n').trim();
  if (!normalized) {
    return [];
  }

  return normalized
    .split(/\n|;/)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

function getBestMatchingTeam(
  lookup: RawTeamLookupResponse | null | undefined,
  teamName: string,
): RawTeamLookupTeam | null {
  const teams = lookup?.search ?? lookup?.teams ?? [];
  if (teams.length === 0) {
    return null;
  }

  const normalizedTeamName = teamName.trim().toLowerCase();
  if (!normalizedTeamName) {
    return teams[0] ?? null;
  }

  const exactMatch = teams.find(
    (team) => normalizeString(team.strTeam).toLowerCase() === normalizedTeamName,
  );
  if (exactMatch) {
    return exactMatch;
  }

  const alternateMatch = teams.find((team) =>
    normalizeString(team.strTeamAlternate)
      .toLowerCase()
      .split(',')
      .map((name) => name.trim())
      .includes(normalizedTeamName),
  );

  return alternateMatch ?? teams[0] ?? null;
}

function resolveTeamBadge(
  badgeFromEvent: string | null | undefined,
  lookup: RawTeamLookupResponse | null | undefined,
  teamName: string,
): string {
  const normalizedEventBadge = normalizeString(badgeFromEvent);
  if (normalizedEventBadge) {
    return normalizedEventBadge;
  }

  const team = getBestMatchingTeam(lookup, teamName);
  return (
    normalizeString(team?.strBadge) ||
    normalizeString(team?.strTeamBadge) ||
    normalizeString(team?.strLogo)
  );
}

function mapMatchDetail(
  event: RawMatchDetailEvent,
  fallbackEventId: string,
  lookups: MatchTeamLookups,
): MatchDetail {
  const homeScore = parseNumber(event.intHomeScore);
  const awayScore = parseNumber(event.intAwayScore);
  const halftimeHomeScore = getOptionalScoreField(event, [
    'intHomeScoreHalf',
    'intHomeScoreHalfTime',
    'intHomeHalftimeScore',
  ]);
  const halftimeAwayScore = getOptionalScoreField(event, [
    'intAwayScoreHalf',
    'intAwayScoreHalfTime',
    'intAwayHalftimeScore',
  ]);
  const status = event.strStatus?.trim() ?? null;
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
  logKickoffDiscrepancy(event.idEvent, kickoff);

  return {
    id: normalizeString(event.idEvent) || fallbackEventId,
    leagueId: normalizeString(event.idLeague),
    leagueName: normalizeString(event.strLeague),
    leagueBadge: normalizeString(event.strLeagueBadge),
    eventLabel: normalizeString(event.strEvent),
    kickoff,
    season: normalizeString(event.strSeason),
    round: parseNumber(event.intRound),
    venueName: normalizeString(event.strVenue),
    venueCity: normalizeString(event.strCity),
    venueCountry: normalizeString(event.strCountry),
    homeTeamId: normalizeString(event.idHomeTeam),
    awayTeamId: normalizeString(event.idAwayTeam),
    homeTeamName,
    awayTeamName,
    homeTeamBadge: resolveTeamBadge(event.strHomeTeamBadge, lookups.homeTeam, homeTeamName),
    awayTeamBadge: resolveTeamBadge(event.strAwayTeamBadge, lookups.awayTeam, awayTeamName),
    homeScore,
    awayScore,
    ...(halftimeHomeScore !== undefined ? { halftimeHomeScore } : {}),
    ...(halftimeAwayScore !== undefined ? { halftimeAwayScore } : {}),
    status,
    state: getMatchState({ status, homeScore, awayScore }),
    summary: {
      homeGoalDetails: splitSummaryEntries(event.strHomeGoalDetails),
      awayGoalDetails: splitSummaryEntries(event.strAwayGoalDetails),
      homeYellowCardDetails: splitSummaryEntries(event.strHomeYellowCards),
      awayYellowCardDetails: splitSummaryEntries(event.strAwayYellowCards),
      homeRedCardDetails: splitSummaryEntries(event.strHomeRedCards),
      awayRedCardDetails: splitSummaryEntries(event.strAwayRedCards),
    },
  };
}

export function mapMatchDetailResponse(
  raw: RawMatchDetailResponse,
  eventId: string,
  lookups: MatchTeamLookups = {},
): MatchDetail | null {
  const event = raw.lookup?.[0] ?? raw.events?.[0];
  if (!event) {
    return null;
  }

  return mapMatchDetail(event, eventId, lookups);
}
