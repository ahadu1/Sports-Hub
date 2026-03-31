import { mapMatchDetailResponse } from '@/features/match/api/match.mappers';
import {
  matchDetailResponseSchema,
  teamLookupResponseSchema,
} from '@/features/match/api/match.schemas';
import type { MatchDetail } from '@/features/match/types/match.types';
import { normalizeString } from '@/lib/normalize';
import { isValidMatchEventId } from '@/utils/match/matchEventId.utils';
import { endpoints } from '@/lib/api/endpoints';
import { getJson } from '@/lib/api/http-client';

async function fetchTeamLookup(teamName: string, signal?: AbortSignal) {
  const trimmedTeamName = teamName.trim();
  if (!trimmedTeamName) {
    return null;
  }

  const opts = signal !== undefined ? { signal } : undefined;
  return getJson(endpoints.teamsByName(trimmedTeamName), teamLookupResponseSchema, opts);
}

export async function fetchMatchDetails(
  eventId: string,
  signal?: AbortSignal,
): Promise<MatchDetail | null> {
  const trimmedEventId = eventId.trim();
  if (!isValidMatchEventId(trimmedEventId)) {
    throw new Error('Match details require a valid numeric eventId.');
  }

  const opts = signal !== undefined ? { signal } : undefined;
  const raw = await getJson(endpoints.matchById(trimmedEventId), matchDetailResponseSchema, opts);
  const event = raw.lookup?.[0] ?? raw.events?.[0];

  if (!event) {
    return null;
  }

  const resolvedEventId = normalizeString(event.idEvent);
  if (resolvedEventId && resolvedEventId !== trimmedEventId) {
    return null;
  }

  const [homeTeam, awayTeam] = await Promise.all([
    event.strHomeTeamBadge ? null : fetchTeamLookup(event.strHomeTeam ?? '', signal),
    event.strAwayTeamBadge ? null : fetchTeamLookup(event.strAwayTeam ?? '', signal),
  ]);

  return mapMatchDetailResponse(raw, trimmedEventId, {
    homeTeam,
    awayTeam,
  });
}
