import { z } from 'zod';

const nullableString = z.string().nullable().optional();

const scoreValueSchema = z.union([z.string(), z.number()]).nullable().optional();

const matchDetailEventSchema = z
  .object({
    idEvent: nullableString,
    idLeague: nullableString,
    strLeague: nullableString,
    strLeagueBadge: nullableString,
    strEvent: nullableString,
    dateEvent: nullableString,
    dateEventLocal: nullableString,
    strTimestamp: nullableString,
    strTime: nullableString,
    strTimeLocal: nullableString,
    strSeason: nullableString,
    intRound: scoreValueSchema,
    strHomeTeam: nullableString,
    strAwayTeam: nullableString,
    strHomeTeamBadge: nullableString,
    strAwayTeamBadge: nullableString,
    idHomeTeam: nullableString,
    idAwayTeam: nullableString,
    strVenue: nullableString,
    strCity: nullableString,
    strCountry: nullableString,
    strHomeGoalDetails: nullableString,
    strAwayGoalDetails: nullableString,
    strHomeYellowCards: nullableString,
    strAwayYellowCards: nullableString,
    strHomeRedCards: nullableString,
    strAwayRedCards: nullableString,
    intHomeScore: scoreValueSchema,
    intAwayScore: scoreValueSchema,
    strStatus: nullableString,
  })
  .passthrough();

export const matchDetailResponseSchema = z.object({
  lookup: z.array(matchDetailEventSchema).nullable().optional(),
  events: z.array(matchDetailEventSchema).nullable().optional(),
});

const teamLookupTeamSchema = z
  .object({
    idTeam: nullableString,
    strTeam: nullableString,
    strTeamAlternate: nullableString,
    strBadge: nullableString,
    strLogo: nullableString,
    strTeamBadge: nullableString,
  })
  .passthrough();

export const teamLookupResponseSchema = z.object({
  search: z.array(teamLookupTeamSchema).nullable().optional(),
  teams: z.array(teamLookupTeamSchema).nullable().optional(),
});
