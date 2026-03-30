export const endpoints = {
  allLeagues: (): string => 'all/leagues',
  leagueById: (leagueId: string): string => `lookup/league/${encodeURIComponent(leagueId)}`,
  leagueSeasons: (leagueId: string): string => `list/seasons/${encodeURIComponent(leagueId)}`,
  matchById: (eventId: string): string => `lookup/event/${encodeURIComponent(eventId)}`,
  eventsSeason: (leagueId: string, season: string): string =>
    `schedule/league/${encodeURIComponent(leagueId)}/${encodeURIComponent(season)}`,
  matchTimelineById: (eventId: string): string =>
    `lookup/event_timeline/${encodeURIComponent(eventId)}`,
  teamsByName: (teamName: string): string => `search/team/${encodeURIComponent(teamName)}`,
} as const;

export const legacyEndpoints = {
  allLeagues: (): string => 'all_leagues.php',
  leagueById: (leagueId: string): string => `lookupleague.php?id=${encodeURIComponent(leagueId)}`,
  leagueSeasons: (leagueId: string): string =>
    `search_all_seasons.php?id=${encodeURIComponent(leagueId)}`,
  matchTimelineById: (eventId: string): string =>
    `lookuptimeline.php?id=${encodeURIComponent(eventId)}`,
} as const;
