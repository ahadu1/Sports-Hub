export const PRIMARY_NAV_ITEMS = [
  { key: 'live', label: 'Live', temporary: true },
  { key: 'matches', label: 'Matches', temporary: false },
  { key: 'standings', label: 'Standings', temporary: true },
  { key: 'teams', label: 'Teams', temporary: true },
  { key: 'comparison', label: 'Comparison', temporary: true },
  { key: 'statistics', label: 'Statistics', temporary: true },
  { key: 'venues', label: 'Venues', temporary: true },
] as const;

export const MOBILE_ACCORDION_CONTENT = {
  league: ['Premier League'],
  season: ['2024/25', '2023/24'],
} as const;

export const HEADER_ASSETS = {
  logo: '/header/logo-statscore.svg',
  globe: '/header/icon-globe.svg',
  football: '/header/icon-football.svg',
  leagueFlag: '/header/flag-england.svg',
  localeFlag: '/header/flag-uk.svg',
} as const;

export type HeaderAccordionSection = keyof typeof MOBILE_ACCORDION_CONTENT;
