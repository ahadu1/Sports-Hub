import { mapMatchDetailResponse } from '@/features/match/api/match.mappers';
import { matchDetailResponseSchema } from '@/features/match/api/match.schemas';
import type { MatchDetail } from '@/features/match/types/match.types';
import { endpoints } from '@/lib/api/endpoints';
import { getJson } from '@/lib/api/http-client';

export async function fetchMatchDetails(
  eventId: string,
  signal?: AbortSignal,
): Promise<MatchDetail | null> {
  const opts = signal !== undefined ? { signal } : undefined;
  const raw = await getJson(endpoints.matchById(eventId), matchDetailResponseSchema, opts);
  return mapMatchDetailResponse(raw, eventId);
}
