import type { MatchState } from '@/features/match/types/match.types';
import type { NormalizedKickoff } from '@/lib/datetime/kickoff';

export type MatchDetailsHeaderEvent = {
  idEvent: string;
  strLeague: string;
  kickoff: NormalizedKickoff;
  strHomeTeam: string;
  strAwayTeam: string;
  strHomeTeamBadge: string;
  strAwayTeamBadge: string;
  intHomeScore: number | null;
  intAwayScore: number | null;
  strStatus: string | null;
  matchState: MatchState;
};

export type MatchDetailsHeaderUiMeta = {
  activeTab: 'details' | 'odds' | 'lineups' | 'events' | 'stats' | 'standings';
  homeYellowCards: number;
  homeRedCards: number;
  awayYellowCards: number;
  awayRedCards: number;
};

export type MatchDetailsHeaderCardCounter = {
  color: 'yellow' | 'red';
  value: number;
};

export type MatchDetailsHeaderVisibleCardCounters = {
  home: MatchDetailsHeaderCardCounter[];
  away: MatchDetailsHeaderCardCounter[];
};
