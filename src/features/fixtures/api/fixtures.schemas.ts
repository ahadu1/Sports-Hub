import { z } from 'zod';

const nullableString = z.string().nullable().optional();

const scoreValueSchema = z.union([z.string(), z.number()]).nullable().optional();

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
