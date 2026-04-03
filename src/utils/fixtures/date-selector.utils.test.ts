import { describe, expect, it } from 'vitest';

import type { CompetitionSection, Fixture } from '@/features/fixtures/types/fixtures.types';
import { getClosestFixtureDate } from '@/utils/fixtures/date-selector.utils';

function createFixture(dayKey: string, eventId: string): Fixture {
  return {
    eventId,
    leagueId: '100',
    leagueName: 'Premier League',
    kickoff: {
      kickoffInstant: new Date(`${dayKey}T20:00:00Z`),
      parseSource: 'timestamp',
      hasDiscrepancy: false,
      discrepancyReason: null,
      localDayKey: dayKey,
      localDateLabel: 'Fixture date',
      localTimeLabel: '20:00',
      localDateTimeLabel: 'Fixture date, 20:00',
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
  };
}

function createSections(fixtures: Fixture[]): CompetitionSection[] {
  return [
    {
      id: '100',
      name: 'Premier League',
      fixtures,
    },
  ];
}

describe('getClosestFixtureDate', () => {
  it('returns the nearest fixture date to the reference day', () => {
    const sections = createSections([
      createFixture('2026-04-01', '1'),
      createFixture('2026-04-05', '2'),
      createFixture('2026-04-09', '3'),
    ]);

    const result = getClosestFixtureDate(sections, new Date('2026-04-03T10:00:00'));

    expect(result).not.toBeNull();
    expect(result?.getFullYear()).toBe(2026);
    expect(result?.getMonth()).toBe(3);
    expect(result?.getDate()).toBe(5);
  });

  it('prefers the future fixture when past and future dates are equally close', () => {
    const sections = createSections([
      createFixture('2026-04-02', '1'),
      createFixture('2026-04-04', '2'),
    ]);

    const result = getClosestFixtureDate(sections, new Date('2026-04-03T10:00:00'));

    expect(result).not.toBeNull();
    expect(result?.getFullYear()).toBe(2026);
    expect(result?.getMonth()).toBe(3);
    expect(result?.getDate()).toBe(4);
  });

  it('returns null when no valid fixture dates are available', () => {
    const sections = createSections([
      {
        ...createFixture('2026-04-04', '1'),
        kickoff: {
          ...createFixture('2026-04-04', '1').kickoff,
          localDayKey: null,
        },
      },
    ]);

    expect(getClosestFixtureDate(sections)).toBeNull();
  });
});
