import { z } from 'zod';

/** Placeholder schema for future match detail API payloads. */
export const matchDetailResponseSchema = z.object({
  events: z.array(z.record(z.unknown())).optional(),
});
