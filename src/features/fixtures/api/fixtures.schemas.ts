import { z } from 'zod';

/** Placeholder schema for future SportsDB (or other) fixtures payloads. */
export const fixturesResponseSchema = z.object({
  events: z.array(z.record(z.unknown())).optional(),
});
