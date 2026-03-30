import { describe, expect, it } from 'vitest';

import {
  mapMatchDetailsHeaderEvent,
  mapMatchDetailsHeaderUiMeta,
} from '@/features/match/utils/matchDetailsPage.utils';
import type { Fixture } from '@/features/fixtures/types/fixtures.types';
import type { MatchDetail } from '@/features/match/types/match.types';

const matchDetail: MatchDetail = {
  id: '42',
  leagueId: '100',
  leagueName: 'Premier League',
  leagueBadge: '',
  eventLabel: 'Home FC vs Away FC',
  dateEvent: '2026-03-30',
  dateEventLocal: '2026-03-30',
  kickoffTime: '20:00',
  kickoffTimeLocal: '20:00',
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
  fixtureDate: '2026-03-30',
  state: 'live',
  visibleInFilters: ['all', 'live'],
  isFavorite: false,
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

describe('matchDetailsPage.utils', () => {
  it('prefers fetched match details over route fixture state', () => {
    const result = mapMatchDetailsHeaderEvent(matchDetail, selectedFixture, '42');

    expect(result).toMatchObject({
      idEvent: '42',
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

  it('maps header meta counts from the match summary', () => {
    expect(mapMatchDetailsHeaderUiMeta(matchDetail)).toEqual({
      activeTab: 'events',
      homeYellowCards: 1,
      homeRedCards: 0,
      awayYellowCards: 2,
      awayRedCards: 1,
    });
  });
});
