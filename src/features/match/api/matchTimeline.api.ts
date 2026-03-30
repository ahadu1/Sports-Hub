import type { MatchTimelineApiPayload } from '@/features/match/types/match-events.types';
import { isValidMatchEventId } from '@/features/match/utils/matchEventId.utils';
import { ApiError, shouldFallbackToLegacyApi } from '@/lib/api/errors';
import { endpoints, legacyEndpoints } from '@/lib/api/endpoints';
import { getJson } from '@/lib/api/http-client';
import { z } from 'zod';

const nullableString = z.string().nullable().optional();

const timelineValueSchema = z.union([z.string(), z.number()]).nullable().optional();

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
    intTime: timelineValueSchema,
    intTimeExtra: timelineValueSchema,
    strTime: nullableString,
  })
  .passthrough();

const matchTimelineResponseSchema = z.object({
  lookup: z.union([z.array(matchTimelineEntrySchema), z.string(), z.null()]).optional(),
  timeline: z.union([z.array(matchTimelineEntrySchema), z.string(), z.null()]).optional(),
});

function normalizeTimelinePayload(
  raw: MatchTimelineApiPayload,
  url: string,
): MatchTimelineApiPayload {
  const timelineData = raw.lookup ?? raw.timeline;

  if (typeof timelineData === 'string' && timelineData.trim().length > 0) {
    throw new ApiError('Timeline data is unavailable for the current TheSportsDB plan.', 403, url, {
      details: timelineData,
    });
  }

  if (Array.isArray(raw.lookup)) {
    return raw;
  }

  if (Array.isArray(raw.timeline)) {
    return { lookup: raw.timeline };
  }

  return { lookup: [], timeline: raw.timeline };
}

export async function fetchMatchTimeline(
  eventId: string,
  signal?: AbortSignal,
): Promise<MatchTimelineApiPayload> {
  const trimmedEventId = eventId.trim();
  if (!isValidMatchEventId(trimmedEventId)) {
    throw new Error('Match timeline requires a valid numeric eventId.');
  }

  const opts = signal !== undefined ? { signal } : undefined;

  try {
    const raw = await getJson(
      endpoints.matchTimelineById(trimmedEventId),
      matchTimelineResponseSchema,
      opts,
    );
    return normalizeTimelinePayload(raw, endpoints.matchTimelineById(trimmedEventId));
  } catch (error) {
    if (!shouldFallbackToLegacyApi(error)) {
      throw error;
    }

    try {
      const raw = await getJson(
        legacyEndpoints.matchTimelineById(trimmedEventId),
        matchTimelineResponseSchema,
        {
          ...opts,
          apiVersion: 'v1',
        },
      );
      return normalizeTimelinePayload(raw, legacyEndpoints.matchTimelineById(trimmedEventId));
    } catch (legacyError) {
      if (legacyError instanceof ApiError && legacyError.status === 403) {
        return { lookup: [] };
      }

      throw legacyError;
    }
  }
}
