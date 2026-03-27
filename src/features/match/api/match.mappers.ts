import type { matchDetailResponseSchema } from '@/features/match/api/match.schemas';
import type { MatchDetail } from '@/features/match/types/match.types';
import type { z } from 'zod';

type RawMatchDetailResponse = z.infer<typeof matchDetailResponseSchema>;

export function mapMatchDetailResponse(
  raw: RawMatchDetailResponse,
  eventId: string,
): MatchDetail | null {
  void raw;
  return {
    id: eventId,
    title: 'Placeholder',
  };
}
