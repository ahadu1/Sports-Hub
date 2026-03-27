import { APP_NAME } from '@/app/config/app-config';

export const copy = {
  appTitle: APP_NAME,
  navHome: 'Home',
  navDemoMatch: 'Demo match',

  fixturesPlaceholderHeading: 'Fixtures dashboard',
  fixturesPlaceholderBody:
    'This is the Fixtures dashboard placeholder. Real fixtures data and UI are not implemented yet.',

  matchPlaceholderHeading: 'Match details',
  matchPlaceholderBodyPrefix: 'This is the Match details placeholder for event',

  notFoundHeading: 'Page not found',
  notFoundBody: 'The page you requested does not exist.',

  routeErrorTitle: 'Something went wrong',
  routeErrorMessage: 'We could not load this page. Please try again or return home.',

  inlineErrorTitle: 'Something went wrong',
  inlineErrorMessage: 'We could not load this content.',

  errorBoundaryTitle: 'Something went wrong',
  errorBoundaryMessage: 'This section failed to render. Please refresh or try again later.',

  goHome: 'Go home',
  goBack: 'Go back',
  retry: 'Retry',
  loading: 'Loading…',
} as const;
