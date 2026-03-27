export const routes = {
  home: '/',
  match: '/match/:eventId',
  notFound: '*',
} as const;

export function matchDetails(eventId: string): string {
  return `/match/${encodeURIComponent(eventId)}`;
}
