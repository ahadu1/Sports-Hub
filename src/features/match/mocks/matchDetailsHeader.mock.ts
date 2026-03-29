import { FIXTURES_TEAM_BADGES } from '@/features/fixtures/mocks/fixtures.mock';

import type {
  MatchDetailsHeaderEvent,
  MatchDetailsHeaderUiMeta,
} from '@/features/match/components/match-details-header.types';

export const mockMatchDetailsHeaderEvent: MatchDetailsHeaderEvent = {
  idEvent: 'mock-arsenal-vs-liverpool-2025-08-11',
  strLeague: 'English Premier league',
  dateEvent: '2025-08-11',
  strHomeTeam: 'Arsenal',
  strAwayTeam: 'Liverpool',
  strHomeTeamBadge: FIXTURES_TEAM_BADGES.arsenal,
  strAwayTeamBadge: FIXTURES_TEAM_BADGES.liverpool,
  intHomeScore: 2,
  intAwayScore: 1,
  strStatus: 'Match Finished',
};

export const mockMatchDetailsHeaderUiMeta: MatchDetailsHeaderUiMeta = {
  activeTab: 'events',
  homeYellowCards: 2,
  homeRedCards: 0,
  awayYellowCards: 1,
  awayRedCards: 1,
};
