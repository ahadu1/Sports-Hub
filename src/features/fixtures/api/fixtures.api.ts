import { mapFixturesResponse } from '@/features/fixtures/api/fixtures.mappers';
import { fixturesResponseSchema } from '@/features/fixtures/api/fixtures.schemas';
import type { Fixture } from '@/features/fixtures/types/fixtures.types';
import { endpoints } from '@/lib/api/endpoints';
import { getJson } from '@/lib/api/http-client';

export async function fetchFixtures(signal?: AbortSignal): Promise<Fixture[]> {
  const opts = signal !== undefined ? { signal } : undefined;
  const raw = await getJson(endpoints.fixtures(), fixturesResponseSchema, opts);
  return mapFixturesResponse(raw);
}
