import { format, startOfDay } from 'date-fns';

import type { CompetitionSection, FixturesPageMock } from '../types/fixtures.types';

export const FIXTURES_TEAM_BADGES = {
  arsenal: 'https://r2.thesportsdb.com/images/media/team/badge/uyhbfe1612467038.png',
  valencia: 'https://r2.thesportsdb.com/images/media/team/badge/dm8l6o1655594864.png',
  realMadrid: 'https://r2.thesportsdb.com/images/media/team/badge/vwvwrw1473502969.png',
  leicesterCity: 'https://r2.thesportsdb.com/images/media/team/badge/xtxwtu1448813356.png',
  manchesterCity: 'https://r2.thesportsdb.com/images/media/team/badge/vwpvry1467462651.png',
  newcastleUnited: 'https://r2.thesportsdb.com/images/media/team/badge/lhwuiz1621593302.png',
  liverpool: 'https://r2.thesportsdb.com/images/media/team/badge/kfaher1737969724.png',
  burnley: 'https://r2.thesportsdb.com/images/media/team/badge/ql7nl31686893820.png',
  manchesterUnited: 'https://r2.thesportsdb.com/images/media/team/badge/xzqdr11517660252.png',
  chelsea: 'https://r2.thesportsdb.com/images/media/team/badge/yvwvtu1448813215.png',
  southampton: 'https://r2.thesportsdb.com/images/media/team/badge/ggqtd01621593274.png',
} as const;

export const FIXTURES_INITIAL_DATE_ISO = format(startOfDay(new Date()), 'yyyy-MM-dd');

export const FIXTURES_SECTIONS: CompetitionSection[] = [
  {
    id: 'ucl',
    name: 'UEFA Champions League',
    fixtures: [
      {
        eventId: 'ucl-ars-val-001',
        fixtureDate: FIXTURES_INITIAL_DATE_ISO,
        state: 'finished',
        visibleInFilters: ['all', 'favorites'],
        isFavorite: true,
        home: {
          id: 'arsenal',
          name: 'Arsenal',
          badgeSrc: FIXTURES_TEAM_BADGES.arsenal,
        },
        away: {
          id: 'valencia',
          name: 'Valencia',
          badgeSrc: FIXTURES_TEAM_BADGES.valencia,
        },
        homeScore: 2,
        awayScore: 1,
        homeLegScore: 2,
        awayLegScore: 0,
        contextTags: [{ side: 'home', label: 'AGG' }],
        discipline: [{ side: 'home', card: 'yellow' }],
      },
      {
        eventId: 'ucl-rma-lei-002',
        fixtureDate: FIXTURES_INITIAL_DATE_ISO,
        state: 'finished',
        visibleInFilters: ['all'],
        isFavorite: false,
        home: {
          id: 'real-madrid',
          name: 'Real Madrid',
          badgeSrc: FIXTURES_TEAM_BADGES.realMadrid,
        },
        away: {
          id: 'leicester-city',
          name: 'Leicester city',
          badgeSrc: FIXTURES_TEAM_BADGES.leicesterCity,
        },
        homeScore: 1,
        awayScore: 3,
        homeLegScore: 3,
        awayLegScore: 1,
        contextTags: [{ side: 'away', label: 'PEN' }],
        discipline: [{ side: 'home', card: 'red' }],
      },
    ],
  },
  {
    id: 'epl',
    name: 'English Premier League',
    fixtures: [
      {
        eventId: 'epl-ars-mci-003',
        fixtureDate: FIXTURES_INITIAL_DATE_ISO,
        state: 'live',
        visibleInFilters: ['all', 'live', 'favorites'],
        isFavorite: true,
        liveLabel: '63’',
        home: {
          id: 'arsenal',
          name: 'Arsenal',
          badgeSrc: FIXTURES_TEAM_BADGES.arsenal,
        },
        away: {
          id: 'manchester-city',
          name: 'Manchester City',
          badgeSrc: FIXTURES_TEAM_BADGES.manchesterCity,
        },
        homeScore: 4,
        awayScore: 1,
      },
      {
        eventId: 'epl-new-liv-004',
        fixtureDate: FIXTURES_INITIAL_DATE_ISO,
        state: 'halftime',
        visibleInFilters: ['all', 'live'],
        isFavorite: false,
        liveLabel: 'HT',
        home: {
          id: 'newcastle-united',
          name: 'Newcastle United',
          badgeSrc: FIXTURES_TEAM_BADGES.newcastleUnited,
        },
        away: {
          id: 'liverpool',
          name: 'Liverpool',
          badgeSrc: FIXTURES_TEAM_BADGES.liverpool,
        },
        homeScore: 0,
        awayScore: 1,
      },
      {
        eventId: 'epl-bur-mun-005',
        fixtureDate: FIXTURES_INITIAL_DATE_ISO,
        state: 'scheduled',
        visibleInFilters: ['all', 'live'],
        isFavorite: false,
        kickoffLabel: '23:00',
        home: {
          id: 'burnley',
          name: 'Burnley',
          badgeSrc: FIXTURES_TEAM_BADGES.burnley,
        },
        away: {
          id: 'manchester-united',
          name: 'Manchester City',
          badgeSrc: FIXTURES_TEAM_BADGES.manchesterUnited,
        },
      },
      {
        eventId: 'epl-che-sou-006',
        fixtureDate: FIXTURES_INITIAL_DATE_ISO,
        state: 'scheduled',
        visibleInFilters: ['all', 'live'],
        isFavorite: false,
        kickoffLabel: '23:00',
        home: {
          id: 'chelsea',
          name: 'Chelsea',
          badgeSrc: FIXTURES_TEAM_BADGES.chelsea,
        },
        away: {
          id: 'southampton',
          name: 'Southampton',
          badgeSrc: FIXTURES_TEAM_BADGES.southampton,
        },
      },
    ],
  },
];

export const FIXTURES_PAGE_MOCK: FixturesPageMock = {
  initialDateIso: FIXTURES_INITIAL_DATE_ISO,
  sections: FIXTURES_SECTIONS,
};
