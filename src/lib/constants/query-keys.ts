export const queryKeys = {
  fixtures: {
    league: (leagueId: string) => ['fixtures', 'league', leagueId] as const,
    leagues: () => ['fixtures', 'leagues'] as const,
    list: (leagueId: string, season: string) => ['fixtures', 'list', leagueId, season] as const,
    seasons: (leagueId: string) => ['fixtures', 'seasons', leagueId] as const,
  },
  match: {
    detail: (eventId: string) => ['match', 'detail', eventId] as const,
    timeline: (eventId: string) => ['match', 'timeline', eventId] as const,
  },
} as const;
