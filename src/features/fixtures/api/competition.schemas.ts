import { nullableString } from '@/lib/api/schemas';
import { z } from 'zod';

const leagueSchema = z
  .object({
    idLeague: nullableString,
    strLeague: nullableString,
    strSport: nullableString,
    strBadge: nullableString,
    strLogo: nullableString,
    strLeagueBadge: nullableString,
  })
  .passthrough();

const seasonObjectSchema = z
  .object({
    strSeason: nullableString,
  })
  .passthrough();

const leagueLookupSchema = z
  .object({
    idLeague: nullableString,
    strLeague: nullableString,
    strCurrentSeason: nullableString,
    strBadge: nullableString,
    strLogo: nullableString,
    strLeagueBadge: nullableString,
  })
  .passthrough();

export const leagueListResponseSchema = z.object({
  all: z.array(leagueSchema).nullable().optional(),
  leagues: z.array(leagueSchema).nullable().optional(),
});

export const leagueSeasonsResponseSchema = z.object({
  list: z.array(seasonObjectSchema).nullable().optional(),
  seasons: z
    .array(z.union([z.string(), seasonObjectSchema]))
    .nullable()
    .optional(),
});

export const leagueLookupResponseSchema = z.object({
  lookup: z.array(leagueLookupSchema).nullable().optional(),
  leagues: z.array(leagueLookupSchema).nullable().optional(),
});
