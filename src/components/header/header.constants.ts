import { routes } from '@/app/config/routes';
import type { SelectOption } from '@/lib/select-option';
import englandFlagIconSrc from '../icons/flag-england.svg';
import footballIconSrc from '../icons/football.svg';
import globeIconSrc from '../icons/globe.svg';
import ukFlagIconSrc from '../icons/uk-flag.svg';

export type HeaderSelectOption = SelectOption;

export type PrimaryNavItem = {
  key: 'live' | 'matches' | 'standings' | 'teams' | 'comparison' | 'statistics' | 'venues';
  label: string;
  to?: string;
  disabled?: boolean;
  disabledText?: string;
};

export const PRIMARY_NAV_ITEMS: readonly PrimaryNavItem[] = [
  { key: 'live', label: 'Live', to: routes.live },
  { key: 'matches', label: 'Matches', to: routes.home },
  { key: 'standings', label: 'Standings', disabled: true },
  { key: 'teams', label: 'Teams', to: routes.teams },
  { key: 'comparison', label: 'Comparison', to: routes.comparison },
  { key: 'statistics', label: 'Statistics', to: routes.statistics },
  { key: 'venues', label: 'Venues', to: routes.venues },
];

/** Wordmark in `HEADER_LOGO_SRC` (SVG ~3.33:1) */
export const HEADER_LOGO_ALT = 'Statscore';

export const HEADER_LOGO_SRC = '/header/logo-statscore.svg';

export const HEADER_ASSETS = {
  football: footballIconSrc,
  globe: globeIconSrc,
  leagueFlag: englandFlagIconSrc,
  localeFlag: ukFlagIconSrc,
  logo: HEADER_LOGO_SRC,
} as const;

export type HeaderAccordionSection = 'league' | 'season';
