const MATCH_ROUTE_SEGMENT = 'match';

export const routes = {
  home: '/',
  matchPath: `${MATCH_ROUTE_SEGMENT}/:eventId`,
  match: `/${MATCH_ROUTE_SEGMENT}/:eventId`,
  matchPrefix: `/${MATCH_ROUTE_SEGMENT}`,
  notFound: '*',
} as const;

export function matchDetails(eventId: string): string {
  return `${routes.matchPrefix}/${encodeURIComponent(eventId)}`;
}
