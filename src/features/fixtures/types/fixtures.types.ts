export type FixturesFilterKey = 'all' | 'live' | 'favorites';

export type FixtureState = 'finished' | 'live' | 'halftime' | 'scheduled';

export type DisciplineCard = 'yellow' | 'red';

export type FixtureTeam = {
  id: string;
  name: string;
  badgeSrc: string;
};

export type FixtureContextTag = {
  side: 'home' | 'away';
  label: 'AGG' | 'PEN';
};

export type FixtureDiscipline = {
  side: 'home' | 'away';
  card: DisciplineCard;
};

export type Fixture = {
  eventId: string;
  fixtureDate: string;
  state: FixtureState;
  visibleInFilters: FixturesFilterKey[];
  isFavorite: boolean;
  kickoffLabel?: string;
  liveLabel?: string;
  home: FixtureTeam;
  away: FixtureTeam;
  homeScore?: number;
  awayScore?: number;
  homeLegScore?: number;
  awayLegScore?: number;
  contextTags?: FixtureContextTag[];
  discipline?: FixtureDiscipline[];
};

export type CompetitionSection = {
  id: string;
  name: string;
  fixtures: Fixture[];
};

export type FixturesPageMock = {
  initialDateIso: string;
  sections: CompetitionSection[];
};
