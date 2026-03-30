import { routes } from '@/app/config/routes';

export type HeaderSelectOption = {
  id: string;
  label: string;
  badgeSrc?: string | undefined;
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

/** Wordmark in `HEADER_LOGO_SRC` (SVG ~3.33:1) */
export const HEADER_LOGO_ALT = 'Statscore';

export const HEADER_LOGO_SRC = '/header/logo-statscore.svg';

export type HeaderAccordionSection = 'league' | 'season';
