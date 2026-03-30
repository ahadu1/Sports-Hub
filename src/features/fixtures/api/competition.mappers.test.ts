import { describe, expect, it } from 'vitest';

import {
  mapLeagueListResponse,
  mapLeagueLookupResponse,
} from '@/features/fixtures/api/competition.mappers';

describe('mapLeagueListResponse', () => {
  it('uses badge fields and ignores league logos', () => {
    const result = mapLeagueListResponse({
      leagues: [
        {
          idLeague: '4332',
          strLeague: 'Italian Serie A',
          strSport: 'Soccer',
          strBadge: 'serie-a-badge.svg',
          strLogo: 'serie-a-logo.svg',
        },
      ],
    });

    expect(result).toEqual([
      {
        id: '4332',
        label: 'Italian Serie A',
        badgeSrc: 'serie-a-badge.svg',
      },
    ]);
  });

  it('maps lookup responses so selected leagues can supply a header badge', () => {
    const result = mapLeagueLookupResponse({
      leagues: [
        {
          idLeague: '4328',
          strLeague: 'English Premier League',
          strCurrentSeason: '2025-2026',
          strLeagueBadge: 'premier-league-badge.svg',
        },
      ],
    });

    expect(result).toEqual({
      id: '4328',
      label: 'English Premier League',
      badgeSrc: 'premier-league-badge.svg',
    });
  });
});
