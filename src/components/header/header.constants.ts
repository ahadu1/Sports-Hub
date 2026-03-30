import { routes } from '@/app/config/routes';

export type HeaderSelectOption = {
  id: string;
  label: string;
};

export type PrimaryNavItem = {
  key: 'live' | 'matches' | 'standings' | 'teams' | 'comparison' | 'statistics' | 'venues';
  label: string;
  to?: string;
  disabled?: boolean;
  disabledText?: string;
};

export const PRIMARY_NAV_ITEMS: readonly PrimaryNavItem[] = [
  { key: 'live', label: 'Live' },
  { key: 'matches', label: 'Matches', to: routes.home },
  { key: 'standings', label: 'Standings', disabled: true },
  { key: 'teams', label: 'Teams' },
  { key: 'comparison', label: 'Comparison' },
  { key: 'statistics', label: 'Statistics' },
  { key: 'venues', label: 'Venues' },
];

export const HEADER_ASSETS = {
  logo: '/header/logo-statscore.svg',
  globe: '/header/icon-globe.svg',
  football: '/header/icon-football.svg',
  leagueFlag: '/header/flag-england.svg',
  localeFlag: '/header/flag-uk.svg',
} as const;

export type HeaderAccordionSection = 'league' | 'season';
