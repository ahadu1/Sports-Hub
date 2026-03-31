import type { MatchTimelineApiPayload } from '@/features/match/types/match-events.types';
import { isValidMatchEventId } from '@/utils/match/matchEventId.utils';
import { nullableString, scoreValueSchema } from '@/lib/api/schemas';
import { ApiError } from '@/lib/api/errors';
import { endpoints, legacyEndpoints } from '@/lib/api/endpoints';
import { getJsonWithLegacyFallback } from '@/lib/api/http-client';
import { z } from 'zod';

const matchTimelineEntrySchema = z
  .object({
    idTimeline: nullableString,
    idEvent: nullableString,
    idTeam: nullableString,
    strTimeline: nullableString,
    strTimelineDetail: nullableString,
    strEvent: nullableString,
    strPlayer: nullableString,
    strPlayerIn: nullableString,
    strPlayerOut: nullableString,
    strAssist: nullableString,
    strTeam: nullableString,
    intTime: scoreValueSchema,
    intTimeExtra: scoreValueSchema,
    strTime: nullableString,
  })
  .passthrough();

export const matchTimelineResponseSchema = z.object({
  lookup: z.union([z.array(matchTimelineEntrySchema), z.string(), z.null()]).optional(),
  timeline: z.union([z.array(matchTimelineEntrySchema), z.string(), z.null()]).optional(),
  message: nullableString,
  Message: nullableString,
});

function isNoDataMessage(value: string | null | undefined): boolean {
  return value?.trim().toLowerCase() === 'no data found';
}

export function normalizeTimelinePayload(
  raw: MatchTimelineApiPayload,
  url: string,
): MatchTimelineApiPayload {
  const timelineData = raw.lookup ?? raw.timeline;
  const responseMessage = raw.message ?? raw.Message;

  if (
    isNoDataMessage(responseMessage) ||
    (typeof timelineData === 'string' && isNoDataMessage(timelineData))
  ) {
    return {
      lookup: [],
      timeline: null,
      message: responseMessage ?? (typeof timelineData === 'string' ? timelineData : null),
    };
  }

  if (typeof timelineData === 'string' && timelineData.trim().length > 0) {
    throw new ApiError('Timeline data is unavailable for the current TheSportsDB plan.', 403, url, {
      details: timelineData,
    });
  }

  if (Array.isArray(raw.lookup)) {
    return {
      ...raw,
      message: responseMessage,
    };
  }

  if (Array.isArray(raw.timeline)) {
    return {
      lookup: raw.timeline,
      message: responseMessage,
    };
  }

  return {
    lookup: [],
    timeline: raw.timeline,
    message: responseMessage,
  };
}

export async function fetchMatchTimeline(
  eventId: string,
  signal?: AbortSignal,
): Promise<MatchTimelineApiPayload> {
  const trimmedEventId = eventId.trim();
  if (!isValidMatchEventId(trimmedEventId)) {
    throw new Error('Match timeline requires a valid numeric eventId.');
  }

  const v2Path = endpoints.matchTimelineById(trimmedEventId);
  const v1Path = legacyEndpoints.matchTimelineById(trimmedEventId);
  const raw = await getJsonWithLegacyFallback(
    v2Path,
    v1Path,
    matchTimelineResponseSchema,
    signal !== undefined ? { signal } : undefined,
  );

  return normalizeTimelinePayload(raw, v2Path);
}
