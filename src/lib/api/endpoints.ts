export const endpoints = {
  fixtures: (): string => 'eventsnext.php',
  matchById: (eventId: string): string => `lookupevent.php?id=${encodeURIComponent(eventId)}`,
} as const;
