import { format, startOfDay } from 'date-fns';

import type { CompetitionSection, FixturesPageMock } from '../types/fixtures.types';

export const FIXTURES_TEAM_BADGES = {
  arsenal: '/fixtures/teams/arsenal.png',
  valencia: '/fixtures/teams/valencia.png',
  realMadrid: '/fixtures/teams/real-madrid.png',
  leicesterCity: '/fixtures/teams/leicester-city.png',
  manchesterCity: '/fixtures/teams/manchester-city.png',
  newcastleUnited: '/fixtures/teams/newcastle-united.png',
  liverpool: '/fixtures/teams/liverpool.png',
  burnley: '/fixtures/teams/burnley.png',
  manchesterUnited: '/fixtures/teams/manchester-united.png',
  chelsea: '/fixtures/teams/chelsea.png',
  southampton: '/fixtures/teams/southampton.png',
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
