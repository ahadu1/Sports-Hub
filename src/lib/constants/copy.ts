import { APP_NAME } from '@/app/config/app-config';

export const copy = {
  appTitle: APP_NAME,
  navHome: 'Home',

  notFoundHeading: 'Page not found',
  notFoundBody: 'The page you requested does not exist.',

  routeErrorTitle: 'Something went wrong',
  routeErrorMessage: 'We could not load this page. Please try again or return home.',

  inlineErrorTitle: 'Something went wrong',
  inlineErrorMessage: 'We could not load this content.',
  emptyStateTitle: 'Nothing to show yet',

  errorBoundaryTitle: 'Something went wrong',
  errorBoundaryMessage: 'This section failed to render. Please refresh or try again later.',

  goHome: 'Go home',
  goBack: 'Go back',
  retry: 'Retry',
  loading: 'Loading…',
  matchesHeading: 'Matches',
  matchesEmptyTitle: 'No matches scheduled',
  timelineTitle: 'Events',
  timelineEmptyMessage: 'No timeline events available.',
  matchUnavailableMessage: 'We could not load this match.',
} as const;
