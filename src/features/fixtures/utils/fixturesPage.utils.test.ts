import { describe, expect, it } from 'vitest';

import { groupFixturesByCompetition } from '@/features/fixtures/utils/fixturesPage.utils';
import type { Fixture } from '@/features/fixtures/types/fixtures.types';

function createFixture(overrides: Partial<Fixture>): Fixture {
  return {
    eventId: '1',
    leagueId: '100',
    leagueName: 'Premier League',
    fixtureDate: '2026-03-30',
    state: 'scheduled',
    visibleInFilters: ['all'],
    isFavorite: false,
    home: {
      id: 'home',
      name: 'Home FC',
      badgeSrc: '',
    },
    away: {
      id: 'away',
      name: 'Away FC',
      badgeSrc: '',
    },
    ...overrides,
  };
}

describe('groupFixturesByCompetition', () => {
  it('groups fixtures by league while preserving fixture order', () => {
    const fixtures = [
      createFixture({ eventId: '1', leagueId: '100', leagueName: 'Premier League' }),
      createFixture({ eventId: '2', leagueId: '200', leagueName: 'La Liga' }),
      createFixture({ eventId: '3', leagueId: '100', leagueName: 'Premier League' }),
    ];

    const result = groupFixturesByCompetition(fixtures);

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      id: '100',
      name: 'Premier League',
    });
    expect(result[0]!.fixtures.map((fixture) => fixture.eventId)).toEqual(['1', '3']);
    expect(result[1]).toMatchObject({
      id: '200',
      name: 'La Liga',
    });
    expect(result[1]!.fixtures.map((fixture) => fixture.eventId)).toEqual(['2']);
  });
});
