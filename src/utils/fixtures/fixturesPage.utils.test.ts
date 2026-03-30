import { describe, expect, it } from 'vitest';

import { groupFixturesByCompetition } from '@/utils/fixtures/fixturesPage.utils';
import type { Fixture } from '@/features/fixtures/types/fixtures.types';

function createFixture(overrides: Partial<Fixture>): Fixture {
  return {
    eventId: '1',
    leagueId: '100',
    leagueName: 'Premier League',
    kickoff: {
      kickoffInstant: new Date('2026-03-30T20:00:00Z'),
      parseSource: 'timestamp',
      hasDiscrepancy: false,
      discrepancyReason: null,
      localDayKey: '2026-03-30',
      localDateLabel: 'Mon, 30 Mar',
      localTimeLabel: '20:00',
      localDateTimeLabel: 'Mon, 30 Mar, 20:00',
      relativeDayLabel: null,
      secondaryLabel: 'Local to you',
      fallbackLabel: null,
    },
    state: 'scheduled',
    visibleInFilters: ['all'],
    isFavorite: false,
    kickoffLabel: '20:00',
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
