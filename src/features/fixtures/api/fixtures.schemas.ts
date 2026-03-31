import { nullableString, scoreValueSchema } from '@/lib/api/schemas';
import { z } from 'zod';

export const fixtureEventSchema = z
  .object({
    idEvent: nullableString,
    idLeague: nullableString,
    strLeague: nullableString,
    dateEvent: nullableString,
    dateEventLocal: nullableString,
    strTimestamp: nullableString,
    strTime: nullableString,
    strTimeLocal: nullableString,
    strHomeTeam: nullableString,
    strAwayTeam: nullableString,
    idHomeTeam: nullableString,
    idAwayTeam: nullableString,
    strHomeTeamBadge: nullableString,
    strAwayTeamBadge: nullableString,
    intHomeScore: scoreValueSchema,
    intAwayScore: scoreValueSchema,
    strStatus: nullableString,
  })
  .passthrough();

export const fixturesResponseSchema = z.object({
  schedule: z.array(fixtureEventSchema).nullable().optional(),
  events: z.array(fixtureEventSchema).nullable().optional(),
});
