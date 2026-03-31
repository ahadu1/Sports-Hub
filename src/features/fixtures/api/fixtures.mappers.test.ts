import { describe, expect, it } from 'vitest';

import { mapFixturesResponse } from '@/features/fixtures/api/fixtures.mappers';

describe('mapFixturesResponse', () => {
  it('adds a PEN context tag to the winning side', () => {
    const result = mapFixturesResponse([
      {
        events: [
          {
            idEvent: '42',
            idLeague: '4480',
            strLeague: 'UEFA Champions League',
            dateEvent: '2026-03-31',
            dateEventLocal: '2026-03-31',
            strTimestamp: '2026-03-31T19:00:00Z',
            strTime: '19:00:00',
            strTimeLocal: '19:00:00',
            strHomeTeam: 'Home FC',
            strAwayTeam: 'Away FC',
            idHomeTeam: 'home',
            idAwayTeam: 'away',
            strHomeTeamBadge: 'home.svg',
            strAwayTeamBadge: 'away.svg',
            intHomeScore: '4',
            intAwayScore: '5',
            strStatus: 'PEN',
          },
        ],
      },
    ]);

    expect(result[0]?.contextTags).toEqual([{ side: 'away', label: 'PEN' }]);
  });

  it('does not add a PEN tag when the winner cannot be inferred', () => {
    const result = mapFixturesResponse([
      {
        events: [
          {
            idEvent: '43',
            idLeague: '4480',
            strLeague: 'UEFA Champions League',
            dateEvent: '2026-03-31',
            dateEventLocal: '2026-03-31',
            strTimestamp: '2026-03-31T19:00:00Z',
            strTime: '19:00:00',
            strTimeLocal: '19:00:00',
            strHomeTeam: 'Home FC',
            strAwayTeam: 'Away FC',
            idHomeTeam: 'home',
            idAwayTeam: 'away',
            strHomeTeamBadge: 'home.svg',
            strAwayTeamBadge: 'away.svg',
            intHomeScore: '1',
            intAwayScore: '1',
            strStatus: 'PEN',
          },
        ],
      },
    ]);

    expect(result[0]?.contextTags).toBeUndefined();
  });
});
