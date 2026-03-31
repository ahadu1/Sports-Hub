import { describe, expect, it } from 'vitest';

import {
  mapMatchDetailsHeaderEvent,
  mapMatchDetailsHeaderUiMeta,
} from '@/utils/match/matchDetailsPage.utils';
import type { Fixture } from '@/features/fixtures/types/fixtures.types';
import type { TimelineItem } from '@/features/match/types/match-events.types';
import type { MatchDetail } from '@/features/match/types/match.types';

const matchDetail: MatchDetail = {
  id: '42',
  leagueId: '100',
  leagueName: 'Premier League',
  leagueBadge: '',
  eventLabel: 'Home FC vs Away FC',
  kickoff: {
    kickoffInstant: new Date('2026-03-29T20:00:00Z'),
    parseSource: 'timestamp',
    hasDiscrepancy: false,
    discrepancyReason: null,
    localDayKey: '2026-03-29',
    localDateLabel: 'Sun, 29 Mar',
    localTimeLabel: '20:00',
    localDateTimeLabel: 'Sun, 29 Mar, 20:00',
    relativeDayLabel: null,
    secondaryLabel: 'Local to you',
    fallbackLabel: null,
  },
  season: '2025-2026',
  round: 32,
  venueName: 'Main Stadium',
  venueCity: 'London',
  venueCountry: 'England',
  homeTeamId: 'home',
  awayTeamId: 'away',
  homeTeamName: 'Home FC',
  awayTeamName: 'Away FC',
  homeTeamBadge: 'home.svg',
  awayTeamBadge: 'away.svg',
  homeScore: 2,
  awayScore: 1,
  status: 'FT',
  state: 'finished',
  summary: {
    homeGoalDetails: [],
    awayGoalDetails: [],
    homeYellowCardDetails: ['A'],
    awayYellowCardDetails: ['B', 'C'],
    homeRedCardDetails: [],
    awayRedCardDetails: ['D'],
  },
};

const selectedFixture: Fixture = {
  eventId: '42',
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
  state: 'live',
  visibleInFilters: ['all', 'live'],
  isFavorite: false,
  kickoffLabel: '20:00',
  home: {
    id: 'home',
    name: 'Home FC',
    badgeSrc: 'fixture-home.svg',
  },
  away: {
    id: 'away',
    name: 'Away FC',
    badgeSrc: 'fixture-away.svg',
  },
  homeScore: 1,
  awayScore: 1,
};

const timelineItems: TimelineItem[] = [
  {
    id: 'home-yellow',
    kind: 'event',
    minute: "15'",
    minuteVariant: 'default',
    home: {
      side: 'home',
      eventType: 'yellow-card',
      primaryText: 'Home Player',
      showSecondaryText: false,
    },
  },
  {
    id: 'away-double',
    kind: 'event',
    minute: "60'",
    minuteVariant: 'default',
    away: {
      side: 'away',
      eventType: 'yellow-card',
      primaryText: 'Away Player',
      showSecondaryText: false,
    },
    home: {
      side: 'home',
      eventType: 'red-card',
      primaryText: 'Home Sent Off',
      showSecondaryText: false,
    },
  },
];

describe('matchDetailsPage.utils', () => {
  it('prefers fetched match details over route fixture state', () => {
    const result = mapMatchDetailsHeaderEvent(matchDetail, selectedFixture, '42');

    expect(result).toMatchObject({
      idEvent: '42',
      kickoff: { localDayKey: '2026-03-29' },
      strHomeTeamBadge: 'home.svg',
      intHomeScore: 2,
      intAwayScore: 1,
      matchState: 'finished',
    });
  });

  it('falls back to route fixture state when details are unavailable', () => {
    const result = mapMatchDetailsHeaderEvent(null, selectedFixture, '42');

    expect(result).toMatchObject({
      idEvent: '42',
      strHomeTeamBadge: 'fixture-home.svg',
      intHomeScore: 1,
      intAwayScore: 1,
      matchState: 'live',
    });
  });

  it('keeps kickoff output consistent between fixtures and header mapping', () => {
    const fromDetail = mapMatchDetailsHeaderEvent(matchDetail, selectedFixture, '42');
    const fromFixture = mapMatchDetailsHeaderEvent(null, selectedFixture, '42');

    expect(fromDetail?.kickoff.localTimeLabel).toBe('20:00');
    expect(fromFixture?.kickoff.localTimeLabel).toBe('20:00');
  });

  it('maps header meta counts from the match summary', () => {
    expect(mapMatchDetailsHeaderUiMeta(matchDetail)).toEqual({
      activeTab: 'events',
      homeYellowCards: 1,
      homeRedCards: 0,
      awayYellowCards: 2,
      awayRedCards: 1,
    });
  });

  it('uses timeline card counts when summary fields are empty', () => {
    const emptySummaryMatch: MatchDetail = {
      ...matchDetail,
      summary: {
        homeGoalDetails: [],
        awayGoalDetails: [],
        homeYellowCardDetails: [],
        awayYellowCardDetails: [],
        homeRedCardDetails: [],
        awayRedCardDetails: [],
      },
    };

    expect(mapMatchDetailsHeaderUiMeta(emptySummaryMatch, timelineItems)).toEqual({
      activeTab: 'events',
      homeYellowCards: 1,
      homeRedCards: 1,
      awayYellowCards: 1,
      awayRedCards: 0,
    });
  });

  it('uses Details as the active tab when the match is postponed', () => {
    const postponedMatch: MatchDetail = {
      ...matchDetail,
      status: 'PST',
      state: 'Match Postponed',
    };
    expect(mapMatchDetailsHeaderUiMeta(postponedMatch).activeTab).toBe('details');
  });

  it('uses Details tab when fixture is postponed before details load', () => {
    const postponedFixture: Fixture = { ...selectedFixture, state: 'Match Postponed' };
    expect(mapMatchDetailsHeaderUiMeta(undefined, postponedFixture).activeTab).toBe('details');
  });
});
