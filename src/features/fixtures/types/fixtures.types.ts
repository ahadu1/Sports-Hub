import type { MatchState } from '@/features/match/types/match.types';
import type { NormalizedKickoff } from '@/lib/datetime/kickoff';

export type FixturesFilterKey = 'all' | 'live' | 'favorites';

export type FixtureState = MatchState;

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
  leagueId: string;
  leagueName: string;
  kickoff: NormalizedKickoff;
  state: FixtureState;
  visibleInFilters: FixturesFilterKey[];
  isFavorite: boolean;
  kickoffLabel: string;
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
