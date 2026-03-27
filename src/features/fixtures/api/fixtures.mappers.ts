import type { fixturesResponseSchema } from '@/features/fixtures/api/fixtures.schemas';
import type { Fixture } from '@/features/fixtures/types/fixtures.types';
import type { z } from 'zod';

type RawFixturesResponse = z.infer<typeof fixturesResponseSchema>;

export function mapFixturesResponse(raw: RawFixturesResponse): Fixture[] {
  void raw;
  return [];
}
