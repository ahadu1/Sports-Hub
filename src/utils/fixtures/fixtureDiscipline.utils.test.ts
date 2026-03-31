import { describe, expect, it } from 'vitest';

import {
  mapFixtureDisciplineFromTimelineItems,
  mergeCompetitionSectionsWithDiscipline,
} from '@/utils/fixtures/fixtureDiscipline.utils';
import type { CompetitionSection } from '@/features/fixtures/types/fixtures.types';
import type { TimelineItem } from '@/features/match/types/match-events.types';

const kickoff = {
  kickoffInstant: new Date('2026-03-29T20:00:00Z'),
  parseSource: 'timestamp' as const,
  hasDiscrepancy: false,
  discrepancyReason: null,
  localDayKey: '2026-03-29',
  localDateLabel: 'Sun, 29 Mar',
  localTimeLabel: '20:00',
  localDateTimeLabel: 'Sun, 29 Mar, 20:00',
  relativeDayLabel: null,
  secondaryLabel: 'Local to you',
  fallbackLabel: null,
};

const sections: CompetitionSection[] = [
  {
    id: '100',
    name: 'Premier League',
    fixtures: [
      {
        eventId: '42',
        leagueId: '100',
        leagueName: 'Premier League',
        kickoff,
        state: 'finished',
        visibleInFilters: ['all'],
        isFavorite: false,
        kickoffLabel: 'FT',
        home: {
          id: 'home',
          name: 'Home FC',
          badgeSrc: 'home.svg',
        },
        away: {
          id: 'away',
          name: 'Away FC',
          badgeSrc: 'away.svg',
        },
        homeScore: 2,
        awayScore: 1,
      },
    ],
  },
];

const timelineItems: TimelineItem[] = [
  {
    id: 'home-yellow-1',
    kind: 'event',
    minute: "12'",
    minuteVariant: 'default',
    home: {
      side: 'home',
      eventType: 'yellow-card',
      primaryText: 'Home Player 1',
      showSecondaryText: false,
    },
  },
  {
    id: 'home-yellow-2-and-away-red',
    kind: 'event',
    minute: "65'",
    minuteVariant: 'default',
    home: {
      side: 'home',
      eventType: 'yellow-card',
      primaryText: 'Home Player 2',
      showSecondaryText: false,
    },
    away: {
      side: 'away',
      eventType: 'red-card',
      primaryText: 'Away Player 1',
      showSecondaryText: false,
    },
  },
  {
    id: 'away-yellow',
    kind: 'event',
    minute: "77'",
    minuteVariant: 'default',
    away: {
      side: 'away',
      eventType: 'yellow-card',
      primaryText: 'Away Player 2',
      showSecondaryText: false,
    },
  },
];

describe('fixtureDiscipline utils', () => {
  it('maps yellow and red card counts into inline fixture markers', () => {
    expect(mapFixtureDisciplineFromTimelineItems(timelineItems)).toEqual([
      { side: 'home', card: 'yellow' },
      { side: 'home', card: 'yellow' },
      { side: 'away', card: 'yellow' },
      { side: 'away', card: 'red' },
    ]);
  });

  it('merges discipline markers into matching visible fixtures', () => {
    const result = mergeCompetitionSectionsWithDiscipline(
      sections,
      new Map([
        [
          '42',
          [
            { side: 'home', card: 'yellow' as const },
            { side: 'away', card: 'red' as const },
          ],
        ],
      ]),
    );

    expect(result[0]?.fixtures[0]?.discipline).toEqual([
      { side: 'home', card: 'yellow' },
      { side: 'away', card: 'red' },
    ]);
  });
});
