export type MatchState =
  | 'scheduled'
  | 'live'
  | 'halftime'
  | 'finished'
  | 'postponed'
  | 'canceled'
  | 'suspended'
  | 'abandoned'
  | 'awarded'
  | 'unknown';

export type MatchDetailEventSummary = {
  homeGoalDetails: string[];
  awayGoalDetails: string[];
  homeYellowCardDetails: string[];
  awayYellowCardDetails: string[];
  homeRedCardDetails: string[];
  awayRedCardDetails: string[];
};

export type MatchDetail = {
  id: string;
  leagueId: string;
  leagueName: string;
  leagueBadge: string;
  eventLabel: string;
  dateEvent: string;
  dateEventLocal: string;
  kickoffTime: string;
  kickoffTimeLocal: string;
  season: string;
  round: number | null;
  venueName: string;
  venueCity: string;
  venueCountry: string;
  homeTeamId: string;
  awayTeamId: string;
  homeTeamName: string;
  awayTeamName: string;
  homeTeamBadge: string;
  awayTeamBadge: string;
  homeScore: number | null;
  awayScore: number | null;
  halftimeHomeScore?: number | null;
  halftimeAwayScore?: number | null;
  status: string | null;
  state: MatchState;
  summary: MatchDetailEventSummary;
};
